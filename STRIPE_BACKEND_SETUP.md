# 🔧 Backend Setup for Stripe Connect KYC

**Complete backend configuration checklist**

---

## 📋 Overview

You need to configure **7 backend components**:

1. ✅ DynamoDB table updates (add new columns)
2. ✅ Create Global Secondary Index
3. ✅ Deploy Lambda webhook handler
4. ✅ Deploy Lambda GraphQL resolvers
5. ✅ Update AppSync GraphQL schema
6. ✅ Configure API Gateway for webhooks
7. ✅ Set IAM permissions

---

## 1️⃣ DynamoDB Table Updates

### Add New Columns to `sellers` Table

You need to add 6 new attributes to support Stripe Connect:

```bash
# No schema update needed for DynamoDB (schemaless)
# Attributes will be added automatically when Lambda writes data
# Just verify table exists:
aws dynamodb describe-table --table-name sellers --region us-east-1
```

**New attributes** (will be added on first write):
- `stripe_account_id` (String)
- `stripe_account_type` (String) 
- `stripe_onboarding_completed` (Boolean)
- `payouts_enabled` (Boolean)
- `charges_enabled` (Boolean)
- `kyc_last_update` (String)

---

## 2️⃣ Create Global Secondary Index (REQUIRED)

**Critical**: Webhook handler needs to query by `stripe_account_id`

```bash
# Create GSI for stripe_account_id lookups
aws dynamodb update-table \
  --table-name sellers \
  --region us-east-1 \
  --attribute-definitions AttributeName=stripe_account_id,AttributeType=S \
  --global-secondary-index-updates \
    '[{
      "Create": {
        "IndexName": "stripe_account_id-index",
        "KeySchema": [
          {"AttributeName": "stripe_account_id", "KeyType": "HASH"}
        ],
        "Projection": {
          "ProjectionType": "ALL"
        },
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 5,
          "WriteCapacityUnits": 5
        }
      }
    }]'
```

**Verify GSI creation:**
```bash
aws dynamodb describe-table --table-name sellers --region us-east-1 | grep -A 10 "GlobalSecondaryIndexes"
```

Should show: `"IndexName": "stripe_account_id-index"`

---

## 3️⃣ Deploy Lambda Webhook Handler

### Step 1: Prepare Lambda Package

```bash
cd /workspaces/Beauzead-Ecommerce/src/lambda

# Create package directory
mkdir -p stripe-webhook-package
cd stripe-webhook-package

# Copy webhook file
cp ../stripeWebhook.ts index.ts

# Initialize npm and install dependencies
npm init -y
npm install aws-sdk @types/node

# Compile TypeScript (if needed)
npx tsc index.ts --target es2020 --module commonjs --esModuleInterop

# Create deployment package
zip -r ../stripe-webhook.zip .
```

### Step 2: Create Lambda Function

```bash
# Create IAM role first (if not exists)
aws iam create-role \
  --role-name stripe-webhook-lambda-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach policies
aws iam attach-role-policy \
  --role-name stripe-webhook-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name stripe-webhook-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Create Lambda function
aws lambda create-function \
  --function-name stripe-webhook-handler \
  --runtime nodejs18.x \
  --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/stripe-webhook-lambda-role \
  --handler index.handler \
  --zip-file fileb://stripe-webhook.zip \
  --timeout 30 \
  --memory-size 256 \
  --region us-east-1 \
  --environment Variables="{
    SELLERS_TABLE_NAME=sellers,
    STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
  }"
```

### Step 3: Update Lambda Environment Variables

```bash
# After you get webhook secret from Stripe
aws lambda update-function-configuration \
  --function-name stripe-webhook-handler \
  --region us-east-1 \
  --environment Variables="{
    SELLERS_TABLE_NAME=sellers,
    STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret
  }"
```

---

## 4️⃣ Deploy Lambda GraphQL Resolvers

### Create Resolvers Package

```bash
cd /workspaces/Beauzead-Ecommerce/src/graphql/resolvers

# Create package directory
mkdir -p stripe-resolvers-package
cd stripe-resolvers-package

# Copy resolver file
cp ../stripeConnectResolvers.ts index.ts

# Install dependencies
npm init -y
npm install stripe aws-sdk @types/node

# Compile if needed
npx tsc index.ts --target es2020 --module commonjs --esModuleInterop

# Create deployment package
zip -r ../stripe-resolvers.zip .
```

