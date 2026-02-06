#!/bin/bash

# Stripe Payment Lambda Functions Deployment Script
# This script deploys all Stripe payment-related Lambda functions with proper dependencies

set -e

echo "=========================================="
echo "Stripe Payment Lambda Deployment Script"
echo "=========================================="
echo ""

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
LAMBDA_RUNTIME="nodejs18.x"
LAMBDA_TIMEOUT=30
LAMBDA_MEMORY=512
ORDERS_TABLE="orders"
SELLERS_TABLE="Sellers"
PRODUCTS_TABLE="Products"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

if ! command -v tsc &> /dev/null; then
    echo -e "${YELLOW}Warning: TypeScript compiler not found. Installing...${NC}"
    npm install -g typescript
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Function to create Lambda package
create_lambda_package() {
    local function_name=$1
    local source_file=$2
    local output_file=$3
    
    echo -e "${BLUE}Packaging ${function_name}...${NC}"
    
    # Create temporary directory
    local temp_dir="./lambda-packages/${function_name}"
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"
    
    # Compile TypeScript to JavaScript
    echo "  - Compiling TypeScript..."
    tsc "$source_file" --outDir "$temp_dir" --module commonjs --target es2020 --lib es2020 --esModuleInterop --skipLibCheck
    
    # Initialize package.json and install dependencies
    echo "  - Installing dependencies..."
    cd "$temp_dir"
    npm init -y > /dev/null 2>&1
    npm install stripe aws-sdk > /dev/null 2>&1
    
    # Move compiled file to index.js (Lambda expects this)
    mv "$(basename ${source_file%.ts}).js" index.js
    
    # Create ZIP package
    echo "  - Creating ZIP package..."
    zip -rq "../${output_file}" . > /dev/null 2>&1
    
    cd - > /dev/null
    
    echo -e "${GREEN}  ✓ Package created: lambda-packages/${output_file}${NC}"
}

# Create Lambda IAM role if it doesn't exist
echo -e "${BLUE}Checking Lambda execution role...${NC}"

ROLE_NAME="BeauzeadStripePaymentLambdaRole"
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.Arn' --output text 2>/dev/null || echo "")

if [ -z "$ROLE_ARN" ]; then
    echo "  - Creating IAM role..."
    
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
    
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file:///tmp/trust-policy.json \
        --description "Execution role for Beauzead Stripe payment Lambda functions" \
        > /dev/null
    
    # Attach policies
    aws iam attach-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    
    # Create inline policy for DynamoDB access
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
        "arn:aws:dynamodb:${AWS_REGION}:*:table/${ORDERS_TABLE}",
        "arn:aws:dynamodb:${AWS_REGION}:*:table/${SELLERS_TABLE}",
        "arn:aws:dynamodb:${AWS_REGION}:*:table/${PRODUCTS_TABLE}"
      ]
    }
  ]
}
EOF
    
    aws iam put-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-name "DynamoDBAccess" \
        --policy-document file:///tmp/dynamodb-policy.json
    
    ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.Arn' --output text)
    
    echo "  - Waiting for role to propagate..."
    sleep 10
    
    echo -e "${GREEN}  ✓ IAM role created${NC}"
else
    echo -e "${GREEN}  ✓ IAM role exists${NC}"
fi

echo ""

# Get Stripe API keys from environment or prompt
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${YELLOW}Stripe Secret Key not found in environment.${NC}"
    read -p "Enter your Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY
fi

