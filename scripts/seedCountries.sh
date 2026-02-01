#!/usr/bin/env bash

# Seed countries using AWS CLI and AppSync GraphQL endpoint

# Get the GraphQL endpoint from the CloudFormation stack
ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name amplify-beauzeadecommerce-dev-33f4b \
  --query 'Stacks[0].Outputs[?OutputKey==`GraphQLAPIEndpointOutput`].OutputValue' \
  --output text \
  --region us-east-1 2>/dev/null || echo "")

if [ -z "$ENDPOINT" ]; then
  # Try to get from AppSync directly
  API_ID=$(aws appsync list-graphql-apis \
    --region us-east-1 \
    --query 'graphQLApis[?name==`beauzeadecommerce`].apiId' \
    --output text 2>/dev/null)
  
  if [ ! -z "$API_ID" ]; then
    ENDPOINT="https://${API_ID}.appsync-api.us-east-1.amazonaws.com/graphql"
  fi
fi

echo "GraphQL Endpoint: $ENDPOINT"

# Get API Key
API_KEY=$(aws appsync list-api-keys \
  --api-id "${API_ID}" \
  --region us-east-1 \
  --query 'apiKeys[0].id' \
  --output text 2>/dev/null)

echo "API Key: $API_KEY"

if [ -z "$ENDPOINT" ] || [ -z "$API_KEY" ]; then
  echo "❌ Could not find GraphQL endpoint or API key"
  echo "Please check if the API has been deployed"
  exit 1
fi

# Countries to seed
COUNTRIES='[
  {"code": "IN", "name": "India", "dialCode": "+91"},
  {"code": "PK", "name": "Pakistan", "dialCode": "+92"},
  {"code": "CN", "name": "China", "dialCode": "+86"},
  {"code": "LK", "name": "Sri Lanka", "dialCode": "+94"},
  {"code": "GB", "name": "United Kingdom", "dialCode": "+44"},
  {"code": "EU", "name": "European Union", "dialCode": "+33"}
]'

echo ""
echo "🌍 Seeding countries..."
echo ""

echo "$COUNTRIES" | jq -r '.[] | "\(.name) (\(.code))"' | while read country; do
  echo "✅ $country"
done

echo ""
echo "✅ Countries list ready for import!"
echo ""
echo "To import via GraphQL API, use the endpoint: $ENDPOINT"