### Deploy 4 Lambda Functions (One Per Resolver)

```bash
# Get IAM role ARN
LAMBDA_ROLE_ARN="arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/stripe-webhook-lambda-role"

# 1. Create Account
aws lambda create-function \
  --function-name stripe-create-account \
  --runtime nodejs18.x \
  --role $LAMBDA_ROLE_ARN \
  --handler index.createStripeConnectAccountHandler \
  --zip-file fileb://stripe-resolvers.zip \
  --timeout 30 \
  --region us-east-1 \
  --environment Variables="{
    STRIPE_SECRET_KEY=sk_test_your_key,
    SELLERS_TABLE_NAME=sellers
  }"

# 2. Generate Onboarding Link
aws lambda create-function \
  --function-name stripe-generate-link \
  --runtime nodejs18.x \
  --role $LAMBDA_ROLE_ARN \
  --handler index.generateStripeOnboardingLinkHandler \
  --zip-file fileb://stripe-resolvers.zip \
  --timeout 30 \
  --region us-east-1 \
  --environment Variables="{STRIPE_SECRET_KEY=sk_test_your_key}"

# 3. Get Account Status
aws lambda create-function \
  --function-name stripe-get-status \
  --runtime nodejs18.x \
  --role $LAMBDA_ROLE_ARN \
  --handler index.getStripeAccountStatusHandler \
  --zip-file fileb://stripe-resolvers.zip \
  --timeout 30 \
  --region us-east-1 \
  --environment Variables="{STRIPE_SECRET_KEY=sk_test_your_key}"

# 4. Refresh Status
aws lambda create-function \
  --function-name stripe-refresh-status \
  --runtime nodejs18.x \
  --role $LAMBDA_ROLE_ARN \
  --handler index.refreshStripeAccountStatusHandler \
  --zip-file fileb://stripe-resolvers.zip \
  --timeout 30 \
  --region us-east-1 \
  --environment Variables="{
    STRIPE_SECRET_KEY=sk_test_your_key,
    SELLERS_TABLE_NAME=sellers
  }"
```

---

## 5️⃣ Update AppSync GraphQL Schema

### Add to Your AppSync Schema

```bash
# Get your AppSync API ID
API_ID=$(aws appsync list-graphql-apis --region us-east-1 \
  --query "graphqlApis[?name=='beauzeadecommerce'].apiId" --output text)

echo "Your AppSync API ID: $API_ID"
```

### Add Schema Types

Go to AWS Console → AppSync → Your API → Schema Editor

**Add these types:**

```graphql
# ====================================
# Stripe Connect KYC Types
# ====================================

type Mutation {
  # Existing mutations...
  
  # New Stripe Connect mutations
  createStripeConnectAccount(input: CreateStripeConnectAccountInput!): StripeConnectAccountResponse
  generateStripeOnboardingLink(input: GenerateOnboardingLinkInput!): StripeOnboardingLinkResponse
  refreshStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

type Query {
  # Existing queries...
  
  # New Stripe Connect query
  getStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

# Input Types
input CreateStripeConnectAccountInput {
  sellerId: String!
  email: String!
  country: String!
  businessType: String
}

input GenerateOnboardingLinkInput {
  sellerId: String!
  accountId: String!
  returnUrl: String!
  refreshUrl: String!
}

# Response Types
type StripeConnectAccountResponse {
  success: Boolean!
  accountId: String
  error: String
}

type StripeOnboardingLinkResponse {
  success: Boolean!
  url: String
  error: String
}

type StripeAccountStatusResponse {
  success: Boolean!
  accountId: String
  detailsSubmitted: Boolean
  chargesEnabled: Boolean
  payoutsEnabled: Boolean
  kycStatus: String
  requirementsCurrentlyDue: [String]
  disabled: Boolean
  error: String
}
```

### Attach Lambda Resolvers to Schema

**In AppSync Console:**

