#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
API_ID="kodgcazqazgf5eiaxjzr6xravq"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo -e "${YELLOW}Configuring AppSync Payment Resolvers...${NC}\n"

# Get Lambda ARNs
echo "Getting Lambda function ARNs..."
PAYMENT_INTENT_ARN=$(aws lambda get-function --function-name BeauzeadCreatePaymentIntent --region $REGION --query 'Configuration.FunctionArn' --output text)
CONFIRM_PAYMENT_ARN=$(aws lambda get-function --function-name BeauzeadConfirmPaymentAndCreateOrder --region $REGION --query 'Configuration.FunctionArn' --output text)
REFUND_ARN=$(aws lambda get-function --function-name BeauzeadProcessRefund --region $REGION --query 'Configuration.FunctionArn' --output text)
PAYOUT_ARN=$(aws lambda get-function --function-name BeauzeadProcessSellerPayout --region $REGION --query 'Configuration.FunctionArn' --output text)

echo -e "${GREEN}✓ Lambda ARNs retrieved${NC}\n"

# Create IAM role for AppSync to invoke Lambda
ROLE_NAME="BeauzeadAppSyncPaymentLambdaRole"
echo "Creating IAM role: $ROLE_NAME..."

TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Service": "appsync.amazonaws.com"
    },
    "Action": "sts:AssumeRole"
  }]
}'

# Create role if it doesn't exist
if aws iam get-role --role-name $ROLE_NAME 2>/dev/null; then
  echo -e "${YELLOW}Role already exists${NC}"
else
  aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document "$TRUST_POLICY" \
    --region $REGION
  echo -e "${GREEN}✓ Role created${NC}"
fi

# Attach Lambda invoke policy
POLICY_DOCUMENT='{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "lambda:InvokeFunction"
    ],
    "Resource": [
      "'"$PAYMENT_INTENT_ARN"'",
      "'"$CONFIRM_PAYMENT_ARN"'",
      "'"$REFUND_ARN"'",
      "'"$PAYOUT_ARN"'"
    ]
  }]
}'

POLICY_NAME="BeauzeadAppSyncPaymentLambdaPolicy"
echo "Creating/updating inline policy..."

aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name $POLICY_NAME \
  --policy-document "$POLICY_DOCUMENT" \
  --region $REGION

echo -e "${GREEN}✓ Policy attached${NC}\n"

# Wait for role to propagate
echo "Waiting for IAM role propagation (10 seconds)..."
sleep 10

# Get role ARN
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
echo -e "${GREEN}✓ Role ARN: $ROLE_ARN${NC}\n"

# Function to create data source
create_data_source() {
  local DS_NAME=$1
  local LAMBDA_ARN=$2
  
  echo "Creating data source: $DS_NAME..."
  
  aws appsync create-data-source \
    --api-id $API_ID \
    --name $DS_NAME \
    --type AWS_LAMBDA \
    --service-role-arn $ROLE_ARN \
    --lambda-config lambdaFunctionArn=$LAMBDA_ARN \
    --region $REGION \
    --output json > /dev/null 2>&1
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Created: $DS_NAME${NC}"
  else
    echo -e "${YELLOW}⚠ Data source may already exist: $DS_NAME${NC}"
  fi
}

# Create data sources
echo "Creating AppSync data sources..."
create_data_source "PaymentIntentDataSource" $PAYMENT_INTENT_ARN
create_data_source "ConfirmPaymentDataSource" $CONFIRM_PAYMENT_ARN
create_data_source "RefundDataSource" $REFUND_ARN
create_data_source "PayoutDataSource" $PAYOUT_ARN

echo ""

# Function to create resolver
create_resolver() {
  local TYPE_NAME=$1
  local FIELD_NAME=$2
  local DS_NAME=$3
  
  echo "Creating resolver: $TYPE_NAME.$FIELD_NAME..."
  
  # Simple request mapping template (pass through)
  REQUEST_TEMPLATE='{
    "version": "2017-02-28",
    "operation": "Invoke",
    "payload": $util.toJson($context.arguments)
  }'
  
  # Simple response mapping template (pass through)
  RESPONSE_TEMPLATE='$util.toJson($context.result)'
  
  aws appsync create-resolver \
    --api-id $API_ID \
    --type-name $TYPE_NAME \
    --field-name $FIELD_NAME \
    --data-source-name $DS_NAME \
    --request-mapping-template "$REQUEST_TEMPLATE" \
    --response-mapping-template "$RESPONSE_TEMPLATE" \
    --region $REGION \
    --output json > /dev/null 2>&1
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Created resolver: $TYPE_NAME.$FIELD_NAME${NC}"
  else
    echo -e "${YELLOW}⚠ Resolver may already exist: $TYPE_NAME.$FIELD_NAME${NC}"
  fi
}

# Create resolvers for mutations
echo "Creating AppSync resolvers..."
create_resolver "Mutation" "createStripePaymentIntent" "PaymentIntentDataSource"
create_resolver "Mutation" "confirmStripePaymentAndCreateOrder" "ConfirmPaymentDataSource"
create_resolver "Mutation" "processStripeRefund" "RefundDataSource"
create_resolver "Mutation" "processStripeSellerPayout" "PayoutDataSource"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ AppSync Configuration Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "Data Sources Created:"
echo "  • PaymentIntentDataSource → BeauzeadCreatePaymentIntent"
echo "  • ConfirmPaymentDataSource → BeauzeadConfirmPaymentAndCreateOrder"
echo "  • RefundDataSource → BeauzeadProcessRefund"
echo "  • PayoutDataSource → BeauzeadProcessSellerPayout"
echo ""
echo "Resolvers Attached:"
echo "  • Mutation.createStripePaymentIntent"
echo "  • Mutation.confirmStripePaymentAndCreateOrder"
echo "  • Mutation.processStripeRefund"
echo "  • Mutation.processStripeSellerPayout"
echo ""
echo -e "${YELLOW}Next Step: Test your payment flow!${NC}"
echo ""
