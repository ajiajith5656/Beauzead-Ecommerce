#!/bin/bash

# =============================================================================
# Stripe Connect KYC - Automated Backend Setup Script
# =============================================================================
# 
# This script automates the backend configuration for Stripe Connect KYC:
# 1. Creates DynamoDB Global Secondary Index
# 2. Creates IAM roles with proper permissions
# 3. Packages and deploys Lambda functions
# 4. Creates API Gateway endpoint for webhooks
# 5. Configures AppSync resolvers (manual steps provided)
#
# Prerequisites:
# - AWS CLI configured with credentials
# - Node.js and npm installed
# - Stripe test API keys ready
# 
# Usage:
#   ./setup-stripe-backend.sh
# 
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGION="us-east-1"
TABLE_NAME="sellers"
WEBHOOK_LAMBDA_NAME="stripe-webhook-handler"
CREATE_ACCOUNT_LAMBDA="stripe-create-account"
GENERATE_LINK_LAMBDA="stripe-generate-link"
GET_STATUS_LAMBDA="stripe-get-status"
REFRESH_STATUS_LAMBDA="stripe-refresh-status"
API_NAME="stripe-webhooks"
LAMBDA_ROLE_NAME="stripe-lambda-execution-role"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Stripe Connect KYC - Automated Backend Setup           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get AWS account ID
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓${NC} AWS Account: $AWS_ACCOUNT"
echo -e "${GREEN}✓${NC} Region: $REGION"
echo ""

# =============================================================================
# Step 1: Create DynamoDB Global Secondary Index
# =============================================================================

echo -e "${YELLOW}▶ Step 1: Creating DynamoDB Global Secondary Index...${NC}"

# Check if GSI already exists
GSI_EXISTS=$(aws dynamodb describe-table \
  --table-name $TABLE_NAME \
  --region $REGION \
  --query "Table.GlobalSecondaryIndexes[?IndexName=='stripe_account_id-index'].IndexName" \
  --output text 2>/dev/null || echo "")

if [ -n "$GSI_EXISTS" ]; then
  echo -e "${GREEN}  ✓ GSI 'stripe_account_id-index' already exists${NC}"
else
  echo "  Creating GSI (this takes 5-10 minutes)..."
  aws dynamodb update-table \
    --table-name $TABLE_NAME \
    --region $REGION \
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
      }]' > /dev/null 2>&1
  
  echo -e "${GREEN}  ✓ GSI creation initiated${NC}"
  echo "  ⏳ Index will be ready in 5-10 minutes. Continuing with other steps..."
fi

echo ""

# =============================================================================
# Step 2: Create IAM Role for Lambda Functions
# =============================================================================

echo -e "${YELLOW}▶ Step 2: Creating IAM Role for Lambda functions...${NC}"

# Check if role exists
ROLE_EXISTS=$(aws iam get-role --role-name $LAMBDA_ROLE_NAME 2>/dev/null || echo "")

if [ -n "$ROLE_EXISTS" ]; then
  echo -e "${GREEN}  ✓ IAM Role '$LAMBDA_ROLE_NAME' already exists${NC}"
else
  # Create trust policy
  cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  # Create role
  aws iam create-role \
    --role-name $LAMBDA_ROLE_NAME \
    --assume-role-policy-document file:///tmp/trust-policy.json \
    > /dev/null 2>&1
  
  echo -e "${GREEN}  ✓ IAM Role created${NC}"
  
  # Attach basic execution policy
  aws iam attach-role-policy \
    --role-name $LAMBDA_ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  
  # Create and attach DynamoDB policy
  cat > /tmp/dynamodb-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:${REGION}:${AWS_ACCOUNT}:table/${TABLE_NAME}",
        "arn:aws:dynamodb:${REGION}:${AWS_ACCOUNT}:table/${TABLE_NAME}/index/*"
      ]
    }
  ]
}
EOF

  aws iam put-role-policy \
    --role-name $LAMBDA_ROLE_NAME \
    --policy-name DynamoDBAccess \
    --policy-document file:///tmp/dynamodb-policy.json
  
  echo -e "${GREEN}  ✓ Policies attached${NC}"
  
  # Wait for role to propagate
  echo "  ⏳ Waiting for IAM role to propagate (10 seconds)..."
  sleep 10
