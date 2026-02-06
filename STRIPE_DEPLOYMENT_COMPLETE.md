# 🎉 Stripe Connect KYC Backend Deployment Complete!

## ✅ What's Been Deployed

### 1. DynamoDB ✓
- **Table**: `Sellers` (already exists)
- **Global Secondary Index**: `stripe_account_id-index` (ACTIVE)
  - Allows webhook to lookup sellers by Stripe account ID

### 2. Lambda Functions ✓
All 5 Lambda functions are deployed with placeholder API keys:

| Function Name | Purpose | Status |
|---------------|---------|--------|
| `BeauzeadStripeWebhook` | Handles Stripe webhook events | ✓ Created |
| `BeauzeadStripeCreateAccount` | Creates Stripe Express accounts | ✓ Created |
| `BeauzeadStripeOnboardingLink` | Generates onboarding URLs | ✓ Created |
| `BeauzeadStripeGetStatus` | Fetches account verification status | ✓ Created |
| `BeauzeadStripeRefreshStatus` | Syncs status from Stripe | ✓ Created |

### 3. API Gateway ✓
- **API ID**: `ji3gytbs6j`
- **Stage**: `prod`
- **Webhook URL**: `https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook`

### 4. IAM Role ✓
- **Role**: `BeauzeadStripeConnectLambdaRole`
- **Permissions**: DynamoDB (Sellers table + GSI), CloudWatch Logs

---

## 🔧 MANUAL STEPS REQUIRED

### Step 1: Get Your Stripe API Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Go to: https://dashboard.stripe.com/test/webhooks
4. Click "Add endpoint" with URL: `https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook`
5. Select these events:
   - `account.updated`
   - `account.application.authorized`
   - `account.application.deauthorized`
   - `capability.updated`
6. Click "Add endpoint" and reveal the **Signing secret** (starts with `whsec_`)

### Step 2: Update Lambda Environment Variables

Run these commands to set your **real** Stripe API keys:

```bash
# Set your actual keys here
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"

# Update webhook function
aws lambda update-function-configuration \
  --function-name BeauzeadStripeWebhook \
  --environment Variables="{SELLERS_TABLE_NAME=Sellers,STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY},STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}}" \
  --region us-east-1

# Update resolver functions
aws lambda update-function-configuration \
  --function-name BeauzeadStripeCreateAccount \
  --environment Variables="{SELLERS_TABLE_NAME=Sellers,STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region us-east-1

aws lambda update-function-configuration \
  --function-name BeauzeadStripeOnboardingLink \
  --environment Variables="{STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region us-east-1

aws lambda update-function-configuration \
  --function-name BeauzeadStripeGetStatus \
  --environment Variables="{STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region us-east-1

aws lambda update-function-configuration \
  --function-name BeauzeadStripeRefreshStatus \
  --environment Variables="{SELLERS_TABLE_NAME=Sellers,STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}}" \
  --region us-east-1

echo "✓ All Lambda functions updated with Stripe API keys"
```

### Step 3: Update AppSync Schema

Add these types to your AppSync GraphQL schema:

```graphql
# Add to your schema
type Mutation {
  createStripeConnectAccount(input: CreateStripeConnectAccountInput!): StripeConnectAccountResponse
  generateStripeOnboardingLink(input: GenerateOnboardingLinkInput!): StripeOnboardingLinkResponse
  refreshStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

type Query {
  getStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

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
  status: StripeAccountStatus
  error: String
}

type StripeAccountStatus {
  accountId: String!
  chargesEnabled: Boolean!
  payoutsEnabled: Boolean!
  detailsSubmitted: Boolean!
  kycStatus: String!
  requirements: StripeRequirements
}

type StripeRequirements {
  currentlyDue: [String]
  eventuallyDue: [String]
  pastDue: [String]
  pendingVerification: [String]
}
```

### Step 4: Attach Lambda Resolvers to AppSync

In AWS AppSync Console → Schema → Resolvers:

1. **Mutation.createStripeConnectAccount**
   - Data source: Lambda function `BeauzeadStripeCreateAccount`
   - Request mapping: `$util.toJson($ctx.args)`
   - Response mapping: `$util.toJson($ctx.result)`

2. **Mutation.generateStripeOnboardingLink**
   - Data source: Lambda function `BeauzeadStripeOnboardingLink`
   - Request mapping: `$util.toJson($ctx.args)`
   - Response mapping: `$util.toJson($ctx.result)`

