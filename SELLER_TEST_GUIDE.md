# Quick Test Guide - Seller Role Detection Fix

## Test Seller Login (Now Fixed ✅)

### Existing Seller Accounts (Added to seller group):
1. **Email:** `akhilmfssolutions@gmail.com`
   - **Password:** (check your records)
   - **Group:** seller ✅
   - **Expected:** Should redirect to `/seller/dashboard`

2. **Email:** `bmoon6458@gmail.com`
   - **Password:** (check your records)
   - **Group:** seller ✅
   - **Expected:** Should redirect to `/seller/dashboard`

### Test Steps:
1. Go to `/seller/login`
2. Enter seller email and password
3. Verify OTP from email
4. Should be redirected to `/seller/dashboard` (not homepage)
5. Header should show Account menu

## How to Verify Group Membership:
```bash
aws cognito-idp admin-list-groups-for-user \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <email> \
  --region us-east-1
```

Expected output should include `"GroupName": "seller"`

## Create New Seller for Testing:
1. Go to `/seller/signup`
2. Fill in seller details (including phone number)
3. Verify email OTP
4. Lambda trigger will automatically add user to seller group
5. Next login should work correctly

## Troubleshooting:
- **Still redirected to homepage?** → User might not be in seller group
  - Check: `aws cognito-idp admin-list-groups-for-user` command above
  - Fix: `aws cognito-idp admin-add-user-to-group --group-name seller ...`

- **Lambda not executing?** → Check CloudWatch logs:
  - `/aws/lambda/BeauzeadPostConfirmation` (after deployment)

- **JWT missing cognito:groups?** → User not in any group
  - Run manual group assignment above
