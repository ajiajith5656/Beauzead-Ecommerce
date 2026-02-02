/**
 * Admin Dashboard API Service - DynamoDB Version
 * Direct access to DynamoDB tables for admin operations
 */

import { fetchAuthSession } from 'aws-amplify/auth';
import type {
  User,
  Seller,
  Product,
  Order,
  Category,
  Banner,
  Promotion,
  Review,
  Complaint,
  DashboardData,
  Admin,
  AccountSummary,
  DaybookEntry,
  BankBookEntry,
  AccountHead,
  ExpenseEntry,
  SellerPayout,
  MembershipPlan,
  TaxRule,
  PlatformCost,
} from '../../types';

// DynamoDB Table Names
const TABLES = {
  USERS: 'BeauZeadUsers',
  SELLERS: 'BeauZeadSellers',
  PRODUCTS: 'BeauZeadProducts',
  ORDERS: 'OrdersTable',
  CATEGORIES: 'Categories',
  COUNTRIES: 'CountryList',
  BUSINESS_TYPES: 'BusinessType',
} as const;

const AWS_REGION = 'us-east-1';

// ============ AWS SIGV4 SIGNING ============

async function getAWSCredentials() {
  try {
    const session = await fetchAuthSession();
    return session.credentials;
  } catch (error) {
    console.error('Failed to get AWS credentials:', error);
    return null;
  }
}

async function hmacSha256(key: ArrayBuffer | string, data: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyBuffer = typeof key === 'string' ? encoder.encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
}