3. **Mutation.refreshStripeAccountStatus**
   - Data source: Lambda function `BeauzeadStripeRefreshStatus`
   - Request mapping: `$util.toJson($ctx.args)`
   - Response mapping: `$util.toJson($ctx.result)`

4. **Query.getStripeAccountStatus**
   - Data source: Lambda function `BeauzeadStripeGetStatus`
   - Request mapping: `$util.toJson($ctx.args)`
   - Response mapping: `$util.toJson($ctx.result)`

---

## 🧪 Testing Your Setup

### Test 1: Webhook Endpoint

```bash
# Test that API Gateway is responding
curl -X POST https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Should return: {"statusCode":401,"body":"{\"error\":\"Invalid signature\"}"}
# This is CORRECT - it means webhook is working but rejecting unsigned requests
```

### Test 2: Create Stripe Account (After Step 2 & 4)

In your AppSync console, run this mutation:

```graphql
mutation TestCreateAccount {
  createStripeConnectAccount(input: {
    sellerId: "test-seller-123"
    email: "test@example.com"
    country: "US"
    businessType: "individual"
  }) {
    success
    accountId
    error
  }
}
```

### Test 3: Check CloudWatch Logs

```bash
# View webhook logs
aws logs tail /aws/lambda/BeauzeadStripeWebhook --follow --region us-east-1

# View resolver logs
aws logs tail /aws/lambda/BeauzeadStripeCreateAccount --follow --region us-east-1
```

---

## 📋 Frontend Integration Checklist

1. ✅ Frontend components already created:
   - `src/components/seller/StripeKYCStatus.tsx`
   - `src/components/admin/StripeKYCMonitor.tsx`

2. ✅ Service layer ready:
   - `src/services/stripeConnectService.ts`

3. ⚠️ **Add to your `.env` file**:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```

4. ⚠️ **Import in your seller dashboard**:
   ```typescript
   import { StripeKYCStatus } from '@/components/seller/StripeKYCStatus';

   <StripeKYCStatus 
     seller={currentSeller} 
     onStatusUpdate={handleKYCUpdate} 
   />
   ```

---

## 🎯 Summary

### ✅ Completed (Automated)
- DynamoDB GSI for `stripe_account_id` lookups
- 5 Lambda functions (webhook + 4 resolvers)
- API Gateway with webhook endpoint
- IAM roles and permissions

### 🔧 Required (Manual - 15 minutes)
1. Get Stripe API keys and webhook secret
2. Update Lambda environment variables (5 commands)
3. Update AppSync GraphQL schema (copy/paste)
4. Attach Lambda resolvers to AppSync (4 resolvers)
5. Test webhook endpoint

### 📚 Documentation
- **Full Guide**: `STRIPE_CONNECT_KYC_IMPLEMENTATION.md`
- **Quick Start**: `STRIPE_CONNECT_KYC_QUICK_START.md`
- **Backend Setup**: `STRIPE_BACKEND_SETUP.md` (this guide)

---

## 🚨 Important Security Notes

1. **Replace placeholder keys immediately** - Current Lambda functions have `sk_test_placeholder` which won't work
2. **Never commit real API keys to git** - Use environment variables only
3. **Webhook signature verification** - Already implemented in Lambda, Stripe will reject unsigned requests
4. **Test in Stripe Test Mode first** - Use test keys (sk_test_...) before going live

---

## 🆘 Troubleshooting

### Webhook not receiving events
- Check Stripe Dashboard → Webhooks → Attempts
- Verify webhook URL matches: `https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook`
- Check CloudWatch Logs: `/aws/lambda/BeauzeadStripeWebhook`

### Lambda timeouts
- Current timeout: 30 seconds (should be sufficient)
- Check CloudWatch Logs for error details

### "Invalid authentication credentials"
- Verify you updated environment variables with **real** Stripe keys
- Confirm keys start with `sk_test_` (test) or `sk_live_` (production)

### AppSync resolver errors
- Ensure Lambda data sources are created in AppSync
- Verify Lambda functions have correct IAM permissions
- Check CloudWatch Logs for each Lambda function

---

## 🎉 Next Steps

1. Complete manual steps 1-4 above
2. Test creating a Stripe account via AppSync
3. Test webhook by updating account in Stripe Dashboard
4. Integrate `StripeKYCStatus` component in seller dashboard
5. Train customer support on new KYC flow

**Estimated setup time**: 15-20 minutes

---

**Generated**: 2026-02-04  
**Webhook URL**: https://ji3gytbs6j.execute-api.us-east-1.amazonaws.com/prod/webhook  
**AWS Account**: 422287834049  
**Region**: us-east-1
