#!/bin/bash

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

API_ID="kodgcazqazgf5eiaxjzr6xravq"
REGION="us-east-1"

echo -e "${YELLOW}Creating Payment Resolvers with VTL Templates...${NC}\n"

# Function to create resolver with VTL templates
create_resolver_with_vtl() {
  local FIELD_NAME=$1
  local DS_NAME=$2
  local REQUEST_TEMPLATE=$3
  local RESPONSE_TEMPLATE=$4
  
  echo "Creating resolver: Mutation.$FIELD_NAME..."
  
  # Delete existing resolver if it exists
  aws appsync delete-resolver \
    --api-id $API_ID \
    --type-name Mutation \
    --field-name $FIELD_NAME \
    --region $REGION > /dev/null 2>&1
  
  # Create new resolver
  aws appsync create-resolver \
    --api-id $API_ID \
    --type-name Mutation \
    --field-name $FIELD_NAME \
    --data-source-name $DS_NAME \
    --request-mapping-template "$REQUEST_TEMPLATE" \
    --response-mapping-template "$RESPONSE_TEMPLATE" \
    --region $REGION \
    --output json > /dev/null 2>&1
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Created: Mutation.$FIELD_NAME${NC}"
  else
    echo -e "${RED}✗ Failed: Mutation.$FIELD_NAME${NC}"
  fi
}

# VTL Templates
REQUEST_TPL='{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "field": "'"'"'$context.info.fieldName'"'"'",
    "arguments": $util.toJson($context.arguments),
    "identity": $util.toJson($context.identity),
    "request": $util.toJson($context.request)
  }
}'

RESPONSE_TPL='#if($context.error)
  $util.error($context.error.message, $context.error.type)
#end
$util.toJson($context.result)'

echo "Creating resolvers..."
create_resolver_with_vtl "createStripePaymentIntent" "PaymentIntentDataSource" "$REQUEST_TPL" "$RESPONSE_TPL"
create_resolver_with_vtl "confirmPaymentAndCreateOrder" "ConfirmPaymentDataSource" "$REQUEST_TPL" "$RESPONSE_TPL"
create_resolver_with_vtl "processRefund" "RefundDataSource" "$REQUEST_TPL" "$RESPONSE_TPL"
create_resolver_with_vtl "processSellerPayout" "PayoutDataSource" "$REQUEST_TPL" "$RESPONSE_TPL"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Resolvers Created with VTL Templates!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "Note: You'll need to manually add the mutation definitions to your"
echo "AppSync schema via the AWS Console:"
echo ""
echo "1. Go to: https://console.aws.amazon.com/appsync"
echo "2. Select: BeauzeadStore-API"
echo "3. Click: Schema"
echo "4. Add these mutations to the Mutation type:"
echo ""
echo "  createStripePaymentIntent(input: AWSJSON!): AWSJSON"
echo "  confirmPaymentAndCreateOrder(input: AWSJSON!): AWSJSON"
echo "  processRefund(input: AWSJSON!): AWSJSON"
echo "  processSellerPayout(input: AWSJSON!): AWSJSON"
echo ""
echo "Or deploy the updated schema from: graphql-schemas/products-schema.graphql"
echo ""