async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getSignatureKey(secretKey: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(`AWS4${secretKey}`, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}

async function signRequest(method: string, body: string, credentials: any): Promise<Record<string, string>> {
  const host = `dynamodb.${AWS_REGION}.amazonaws.com`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  
  const payloadHash = await sha256(body);
  
  const canonicalHeaders = 
    `content-type:application/x-amz-json-1.0\n` +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-security-token:${credentials.sessionToken}\n`;
  
  const signedHeaders = 'content-type;host;x-amz-date;x-amz-security-token';
  
  const canonicalRequest = `${method}\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${AWS_REGION}/dynamodb/aws4_request`;
  const canonicalRequestHash = await sha256(canonicalRequest);
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;
  
  const signingKey = await getSignatureKey(credentials.secretAccessKey, dateStamp, AWS_REGION, 'dynamodb');
  const signatureBuffer = await hmacSha256(signingKey, stringToSign);
  const signature = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return {
    'Content-Type': 'application/x-amz-json-1.0',
    'X-Amz-Date': amzDate,
    'X-Amz-Security-Token': credentials.sessionToken,
    'Authorization': `${algorithm} Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

async function dynamoDBRequest(action: string, params: any): Promise<any> {
  const credentials = await getAWSCredentials();
  if (!credentials) {
    throw new Error('Unable to get AWS credentials. Please sign in.');
  }
  
  const url = `https://dynamodb.${AWS_REGION}.amazonaws.com/`;
  const body = JSON.stringify(params);
  
  const headers = await signRequest('POST', body, credentials);
  headers['X-Amz-Target'] = `DynamoDB_20120810.${action}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('DynamoDB Error:', errorText);
    throw new Error(`DynamoDB request failed: ${response.status}`);
  }
  
  return response.json();
}

// ============ HELPER FUNCTIONS ============

function parseItem(item: any): any {
  const result: any = {};
  for (const [key, value] of Object.entries(item)) {
    const val = value as any;
    if (val.S) result[key] = val.S;
    else if (val.N) result[key] = parseFloat(val.N);
    else if (val.BOOL !== undefined) result[key] = val.BOOL;
    else if (val.L) result[key] = val.L.map((v: any) => v.S || v.N || v.BOOL);
    else if (val.M) result[key] = parseItem(val.M);
    else if (val.NULL) result[key] = null;
  }
  return result;
}

// ============ DASHBOARD ============

export const getDashboardMetrics = async (): Promise<DashboardData | null> => {
  try {
    const [usersResult, _categoriesResult, ordersResult, sellersResult, productsResult] = await Promise.all([
      dynamoDBRequest('Scan', { TableName: TABLES.USERS, Select: 'COUNT' }),
      dynamoDBRequest('Scan', { TableName: TABLES.CATEGORIES, Select: 'COUNT' }),
      dynamoDBRequest('Scan', { TableName: TABLES.ORDERS, Select: 'COUNT' }),
      dynamoDBRequest('Scan', { TableName: TABLES.SELLERS, Select: 'COUNT' }),
      dynamoDBRequest('Scan', { TableName: TABLES.PRODUCTS, Select: 'COUNT' }),
    ]);
    
    return {
      metrics: {
        total_users: usersResult.Count || 0,
        total_sellers: sellersResult.Count || 0,
        total_products: productsResult.Count || 0,
        total_bookings: ordersResult.Count || 0,
        total_sales: 0,
        total_expenses: 0,
        ongoing_orders: 0,
        returns_cancellations: 0,
      },
      top_categories: [],
      top_sellers: [],
      user_registrations: usersResult.Count || 0,
      prime_members: 0,
      seller_registrations: sellersResult.Count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    return null;
  }
};

// ============ USER MANAGEMENT ============

export const getAllUsers = async (
  page?: number,
  limit?: number,
  search?: string,
  _profile_type?: string
): Promise<{ users: User[]; total: number } | null> => {
  try {
    const result = await dynamoDBRequest('Scan', { TableName: TABLES.USERS });
    
    let users: User[] = (result.Items || []).map((item: any) => {
      const parsed = parseItem(item);
      return {
        id: parsed.userId,
        email: parsed.email,
        full_name: `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim(),
        role: parsed.userRole?.toLowerCase() === 'buyer' ? 'user' : parsed.userRole?.toLowerCase(),
        created_at: parsed.createdAt,
        is_banned: parsed.isBanned || false,
        phone: parsed.profile?.phoneNumber,
        address: parsed.profile?.address,
        profile_type: 'member',
      } as User;
    });
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(u => 
        u.email?.toLowerCase().includes(searchLower) || 
        u.full_name?.toLowerCase().includes(searchLower)
      );
    }
    
    const total = users.length;
    
    // Paginate
    if (page && limit) {
      const start = (page - 1) * limit;
      users = users.slice(start, start + limit);
    }
    
    return { users, total };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return null;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const result = await dynamoDBRequest('GetItem', {
      TableName: TABLES.USERS,
      Key: { userId: { S: userId } },
    });
    
    if (!result.Item) return null;
    
    const parsed = parseItem(result.Item);
    return {
      id: parsed.userId,
      email: parsed.email,
      full_name: `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim(),
      role: parsed.userRole?.toLowerCase() === 'buyer' ? 'user' : parsed.userRole?.toLowerCase(),
      created_at: parsed.createdAt,
      is_banned: parsed.isBanned || false,
    } as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};

export const banUser = async (userId: string): Promise<boolean> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.USERS,
      Key: { userId: { S: userId } },
      UpdateExpression: 'SET isBanned = :banned',
      ExpressionAttributeValues: { ':banned': { BOOL: true } },
    });
    return true;
  } catch (error) {
    console.error('Failed to ban user:', error);
    return false;
  }
};

export const unbanUser = async (userId: string): Promise<boolean> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.USERS,
      Key: { userId: { S: userId } },
      UpdateExpression: 'SET isBanned = :banned',
      ExpressionAttributeValues: { ':banned': { BOOL: false } },
    });
    return true;
  } catch (error) {
    console.error('Failed to unban user:', error);
    return false;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await dynamoDBRequest('DeleteItem', {
      TableName: TABLES.USERS,
      Key: { userId: { S: userId } },
    });
    return true;
  } catch (error) {
    console.error('Failed to delete user:', error);
    return false;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  try {
    const updates: string[] = [];
    const values: Record<string, any> = {};
    
    if (userData.full_name) {
      const [first, ...rest] = userData.full_name.split(' ');
      updates.push('firstName = :firstName, lastName = :lastName');
      values[':firstName'] = { S: first };
      values[':lastName'] = { S: rest.join(' ') };
    }
    
    if (updates.length === 0) return null;
    
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.USERS,
      Key: { userId: { S: userId } },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ExpressionAttributeValues: values,
    });
    
    return { id: userId, ...userData } as User;
  } catch (error) {
    console.error('Failed to update user:', error);
    return null;
  }
};

// ============ SELLER MANAGEMENT ============

export const getAllSellers = async (
  page?: number,
  limit?: number,
  search?: string,
  _kyc_status?: string
): Promise<{ sellers: Seller[]; total: number } | null> => {
  try {
    const result = await dynamoDBRequest('Scan', { TableName: TABLES.SELLERS });
    
    let sellers: Seller[] = (result.Items || []).map((item: any) => {
      const parsed = parseItem(item);
      return {
        id: parsed.sellerId || parsed.id,
        user_id: parsed.userId,
        shop_name: parsed.shopName || parsed.businessName || 'Unknown Shop',
        email: parsed.email,
        phone: parsed.phone,
        total_listings: parsed.totalListings || 0,
        badge: parsed.badge,
        kyc_status: parsed.kycStatus || 'pending',
        product_approval_status: parsed.productApprovalStatus || 'pending',
        created_at: parsed.createdAt,
        is_active: parsed.isActive ?? true,
      } as Seller;
    });
    
    if (search) {
      const searchLower = search.toLowerCase();
      sellers = sellers.filter(s => 
        s.shop_name?.toLowerCase().includes(searchLower) || 
        s.email?.toLowerCase().includes(searchLower)
      );
    }
    
    const total = sellers.length;
    
    if (page && limit) {
      const start = (page - 1) * limit;
      sellers = sellers.slice(start, start + limit);
    }
    
    return { sellers, total };
  } catch (error) {
    console.error('Failed to fetch sellers:', error);
    return { sellers: [], total: 0 };
  }
};

export const getSellerById = async (sellerId: string): Promise<Seller | null> => {
  try {
    const result = await dynamoDBRequest('GetItem', {
      TableName: TABLES.SELLERS,
      Key: { sellerId: { S: sellerId } },
    });
    
    if (!result.Item) return null;
    const parsed = parseItem(result.Item);
    return parsed as Seller;
  } catch (error) {
    console.error('Failed to fetch seller:', error);
    return null;
  }
};

export const updateSellerKYC = async (sellerId: string, status: 'pending' | 'approved' | 'rejected'): Promise<Seller | null> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.SELLERS,
      Key: { sellerId: { S: sellerId } },
      UpdateExpression: 'SET kycStatus = :status',
      ExpressionAttributeValues: { ':status': { S: status } },
    });
    return { id: sellerId, kyc_status: status } as Seller;
  } catch (error) {
    console.error('Failed to update seller KYC:', error);
    return null;
  }
};

export const updateSellerBadge = async (sellerId: string, badge: 'silver' | 'gold' | 'platinum'): Promise<Seller | null> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.SELLERS,
      Key: { sellerId: { S: sellerId } },
      UpdateExpression: 'SET badge = :badge',
      ExpressionAttributeValues: { ':badge': { S: badge } },
    });
    return { id: sellerId, badge } as Seller;
  } catch (error) {
    console.error('Failed to update seller badge:', error);
    return null;
  }
};

export const approveSeller = async (sellerId: string): Promise<boolean> => {
  return (await updateSellerKYC(sellerId, 'approved')) !== null;
};

export const rejectSeller = async (sellerId: string, _reason?: string): Promise<boolean> => {
  return (await updateSellerKYC(sellerId, 'rejected')) !== null;
};

// ============ PRODUCT MANAGEMENT ============

export const getAllProducts = async (
  page?: number,
  limit?: number,
  search?: string,
  approval_status?: string,
  _category?: string
): Promise<{ products: Product[]; total: number } | null> => {
  try {
    const result = await dynamoDBRequest('Scan', { TableName: TABLES.PRODUCTS });
    
    let products: Product[] = (result.Items || []).map((item: any) => {
      const parsed = parseItem(item);
      return {
        id: parsed.productId || parsed.id,
        name: parsed.name || parsed.productName,
        description: parsed.description,
        price: parsed.price || 0,
        currency: parsed.currency || 'INR',
        image_url: parsed.imageUrl,
        seller_id: parsed.sellerId,
        category: parsed.category || parsed.categoryId,
        stock: parsed.stock || 0,
        approved: parsed.approved ?? false,
        created_at: parsed.createdAt,
        approval_status: parsed.approvalStatus || 'pending',
        is_active: parsed.isActive ?? true,
      } as Product;
    });
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => p.name?.toLowerCase().includes(searchLower));
    }
    
    if (approval_status) {
      products = products.filter(p => p.approval_status === approval_status);
    }
    
    const total = products.length;
    
    if (page && limit) {
      const start = (page - 1) * limit;
      products = products.slice(start, start + limit);
    }
    
    return { products, total };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], total: 0 };
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const result = await dynamoDBRequest('GetItem', {
      TableName: TABLES.PRODUCTS,
      Key: { productId: { S: productId } },
    });
    
    if (!result.Item) return null;
    return parseItem(result.Item) as Product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
};

export const approveProduct = async (productId: string): Promise<boolean> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.PRODUCTS,
      Key: { productId: { S: productId } },
      UpdateExpression: 'SET approvalStatus = :status, approved = :approved',
      ExpressionAttributeValues: { 
        ':status': { S: 'approved' },
        ':approved': { BOOL: true },
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to approve product:', error);
    return false;
  }
};

export const rejectProduct = async (productId: string, _reason?: string): Promise<boolean> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.PRODUCTS,
      Key: { productId: { S: productId } },
      UpdateExpression: 'SET approvalStatus = :status, approved = :approved',
      ExpressionAttributeValues: { 
        ':status': { S: 'rejected' },
        ':approved': { BOOL: false },
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to reject product:', error);
    return false;
  }
};

export const disableProduct = async (productId: string): Promise<Product | null> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.PRODUCTS,
      Key: { productId: { S: productId } },
      UpdateExpression: 'SET isActive = :active',
      ExpressionAttributeValues: { ':active': { BOOL: false } },
    });
    return { id: productId, is_active: false } as Product;
  } catch (error) {
    console.error('Failed to disable product:', error);
    return null;
  }
};

// Create a new product with full details
export const createProduct = async (productData: any): Promise<Product | null> => {
  try {
    const productId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Build the DynamoDB item
    const item: Record<string, any> = {
      productId: { S: productId },
      createdAt: { S: now },
      updatedAt: { S: now },
      approvalStatus: { S: productData.approvalStatus || 'pending' },
      isActive: { BOOL: productData.isActive ?? false },
    };
    
    // Basic info
    if (productData.categoryId) item.categoryId = { S: productData.categoryId };
    if (productData.subCategoryId) item.subCategoryId = { S: productData.subCategoryId };
    if (productData.productTypeId) item.productTypeId = { S: productData.productTypeId };
    if (productData.name) item.name = { S: productData.name };
    if (productData.brandName) item.brandName = { S: productData.brandName };
    if (productData.modelNumber) item.modelNumber = { S: productData.modelNumber };
    if (productData.shortDescription) item.shortDescription = { S: productData.shortDescription };
    if (productData.stock !== undefined) item.stock = { N: productData.stock.toString() };
    
    // Variants
    if (productData.sizeVariants?.length > 0) {
      item.sizeVariants = { S: JSON.stringify(productData.sizeVariants) };
    }
    if (productData.colorVariants?.length > 0) {
      item.colorVariants = { S: JSON.stringify(productData.colorVariants) };
    }
    
    // Media
    if (productData.images?.length > 0) {
      item.images = { L: productData.images.map((img: string) => ({ S: img })) };
      item.imageUrl = { S: productData.images[0] }; // Primary image
    }
    if (productData.videos?.length > 0) {
      item.videos = { L: productData.videos.map((vid: string) => ({ S: vid })) };
    }
    
    // Details
    if (productData.highlights?.length > 0) {
      item.highlights = { L: productData.highlights.map((h: string) => ({ S: h })) };
    }
    if (productData.description) item.description = { S: productData.description };
    if (productData.specifications?.length > 0) {
      item.specifications = { S: JSON.stringify(productData.specifications) };
    }
    if (productData.sellerNotes?.length > 0) {
      item.sellerNotes = { L: productData.sellerNotes.map((n: string) => ({ S: n })) };
    }
    
    // Pricing
    if (productData.countryCode) item.countryCode = { S: productData.countryCode };
    if (productData.mrp !== undefined) item.mrp = { N: productData.mrp.toString() };
    if (productData.price !== undefined) item.price = { N: productData.price.toString() };
    if (productData.stockQuantity !== undefined) item.stockQuantity = { N: productData.stockQuantity.toString() };
    if (productData.gstRate !== undefined) item.gstRate = { N: productData.gstRate.toString() };
    if (productData.platformFee !== undefined) item.platformFee = { N: productData.platformFee.toString() };
    if (productData.commission !== undefined) item.commission = { N: productData.commission.toString() };
    if (productData.deliveryCountries?.length > 0) {
      item.deliveryCountries = { S: JSON.stringify(productData.deliveryCountries) };
    }
    
    // Shipping
    if (productData.packageWeight !== undefined) item.packageWeight = { N: productData.packageWeight.toString() };
    if (productData.packageDimensions) {
      item.packageDimensions = { S: JSON.stringify(productData.packageDimensions) };
    }
    if (productData.shippingType) item.shippingType = { S: productData.shippingType };
    if (productData.manufacturerName) item.manufacturerName = { S: productData.manufacturerName };
    if (productData.manufacturerAddress) item.manufacturerAddress = { S: productData.manufacturerAddress };
    if (productData.packingDetails) item.packingDetails = { S: productData.packingDetails };
    if (productData.courierPartner) item.courierPartner = { S: productData.courierPartner };
    if (productData.cancellationPolicyDays !== undefined) {
      item.cancellationPolicyDays = { N: productData.cancellationPolicyDays.toString() };
    }
    if (productData.returnPolicyDays !== undefined) {
      item.returnPolicyDays = { N: productData.returnPolicyDays.toString() };
    }
    
    // Offers
    if (productData.offerRules?.length > 0) {
      item.offerRules = { S: JSON.stringify(productData.offerRules) };
    }
    
    // Set currency based on country
    item.currency = { S: 'INR' };
    
    await dynamoDBRequest('PutItem', {
      TableName: TABLES.PRODUCTS,
      Item: item,
    });
    
    return {
      id: productId,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      currency: 'INR',
      image_url: productData.images?.[0] || '',
      seller_id: productData.sellerId || '',
      category: productData.categoryId,
      stock: productData.stock || 0,
      approved: false,
      created_at: now,
      approval_status: 'pending',
    } as Product;
  } catch (error) {
    console.error('Failed to create product:', error);
    return null;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    await dynamoDBRequest('DeleteItem', {
      TableName: TABLES.PRODUCTS,
      Key: { productId: { S: productId } },
    });
    return true;
  } catch (error) {
    console.error('Failed to delete product:', error);
    return false;
  }
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const updates: string[] = [];
    const values: Record<string, any> = {};
    const names: Record<string, string> = {};
    
    if (productData.name) {
      updates.push('#name = :name');
      names['#name'] = 'name';
      values[':name'] = { S: productData.name };
    }
    if (productData.price !== undefined) {
      updates.push('price = :price');
      values[':price'] = { N: productData.price.toString() };
    }
    if (productData.is_active !== undefined) {
      updates.push('isActive = :active');
      values[':active'] = { BOOL: productData.is_active };
    }
    
    if (updates.length === 0) return null;
    
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.PRODUCTS,
      Key: { productId: { S: productId } },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ExpressionAttributeValues: values,
      ...(Object.keys(names).length > 0 ? { ExpressionAttributeNames: names } : {}),
    });
    
    return { id: productId, ...productData } as Product;
  } catch (error) {
    console.error('Failed to update product:', error);
    return null;
  }
};

// ============ ORDER MANAGEMENT ============

export const getAllOrders = async (
  page?: number,
  limit?: number,
  status?: string
): Promise<{ orders: Order[]; total: number } | null> => {
  try {
    const result = await dynamoDBRequest('Scan', { TableName: TABLES.ORDERS });
    
    let orders: Order[] = (result.Items || []).map((item: any) => {
      const parsed = parseItem(item);
      return {
        id: parsed.orderId || parsed.id,
        user_id: parsed.userId,
        total: parsed.total || 0,
        currency: parsed.currency || 'INR',
        status: parsed.status || 'new',
        created_at: parsed.createdAt,
        payment_status: parsed.paymentStatus || 'pending',
        address: parsed.address,
        phone: parsed.phone,
      } as Order;
    });
    
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    
    const total = orders.length;
    
    if (page && limit) {
      const start = (page - 1) * limit;
      orders = orders.slice(start, start + limit);
    }
    
    return { orders, total };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return { orders: [], total: 0 };
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const result = await dynamoDBRequest('GetItem', {
      TableName: TABLES.ORDERS,
      Key: { orderId: { S: orderId } },
    });
    
    if (!result.Item) return null;
    return parseItem(result.Item) as Order;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<Order | null> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.ORDERS,
      Key: { orderId: { S: orderId } },
      UpdateExpression: 'SET #status = :status, updatedAt = :updated',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { 
        ':status': { S: newStatus },
        ':updated': { S: new Date().toISOString() },
      },
    });
    return { id: orderId, status: newStatus } as Order;
  } catch (error) {
    console.error('Failed to update order status:', error);
    return null;
  }
};

export const processRefund = async (orderId: string, _amount: number): Promise<boolean> => {
  try {
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.ORDERS,
      Key: { orderId: { S: orderId } },
      UpdateExpression: 'SET #status = :status, paymentStatus = :payment',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { 
        ':status': { S: 'refunded' },
        ':payment': { S: 'refunded' },
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to process refund:', error);
    return false;
  }
};

// ============ CATEGORY MANAGEMENT ============

export const getAllCategories = async (): Promise<{ categories: Category[]; total: number } | null> => {
  try {
    const result = await dynamoDBRequest('Scan', { TableName: TABLES.CATEGORIES });
    
    const categories: Category[] = (result.Items || []).map((item: any) => {
      const parsed = parseItem(item);
      return {
        id: parsed.categoryId,
        name: parsed.name,
        description: parsed.description || '',
        image_url: parsed.imageUrl || '',
        is_active: parsed.isActive ?? true,
        created_at: parsed.createdAt,
        sub_categories: parsed.subCategories || [],
      } as Category;
    });
    
    return { categories, total: categories.length };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { categories: [], total: 0 };
  }
};

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const result = await dynamoDBRequest('GetItem', {
      TableName: TABLES.CATEGORIES,
      Key: { categoryId: { S: categoryId } },
    });
    
    if (!result.Item) return null;
    const parsed = parseItem(result.Item);
    return {
      id: parsed.categoryId,
      name: parsed.name,
      description: parsed.description || '',
      is_active: parsed.isActive ?? true,
      created_at: parsed.createdAt,
    } as Category;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category | null> => {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await dynamoDBRequest('PutItem', {
      TableName: TABLES.CATEGORIES,
      Item: {
        categoryId: { S: id },
        name: { S: categoryData.name || '' },
        description: { S: categoryData.description || '' },
        imageUrl: { S: categoryData.image_url || '' },
        isActive: { BOOL: categoryData.is_active ?? true },
        createdAt: { S: now },
        updatedAt: { S: now },
        subCategories: { L: [] },
      },
    });
    
    return { id, ...categoryData, created_at: now } as Category;
  } catch (error) {
    console.error('Failed to create category:', error);
    return null;
  }
};

export const updateCategory = async (categoryId: string, categoryData: Partial<Category>): Promise<Category | null> => {
  try {
    const updates: string[] = [];
    const values: Record<string, any> = {};
    const names: Record<string, string> = {};
    
    if (categoryData.name) {
      updates.push('#name = :name');
      names['#name'] = 'name';
      values[':name'] = { S: categoryData.name };
    }
    if (categoryData.description !== undefined) {
      updates.push('description = :desc');
      values[':desc'] = { S: categoryData.description };
    }
    if (categoryData.image_url !== undefined) {
      updates.push('imageUrl = :img');
      values[':img'] = { S: categoryData.image_url };
    }
    if (categoryData.is_active !== undefined) {
      updates.push('isActive = :active');
      values[':active'] = { BOOL: categoryData.is_active };
    }
    
    updates.push('updatedAt = :updated');
    values[':updated'] = { S: new Date().toISOString() };
    
    await dynamoDBRequest('UpdateItem', {
      TableName: TABLES.CATEGORIES,
      Key: { categoryId: { S: categoryId } },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ExpressionAttributeValues: values,
      ...(Object.keys(names).length > 0 ? { ExpressionAttributeNames: names } : {}),
    });
    
    return { id: categoryId, ...categoryData } as Category;
  } catch (error) {
    console.error('Failed to update category:', error);
    return null;
  }
};

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    await dynamoDBRequest('DeleteItem', {
      TableName: TABLES.CATEGORIES,
      Key: { categoryId: { S: categoryId } },
    });
    return true;
  } catch (error) {
    console.error('Failed to delete category:', error);
    return false;
  }
};

// ============ BANNERS (Mock - no table yet) ============

const mockBanners: Banner[] = [];

export const getAllBanners = async (): Promise<{ banners: Banner[]; total: number } | null> => {
  return { banners: mockBanners, total: mockBanners.length };
};

export const createBanner = async (bannerData: Partial<Banner>): Promise<Banner | null> => {
  const banner: Banner = {
    id: crypto.randomUUID(),
    title: bannerData.title || '',
    image_url: bannerData.image_url || '',
    link: bannerData.link,
    is_active: bannerData.is_active ?? true,
    position: bannerData.position || mockBanners.length,
    created_at: new Date().toISOString(),
  };
  mockBanners.push(banner);
  return banner;
};

export const updateBanner = async (bannerId: string, bannerData: Partial<Banner>): Promise<Banner | null> => {
  const index = mockBanners.findIndex(b => b.id === bannerId);
  if (index === -1) return null;
  mockBanners[index] = { ...mockBanners[index], ...bannerData };
  return mockBanners[index];
};

export const deleteBanner = async (bannerId: string): Promise<boolean> => {
  const index = mockBanners.findIndex(b => b.id === bannerId);
  if (index === -1) return false;
  mockBanners.splice(index, 1);
  return true;
};

// ============ PROMOTIONS (Mock - no table yet) ============

const mockPromotions: Promotion[] = [];

export const getAllPromotions = async (): Promise<{ promotions: Promotion[]; total: number } | null> => {
  return { promotions: mockPromotions, total: mockPromotions.length };
};

export const createPromotion = async (data: Partial<Promotion>): Promise<Promotion | null> => {
  const promo: Promotion = {
    id: crypto.randomUUID(),
    title: data.title || '',
    description: data.description,
    discount_type: data.discount_type || 'percentage',
    discount_value: data.discount_value || 0,
    applicable_to: data.applicable_to || 'common',
    start_date: data.start_date || new Date().toISOString(),
    end_date: data.end_date || new Date().toISOString(),
    is_active: data.is_active ?? true,
    created_at: new Date().toISOString(),
  };
  mockPromotions.push(promo);
  return promo;
};

export const updatePromotion = async (promoId: string, data: Partial<Promotion>): Promise<Promotion | null> => {
  const index = mockPromotions.findIndex(p => p.id === promoId);
  if (index === -1) return null;
  mockPromotions[index] = { ...mockPromotions[index], ...data };
  return mockPromotions[index];
};

export const deletePromotion = async (promoId: string): Promise<boolean> => {
  const index = mockPromotions.findIndex(p => p.id === promoId);
  if (index === -1) return false;
  mockPromotions.splice(index, 1);
  return true;
};

// ============ REVIEWS (Mock - no table yet) ============

export const getAllReviews = async (
  _page?: number,
  _limit?: number
): Promise<{ reviews: Review[]; total: number } | null> => {
  return { reviews: [], total: 0 };
};

export const flagReview = async (_reviewId: string): Promise<boolean> => {
  return true;
};

export const deleteReview = async (_reviewId: string): Promise<boolean> => {
  return true;
};

// ============ COMPLAINTS (Mock - no table yet) ============

export const getAllComplaints = async (
  _page?: number,
  _limit?: number,
  _statusFilter?: string
): Promise<{ complaints: Complaint[]; total: number } | null> => {
  return { complaints: [], total: 0 };
};

export const updateComplaint = async (
  _complaintId: string,
  _data: Partial<Complaint>
): Promise<Complaint | null> => {
  return null;
};

// ============ ADMIN MANAGEMENT (Mock) ============

export const getAllAdmins = async (
  _page?: number,
  _limit?: number,
  _search?: string
): Promise<{ admins: Admin[]; total: number } | null> => {
  return { admins: [], total: 0 };
};

export const getAdminProfile = async (): Promise<Admin | null> => {
  return null;
};

export const createAdmin = async (_data: Partial<Admin>): Promise<Admin | null> => {
  return null;
};

export const updateAdmin = async (_adminId: string, _data: Partial<Admin>): Promise<Admin | null> => {
  return null;
};

export const deleteAdmin = async (_adminId: string): Promise<boolean> => {
  return false;
};

// ============ COUNTRIES ============

export const getAllCountries = async (): Promise<{ countries: any[]; total: number } | null> => {
  try {
    const result = await dynamoDBRequest('Scan', { TableName: TABLES.COUNTRIES });
    
    const countries = (result.Items || []).map((item: any) => {
      const parsed = parseItem(item);
      return {
        id: parsed.short_code || parsed.id,
        name: parsed.country_name || parsed.name,
        code: parsed.short_code,
        dial_code: parsed.dial_code || parsed.isd_code,
        currency: parsed.currency,
        is_active: parsed.is_active ?? true,
      };
    });
    
    return { countries, total: countries.length };
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return { countries: [], total: 0 };
  }
};

// ============ BUSINESS TYPES ============

export const getAllBusinessTypes = async (): Promise<{ businessTypes: any[]; total: number } | null> => {
  try {
    const result = await dynamoDBRequest('Scan', { TableName: TABLES.BUSINESS_TYPES });
    
    const businessTypes = (result.Items || []).map((item: any) => {
      const parsed = parseItem(item);
      return {
        id: parsed.id,
        name: parsed.name,
        description: parsed.description,
        display_order: parsed.displayOrder || 0,
        is_active: parsed.is_active ?? true,
      };
    }).sort((a: any, b: any) => a.display_order - b.display_order);
    
    return { businessTypes, total: businessTypes.length };
  } catch (error) {
    console.error('Failed to fetch business types:', error);
    return { businessTypes: [], total: 0 };
  }
};

// ============ PENDING USERS ============

export const getPendingUsers = async (): Promise<User[] | null> => {
  return [];
};

export const approveUser = async (_userId: string): Promise<User | null> => {
  return null;
};

export const rejectUser = async (_userId: string): Promise<boolean> => {
  return true;
};

// ============ ACCOUNTS & FINANCE (Mock data for now) ============

export const getAccountSummary = async (): Promise<AccountSummary | null> => {
  return {
    total_revenue: 0,
    total_expenses: 0,
    net_profit: 0,
    total_payouts: 0,
    total_taxes: 0,
    currency: 'INR',
  };
};

export const getDaybook = async (
  _page: number = 1, 
  _limit: number = 10
): Promise<{ entries: DaybookEntry[]; total: number } | null> => {
  return { entries: [], total: 0 };
};

export const getBankBook = async (
  _page: number = 1, 
  _limit: number = 10
): Promise<{ entries: BankBookEntry[]; total: number } | null> => {
  return { entries: [], total: 0 };
};

export const getAccountHeads = async (): Promise<AccountHead[] | null> => {
  return [];
};

export const getExpenses = async (
  _page: number = 1, 
  _limit: number = 10
): Promise<{ expenses: ExpenseEntry[]; total: number } | null> => {
  return { expenses: [], total: 0 };
};

export const getSellerPayouts = async (
  _page: number = 1, 
  _limit: number = 10
): Promise<{ payouts: SellerPayout[]; total: number } | null> => {
  return { payouts: [], total: 0 };
};

export const getMembershipPlans = async (): Promise<MembershipPlan[] | null> => {
  return [];
};

export const getTaxRules = async (): Promise<TaxRule[] | null> => {
  return [];
};

export const getPlatformCosts = async (): Promise<PlatformCost[] | null> => {
  return [];
};

// ============ REPORTS ============

export const generateReport = async (
  reportType: string,
  params: {
    dateRange?: { start: string; end: string };
    startDate?: string;
    endDate?: string;
    category?: string;
    country?: string;
    format?: string;
  }
): Promise<Blob | null> => {
  console.log('Generating report:', reportType, params);
  // Return a mock blob for now - this would normally call a backend service
  const mockData = JSON.stringify({
    reportType,
    generatedAt: new Date().toISOString(),
    data: [],
    summary: {},
  });
  return new Blob([mockData], { type: 'application/json' });
};

// ============ COMPLAINT STATUS UPDATE ============

export const updateComplaintStatus = async (
  complaintId: string,
  status: string,
  _resolution?: string
): Promise<Complaint | null> => {
  return updateComplaint(complaintId, { status: status as Complaint['status'] });
};

// ============ DEFAULT EXPORT ============

export default {
  // Dashboard
  getDashboardMetrics,
  getPendingUsers,
  approveUser,
  rejectUser,
  // Users
  getAllUsers,
  getUserById,
  updateUser,
  banUser,
  unbanUser,
  deleteUser,
  // Sellers
  getAllSellers,
  getSellerById,
  updateSellerKYC,
  updateSellerBadge,
  approveSeller,
  rejectSeller,
  // Products
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  approveProduct,
  rejectProduct,
  disableProduct,
  deleteProduct,
  // Orders
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  processRefund,
  // Categories
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Banners
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  // Promotions
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  // Reviews
  getAllReviews,
  flagReview,
  deleteReview,
  // Complaints
  getAllComplaints,
  updateComplaint,
  updateComplaintStatus,
  // Admins
  getAllAdmins,
  getAdminProfile,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  // Countries
  getAllCountries,
  // Business Types
  getAllBusinessTypes,
  // Accounts & Finance
  getAccountSummary,
  getDaybook,
  getBankBook,
  getAccountHeads,
  getExpenses,
  getSellerPayouts,
  getMembershipPlans,
  getTaxRules,
  getPlatformCosts,
  // Reports
  generateReport,
};
