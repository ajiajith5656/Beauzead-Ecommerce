# AWS Amplify Backend Examples

## Backend Architecture

Your Amplify backend consists of:
- **AWS Lambda**: Serverless compute (function handlers)
- **API Gateway**: REST API endpoints
- **Cognito**: User authentication & authorization
- **DynamoDB/RDS**: Database
- **S3**: File storage
- **CloudWatch**: Logging & monitoring

---

## Lambda Function Examples

### 1. Create User Profile

**File**: `amplify/backend/function/createUserProfile/src/index.js`

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Users';

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));

  const { userId, email, name, role } = JSON.parse(event.body);

  if (!userId || !email || !role) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId,
      email,
      name,
      role, // 'user', 'seller', 'admin'
      approved: role === 'user', // Users auto-approved, sellers need approval
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User profile created', userId }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create user profile' }),
    };
  }
};
```

### 2. Get User Profile

**File**: `amplify/backend/function/getUserProfile/src/index.js`

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Users';

exports.handler = async (event) => {
  const userId = event.pathParameters.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'userId is required' }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { userId },
  };

  try {
    const result = await dynamodb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve user' }),
    };
  }
};
```

### 3. Create Product

**File**: `amplify/backend/function/createProduct/src/index.js`

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'Products';

exports.handler = async (event) => {
  const { name, description, price, category, sellerId, stock } = JSON.parse(
    event.body
  );

  if (!name || !price || !sellerId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const productId = uuidv4();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      productId,
      name,
      description,
      price,
      category,
      sellerId,
      stock: stock || 0,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Product created', productId }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create product' }),
    };
  }
};
```

### 4. List Products

**File**: `amplify/backend/function/listProducts/src/index.js`

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Products';

exports.handler = async (event) => {
  const { category, limit = 20, startKey } = event.queryStringParameters || {};

  let params = {
    TableName: TABLE_NAME,
    Limit: parseInt(limit),
  };

  if (category) {
    params.IndexName = 'CategoryIndex'; // GSI
    params.KeyConditionExpression = 'category = :cat';
    params.ExpressionAttributeValues = {
      ':cat': category,
    };
  }

  if (startKey) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(startKey, 'base64'));
  }

  try {
    const result = await dynamodb.query(params).promise();
    
    // If no GSI used, use scan instead
    if (!category) {
      const scanResult = await dynamodb.scan(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: scanResult.Items,
          lastEvaluatedKey: scanResult.LastEvaluatedKey
            ? Buffer.from(JSON.stringify(scanResult.LastEvaluatedKey)).toString('base64')
            : null,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
          : null,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to list products' }),
    };
  }
};
```

### 5. Update Product Stock

**File**: `amplify/backend/function/updateProductStock/src/index.js`

```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Products';

exports.handler = async (event) => {
  const productId = event.pathParameters.productId;
  const { quantity } = JSON.parse(event.body);

  if (!productId || quantity === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'productId and quantity are required' }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: { productId },
    UpdateExpression: 'SET stock = stock + :qty, updatedAt = :now',
    ExpressionAttributeValues: {
      ':qty': quantity,
      ':now': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update stock' }),
    };
  }
};
```

---

## Frontend Integration

### Call Your Backend from React

```typescript
import api from '../lib/api';

// Create user profile after signup
async function createUserProfile(userId: string, userData: any) {
  const { data, error } = await api.post('/users', {
    userId,
    ...userData,
  });
  
  if (error) {
    console.error('Error:', error);
  }
  return data;
}

// Get user profile
async function fetchUserProfile(userId: string) {
  const { data, error } = await api.get(`/users/${userId}`);
  if (error) {
    console.error('Error:', error);
  }
  return data;
}

// Create product
async function createProduct(productData: any) {
  const { data, error } = await api.post('/products', productData);
  if (error) {
    console.error('Error:', error);
  }
  return data;
}

// List products
async function getProducts(category?: string) {
  const query = category ? `?category=${category}` : '';
  const { data, error } = await api.get(`/products${query}`);
  if (error) {
    console.error('Error:', error);
  }
  return data;
}

// Update product stock
async function updateStock(productId: string, quantity: number) {
  const { data, error } = await api.put(`/products/${productId}/stock`, {
    quantity,
  });
  if (error) {
    console.error('Error:', error);
  }
  return data;
}
```

---

## Database Schema (DynamoDB)

### Users Table
```
PK: userId
SK: (none - single item per user)

Attributes:
- userId (String)
- email (String)
- name (String)
- role (String) - "user", "seller", "admin"
- approved (Boolean)
- createdAt (String - ISO 8601)
- updatedAt (String - ISO 8601)
- profileImage (String - S3 URL)
- phone (String)
```

### Products Table
```
PK: productId
SK: (none - single item per product)

Attributes:
- productId (String)
- name (String)
- description (String)
- price (Number)
- category (String)
- sellerId (String)
- stock (Number)
- rating (Number)
- reviews (Array)
- images (Array - S3 URLs)
- createdAt (String)
- updatedAt (String)

GSI: CategoryIndex
- PK: category
- SK: createdAt
```

### Orders Table
```
PK: orderId
SK: (none - single item per order)

Attributes:
- orderId (String)
- userId (String)
- items (Array)
- totalPrice (Number)
- status (String) - "pending", "shipped", "delivered"
- createdAt (String)
- updatedAt (String)

GSI: UserOrdersIndex
- PK: userId
- SK: createdAt
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create user profile |
| GET | `/users/{userId}` | Get user profile |
| PUT | `/users/{userId}` | Update user profile |
| POST | `/products` | Create product |
| GET | `/products` | List products |
| GET | `/products/{productId}` | Get product details |
| PUT | `/products/{productId}` | Update product |
| PUT | `/products/{productId}/stock` | Update stock |
| DELETE | `/products/{productId}` | Delete product |
| POST | `/orders` | Create order |
| GET | `/orders/{orderId}` | Get order |
| GET | `/users/{userId}/orders` | Get user orders |

---

## Deployment

```bash
# Add API
amplify add api

# Add functions
amplify add function

# Add database
amplify add storage

# Deploy
amplify push
```

---

## Testing APIs

### Using curl
```bash
# Create product
curl -X POST https://your-api-endpoint/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "sellerId": "seller123"
  }'

# Get product
curl https://your-api-endpoint/products/prod123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Get auth token from browser DevTools → Local Storage
2. Create new request in Postman
3. Add `Authorization: Bearer <token>` header
4. Test API endpoints

---

## Security

- ✅ All API calls require authentication token
- ✅ Cognito validates token automatically
- ✅ IAM roles restrict access to AWS resources
- ✅ API Gateway CORS prevents unauthorized requests
- ✅ Lambda execution role limits permissions

---

**For more details, visit [AWS Amplify Documentation](https://docs.amplify.aws/)**
