import apiClient from '../../lib/api';
import categoryService from '../categoryService';
import type {
  Admin,
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

/**
 * Admin Dashboard API Service
 * Handles all admin-related API calls
 */

// ============ DASHBOARD ============
export const getDashboardMetrics = async (): Promise<DashboardData | null> => {
  const { data, error } = await apiClient.request<DashboardData>('/admin/dashboard/metrics');
  if (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    return null;
  }
  return data || null;
};

export const getPendingUsers = async (): Promise<User[] | null> => {
  const { data, error } = await apiClient.request<User[]>('/admin/users/pending');
  if (error) {
    console.error('Failed to fetch pending users:', error);
    return null;
  }
  return data || null;
};

export const approveUser = async (userId: string): Promise<User | null> => {
  const { data, error } = await apiClient.request<User>(`/admin/users/${userId}/approve`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to approve user:', error);
    return null;
  }
  return data || null;
};

export const rejectUser = async (userId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/users/${userId}/reject`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to reject user:', error);
    return false;
  }
  return true;
};

// ============ ADMIN MANAGEMENT ============
export const getAllAdmins = async (
  page?: number,
  limit?: number,
  search?: string
): Promise<{ admins: Admin[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (search) params.append('search', search);

  const { data, error } = await apiClient.request<{ admins: Admin[]; total: number }>(
    `/admin/admins?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch admins:', error);
    return null;
  }
  return data || null;
};

export const getAdminProfile = async (): Promise<Admin | null> => {
  const { data, error } = await apiClient.request<Admin>('/admin/profile');
  if (error) {
    console.error('Failed to fetch admin profile:', error);
    return null;
  }
  return data || null;
};

export const createAdmin = async (adminData: Partial<Admin>): Promise<Admin | null> => {
  const { data, error } = await apiClient.request<Admin>('/admin/admins', {
    method: 'POST',
    body: adminData,
  });
  if (error) {
    console.error('Failed to create admin:', error);
    return null;
  }
  return data || null;
};

export const updateAdmin = async (adminId: string, adminData: Partial<Admin>): Promise<Admin | null> => {
  const { data, error } = await apiClient.request<Admin>(`/admin/admins/${adminId}`, {
    method: 'PUT',
    body: adminData,
  });
  if (error) {
    console.error('Failed to update admin:', error);
    return null;
  }
  return data || null;
};

export const deleteAdmin = async (adminId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/admins/${adminId}`, {
    method: 'DELETE',
  });
  if (error) {
    console.error('Failed to delete admin:', error);
    return false;
  }
  return true;
};

// ============ USER MANAGEMENT ============
export const getAllUsers = async (
  page?: number,
  limit?: number,
  search?: string,
  profile_type?: string
): Promise<{ users: User[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (profile_type) params.append('profile_type', profile_type);

  const { data, error } = await apiClient.request<{ users: User[]; total: number }>(
    `/admin/users?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch users:', error);
    return null;
  }
  return data || null;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await apiClient.request<User>(`/admin/users/${userId}`);
  if (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
  return data || null;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  const { data, error } = await apiClient.request<User>(`/admin/users/${userId}`, {
    method: 'PUT',
    body: userData,
  });
  if (error) {
    console.error('Failed to update user:', error);
    return null;
  }
  return data || null;
};

export const banUser = async (userId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/users/${userId}/ban`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to ban user:', error);
    return false;
  }
  return true;
};

export const unbanUser = async (userId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/users/${userId}/unban`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to unban user:', error);
    return false;
  }
  return true;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
  if (error) {
    console.error('Failed to delete user:', error);
    return false;
  }
  return true;
};

