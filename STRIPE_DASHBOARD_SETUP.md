# 🔧 Stripe Dashboard Setup Guide - Step by Step

## STEP 1: Get Your Stripe API Keys
═══════════════════════════════════════════════════════════════

1. **Go to:** https://dashboard.stripe.com/

2. **Sign in** with your Stripe account credentials

3. **Look for "Developers" section** in left sidebar
   - Click: **Developers**

4. **Click: "API Keys"**

5. **You'll see two keys:**
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

6. **For Testing:**
   - Use the **TEST** keys (look for "Viewing test data" toggle)
   - These start with `pk_test_` and `sk_test_`

7. **Copy the Secret Key** (This is what your Lambda functions need)
   - Click the eye icon to reveal it
   - Copy the secret key

8. **Set Environment Variable** in your Lambda:
   ```
   STRIPE_SECRET_KEY = sk_test_xxxxxxxxxxxxx
   ```

---

## STEP 2: Add Your Environment Variable to Lambda
═══════════════════════════════════════════════════════════════

1. **Go to:** https://console.aws.amazon.com/lambda/

2. **Select each Lambda function:**
   - BeauzeadCreatePaymentIntent
   - BeauzeadConfirmPaymentAndCreateOrder
   - BeauzeadProcessRefund
   - BeauzeadProcessSellerPayout

3. **For each function:**
   - Click: **Configuration**
   - Click: **Environment variables**
   - Click: **Edit**
   - Click: **Add environment variable**
   
4. **Add:**
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_test_xxxxxxxxxxxxx` (paste your secret key here)
   - Click: **Save**

5. **Repeat for all 4 Lambda functions**

---

## STEP 3: Get Test Card Numbers
═══════════════════════════════════════════════════════════════

Go back to Stripe Dashboard:

1. **Click: Developers → API Keys**

2. **Scroll down to "Test Data" section**

3. **Use these test cards for testing:**

### ✅ Successful Payment:
```
Card Number: 4242 4242 4242 4242
Expiry: 12/28 (any future date)
CVC: 123 (any 3 digits)
```

### ❌ Declined Payment:
```
Card Number: 4000 0000 0000 0002
Expiry: 12/28
CVC: 123
```

### ⚠️ Requires Authentication:
```
Card Number: 4000 2500 0000 0002
Expiry: 12/28
CVC: 123
```

---

## STEP 4: Enable Stripe Connect for Seller Payouts
═══════════════════════════════════════════════════════════════

1. **On Stripe Dashboard sidebar**
   - Look for: **Connected accounts** (or **Manage accounts**)
   - Click it

2. **Click: "Create account"**
   - Select: **Express** (for quick seller onboarding)
   - Click: **Create**

3. **You'll get:**
   - A **Restricted API Key** for Express accounts
   - A **Client ID** for onboarding

4. **Save these values** - you'll need them for seller onboarding

5. **For Testing:**
   - Stripe will give you test seller accounts
   - Use those to test payouts

---

## STEP 5: Set Up Webhook Endpoint (Optional But Recommended)
═══════════════════════════════════════════════════════════════

### Why Webhooks?
Webhooks notify your system when:
- Payment succeeds
- Payment fails
- Refund completes
- Dispute occurs

### Setup:

1. **On Stripe Dashboard:**
   - Click: **Developers**
   - Click: **Webhooks**

2. **Click: "Add endpoint"**

3. **Enter your endpoint URL:**
   ```
   https://your-backend.com/stripe-webhook
   ```
   (Or use your API Gateway URL for Lambda)

4. **Select Events to listen for:**
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
   - ✅ `payout.paid`

5. **Click: "Add endpoint"**

6. **Copy the "Signing Secret"** (starts with `whsec_`)
   - Add to Lambda environment variable:
     ```
     STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxx
     ```

---

## STEP 6: Test Your Integration
═══════════════════════════════════════════════════════════════

### Test Payment Flow:

1. **Go to your app:** `http://localhost:5173`

2. **Navigate to:** `/checkout/shipping`

3. **Add a product to cart** (if not already there)

4. **Follow checkout flow:**
   - Enter shipping address
   - Review order
   - Enter test card: `4242 4242 4242 4242`
   - Complete payment

5. **Check if order created:**
   - Go to AWS DynamoDB console
   - Check "Orders" table
   - Look for your order ID

6. **Check Lambda logs:**
   ```bash
   aws logs tail /aws/lambda/BeauzeadCreatePaymentIntent --follow
   aws logs tail /aws/lambda/BeauzeadConfirmPaymentAndCreateOrder --follow
   ```

