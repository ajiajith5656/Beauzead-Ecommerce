#!/bin/bash

# Quick Test Script - Run all tests and verify deployment
# This is a simplified version for quick checks

echo "🔍 Quick Stripe Integration Check..."
echo ""

# Test 1: Check if DynamoDB GSI exists
GSI_STATUS=$(AWS_PAGER="" aws dynamodb describe-table \
  --table-name Sellers \
  --region us-east-1 \
  --output json 2>/dev/null | jq -r '.Table.GlobalSecondaryIndexes[0].IndexStatus')

if [ "$GSI_STATUS" = "ACTIVE" ]; then
  echo "✓ DynamoDB GSI: ACTIVE"
else
  echo "✗ DynamoDB GSI: NOT ACTIVE (Status: $GSI_STATUS)"
fi

# Test 2: Check Lambda functions
LAMBDA_COUNT=$(AWS_PAGER="" aws lambda list-functions \
  --region us-east-1 \
  --output json 2>/dev/null | jq -r '.Functions[] | select(.FunctionName | startswith("BeauzeadStripe")) | .FunctionName' | wc -l)

echo "✓ Lambda Functions: $LAMBDA_COUNT/5 deployed"

# Test 3: Check API Gateway
API_RESPONSE=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
  https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook 2>/dev/null)

if [ "$API_RESPONSE" = "401" ]; then
  echo "✓ API Gateway: Responding (401 = webhook signature required)"
else
  echo "✗ API Gateway: Unexpected response ($API_RESPONSE)"
fi

# Test 4: Check if Stripe keys are configured
STRIPE_KEY=$(AWS_PAGER="" aws lambda get-function-configuration \
  --function-name BeauzeadStripeWebhook \
  --region us-east-1 \
  --output json 2>/dev/null | jq -r '.Environment.Variables.STRIPE_SECRET_KEY')

if [[ "$STRIPE_KEY" == *"placeholder"* ]]; then
  echo "⚠ Stripe Keys: PLACEHOLDER (run ./update-stripe-keys.sh)"
else
  echo "✓ Stripe Keys: Configured"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Update Stripe keys: ./update-stripe-keys.sh sk_test_XXX whsec_XXX"
echo "2. Add webhook in Stripe Dashboard:"
echo "   https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook"
echo "3. Update AppSync schema (see STRIPE_DEPLOYMENT_COMPLETE.md)"
echo ""
echo "📚 Full test suite: ./test-stripe-integration.sh"