// ============ SELLER MANAGEMENT ============
export const getAllSellers = async (
  page?: number,
  limit?: number,
  search?: string,
  kyc_status?: string
): Promise<{ sellers: Seller[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (kyc_status) params.append('kyc_status', kyc_status);

  const { data, error } = await apiClient.request<{ sellers: Seller[]; total: number }>(
    `/admin/sellers?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch sellers:', error);
    return null;
  }
  return data || null;
};

export const getSellerById = async (sellerId: string): Promise<Seller | null> => {
  const { data, error } = await apiClient.request<Seller>(`/admin/sellers/${sellerId}`);
  if (error) {
    console.error('Failed to fetch seller:', error);
    return null;
  }
  return data || null;
};

export const updateSellerKYC = async (
  sellerId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<Seller | null> => {
  const { data, error } = await apiClient.request<Seller>(`/admin/sellers/${sellerId}/kyc`, {
    method: 'PUT',
    body: { status },
  });
  if (error) {
    console.error('Failed to update seller KYC:', error);
    return null;
  }
  return data || null;
};

export const updateSellerBadge = async (
  sellerId: string,
  badge: 'silver' | 'gold' | 'platinum'
): Promise<Seller | null> => {
  const { data, error } = await apiClient.request<Seller>(`/admin/sellers/${sellerId}/badge`, {
    method: 'PUT',
    body: { badge },
  });
  if (error) {
    console.error('Failed to update seller badge:', error);
    return null;
  }
  return data || null;
};

export const approveSeller = async (sellerId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/sellers/${sellerId}/approve`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to approve seller:', error);
    return false;
  }
  return true;
};

export const rejectSeller = async (sellerId: string, reason?: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/sellers/${sellerId}/reject`, {
    method: 'POST',
    body: { reason },
  });
  if (error) {
    console.error('Failed to reject seller:', error);
    return false;
  }
  return true;
};

// ============ PRODUCT MANAGEMENT ============
export const getAllProducts = async (
  page?: number,
  limit?: number,
  search?: string,
  approval_status?: string,
  category?: string
): Promise<{ products: Product[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (approval_status) params.append('approval_status', approval_status);
  if (category) params.append('category', category);

  const { data, error } = await apiClient.request<{ products: Product[]; total: number }>(
    `/admin/products?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch products:', error);
    return null;
  }
  return data || null;
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await apiClient.request<Product>(`/admin/products/${productId}`);
  if (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
  return data || null;
};

export const updateProduct = async (
  productId: string,
  productData: Partial<Product>
): Promise<Product | null> => {
  const { data, error } = await apiClient.request<Product>(`/admin/products/${productId}`, {
    method: 'PUT',
    body: productData,
  });
  if (error) {
    console.error('Failed to update product:', error);
    return null;
  }
  return data || null;
};

export const approveProduct = async (productId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/products/${productId}/approve`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to approve product:', error);
    return false;
  }
  return true;
};

export const rejectProduct = async (productId: string, reason?: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/products/${productId}/reject`, {
    method: 'POST',
    body: { reason },
  });
  if (error) {
    console.error('Failed to reject product:', error);
    return false;
  }
  return true;
};

export const disableProduct = async (productId: string): Promise<Product | null> => {
  const { data, error } = await apiClient.request<Product>(
    `/admin/products/${productId}`,
    {
      method: 'PUT',
      body: { is_active: false },
    }
  );
  if (error) {
    console.error('Failed to disable product:', error);
    return null;
  }
  return data || null;
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/products/${productId}`, {
    method: 'DELETE',
  });
  if (error) {
    console.error('Failed to delete product:', error);
    return false;
  }
  return true;
};

// ============ ORDERS MANAGEMENT ============
export const getAllOrders = async (
  page?: number,
  limit?: number,
  status?: string,
  dateRange?: { start: string; end: string }
): Promise<{ orders: Order[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (status) params.append('status', status);
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }

  const { data, error } = await apiClient.request<{ orders: Order[]; total: number }>(
    `/admin/orders?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch orders:', error);
    return null;
  }
  return data || null;
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const { data, error } = await apiClient.request<Order>(`/admin/orders/${orderId}`);
  if (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
  return data || null;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  trackingNumber?: string
): Promise<Order | null> => {
  const { data, error } = await apiClient.request<Order>(`/admin/orders/${orderId}`, {
    method: 'PUT',
    body: { status, tracking_number: trackingNumber },
  });
  if (error) {
    console.error('Failed to update order status:', error);
    return null;
  }
  return data || null;
};

export const processRefund = async (orderId: string, amount: number): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/orders/${orderId}/refund`, {
    method: 'POST',
    body: { amount },
  });
  if (error) {
    console.error('Failed to process refund:', error);
    return false;
  }
  return true;
};

export const processReturn = async (orderId: string, reason: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/orders/${orderId}/return`, {
    method: 'POST',
    body: { reason },
  });
  if (error) {
    console.error('Failed to process return:', error);
    return false;
  }
  return true;
};