---

## STEP 7: Verify Payment in Stripe Dashboard
═══════════════════════════════════════════════════════════════

1. **On Stripe Dashboard:**
   - Click: **Payments**

2. **Look for your test payment** (timestamp should match your test)
   - Status should show: ✅ **Succeeded**

3. **Click the payment** to see details:
   - Amount charged
   - Card used
   - Timestamp
   - Metadata (order ID, customer info)

---

## STEP 8: Test Refund
═══════════════════════════════════════════════════════════════

1. **Go to admin panel** (if you have one)
   - Orders → Find test order
   - Click: **Refund**
   - Enter amount
   - Click: **Process Refund**

2. **Check Stripe Dashboard:**
   - Go to: **Payments**
   - Click the original payment
   - Scroll down to see: **Refund** (amount and status)

3. **Check Lambda logs:**
   ```bash
   aws logs tail /aws/lambda/BeauzeadProcessRefund --follow
   ```

---

## STEP 9: Test Seller Payout (Advanced)
═══════════════════════════════════════════════════════════════

⚠️ This requires:
- A connected seller account (Express Account from Stripe)
- Orders from that seller

### To test:

1. **Create a test seller account:**
   - Stripe Dashboard → Connected accounts
   - Create Express test account
   - You'll get: `acct_test_xxxxxxxxxxxxx`

2. **Run payout Lambda:**
   ```bash
   # Via admin panel, or manually:
   aws lambda invoke \
     --function-name BeauzeadProcessSellerPayout \
     --payload '{
       "sellerId": "seller_123",
       "stripeAccountId": "acct_test_xxxxxxxxxxxxx"
     }' \
     response.json \
     --region us-east-1
   ```

3. **Check results:**
   ```bash
   cat response.json
   ```

4. **Verify in Stripe:**
   - Dashboard → Transfers
   - Look for transfer to seller account
   - Should show: Amount - (10% platform fee)

---

## STEP 10: Production Setup (When Ready)
═══════════════════════════════════════════════════════════════

### ⚠️ DO THIS ONLY WHEN READY FOR LIVE:

1. **Go to Stripe Dashboard**
   - Look for: **Live data** toggle (top left)
   - Switch from TEST → LIVE

2. **Copy LIVE keys:**
   - Publishable: `pk_live_xxxxxxxxxxxxx`
   - Secret: `sk_live_xxxxxxxxxxxxx`

3. **Update Lambda environment variables:**
   - Same process as Step 2
   - But use **LIVE** keys instead of test keys

4. **Update frontend:**
   - `src/services/stripeService.ts`
   - Change `loadStripe('pk_test_...')` to `loadStripe('pk_live_...')`

5. **Enable webhooks on production** (Step 5)

6. **Test with real card** (Optional - use small amount)

---

## Quick Reference - What Each Library Needs
═══════════════════════════════════════════════════════════════

### Backend (Node.js Stripe SDK):
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```
→ Uses `sk_test_` or `sk_live_`

### Frontend (Stripe.js):
```javascript
const stripe = await loadStripe('pk_test_...');
```
→ Uses `pk_test_` or `pk_live_`

### Admin (Webhook):
```javascript
const event = stripe.webhooks.constructEvent(
  body, 
  sig, 
  process.env.STRIPE_WEBHOOK_SECRET
);
```
→ Uses `whsec_` (webhook signing secret)

---

## ✅ Checklist - Complete These in Order:

- [ ] Step 1: Copy API Secret Key
- [ ] Step 2: Add to Lambda environment variables
- [ ] Step 3: Know test card numbers
- [ ] Step 4: Set up Stripe Connect (for sellers)
- [ ] Step 5: Create webhook endpoint (optional)
- [ ] Step 6: Test payment flow
- [ ] Step 7: Verify payment in Stripe
- [ ] Step 8: Test refund
- [ ] Step 9: Test seller payout
- [ ] Step 10: Move to production (when ready)

---

## 🆘 Troubleshooting Common Issues

### "Invalid API Key"
→ Check `STRIPE_SECRET_KEY` is correct in Lambda environment variables

### "Payment failed"
→ Check test card number (use `4242...`)
→ Check expiry date is in future
→ Check CloudWatch logs

### "Order not created"
→ Check DynamoDB Orders table exists
→ Check Lambda has DynamoDB permissions
→ Check Lambda logs for errors

### "Webhook not working"
→ Verify webhook endpoint URL is correct
→ Check signing secret is correct
→ Check webhook logs in Stripe Dashboard

---

**Generated:** February 5, 2026
**Status:** Ready for Testing! 🚀
