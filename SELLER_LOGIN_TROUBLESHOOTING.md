# Seller Login Navigation Fix - Troubleshooting

## Status
✅ Seller users ARE correctly added to the "seller" Cognito group
✅ Code is correctly detecting role from `cognito:groups` in JWT
✅ Navigation logic is correct

## Potential Issue
Sellers who previously logged in may have **cached sessions** that don't include the `cognito:groups` claim. They need a fresh login.

## Solution - Test Fresh Login

### For Existing Seller Users:

1. **Clear browser cache/localStorage:**
   ```javascript
   // In browser console:
   localStorage.clear()
   sessionStorage.clear()
   ```
   OR use DevTools → Application → Clear Site Data

2. **Sign out from the app:**
   - Click Account menu → Logout
   - Confirm logout

3. **Close and reopen the browser**
   - Close all tabs with your app
   - Open fresh browser tab

4. **Test seller login:**
   - Go to `/seller/login`
   - Use credentials:
     - Email: `akhilmfssolutions@gmail.com`
     - Password: (your seller password)
   - Verify email OTP
   - **Should redirect to `/seller/dashboard`** ✅

### Browser DevTools Verification:

After logging in, check the JWT token in browser console:

```javascript
// In browser console, run:
const tokens = await JSON.parse(localStorage.getItem('CognitoIdentityServiceProvider:3hk6tg9hduv7fkotlo2h99jpin:CognitoIdentityServiceProviderUserPool.idToken')) || {};
const payload = tokens.split('.')[1];
const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
console.log('cognito:groups:', decoded['cognito:groups']);
// Should show: ["seller"]
```

## Check Console Logs

After seller login, check browser DevTools Console for:

```
JWT Payload for role detection: {
  'custom:role': undefined,
  'role': undefined,
  'cognito:groups': ['seller']  // ← Should see this
}
Resolved role from session: seller
Seller login - User role: seller
Redirecting seller to /seller/dashboard
```

## If Still Not Working

1. **Check AWS CLI verification:**
```bash
aws cognito-idp admin-list-groups-for-user \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <seller-email> \
  --region us-east-1
```

Should output:
```json
{
  "Groups": [
    {
      "GroupName": "seller",
      ...
    }
  ]
}
```

2. **Check if user exists:**
```bash
aws cognito-idp admin-get-user \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <seller-email> \
  --region us-east-1
```

3. **Re-add to seller group if needed:**
```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <seller-email> \
  --group-name seller \
  --region us-east-1
```

## Testing New Seller Signups

New sellers who sign up through `/seller/signup` will:
1. Be added to seller group automatically by Lambda trigger (post-confirmation)
2. Get fresh JWT with `cognito:groups: ["seller"]`
3. Should navigate correctly on first login ✅

## Summary

- ✅ Backend: Sellers are in the group
- ✅ Code: Navigation logic is correct
- ❓ Issue: Likely cached sessions from before group membership
- ✅ Solution: Clear cache and re-login with fresh session
