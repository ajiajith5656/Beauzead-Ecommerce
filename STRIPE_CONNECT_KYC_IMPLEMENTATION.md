# 🔐 Stripe Connect KYC Verification Implementation

**Complete Guide for Identity Verification & Payouts**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Files Created & Modified](#files-created--modified)
4. [Database Schema Updates](#database-schema-updates)
5. [Setup Instructions](#setup-instructions)
6. [Seller Flow](#seller-flow)
7. [Admin Monitoring](#admin-monitoring)
8. [Webhook Integration](#webhook-integration)
9. [Security & Compliance](#security--compliance)
10. [Testing Guide](#testing-guide)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This implementation integrates **Stripe Connect Express accounts** for seller KYC verification, replacing the manual form-based KYC process with Stripe's hosted onboarding.

### Key Features

✅ **Automated KYC Verification** - Stripe handles all identity verification  
✅ **Secure Onboarding** - Sellers verify through Stripe's hosted platform  
✅ **Real-time Status Updates** - Webhooks automatically sync verification status  
✅ **Admin Monitoring** - Read-only view of KYC status for administrators  
✅ **Payout Management** - Automatic payout eligibility based on verification  
✅ **Compliance-First** - No sensitive documents stored on platform

### Benefits

- **Reduced Liability**: Platform doesn't store passports/ID documents
- **Faster Verification**: Typically completes in minutes
- **Global Support**: Stripe supports 40+ countries
- **Automatic Updates**: Webhooks keep dashboard in sync
- **Better UX**: Professional, mobile-friendly onboarding

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SELLER DASHBOARD                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1. Seller clicks "Start KYC Verification" button    │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              STRIPE CONNECT SERVICE (Frontend)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  2. Create Stripe Connect Express account (if new)   │  │
│  │  3. Generate account onboarding link                  │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   STRIPE HOSTED ONBOARDING                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  4. Seller completes identity verification            │  │
│  │  5. Provides bank details for payouts                 │  │
│  │  6. Stripe verifies information                       │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    STRIPE WEBHOOK HANDLER                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  7. Receive account.updated webhook                   │  │
│  │  8. Update seller KYC status in DynamoDB              │  │
│  │  9. Update payout eligibility flags                   │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              DASHBOARD AUTO-REFRESH                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  10. Seller dashboard shows updated status            │  │
│  │  11. Payout status automatically updated              │  │
│  │  12. Admin can view verification status               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Files Created & Modified

### ✅ New Files Created

#### 1. **Stripe Connect Service**
```
src/services/stripeConnectService.ts
```
- Creates Stripe Connect Express accounts
- Generates onboarding links
- Fetches account status
- Maps Stripe status to KYC status

#### 2. **Seller KYC Status Component**
```
src/components/seller/StripeKYCStatus.tsx
```
- Displays current KYC verification status
- Shows payout & charges eligibility
- Button to start/continue onboarding
- Auto-refreshes after onboarding completion

#### 3. **Admin KYC Monitoring Component**
```
src/components/admin/StripeKYCMonitor.tsx
```
- Read-only view for admins
- Shows Stripe account details
- Displays verification status with color indicators
- Links to Stripe Dashboard

#### 4. **Webhook Handler (Lambda)**
```
src/lambda/stripeWebhook.ts
```
- Processes `account.updated` events
- Updates seller KYC status in DynamoDB
- Syncs payout and charges eligibility

#### 5. **GraphQL Resolvers**
```
src/graphql/resolvers/stripeConnectResolvers.ts
```
- `createStripeConnectAccount` - Create new account
- `generateStripeOnboardingLink` - Generate onboarding URL
- `getStripeAccountStatus` - Fetch current status
- `refreshStripeAccountStatus` - Refresh and sync status

### 🔄 Modified Files

#### 1. **Type Definitions**
```
src/types/index.ts
```
**Changes**: Extended `Seller` interface with Stripe Connect fields:
```typescript
stripe_account_id?: string;
stripe_onboarding_completed?: boolean;
payouts_enabled?: boolean;
charges_enabled?: boolean;
kyc_last_update?: string;
stripe_account_type?: 'express' | 'standard' | 'custom';
kyc_status: 'pending' | 'approved' | 'rejected' | 'verified' | 'action_required' | 'restricted';
```

#### 2. **Environment Variables**
```
.env.example
```
**Changes**: Added Stripe Connect configuration:
```env
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-signing-secret
```

---

## 🗄️ Database Schema Updates

### DynamoDB: `sellers` Table

**New Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| `stripe_account_id` | String | Stripe Connect account ID (e.g., `acct_xxx`) |
| `stripe_account_type` | String | Account type (`express`, `standard`, `custom`) |
| `stripe_onboarding_completed` | Boolean | Whether onboarding is complete |
| `payouts_enabled` | Boolean | Whether seller can receive payouts |
| `charges_enabled` | Boolean | Whether seller can accept charges |
| `kyc_last_update` | String (ISO 8601) | Last KYC status update timestamp |

**Updated Attributes:**

| Attribute | Old Values | New Values |
|-----------|------------|------------|
| `kyc_status` | `pending`, `approved`, `rejected` | `pending`, `verified`, `action_required`, `restricted`, `approved`, `rejected` |

**Required GSI (Global Secondary Index):**

```
Index Name: stripe_account_id-index
Partition Key: stripe_account_id (String)
Projection: ALL
```

### DynamoDB Update Commands

```bash
# Create GSI for webhook lookups
aws dynamodb update-table \
  --table-name sellers \
  --attribute-definitions AttributeName=stripe_account_id,AttributeType=S \
  --global-secondary-index-updates \
    '[{
      "Create": {
        "IndexName": "stripe_account_id-index",
        "KeySchema": [{"AttributeName": "stripe_account_id", "KeyType": "HASH"}],
        "Projection": {"ProjectionType": "ALL"},
        "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}
      }
    }]'
```

---

## ⚙️ Setup Instructions

### Step 1: Stripe Dashboard Configuration

1. **Enable Stripe Connect**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Navigate to **Connect** → **Settings**
   - Enable **Express accounts**

2. **Configure Branding**
   - Upload your logo
   - Set brand colors
   - Add support email

3. **Set Up Webhooks**
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Endpoint URL: `https://your-api.com/stripe/webhook`
   - Select events:
     - `account.updated`
     - `account.application.authorized`
     - `account.application.deauthorized`
     - `capability.updated`
   - Copy **Signing secret** (starts with `whsec_`)

4. **Get API Keys**
   - Go to **Developers** → **API keys**
   - Copy **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)

### Step 2: Environment Variables

Create `.env` file (or update existing):

```env
# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx

# Backend/Lambda (DO NOT expose in frontend)
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 3: Deploy Lambda Functions

#### Deploy Webhook Handler

```bash
# Create deployment package
cd src/lambda
zip -r stripe-webhook.zip stripeWebhook.ts node_modules

# Upload to Lambda
aws lambda create-function \
  --function-name stripe-webhook-handler \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler stripeWebhook.handler \
  --zip-file fileb://stripe-webhook.zip \
  --environment Variables="{SELLERS_TABLE_NAME=sellers,STRIPE_WEBHOOK_SECRET=whsec_xxx}"
```

#### Deploy GraphQL Resolvers

```bash
# Create resolvers package
cd src/graphql/resolvers
zip -r stripe-resolvers.zip stripeConnectResolvers.ts node_modules

# Upload to Lambda
aws lambda create-function \
  --function-name stripe-connect-resolvers \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler stripeConnectResolvers.createStripeConnectAccount \
  --zip-file fileb://stripe-resolvers.zip \
  --environment Variables="{STRIPE_SECRET_KEY=sk_test_xxx,SELLERS_TABLE_NAME=sellers}"
```

### Step 4: Update AppSync Schema

Add to `schema.graphql`:

```graphql
# Mutations
type Mutation {
  createStripeConnectAccount(input: CreateStripeConnectAccountInput!): StripeConnectAccountResponse
  generateStripeOnboardingLink(input: GenerateOnboardingLinkInput!): StripeOnboardingLinkResponse
  refreshStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

# Queries
type Query {
  getStripeAccountStatus(accountId: String!): StripeAccountStatusResponse
}

# Inputs
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

# Types
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

### Step 5: Configure API Gateway for Webhook

```bash
# Create REST API endpoint
aws apigateway create-rest-api --name stripe-webhooks

# Add POST method
aws apigateway put-method \
  --rest-api-id YOUR_API_ID \
  --resource-id YOUR_RESOURCE_ID \
  --http-method POST \
  --authorization-type NONE

# Integrate with Lambda
aws apigateway put-integration \
  --rest-api-id YOUR_API_ID \
  --resource-id YOUR_RESOURCE_ID \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:ACCOUNT:function:stripe-webhook-handler/invocations

# Deploy API
aws apigateway create-deployment \
  --rest-api-id YOUR_API_ID \
  --stage-name prod
```

### Step 6: Update Seller Dashboard

Replace the old KYC form with the new Stripe component:

```tsx
// In src/pages/seller/SellerDashboard.tsx
import StripeKYCStatus from '../../components/seller/StripeKYCStatus';

// Replace KYC verification section
{activeSection === 'verification' && (
  <StripeKYCStatus
    seller={sellerData}
    onStatusUpdate={(updates) => {
      // Update seller state
      setSellerData({ ...sellerData, ...updates });
    }}
  />
)}
```

### Step 7: Update Admin Dashboard

Add Stripe KYC monitoring to seller details:

```tsx
// In src/pages/admin/modules/SellerManagement.tsx
import StripeKYCMonitor from '../../../components/admin/StripeKYCMonitor';

// In seller details modal/view
<StripeKYCMonitor seller={selectedSeller} />
```

---

## 👤 Seller Flow

### Step-by-Step User Journey

1. **Seller navigates to Dashboard**
   - Sees KYC verification status card
   - Status initially shows "Pending Verification"
   - Button reads "Start KYC Verification"

2. **Click "Start KYC Verification"**
   - Frontend calls `initiateSellerKYCOnboarding()`
   - Backend creates Stripe Connect Express account (if new)
   - Generates time-limited onboarding link
   - Seller is redirected to Stripe

3. **Stripe Hosted Onboarding**
   - Seller provides:
     - Full legal name
     - Date of birth
     - Home address
     - Last 4 digits of SSN (US) or equivalent
     - Bank account details
   - Stripe verifies identity in real-time
   - Takes 2-5 minutes typically

4. **Return to Platform**
   - Seller redirected to: `https://your-site.com/seller/dashboard?onboarding=complete`
   - Dashboard auto-refreshes status
   - New status displayed immediately

5. **Status Updates**
   - **Verified** (Green): Identity confirmed, payouts enabled
   - **Pending** (Yellow): Verification in progress
   - **Action Required** (Orange): Additional info needed
   - **Restricted** (Red): Account restricted by Stripe

### Button Behavior Matrix

| Current Status | Button Text | Button State | Action |
|----------------|-------------|--------------|--------|
| No Stripe account | "Start KYC Verification" | Enabled (Gold) | Creates account + redirects to Stripe |
| Onboarding incomplete | "Continue Verification" | Enabled (Gold) | Generates new link + redirects |
| Action required | "Continue Verification" | Enabled (Gold) | Resumes onboarding |
| Pending | "Start KYC Verification" | Enabled (Gold) | Can regenerate link if needed |
| Verified | "Verification Complete" | Disabled (Green) | No action possible |
| Restricted | "Contact Support" | Disabled (Red) | No action possible |

---

## 👨‍💼 Admin Monitoring

### Admin Dashboard View

Admins can monitor KYC status but **cannot override Stripe decisions**.

#### Seller Table Columns

| Column | Description | Example |
|--------|-------------|---------|
| Seller Name | Shop name | "Tech Gadgets Store" |
| Email | Seller email | "seller@example.com" |
| Country | Business country | "United States" |
| Stripe Account ID | Connect account ID | `acct_1MxxxX` |
| KYC Status | Verification status | 🟢 Verified |
| Payouts Enabled | Can receive money | ✅ Yes |
| Charges Enabled | Can accept payments | ✅ Yes |
| Last Updated | Status update time | "2 hours ago" |

#### Status Indicators

- 🟢 **Verified** - Green badge, all systems go
- 🟡 **Pending** - Yellow badge, verification in progress
- 🟠 **Action Required** - Orange badge, seller needs to act
- 🔴 **Restricted** - Red badge, account limited by Stripe

#### Admin Actions

**What Admins CAN do:**
- View detailed Stripe account information
- See verification status history
- Access Stripe Dashboard for seller (direct link)
- Monitor payout eligibility
- View requirements currently due

**What Admins CANNOT do:**
- Manually approve/reject KYC ❌
- Override Stripe verification decisions ❌
- Modify Stripe account settings ❌
- Force enable payouts ❌

### Stripe Dashboard Access

Admins can click "View in Stripe" to access:
```
https://dashboard.stripe.com/connect/accounts/acct_1MxxxX
```

This shows:
- Identity verification details
- Bank account verification status
- Payout schedule
- Required actions
- Verification documents (managed by Stripe)

---

## 🔗 Webhook Integration

### Webhook Events

Subscribe to these events in Stripe Dashboard:

#### 1. `account.updated`
**Triggered when:** Verification status changes, details updated, requirements change

**Payload example:**
```json
{
  "id": "evt_xxx",
  "type": "account.updated",
  "data": {
    "object": {
      "id": "acct_1MxxxX",
      "charges_enabled": true,
      "payouts_enabled": true,
      "details_submitted": true,
      "requirements": {
        "currently_due": [],
        "eventually_due": [],
        "disabled_reason": null
      }
    }
  }
}
```

**Handler action:**
- Query DynamoDB for seller by `stripe_account_id`
- Update `kyc_status` based on account state
- Update `payouts_enabled` and `charges_enabled`
- Set `kyc_last_update` timestamp

#### 2. `account.application.authorized`
**Triggered when:** Seller authorizes your platform

**Handler action:**
- Log authorization event
- Update account status

#### 3. `account.application.deauthorized`
**Triggered when:** Seller revokes access

**Handler action:**
- Mark account as deauthorized
- Disable seller features

#### 4. `capability.updated`
**Triggered when:** Payment or payout capability changes

**Handler action:**
- Update specific capability status
- Sync with main account status

### Webhook Security

#### Signature Verification

```typescript
import Stripe from 'stripe';

const verifyWebhook = (payload: string, signature: string, secret: string) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (err) {
    console.error('Webhook signature verification failed');
    throw new Error('Invalid signature');
  }
};
```

#### Best Practices

1. **Always verify signatures** - Prevents spoofed requests
2. **Idempotency** - Handle duplicate webhook deliveries
3. **Return 200 quickly** - Don't timeout (Stripe retries on failure)
4. **Async processing** - Queue heavy operations
5. **Logging** - Record all webhook events for debugging

### Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/stripe/webhook

# Trigger test event
stripe trigger account.updated
```

---

## 🔒 Security & Compliance

### Data Privacy

#### ✅ What We Store

- Stripe account ID (`acct_xxx`)
- Verification status flags
- Payout eligibility boolean
- Last update timestamp
- Account type

#### ❌ What We DON'T Store

- Passport numbers
- Driver's license images
- SSN or tax ID numbers
- Bank account numbers
- Identity verification documents
- Home address details (stored only in Stripe)

### Compliance Features

1. **GDPR Compliant**
   - No sensitive PII stored on platform
   - Stripe is data processor
   - Right to erasure supported

2. **PCI DSS Level 1**
   - Stripe handles all payment data
   - Platform never touches card information

3. **KYC/AML Compliance**
   - Stripe performs identity verification
   - Automatic sanctions screening
   - Ongoing monitoring

4. **SOC 2 Type II**
   - Stripe maintains compliance
   - Annual audits

### Security Best Practices

```typescript
// ✅ DO: Use environment variables
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// ❌ DON'T: Hardcode secrets
const stripeKey = 'sk_test_xxx'; // NEVER!

// ✅ DO: Verify webhook signatures
const event = stripe.webhooks.constructEvent(body, sig, secret);

// ❌ DON'T: Trust webhook payloads blindly
const event = JSON.parse(body); // INSECURE!

// ✅ DO: Use HTTPS for all API calls
const link = await createAccountLink({ /* ... */ });

// ❌ DON'T: Expose secret keys in frontend
// NEVER use STRIPE_SECRET_KEY in React components!
```

---

## 🧪 Testing Guide

### Test Mode Setup

1. **Use Test API Keys**
   ```env
   STRIPE_SECRET_KEY=sk_test_51xxxxx
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
   ```

2. **Test Onboarding Data**

   **Individual (US):**
   - Name: `Jenny Rosen`
   - DOB: `01/01/1990`
   - SSN last 4: `0000`
   - Address: `123 Main St, San Francisco, CA 94111`
   - Bank routing: `110000000`
   - Bank account: `000123456789`

   **Company (US):**
   - Business name: `Rocket Rides`
   - EIN: `00-0000000`
   - Address: `123 Main St, San Francisco, CA 94111`

3. **Test Verification States**

   **Instant verification:**
   - Use test data above → immediate verification

   **Pending state:**
   - Use routing number: `110000001`
   - Verification stays pending

   **Failed verification:**
   - Use routing number: `110000002`
   - Verification fails

### Manual Testing Checklist

#### Seller Flow

- [ ] Click "Start KYC Verification" button
- [ ] Redirect to Stripe onboarding
- [ ] Complete onboarding with test data
- [ ] Return to dashboard
- [ ] Status shows "Verified"
- [ ] Payouts show "Enabled"
- [ ] Charges show "Enabled"
- [ ] Button changes to "Verification Complete" (disabled)

#### Admin Flow

- [ ] Navigate to Seller Management
- [ ] Search for seller by email
- [ ] View seller details
- [ ] See Stripe account ID
- [ ] Status badge shows correct color
- [ ] Payout status displays correctly
- [ ] "View in Stripe" link works
- [ ] Cannot manually override status

#### Webhook Flow

- [ ] Complete onboarding in Stripe
- [ ] Webhook fires `account.updated`
- [ ] Lambda processes event
- [ ] DynamoDB updates seller record
- [ ] Dashboard refreshes automatically
- [ ] Status syncs correctly

### Automated Testing

```typescript
// Unit test example
describe('mapStripeStatusToKYC', () => {
  it('returns verified when charges and payouts enabled', () => {
    const account = {
      charges_enabled: true,
      payouts_enabled: true,
      details_submitted: true,
      requirements: { currently_due: [], disabled_reason: null }
    };
    expect(mapStripeStatusToKYC(account)).toBe('verified');
  });

  it('returns action_required when requirements due', () => {
    const account = {
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: true,
      requirements: { currently_due: ['individual.verification.document'], disabled_reason: null }
    };
    expect(mapStripeStatusToKYC(account)).toBe('action_required');
  });

  it('returns restricted when disabled', () => {
    const account = {
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: true,
      requirements: { currently_due: [], disabled_reason: 'rejected.fraud' }
    };
    expect(mapStripeStatusToKYC(account)).toBe('restricted');
  });
});
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Failed to create Stripe account"

**Possible causes:**
- Invalid API key
- Country not supported
- Email already used
- Invalid country code

**Solution:**
```typescript
// Check API key is correct
console.log('Using key starting with:', 
  import.meta.env.VITE_STRIPE_SECRET_KEY?.substring(0, 7));

// Verify country is 2-letter ISO code
const validCountries = ['US', 'GB', 'CA', 'AU', ...];
if (!validCountries.includes(country)) {
  throw new Error('Country not supported');
}
```

#### 2. "Onboarding link expired"

**Cause:** Account links expire after ~24 hours

**Solution:** Generate new link automatically
```typescript
if (onboardingStatus === 'refresh') {
  // User's link expired, generate new one
  await createAccountOnboardingLink({ ... });
}
```

#### 3. "Webhook signature verification failed"

**Possible causes:**
- Wrong webhook secret
- Payload tampered with
- Replay attack

**Solution:**
```typescript
// Get secret from Stripe Dashboard
const secret = process.env.STRIPE_WEBHOOK_SECRET;

// Verify before processing
const event = stripe.webhooks.constructEvent(
  request.body,
  request.headers['stripe-signature'],
  secret
);
```

#### 4. "Seller not found in webhook handler"

**Cause:** GSI not created or seller record missing

**Solution:**
```bash
# Verify GSI exists
aws dynamodb describe-table --table-name sellers | grep stripe_account_id

# If missing, create GSI
aws dynamodb update-table \
  --table-name sellers \
  --attribute-definitions AttributeName=stripe_account_id,AttributeType=S \
  --global-secondary-index-updates '[{...}]'
```

#### 5. "Status not updating after onboarding"

**Possible causes:**
- Webhook not configured
- Webhook failing silently
- No GSI on `stripe_account_id`
- Account link `return_url` incorrect

**Solution:**
```bash
# Check webhook logs in Stripe Dashboard
# Go to Developers → Webhooks → [your endpoint] → Events

# Test webhook manually
stripe trigger account.updated

# Check Lambda logs
aws logs tail /aws/lambda/stripe-webhook-handler --follow
```

#### 6. "Payouts disabled after verification"

**Cause:** Bank verification pending or additional requirements

**Check:**
```typescript
const account = await stripe.accounts.retrieve(accountId);
console.log('Requirements:', account.requirements.currently_due);
console.log('Payouts enabled:', account.payouts_enabled);
```

### Debug Mode

Enable detailed logging:

```typescript
// In stripeConnectService.ts
const DEBUG = import.meta.env.VITE_STRIPE_DEBUG === 'true';

export const initiateSellerKYCOnboarding = async (seller) => {
  if (DEBUG) {
    console.log('[STRIPE DEBUG] Initiating onboarding', {
      sellerId: seller.id,
      existingAccount: seller.stripe_account_id,
      country: seller.country,
    });
  }
  
  // ... rest of code
};
```

### Support Resources

- **Stripe Documentation**: https://stripe.com/docs/connect
- **Stripe Support**: https://support.stripe.com
- **Community Forum**: https://stripe.com/docs/connect/community
- **Status Page**: https://status.stripe.com

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **Onboarding Completion Rate**
   ```sql
   SELECT 
     COUNT(*) as total_started,
     SUM(CASE WHEN stripe_onboarding_completed = true THEN 1 ELSE 0 END) as completed,
     (SUM(CASE WHEN stripe_onboarding_completed = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as completion_rate
   FROM sellers
   WHERE stripe_account_id IS NOT NULL;
   ```

2. **Verification Time**
   - Track time from account creation to verification
   - Measure webhook delay

3. **Verification Status Distribution**
   ```sql
   SELECT 
     kyc_status,
     COUNT(*) as count
   FROM sellers
   GROUP BY kyc_status;
   ```

4. **Payout Eligibility Rate**
   ```sql
   SELECT 
     COUNT(*) as total_verified,
     SUM(CASE WHEN payouts_enabled = true THEN 1 ELSE 0 END) as payouts_ready,
     (SUM(CASE WHEN payouts_enabled = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as payout_rate
   FROM sellers
   WHERE kyc_status = 'verified';
   ```

### Stripe Dashboard Analytics

Access at: https://dashboard.stripe.com/connect/analytics

View:
- Total connected accounts
- Account states over time
- Onboarding funnel
- Verification success rate
- Top decline reasons

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] Lambda functions deployed
- [ ] Webhook endpoint configured
- [ ] DynamoDB GSI created
- [ ] AppSync schema updated
- [ ] Frontend components integrated
- [ ] Test mode fully tested

### Production Deployment

- [ ] Switch to live Stripe keys (`sk_live_`, `pk_live_`)
- [ ] Update webhook endpoint to production URL
- [ ] Verify webhook signature with live secret
- [ ] Test production onboarding with real account
- [ ] Monitor CloudWatch logs for errors
- [ ] Check Stripe Dashboard for account creation
- [ ] Verify webhook deliveries in Stripe

### Post-Deployment

- [ ] Monitor first 10 seller onboardings
- [ ] Check webhook success rate
- [ ] Verify dashboard updates correctly
- [ ] Test admin monitoring view
- [ ] Document any production issues

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Review failed webhook deliveries
- Check seller verification queue
- Monitor onboarding completion rate

**Monthly:**
- Review Stripe account health
- Check for API updates
- Update dependencies

**Quarterly:**
- Review compliance requirements
- Update test cases
- Optimize webhook handler

### Emergency Contacts

**Stripe Issues:**
- Dashboard: https://dashboard.stripe.com
- Support: https://support.stripe.com
- Status: https://status.stripe.com

**Platform Issues:**
- Check CloudWatch logs
- Review Sentry errors
- Contact development team

---

## 📝 Changelog

### Version 1.0.0 (Initial Implementation)

**Added:**
- ✅ Stripe Connect Express account creation
- ✅ Hosted onboarding integration
- ✅ Webhook handler for status updates
- ✅ Seller KYC status component
- ✅ Admin monitoring dashboard
- ✅ GraphQL resolvers for Stripe operations
- ✅ DynamoDB schema updates
- ✅ Complete documentation

**Replaced:**
- ❌ Manual KYC form with 5-step process
- ❌ Document upload storage
- ❌ Manual admin approval workflow

---

## 🎯 Next Steps

### Phase 2 Enhancements (Optional)

1. **Automated Payout Scheduling**
   - Configure payout intervals (daily, weekly, monthly)
   - Display next payout date in dashboard

2. **Multi-Currency Support**
   - Enable sellers in different countries
   - Handle currency conversion

3. **Enhanced Analytics**
   - Onboarding funnel breakdown
   - Verification success predictors
   - Time-to-verification metrics

4. **Email Notifications**
   - Send email when verification complete
   - Notify on action required
   - Alert on restrictions

5. **Custom Branding**
   - Fully white-label Stripe onboarding
   - Custom domain for Connect

---

**🎉 Implementation Complete!**

Your platform now has a production-ready Stripe Connect KYC verification system that:
- ✅ Automates identity verification
- ✅ Reduces compliance liability
- ✅ Improves seller onboarding UX
- ✅ Enables automatic payout management
- ✅ Provides admin transparency

For questions or issues, refer to the troubleshooting section or contact your development team.
