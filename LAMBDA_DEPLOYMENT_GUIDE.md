# Lambda Functions Deployment Guide

This guide covers deploying the 4 new Lambda functions created for seller backend operations.

## Lambda Functions Created

### 1. **sellerOrderManagement**
- **Purpose**: Handles seller order actions (accept, reject, ship, deliver)
- **Location**: `lambda-packages/sellerOrderManagement/index.js`
- **Functionality**:
  - Validates seller ownership before allowing updates
  - Enforces proper status transitions
  - Updates order status and tracking information

### 2. **sellerAnalytics**
- **Purpose**: Calculates real-time analytics for sellers
- **Location**: `lambda-packages/sellerAnalytics/index.js`
- **Functionality**:
  - Aggregates sales, orders, and average order value
  - Calculates earnings with platform fee deduction
  - Generates top products and category breakdowns

### 3. **getSellerTransactions**
- **Purpose**: Retrieves wallet transaction history for sellers
- **Location**: `lambda-packages/getSellerTransactions/index.js`
- **Functionality**:
  - Generates transaction records from orders
  - Categorizes transactions (credits, debits, refunds, commissions)
  - Calculates running balance

### 4. **sellerProductManagement**
- **Purpose**: Handles product CRUD operations for sellers
- **Location**: `lambda-packages/sellerProductManagement/index.js`
- **Functionality**:
  - Creates, updates, and deletes products
  - Validates seller ownership for modifications
  - Sets approval status for new products

## Deployment Steps

### Prerequisites
- AWS CLI configured with appropriate credentials
- DynamoDB tables created: Orders, Products, Sellers
- IAM role with permissions for Lambda, DynamoDB, and CloudWatch Logs

### Step 1: Create IAM Role for Lambdas

```bash
# Create IAM role for Lambda execution
aws iam create-role \
  --role-name SellerDashboardLambdaRole \
  --assume-role-policy-document file://lambda-packages/lambda-trust-policy.json

# Attach DynamoDB access policy
aws iam attach-role-policy \
  --role-name SellerDashboardLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Attach CloudWatch Logs policy
aws iam attach-role-policy \
  --role-name SellerDashboardLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess
```

### Step 2: Package Lambda Functions

```bash
# Package each Lambda function
cd lambda-packages/sellerOrderManagement
zip -r ../sellerOrderManagement.zip .
cd ..

cd sellerAnalytics
zip -r ../sellerAnalytics.zip .
cd ..

cd getSellerTransactions
zip -r ../getSellerTransactions.zip .
cd ..

cd sellerProductManagement
zip -r ../sellerProductManagement.zip .
cd ..
```

### Step 3: Deploy Lambda Functions

```bash
# Get your IAM role ARN
ROLE_ARN=$(aws iam get-role --role-name SellerDashboardLambdaRole --query 'Role.Arn' --output text)

# 1. Deploy sellerOrderManagement
aws lambda create-function \
  --function-name sellerOrderManagement \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://lambda-packages/sellerOrderManagement.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables="{ORDERS_TABLE_NAME=Orders,AWS_REGION=us-east-1}"

# 2. Deploy sellerAnalytics
aws lambda create-function \
  --function-name sellerAnalytics \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://lambda-packages/sellerAnalytics.zip \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables="{ORDERS_TABLE_NAME=Orders,PRODUCTS_TABLE_NAME=Products,AWS_REGION=us-east-1}"

# 3. Deploy getSellerTransactions
aws lambda create-function \
  --function-name getSellerTransactions \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://lambda-packages/getSellerTransactions.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables="{ORDERS_TABLE_NAME=Orders,AWS_REGION=us-east-1}"

# 4. Deploy sellerProductManagement
aws lambda create-function \
  --function-name sellerProductManagement \
  --runtime nodejs18.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://lambda-packages/sellerProductManagement.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables="{PRODUCTS_TABLE_NAME=Products,AWS_REGION=us-east-1}"
```

### Step 4: Attach Lambda Functions to AppSync Resolvers

#### 4.1 Create AppSync Data Sources