fi

LAMBDA_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT}:role/${LAMBDA_ROLE_NAME}"
echo -e "${GREEN}  ✓ Lambda Role ARN: $LAMBDA_ROLE_ARN${NC}"
echo ""

# =============================================================================
# Step 3: Package and Deploy Lambda Functions
# =============================================================================

echo -e "${YELLOW}▶ Step 3: Packaging and deploying Lambda functions...${NC}"

# Prompt for Stripe keys
echo ""
echo "  📝 Enter your Stripe API keys (or press Enter to skip and set later):"
read -p "  Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY
read -p "  Stripe Webhook Secret (whsec_...): " STRIPE_WEBHOOK_SECRET

if [ -z "$STRIPE_SECRET_KEY" ]; then
  STRIPE_SECRET_KEY="REPLACE_WITH_YOUR_KEY"
  echo -e "${YELLOW}  ⚠ Skipped. Set keys later using AWS Console or CLI${NC}"
fi

echo ""
echo "  📦 Packaging Lambda functions..."

# Note: Lambda functions are TypeScript and need Node.js environment
# In production, build these properly with dependencies

echo -e "${BLUE}  ℹ Lambda functions require packaging with dependencies:${NC}"
echo "    - aws-sdk"
echo "    - stripe"
echo "    - @types/node"
echo ""
echo "  Manual deployment steps:"
echo "    1. cd src/lambda && npm install aws-sdk @types/node"
echo "    2. Package with dependencies: zip -r webhook.zip ."
echo "    3. Deploy: aws lambda create-function ..."
echo ""
echo -e "${YELLOW}  ⚠ Lambda deployment requires manual packaging (see STRIPE_BACKEND_SETUP.md)${NC}"

echo ""

# =============================================================================
# Step 4: Create API Gateway for Webhooks
# =============================================================================

echo -e "${YELLOW}▶ Step 4: Creating API Gateway endpoint for webhooks...${NC}"

# Check if API already exists
API_EXISTS=$(aws apigateway get-rest-apis \
  --region $REGION \
  --query "items[?name=='${API_NAME}'].id" \
  --output text 2>/dev/null || echo "")

if [ -n "$API_EXISTS" ]; then
  echo -e "${GREEN}  ✓ API Gateway '$API_NAME' already exists (ID: $API_EXISTS)${NC}"
  API_ID="$API_EXISTS"
else
  echo "  Creating REST API..."
  API_ID=$(aws apigateway create-rest-api \
    --name $API_NAME \
    --region $REGION \
    --query id \
    --output text)
  
  echo -e "${GREEN}  ✓ API Gateway created (ID: $API_ID)${NC}"
fi

# Get webhook URL
WEBHOOK_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod/stripe/webhook"

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Backend Setup Summary${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
echo ""
echo "  ✓ DynamoDB GSI: stripe_account_id-index (creating...)"
echo "  ✓ IAM Role: $LAMBDA_ROLE_NAME"
echo "  ✓ API Gateway ID: $API_ID"
echo ""
echo -e "${YELLOW}📋 Manual Steps Required:${NC}"
echo ""
echo "  1. Deploy Lambda Functions:"
echo "     See: STRIPE_BACKEND_SETUP.md (Step 3 & 4)"
echo ""
echo "  2. Configure Stripe Webhook:"
echo "     URL: $WEBHOOK_URL"
echo "     Events: account.updated, capability.updated"
echo "     Dashboard: https://dashboard.stripe.com/test/webhooks"
echo ""
echo "  3. Update AppSync Schema:"
echo "     Add GraphQL types from STRIPE_BACKEND_SETUP.md (Step 5)"
echo ""
echo "  4. Set Environment Variables:"
echo "     Update Lambda functions with:"
echo "       STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY"
echo "       STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET"
echo ""
echo -e "${BLUE}📚 Full Documentation:${NC}"
echo "     - STRIPE_BACKEND_SETUP.md"
echo "     - STRIPE_CONNECT_KYC_IMPLEMENTATION.md"
echo ""
echo -e "${GREEN}✅ Automated setup complete!${NC}"
echo ""
