# CRITICAL BACKEND ARCHITECTURE RULES

## Authentication System

### User Roles & Creation
- **Admin**: AWS CLI / Manual creation only - NOT via signup UI
- **Seller**: Via `/seller/signup` endpoint - role assigned automatically via Cognito Group
- **User**: Via `/signup` endpoint - role assigned automatically via Cognito Group

### Cognito Setup
- **User Pool**: `us-east-1_PPPmNH7HL` (AWS Region: us-east-1)
- **Auth Methods**: Email + Password + 6-digit OTP verification
- **Groups**: `admin`, `seller`, `user` (backend must enforce these)
- **Email Verification**: OTP sent to email before account activation

### Path-Based Role Identification

```
/signup → User role (stored in Cognito group: 'user')
/seller/signup → Seller role (stored in Cognito group: 'seller')
/admin/* → Admin role (ONLY available after backend group assignment)
```

**IMPORTANT**: Role identification happens in TWO places:
1. **Frontend**: Path determines which signup/login page shown (UX routing)
2. **Backend**: Cognito Group assignment determines actual role + permissions (security)

Frontend path cannot override backend role. If frontend sends role='admin' with /signup credentials, backend rejects - path mismatch.

---

## User Login Flows

### User Login (`/login`)
- Email + Password credentials submitted
- Backend verifies credentials match 'user' role in Cognito
- **Success**: Issue JWT token → Redirect to Home (already logged in)
- **Failure**: Show error, stay on login page

**NO Role Selection UI**: User selects login role by choosing path (`/login` for user, `/seller/login` for seller, `/admin/login` for admin)

### Seller Login (`/seller/login`)
- Email + Password credentials submitted
- Backend verifies credentials match 'seller' role in Cognito
- **Success**: Issue JWT token → Redirect to Seller Dashboard
- **Failure**: Show error, stay on seller login page

### Admin Login (`/admin/login`)
- Email + Password credentials submitted
- Backend verifies credentials match 'admin' role in Cognito
- **Success**: Issue JWT token → Redirect to Admin Dashboard
- **Failure**: Show error, stay on admin login page

---

## Signup Flows

### User Signup (`/signup`)
1. User enters: Email, Password, Name, Phone (and any user-specific fields)
2. Frontend: `POST /signup` → Backend creates Cognito account + assigns 'user' group
3. Backend response: Contains temporary token + requires OTP verification
4. Frontend navigates to `/otp-verification` with email and purpose='signup'
5. User enters 6-digit OTP from email
6. OTP verification successful:
   - **Show**: Success dialog ("Email Verified! Your account has been successfully created.")
   - **Wait**: 2 seconds (user sees confirmation)
   - **Redirect**: Navigate to Home page (user is already logged in, no login redirect needed)

### Seller Signup (`/seller/signup`)
1. Seller enters: Email, Password, Business Name, Business Type, Country, KYC docs
2. Frontend: `POST /seller/signup` → Backend creates Cognito account + assigns 'seller' group
3. Backend response: Contains temporary token + requires OTP verification
4. Frontend navigates to `/seller/otp-verification` with email and purpose='seller-signup'
5. Seller enters 6-digit OTP from email
6. OTP verification successful:
   - **Show**: Success dialog
   - **Wait**: 2 seconds
   - **Redirect**: Navigate to Seller Dashboard (already logged in)

### Admin Signup
**DISABLED VIA UI** - Admins created via AWS CLI only:
```bash
aws cognito-idp admin-create-user --user-pool-id us-east-1_PPPmNH7HL --username <email> --message-action SUPPRESS
aws cognito-idp admin-add-user-to-group --user-pool-id us-east-1_PPPmNH7HL --username <email> --group-name admin
```

---

## Password Reset Flows

### User Password Reset (`/forgot-password`)
1. User enters email address
2. Backend: `POST /forgot-password` → Verifies email exists + sends OTP
3. Frontend navigates to `/otp-verification` with email and purpose='password-reset'
4. User enters 6-digit OTP
5. OTP verification successful:
   - Navigate to `/new-password` with email + OTP token
6. User enters new password (with validation: 8-16 chars, mixed case, numbers, special chars)
7. Password updated successfully:
   - Redirect to `/login` page

### Seller Password Reset (`/seller/forgot-password`)
1. Seller enters email address
2. Backend: `POST /seller/forgot-password` → Verifies email exists + sends OTP
3. Frontend navigates to `/seller/otp-verification` with email and purpose='password-reset'
4. Seller enters 6-digit OTP
5. OTP verification successful:
   - Navigate to `/seller/new-password` with email + OTP token