```bash
# Get your AppSync API ID
API_ID=$(aws appsync list-graphql-apis --region us-east-1 --query 'graphqlApis[0].apiId' --output text)

# Get IAM role ARN for AppSync to invoke Lambdas
APPSYNC_ROLE_ARN="arn:aws:iam::YOUR_ACCOUNT_ID:role/YourAppSyncLambdaRole"

# Create data sources for each Lambda
aws appsync create-data-source \
  --api-id $API_ID \
  --name SellerOrderManagementDataSource \
  --type AWS_LAMBDA \
  --lambda-config lambdaFunctionArn="arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:sellerOrderManagement" \
  --service-role-arn $APPSYNC_ROLE_ARN

aws appsync create-data-source \
  --api-id $API_ID \
  --name SellerAnalyticsDataSource \
  --type AWS_LAMBDA \
  --lambda-config lambdaFunctionArn="arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:sellerAnalytics" \
  --service-role-arn $APPSYNC_ROLE_ARN

aws appsync create-data-source \
  --api-id $API_ID \
  --name GetSellerTransactionsDataSource \
  --type AWS_LAMBDA \
  --lambda-config lambdaFunctionArn="arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:getSellerTransactions" \
  --service-role-arn $APPSYNC_ROLE_ARN

aws appsync create-data-source \
  --api-id $API_ID \
  --name SellerProductManagementDataSource \
  --type AWS_LAMBDA \
  --lambda-config lambdaFunctionArn="arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:sellerProductManagement" \
  --service-role-arn $APPSYNC_ROLE_ARN
```

#### 4.2 Add GraphQL Schema Types (if not already present)

Add these to your AppSync schema:

```graphql
# Order Management
input SellerOrderActionInput {
  action: String!  # 'accept' | 'reject' | 'ship' | 'deliver'
  orderId: ID!
  sellerId: ID!
  trackingNumber: String
}

type SellerOrderActionResponse {
  success: Boolean!
  order: Order
  error: String
}

# Analytics
input SellerAnalyticsInput {
  sellerId: ID!
  period: String  # 'today' | 'week' | 'month' | 'all'
}

type SellerAnalytics {
  totalSales: Int
  totalRevenue: Float
  totalOrders: Int
  averageOrderValue: Float
  netEarnings: Float
  platformFeeDeducted: Float
  platformFeePercentage: Float
  ordersByStatus: AWSJSON
  revenueByStatus: AWSJSON
  topProducts: AWSJSON
  period: String
}

type SellerAnalyticsResponse {
  success: Boolean!
  analytics: SellerAnalytics
  error: String
}

# Wallet Transactions
input GetSellerTransactionsInput {
  sellerId: ID!
  limit: Int
  nextToken: String
}

type Transaction {
  id: ID!
  type: String!
  amount: Float!
  description: String
  status: String
  date: String
  orderId: ID
  orderNumber: String
  balance: Float
}

type GetSellerTransactionsResponse {
  success: Boolean!
  transactions: [Transaction]
  totalTransactions: Int
  currentBalance: Float
  nextToken: String
  error: String
}

# Product Management
input SellerProductActionInput {
  action: String!  # 'create' | 'update' | 'delete'
  sellerId: ID!
  productId: ID
  product: AWSJSON
}

type SellerProductActionResponse {
  success: Boolean!
  product: Product
  error: String
}

# Add these mutations/queries to your schema
type Mutation {
  sellerOrderAction(input: SellerOrderActionInput!): SellerOrderActionResponse
  sellerProductAction(input: SellerProductActionInput!): SellerProductActionResponse
}

type Query {
  getSellerAnalytics(input: SellerAnalyticsInput!): SellerAnalyticsResponse
  getSellerTransactions(input: GetSellerTransactionsInput!): GetSellerTransactionsResponse
}
```

#### 4.3 Create AppSync Resolvers

Create resolvers for each Lambda function. Example for seller order management:

**Request Mapping Template (sellerOrderAction-request.vtl)**:
```vtl
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": $util.toJson($ctx.args)
}
```

**Response Mapping Template (sellerOrderAction-response.vtl)**:
```vtl
$util.toJson($ctx.result)
```

Upload these via console or create via CLI:

```bash
aws appsync create-resolver \
  --api-id $API_ID \
  --type-name Mutation \
  --field-name sellerOrderAction \
  --data-source-name SellerOrderManagementDataSource \
  --request-mapping-template file://vtl-templates/sellerOrderAction-request.vtl \
  --response-mapping-template file://vtl-templates/response.vtl
```