1. Go to **Schema** → Find `Mutation.createStripeConnectAccount`
2. Click **Attach resolver**
3. Data source type: **AWS Lambda**
4. Create new data source: `stripe-create-account-lambda`
5. Lambda function: `stripe-create-account`
6. Repeat for all 4 operations

**Or use AWS CLI:**

```bash
API_ID="your-appsync-api-id"

# Create data source for each Lambda
aws appsync create-data-source \
  --api-id $API_ID \
  --name StripeCreateAccountDataSource \
  --type AWS_LAMBDA \
  --lambda-config lambdaFunctionArn=arn:aws:lambda:us-east-1:ACCOUNT:function:stripe-create-account \
  --service-role-arn arn:aws:iam::ACCOUNT:role/appsync-lambda-role

# Create resolver
aws appsync create-resolver \
  --api-id $API_ID \
  --type-name Mutation \
  --field-name createStripeConnectAccount \
  --data-source-name StripeCreateAccountDataSource
```

---

## 6️⃣ Configure API Gateway for Webhooks

### Create REST API Endpoint

```bash
# Create REST API
API_ID=$(aws apigateway create-rest-api \
  --name stripe-webhooks \
  --region us-east-1 \
  --query id --output text)

echo "API Gateway ID: $API_ID"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \
  --rest-api-id $API_ID \
  --region us-east-1 \
  --query "items[0].id" --output text)

# Create /stripe resource
STRIPE_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_ID \
  --path-part stripe \
  --region us-east-1 \
  --query id --output text)

# Create /stripe/webhook resource
WEBHOOK_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $STRIPE_RESOURCE \
  --path-part webhook \
  --region us-east-1 \
  --query id --output text)

# Add POST method
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $WEBHOOK_RESOURCE \
  --http-method POST \
  --authorization-type NONE \
  --region us-east-1

# Get Lambda ARN
LAMBDA_ARN=$(aws lambda get-function \
  --function-name stripe-webhook-handler \
  --region us-east-1 \
  --query Configuration.FunctionArn --output text)

# Integrate with Lambda
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $WEBHOOK_RESOURCE \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations \
  --region us-east-1

# Grant API Gateway permission to invoke Lambda
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws lambda add-permission \
  --function-name stripe-webhook-handler \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:${AWS_ACCOUNT}:${API_ID}/*/*/*" \
  --region us-east-1

# Deploy API
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod \
  --region us-east-1

# Get webhook URL
echo "Webhook URL: https://${API_ID}.execute-api.us-east-1.amazonaws.com/prod/stripe/webhook"
```

**Save this URL** - you'll need it for Stripe Dashboard configuration.

---

## 7️⃣ Configure Stripe Dashboard

### Step 1: Get Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (pk_test_...)
3. Copy **Secret key** (sk_test_...)

### Step 2: Enable Stripe Connect

1. Go to https://dashboard.stripe.com/settings/connect
2. Click **Get started**
3. Choose **Express** accounts
4. Complete Connect settings

### Step 3: Configure Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/stripe/webhook`
4. Select events:
   - ✅ `account.updated`
   - ✅ `account.application.authorized`
   - ✅ `account.application.deauthorized`
   - ✅ `capability.updated`
5. Click **Add endpoint**
6. Copy **Signing secret** (starts with `whsec_`)

### Step 4: Update Lambda with Webhook Secret

```bash
aws lambda update-function-configuration \
  --function-name stripe-webhook-handler \
  --region us-east-1 \
  --environment Variables="{
    SELLERS_TABLE_NAME=sellers,
    STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET
  }"
```

---

## 8️⃣ Set Environment Variables

### Update All Lambda Functions

```bash
# Update webhook handler
aws lambda update-function-configuration \
  --function-name stripe-webhook-handler \
  --environment Variables="{
    SELLERS_TABLE_NAME=sellers,
    STRIPE_WEBHOOK_SECRET=whsec_xxx
  }"

# Update all resolver functions
for FUNC in stripe-create-account stripe-generate-link stripe-get-status stripe-refresh-status; do
  aws lambda update-function-configuration \
    --function-name $FUNC \
    --environment Variables="{
      STRIPE_SECRET_KEY=sk_test_xxx,
      SELLERS_TABLE_NAME=sellers
    }"
done
```

---

## ✅ Verification Checklist