// ============ CATEGORY MANAGEMENT ============
export const getAllCategories = async (
  _page?: number,
  limit?: number
): Promise<{ categories: Category[]; total: number } | null> => {
  try {
    const categories = await categoryService.getAllCategories(limit || 100);
    if (categories) {
      return {
        categories,
        total: categories.length,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return null;
  }
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category | null> => {
  try {
    const result = await categoryService.createNewCategory({
      name: categoryData.name || '',
      description: categoryData.description,
      imageUrl: categoryData.image_url,
      isActive: categoryData.is_active !== false,
    });
    return result;
  } catch (error) {
    console.error('Failed to create category:', error);
    return null;
  }
};

export const updateCategory = async (
  categoryId: string,
  categoryData: Partial<Category>
): Promise<Category | null> => {
  try {
    const result = await categoryService.updateExistingCategory(categoryId, {
      name: categoryData.name,
      description: categoryData.description,
      imageUrl: categoryData.image_url,
      isActive: categoryData.is_active,
    });
    return result;
  } catch (error) {
    console.error('Failed to update category:', error);
    return null;
  }
};

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    return await categoryService.deleteExistingCategory(categoryId);
  } catch (error) {
    console.error('Failed to delete category:', error);
    return false;
  }
};

export const toggleCategoryStatus = async (
  categoryId: string,
  isActive: boolean
): Promise<Category | null> => {
  try {
    return await categoryService.toggleCategoryStatus(categoryId, isActive);
  } catch (error) {
    console.error('Failed to toggle category status:', error);
    return null;
  }
};

// ============ BANNER MANAGEMENT ============
export const getAllBanners = async (
  page?: number,
  limit?: number
): Promise<{ banners: Banner[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const { data, error } = await apiClient.request<{ banners: Banner[]; total: number }>(
    `/admin/banners?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch banners:', error);
    return null;
  }
  return data || null;
};

export const createBanner = async (bannerData: Partial<Banner>): Promise<Banner | null> => {
  const { data, error } = await apiClient.request<Banner>('/admin/banners', {
    method: 'POST',
    body: bannerData,
  });
  if (error) {
    console.error('Failed to create banner:', error);
    return null;
  }
  return data || null;
};

export const updateBanner = async (
  bannerId: string,
  bannerData: Partial<Banner>
): Promise<Banner | null> => {
  const { data, error } = await apiClient.request<Banner>(`/admin/banners/${bannerId}`, {
    method: 'PUT',
    body: bannerData,
  });
  if (error) {
    console.error('Failed to update banner:', error);
    return null;
  }
  return data || null;
};

export const deleteBanner = async (bannerId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/banners/${bannerId}`, {
    method: 'DELETE',
  });
  if (error) {
    console.error('Failed to delete banner:', error);
    return false;
  }
  return true;
};

// ============ PROMOTION MANAGEMENT ============
export const getAllPromotions = async (
  page?: number,
  limit?: number
): Promise<{ promotions: Promotion[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const { data, error } = await apiClient.request<{ promotions: Promotion[]; total: number }>(
    `/admin/promotions?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch promotions:', error);
    return null;
  }
  return data || null;
};

export const createPromotion = async (promotionData: Partial<Promotion>): Promise<Promotion | null> => {
  const { data, error } = await apiClient.request<Promotion>('/admin/promotions', {
    method: 'POST',
    body: promotionData,
  });
  if (error) {
    console.error('Failed to create promotion:', error);
    return null;
  }
  return data || null;
};

export const updatePromotion = async (
  promotionId: string,
  promotionData: Partial<Promotion>
): Promise<Promotion | null> => {
  const { data, error } = await apiClient.request<Promotion>(`/admin/promotions/${promotionId}`, {
    method: 'PUT',
    body: promotionData,
  });
  if (error) {
    console.error('Failed to update promotion:', error);
    return null;
  }
  return data || null;
};

export const deletePromotion = async (promotionId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/promotions/${promotionId}`, {
    method: 'DELETE',
  });
  if (error) {
    console.error('Failed to delete promotion:', error);
    return false;
  }
  return true;
};

// ============ REVIEWS MANAGEMENT ============
export const getAllReviews = async (
  page?: number,
  limit?: number,
  productId?: string
): Promise<{ reviews: Review[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (productId) params.append('product_id', productId);

  const { data, error } = await apiClient.request<{ reviews: Review[]; total: number }>(
    `/admin/reviews?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch reviews:', error);
    return null;
  }
  return data || null;
};

export const flagReview = async (reviewId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/reviews/${reviewId}/flag`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to flag review:', error);
    return false;
  }
  return true;
};

export const unflagReview = async (reviewId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/reviews/${reviewId}/unflag`, {
    method: 'POST',
  });
  if (error) {
    console.error('Failed to unflag review:', error);
    return false;
  }
  return true;
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  const { error } = await apiClient.request(`/admin/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  if (error) {
    console.error('Failed to delete review:', error);
    return false;
  }
  return true;
};

// ============ COMPLAINTS MANAGEMENT ============
export const getAllComplaints = async (
  page?: number,
  limit?: number,
  status?: string
): Promise<{ complaints: Complaint[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (status) params.append('status', status);

  const { data, error } = await apiClient.request<{ complaints: Complaint[]; total: number }>(
    `/admin/complaints?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch complaints:', error);
    return null;
  }
  return data || null;
};

export const getComplaintById = async (complaintId: string): Promise<Complaint | null> => {
  const { data, error } = await apiClient.request<Complaint>(`/admin/complaints/${complaintId}`);
  if (error) {
    console.error('Failed to fetch complaint:', error);
    return null;
  }
  return data || null;
};

export const updateComplaintStatus = async (
  complaintId: string,
  status: string,
  resolution?: string
): Promise<Complaint | null> => {
  const { data, error } = await apiClient.request<Complaint>(`/admin/complaints/${complaintId}`, {
    method: 'PUT',
    body: { status, resolution },
  });
  if (error) {
    console.error('Failed to update complaint:', error);
    return null;
  }
  return data || null;
};

// ============ REPORTS ============
export const generateReport = async (
  reportType: string,
  filters?: {
    dateRange?: { start: string; end: string };
    category?: string;
    country?: string;
    format?: 'csv' | 'excel' | 'pdf';
  }
): Promise<Blob | null> => {
  const params = new URLSearchParams();
  params.append('type', reportType);
  if (filters?.dateRange) {
    params.append('start_date', filters.dateRange.start);
    params.append('end_date', filters.dateRange.end);
  }
  if (filters?.category) params.append('category', filters.category);
  if (filters?.country) params.append('country', filters.country);
  if (filters?.format) params.append('format', filters.format);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/admin/reports?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to generate report');
      return null;
    }

    return await response.blob();
  } catch (error) {
    console.error('Failed to generate report:', error);
    return null;
  }
};

// ============ ACCOUNTS ============
export const getAccountSummary = async (): Promise<AccountSummary | null> => {
  const { data, error } = await apiClient.request<AccountSummary>('/admin/accounts/summary');
  if (error) {
    console.error('Failed to fetch account summary:', error);
    return null;
  }
  return data || null;
};

export const getDaybook = async (
  page?: number,
  limit?: number
): Promise<{ entries: DaybookEntry[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const { data, error } = await apiClient.request<{ entries: DaybookEntry[]; total: number }>(
    `/admin/accounts/daybook?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch daybook:', error);
    return null;
  }
  return data || null;
};

export const getBankBook = async (
  page?: number,
  limit?: number
): Promise<{ entries: BankBookEntry[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const { data, error } = await apiClient.request<{ entries: BankBookEntry[]; total: number }>(
    `/admin/accounts/bankbook?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch bank book:', error);
    return null;
  }
  return data || null;
};

export const getAccountHeads = async (): Promise<AccountHead[] | null> => {
  const { data, error } = await apiClient.request<AccountHead[]>('/admin/accounts/heads');
  if (error) {
    console.error('Failed to fetch account heads:', error);
    return null;
  }
  return data || null;
};

export const getExpenses = async (
  page?: number,
  limit?: number
): Promise<{ expenses: ExpenseEntry[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const { data, error } = await apiClient.request<{ expenses: ExpenseEntry[]; total: number }>(
    `/admin/accounts/expenses?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch expenses:', error);
    return null;
  }
  return data || null;
};

export const getSellerPayouts = async (
  page?: number,
  limit?: number
): Promise<{ payouts: SellerPayout[]; total: number } | null> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const { data, error } = await apiClient.request<{ payouts: SellerPayout[]; total: number }>(
    `/admin/accounts/payouts?${params.toString()}`
  );
  if (error) {
    console.error('Failed to fetch seller payouts:', error);
    return null;
  }
  return data || null;
};

export const getMembershipPlans = async (): Promise<MembershipPlan[] | null> => {
  const { data, error } = await apiClient.request<MembershipPlan[]>('/admin/accounts/membership-plans');
  if (error) {
    console.error('Failed to fetch membership plans:', error);
    return null;
  }
  return data || null;
};

export const getTaxRules = async (): Promise<TaxRule[] | null> => {
  const { data, error } = await apiClient.request<TaxRule[]>('/admin/accounts/taxes');
  if (error) {
    console.error('Failed to fetch taxes:', error);
    return null;
  }
  return data || null;
};

export const getPlatformCosts = async (): Promise<PlatformCost[] | null> => {
  const { data, error } = await apiClient.request<PlatformCost[]>('/admin/accounts/platform-costs');
  if (error) {
    console.error('Failed to fetch platform costs:', error);
    return null;
  }
  return data || null;
};

async function getAuthToken(): Promise<string> {
  const { fetchAuthSession } = await import('aws-amplify/auth');
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString() || '';
}

export default {
  // Dashboard
  getDashboardMetrics,
  getPendingUsers,
  approveUser,
  rejectUser,

  // Admin
  getAdminProfile,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,

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
  processReturn,

  // Categories
  getAllCategories,
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
  unflagReview,
  deleteReview,

  // Complaints
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,

  // Reports
  generateReport,

  // Accounts
  getAccountSummary,
  getDaybook,
  getBankBook,
  getAccountHeads,
  getExpenses,
  getSellerPayouts,
  getMembershipPlans,
  getTaxRules,
  getPlatformCosts,
};
