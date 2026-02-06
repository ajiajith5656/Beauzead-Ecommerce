#!/bin/bash

# Stripe Connect Lambda Configuration Script
# Run this after getting your Stripe API keys

echo "======================================"
echo "Stripe Connect Lambda Configuration"
echo "======================================"
echo ""

# Check if keys are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: ./update-stripe-keys.sh <STRIPE_SECRET_KEY> <STRIPE_WEBHOOK_SECRET>"
    echo ""
    echo "Example:"
    echo "  ./update-stripe-keys.sh sk_test_51Hx... whsec_..."
    echo ""
    echo "Get your keys from:"
    echo "  Secret Key: https://dashboard.stripe.com/test/apikeys"
    echo "  Webhook Secret: https://dashboard.stripe.com/test/webhooks"
    echo ""
    exit 1
fi

STRIPE_SECRET_KEY="$1"
STRIPE_WEBHOOK_SECRET="$2"

# Validate key formats
if [[ ! "$STRIPE_SECRET_KEY" =~ ^sk_(test|live)_ ]]; then
    echo "❌ Error: STRIPE_SECRET_KEY must start with 'sk_test_' or 'sk_live_'"
    exit 1
fi

if [[ ! "$STRIPE_WEBHOOK_SECRET" =~ ^whsec_ ]]; then
    echo "❌ Error: STRIPE_WEBHOOK_SECRET must start with 'whsec_'"
    exit 1
fi

REGION="us-east-1"

echo "Updating Lambda environment variables..."
echo ""

# Update webhook function
echo "1/5 Updating BeauzeadStripeWebhook..."
aws lambda update-function-configuration \
  --function-name BeauzeadStripeWebhook \
  --environment Variables="{SELLERS_TABLE_NAME=Sellers,STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY},STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}}" \
  --region $REGION \
  --no-cli-pager > /dev/null && echo "  ✓ Success" || echo "  ❌ Failed"

# Update resolver functions
echo "2/5 Updating BeauzeadStripeCreateAccount..."
aws lambda update-function-configuration \
  --function-name BeauzeadStripeCreateAccount \
  --environment Variables="{SELLERS_TABLE_NAME=Sellers,STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region $REGION \
  --no-cli-pager > /dev/null && echo "  ✓ Success" || echo "  ❌ Failed"

echo "3/5 Updating BeauzeadStripeOnboardingLink..."
aws lambda update-function-configuration \
  --function-name BeauzeadStripeOnboardingLink \
  --environment Variables="{STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region $REGION \
  --no-cli-pager > /dev/null && echo "  ✓ Success" || echo "  ❌ Failed"

echo "4/5 Updating BeauzeadStripeGetStatus..."
aws lambda update-function-configuration \
  --function-name BeauzeadStripeGetStatus \
  --environment Variables="{STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region $REGION \
  --no-cli-pager > /dev/null && echo "  ✓ Success" || echo "  ❌ Failed"

echo "5/5 Updating BeauzeadStripeRefreshStatus..."
aws lambda update-function-configuration \
  --function-name BeauzeadStripeRefreshStatus \
  --environment Variables="{SELLERS_TABLE_NAME=Sellers,STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region $REGION \
  --no-cli-pager > /dev/null && echo "  ✓ Success" || echo "  ❌ Failed"

echo ""
echo "======================================"
echo "✅ All Lambda functions updated!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Test webhook endpoint:"
echo "   curl -X POST https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook"
echo ""
echo "2. Add webhook endpoint to Stripe Dashboard:"
echo "   URL: https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook"
echo "   Events: account.updated, account.application.authorized, capability.updated"
echo ""
echo "3. Update your AppSync schema (see STRIPE_DEPLOYMENT_COMPLETE.md)"
echo ""
echo "📚 Full guide: STRIPE_DEPLOYMENT_COMPLETE.md"
echo ""