Repeat for each Lambda function with appropriate resolver names.

## Testing

### Test sellerOrderManagement
```bash
aws lambda invoke \
  --function-name sellerOrderManagement \
  --payload '{"action":"accept","orderId":"test-order-id","sellerId":"test-seller-id"}' \
  response.json
cat response.json
```

### Test sellerAnalytics
```bash
aws lambda invoke \
  --function-name sellerAnalytics \
  --payload '{"sellerId":"test-seller-id","period":"all"}' \
  response.json
cat response.json
```

### Test getSellerTransactions
```bash
aws lambda invoke \
  --function-name getSellerTransactions \
  --payload '{"sellerId":"test-seller-id","limit":50}' \
  response.json
cat response.json
```

### Test sellerProductManagement
```bash
aws lambda invoke \
  --function-name sellerProductManagement \
  --payload '{"action":"create","sellerId":"test-seller-id","product":{"name":"Test Product","price":1000}}' \
  response.json
cat response.json
```

## Environment Variables Required

| Lambda Function | Environment Variables | Description |
|----------------|----------------------|-------------|
| sellerOrderManagement | ORDERS_TABLE_NAME | DynamoDB Orders table name |
| sellerAnalytics | ORDERS_TABLE_NAME, PRODUCTS_TABLE_NAME | DynamoDB table names |
| getSellerTransactions | ORDERS_TABLE_NAME | DynamoDB Orders table name |
| sellerProductManagement | PRODUCTS_TABLE_NAME | DynamoDB Products table name |

## Monitoring

Monitor Lambda execution via CloudWatch:
```bash
# View logs for sellerOrderManagement
aws logs tail /aws/lambda/sellerOrderManagement --follow

# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=sellerOrderManagement \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-12-31T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure IAM role has DynamoDB and CloudWatch Logs access
2. **Table Not Found**: Verify ORDERS_TABLE_NAME and PRODUCTS_TABLE_NAME environment variables
3. **Timeout**: Increase Lambda timeout if processing large datasets
4. **Memory Issues**: Increase memory size for sellerAnalytics if processing many orders

### Debug Mode

Enable detailed logging by updating Lambda environment variables:
```bash
aws lambda update-function-configuration \
  --function-name sellerOrderManagement \
  --environment Variables="{ORDERS_TABLE_NAME=Orders,AWS_REGION=us-east-1,DEBUG=true}"
```

## Integration with Frontend

All Lambda functions are now integrated with the following components:

- **SellerOrderManagement.tsx**: Uses `updateOrder` mutation (calls sellerOrderManagement Lambda)
- **SellerWallet.tsx**: Uses `ordersBySeller` query and calculates transactions locally
- **SellerProfile.tsx**: Uses `getSeller` query and `updateSeller` mutation
- **AnalyticsDashboard.tsx**: Uses `ordersBySeller` query and calculates analytics locally
- **SellerProductListing.tsx**: Uses `productsBySeller` query

**Note**: Currently, the frontend calculates analytics and transactions locally. For production, you should:
1. Add GraphQL queries/mutations for the new Lambda functions
2. Update frontend components to call Lambda-based resolvers instead of local calculations
3. This provides better performance and consistency

## Production Checklist

- [ ] All Lambda functions deployed
- [ ] AppSync data sources created
- [ ] AppSync resolvers configured
- [ ] GraphQL schema updated
- [ ] IAM permissions verified
- [ ] Environment variables set correctly
- [ ] Test all functions with real data
- [ ] Monitor CloudWatch logs for errors
- [ ] Set up alarms for Lambda failures
- [ ] Configure auto-scaling if needed

## Cost Optimization

- Use Lambda Provisioned Concurrency for frequently called functions
- Set appropriate memory size (don't over-provision)
- Use DynamoDB on-demand pricing or adjust provisioned capacity
- Enable Lambda function URL if direct HTTP access needed
- Consider using Lambda@Edge for global distribution

## Next Steps

1. Update GraphQL schema with new types
2. Create VTL templates for AppSync resolvers
3. Test each Lambda function with real seller data
4. Update frontend to call Lambda-based resolvers
5. Monitor performance and adjust as needed
6. Add caching layer (ElastiCache) for frequently accessed analytics
7. Implement pagination for large datasets
8. Add rate limiting to prevent abuse