6. Seller enters new password
7. Password updated successfully:
   - Redirect to `/seller/login` page

---

## Frontend Route Protection

### Protected Routes
- `/` (Home): Requires JWT token (any role: user, seller, admin)
- `/profile`: Requires user role JWT
- `/seller/*`: Requires seller role JWT + path starts with `/seller/`
- `/admin/*`: Requires admin role JWT + path starts with `/admin/`

**Guard Implementation**:
```typescript
// In App.tsx or ProtectedRoute component
if (role === 'user' && !pathname.startsWith('/user') && pathname !== '/') {
  redirect to /login
}
if (role === 'seller' && !pathname.startsWith('/seller')) {
  redirect to /seller/login
}
if (role === 'admin' && !pathname.startsWith('/admin')) {
  redirect to /admin/login
}
```

---

## Special Notes

### User Dashboard
- **Users have NO Dashboard page** - Use `/profile` page for user info/settings instead
- **Profile Page**: `/profile` (shows user info, edit profile, preferences)
- **Seller Dashboard**: `/seller/dashboard` (shows seller metrics, orders, products)
- **Admin Dashboard**: `/admin/dashboard` (shows system metrics, user management, reports)

### Session State
- JWT tokens stored in localStorage: `user_token`, `seller_token`, `admin_token`
- Token expiration: Check on app load, refresh before logout
- Logout: Clear token from localStorage + redirect to appropriate login page (based on last role)

### Error Handling
- **Invalid credentials**: "Email or password is incorrect"
- **Email not verified**: "Please verify your email with OTP first"
- **Account disabled**: "Your account has been suspended. Contact support."
- **Role mismatch**: "This email is registered as [current role], cannot use [attempted role] login"

### Database Structure
- **User table**: id, email, passwordHash, name, phone, role (should be 'user'), createdAt, updatedAt
- **Seller table**: id, email, passwordHash, businessName, businessType, kycStatus, role (should be 'seller'), createdAt, updatedAt
- **Admin table**: id, email, passwordHash, role (should be 'admin'), createdAt, updatedAt
- **All tables**: Should have role column redundantly for faster queries (even though Cognito is source of truth)

---

## GraphQL API Configuration

**Endpoint**: https://woqi3tosm5a2jnj4w6zit2mfye.appsync-api.us-east-1.amazonaws.com/graphql

**Auth Type**: API Key (7-day expiration - rotate regularly)

**Required Queries/Mutations**:
- `mutation Signup`: Email, Password, Name, Phone → Returns temp token, requires OTP
- `mutation VerifyOTP`: Email, OTP → Returns JWT token
- `mutation ForgotPassword`: Email → Sends OTP
- `mutation ResetPassword`: Email, OTP, NewPassword → Updates password
- `query GetUser`: ID → Returns user details
- `mutation Login`: Email, Password → Returns JWT token (backend role validation)

---

## Implementation Checklist

- [ ] Cognito User Pool created with 3 groups (admin, seller, user)
- [ ] Role assignment happens at signup time (not during login)
- [ ] OTP verification shows success dialog before redirect
- [ ] User signup redirects to Home (not login) after OTP
- [ ] Seller signup redirects to Seller Dashboard after OTP
- [ ] Password reset redirect to appropriate login page (not home)
- [ ] Route guards check role matches path (user=/user/*, seller=/seller/*, admin=/admin/*)
- [ ] Admin accounts created via AWS CLI only
- [ ] Profile page used instead of user dashboard
- [ ] JWT tokens stored and managed properly
- [ ] Error messages are user-friendly but not revealing

---

## URL Paths Reference

| Path | Purpose | Auth Required | Roles Allowed |
|------|---------|---|---|
| `/` | Home page | No | All |
| `/login` | User login | No | N/A |
| `/signup` | User signup | No | N/A |
| `/forgot-password` | User password reset | No | N/A |
| `/otp-verification` | User OTP verification | No | N/A |
| `/new-password` | User new password creation | No | N/A |
| `/profile` | User profile page | Yes | user |
| `/seller/login` | Seller login | No | N/A |
| `/seller/signup` | Seller signup | No | N/A |
| `/seller/forgot-password` | Seller password reset | No | N/A |
| `/seller/otp-verification` | Seller OTP verification | No | N/A |
| `/seller/new-password` | Seller new password creation | No | N/A |
| `/seller/dashboard` | Seller dashboard | Yes | seller |
| `/admin/login` | Admin login | No | N/A |
| `/admin/dashboard` | Admin dashboard | Yes | admin |