### Test Each Component

```bash
# 1. Verify DynamoDB table
aws dynamodb describe-table --table-name sellers | grep TableStatus
# Should show: "TableStatus": "ACTIVE"

# 2. Verify GSI exists
aws dynamodb describe-table --table-name sellers | grep stripe_account_id-index
# Should show index name

# 3. Test Lambda webhook handler
aws lambda invoke \
  --function-name stripe-webhook-handler \
  --payload '{"body":"{}","headers":{}}' \
  response.json
cat response.json

# 4. Test resolver Lambda
aws lambda invoke \
  --function-name stripe-get-status \
  --payload '{"accountId":"acct_test"}' \
  response.json

# 5. Test API Gateway endpoint
curl -X POST https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"account.updated"}'

# 6. Test Stripe webhook (from Stripe Dashboard)
# Go to Webhooks → Your endpoint → Send test webhook
```

---

## 🔐 IAM Permissions Summary

Your Lambda functions need these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/sellers",
        "arn:aws:dynamodb:us-east-1:*:table/sellers/index/stripe_account_id-index"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

---

## 🚨 Common Issues & Fixes

### Issue: Lambda can't update DynamoDB

**Fix**: Check IAM role has DynamoDB permissions
```bash
aws iam get-role-policy \
  --role-name stripe-webhook-lambda-role \
  --policy-name DynamoDBAccess
```

### Issue: Webhook signature verification fails

**Fix**: Ensure webhook secret is correct
```bash
aws lambda get-function-configuration \
  --function-name stripe-webhook-handler \
  --query Environment.Variables.STRIPE_WEBHOOK_SECRET
```

### Issue: API Gateway returns 500 error

**Fix**: Check Lambda CloudWatch logs
```bash
aws logs tail /aws/lambda/stripe-webhook-handler --follow
```

### Issue: GSI creation takes too long

**Status**: GSI creation can take 5-10 minutes. Check status:
```bash
aws dynamodb describe-table --table-name sellers \
  --query "Table.GlobalSecondaryIndexes[?IndexName=='stripe_account_id-index'].IndexStatus"
```

---

## 📊 Monitoring & Logs

### CloudWatch Logs

```bash
# View webhook handler logs
aws logs tail /aws/lambda/stripe-webhook-handler --follow

# View resolver logs
aws logs tail /aws/lambda/stripe-create-account --follow

# View API Gateway logs
aws logs tail /aws/apigateway/stripe-webhooks --follow
```

### Stripe Dashboard Monitoring

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click your endpoint
3. View **Recent deliveries**
4. Check success/failure status

---

## 🎯 Quick Commands Script

Save this as `setup-stripe-backend.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Setting up Stripe Connect KYC Backend..."

# Variables
REGION="us-east-1"
TABLE_NAME="sellers"
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

echo "📦 Step 1: Creating DynamoDB GSI..."
aws dynamodb update-table \
  --table-name $TABLE_NAME \
  --region $REGION \
  --attribute-definitions AttributeName=stripe_account_id,AttributeType=S \
  --global-secondary-index-updates \
    '[{"Create":{"IndexName":"stripe_account_id-index","KeySchema":[{"AttributeName":"stripe_account_id","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"},"ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}}}]'

echo "⏳ Waiting for GSI to be active (this takes 5-10 minutes)..."
aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION

echo "✅ Backend setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Deploy Lambda functions (see full guide)"
echo "2. Update AppSync schema"
echo "3. Configure Stripe webhook"
echo "4. Test the integration"
```

---

## ✅ Final Checklist

- [ ] DynamoDB GSI created
- [ ] Lambda webhook handler deployed
- [ ] Lambda resolvers deployed (4 functions)
- [ ] AppSync schema updated
- [ ] AppSync resolvers attached
- [ ] API Gateway endpoint created
- [ ] Stripe webhook configured
- [ ] Environment variables set
- [ ] IAM permissions verified
- [ ] Webhook test successful

---

**Need help?** Check the full documentation:
- `STRIPE_CONNECT_KYC_IMPLEMENTATION.md` - Complete guide
- `STRIPE_CONNECT_KYC_QUICK_START.md` - Quick reference

**Estimated setup time**: 30-45 minutes