if [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo -e "${YELLOW}Stripe Webhook Secret not set (optional for payment functions).${NC}"
    read -p "Enter your Stripe Webhook Secret (whsec_...) or press Enter to skip: " STRIPE_WEBHOOK_SECRET
fi

echo ""

# Create packages directory
mkdir -p lambda-packages

# Package and deploy Lambda functions
echo -e "${BLUE}Packaging Lambda functions...${NC}"
echo ""

# 1. Create Payment Intent
create_lambda_package \
    "createStripePaymentIntent" \
    "./src/lambda/createStripePaymentIntent.ts" \
    "createStripePaymentIntent.zip"

# 2. Confirm Payment and Create Order
create_lambda_package \
    "confirmPaymentAndCreateOrder" \
    "./src/lambda/confirmPaymentAndCreateOrder.ts" \
    "confirmPaymentAndCreateOrder.zip"

# 3. Process Refund
create_lambda_package \
    "processRefund" \
    "./src/lambda/processRefund.ts" \
    "processRefund.zip"

# 4. Process Seller Payout
create_lambda_package \
    "processSellerPayout" \
    "./src/lambda/processSellerPayout.ts" \
    "processSellerPayout.zip"

echo ""
echo -e "${BLUE}Deploying Lambda functions...${NC}"
echo ""

# Function to deploy or update Lambda
deploy_lambda() {
    local function_name=$1
    local zip_file=$2
    local env_vars=$3
    
    echo -e "${BLUE}Deploying ${function_name}...${NC}"
    
    # Check if function exists
    if aws lambda get-function --function-name "$function_name" --region "$AWS_REGION" > /dev/null 2>&1; then
        echo "  - Updating existing function..."
        aws lambda update-function-code \
            --function-name "$function_name" \
            --zip-file "fileb://lambda-packages/$zip_file" \
            --region "$AWS_REGION" \
            > /dev/null
        
        aws lambda update-function-configuration \
            --function-name "$function_name" \
            --environment "Variables={$env_vars}" \
            --region "$AWS_REGION" \
            > /dev/null
    else
        echo "  - Creating new function..."
        aws lambda create-function \
            --function-name "$function_name" \
            --runtime "$LAMBDA_RUNTIME" \
            --role "$ROLE_ARN" \
            --handler "index.handler" \
            --zip-file "fileb://lambda-packages/$zip_file" \
            --timeout "$LAMBDA_TIMEOUT" \
            --memory-size "$LAMBDA_MEMORY" \
            --environment "Variables={$env_vars}" \
            --region "$AWS_REGION" \
            > /dev/null
    fi
    
    echo -e "${GREEN}  ✓ Deployed${NC}"
}

# Deploy functions
deploy_lambda \
    "BeauzeadCreatePaymentIntent" \
    "createStripePaymentIntent.zip" \
    "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}"

deploy_lambda \
    "BeauzeadConfirmPaymentAndCreateOrder" \
    "confirmPaymentAndCreateOrder.zip" \
    "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY},ORDERS_TABLE_NAME=${ORDERS_TABLE},PRODUCTS_TABLE_NAME=${PRODUCTS_TABLE}"

deploy_lambda \
    "BeauzeadProcessRefund" \
    "processRefund.zip" \
    "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY},ORDERS_TABLE_NAME=${ORDERS_TABLE}"

deploy_lambda \
    "BeauzeadProcessSellerPayout" \
    "processSellerPayout.zip" \
    "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY},ORDERS_TABLE_NAME=${ORDERS_TABLE},SELLERS_TABLE_NAME=${SELLERS_TABLE},PLATFORM_FEE_PERCENTAGE=10"

echo ""
echo -e "${GREEN}=========================================="
echo -e "✓ All Lambda functions deployed!"
echo -e "==========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Go to AWS AppSync Console"
echo "2. Add these Lambda functions as data sources"
echo "3. Attach resolvers to the GraphQL schema mutations:"
echo "   - createStripePaymentIntent → BeauzeadCreatePaymentIntent"
echo "   - confirmPaymentAndCreateOrder → BeauzeadConfirmPaymentAndCreateOrder"
echo "   - processRefund → BeauzeadProcessRefund"
echo "   - processSellerPayout → BeauzeadProcessSellerPayout"
echo ""
echo "4. Test the checkout flow in your frontend"
echo ""
echo -e "${BLUE}Lambda Functions:${NC}"
echo "  - BeauzeadCreatePaymentIntent"
echo "  - BeauzeadConfirmPaymentAndCreateOrder"
echo "  - BeauzeadProcessRefund"
echo "  - BeauzeadProcessSellerPayout"
echo ""
echo -e "${GREEN}Deployment complete!${NC}"
