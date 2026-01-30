# AWS Amplify Authentication Setup

## Authentication Architecture

### Auth Configuration
- **Service**: AWS Cognito User Pool
- **User Pool ID**: us-east-1_PPPmNH7HL
- **Authentication Method**: Email + Password
- **MFA**: Email OTP (6 digits)
- **Password Policy**: 8-16 characters with uppercase, lowercase, numeric, and special characters

### User Groups (Roles)
Three groups for role-based access control:

1. **admin** - Full system access
   - User: admin@beauzead.com
   - Password: Admin@123456 (created via AWS CLI)
   - Dashboard: /admin

2. **seller** - Store management access
   - Created via /seller/signup
   - Dashboard: /seller/dashboard

3. **user** - Shopping access
   - Created via /signup
   - Dashboard: /user/dashboard

## User Signup Flow

### Regular Users (role: 'user')
1. Navigate to `/signup`
2. Fill in: Email, Full Name (capital first letter), Password (strong)
3. Select Country (fetches from CountryList GraphQL table)
4. Currency auto-selected based on country
5. Submit → Receive 6-digit email OTP
6. Enter OTP → Account created, added to 'user' group

### Sellers (role: 'seller')
1. Navigate to `/seller/signup`
2. Fill in: Email, Full Name, Password, Country
3. Add: Business Name, Business Type (fetches from BusinessType GraphQL table)
4. Submit → Receive 6-digit email OTP
5. Enter OTP → Account created, added to 'seller' group
6. Status: Pending approval initially

### Admin (role: 'admin')
- **NO UI signup** - Created via AWS CLI only
- Use command: `aws cognito-idp admin-create-user --user-pool-id <id> --username <email> ...`
- Then add to admin group: `aws cognito-idp admin-add-user-to-group --user-pool-id <id> --username <email> --group-name admin`
- Default credentials provided separately

## Login Flow

### Role-Based Login
- **User Login**: Navigate to `/login`
  - Email + Password
  - Forgot Password: `/forgot-password`
  - Redirects to `/user/dashboard` on success

- **Seller/Admin Login**: Navigate to `/seller/login` (shared page)
  - Email + Password
  - Forgot Password: `/seller/forgot-password`
  - Role detection from Cognito group:
    - Admin → Redirects to `/admin`
    - Seller → Redirects to `/seller/dashboard`

## Password Reset Flow

### User Forgot Password (`/forgot-password`)
1. Enter email → System sends 6-digit OTP to email
2. Enter OTP → Verify code
3. Create new password → Update in Cognito
4. Success → Redirect to `/login`

### Seller/Admin Forgot Password (`/seller/forgot-password`)
1. Same 4-step flow as user
2. Success → Redirect to `/seller/login`

## Authentication Token & Session

### JWT Token Structure
- **ID Token**: Contains user claims including:
  - `cognito:groups` - Array of groups user belongs to (admin, seller, user)
  - `email` - User email
  - `email_verified` - Email verification status
  - `custom:role` - Custom role attribute (if set)

- **Access Token**: For API authorization

- **Refresh Token**: 30-day expiry for session refresh

### Role Resolution Priority (in AuthContext)
1. Check `custom:role` claim
2. Check `role` claim
3. Check `cognito:groups` array (takes first group)
4. Return null if not found

## Backend Integration

### Amplify Auth Service (`src/lib/amplifyAuth.ts`)
```typescript
- signup() - Create new user with email/password
- confirmSignUp() - Verify OTP and complete signup
- signin() - Authenticate user
- signout() - Logout user
- resetPassword() - Initiate password reset
- confirmPasswordReset() - Complete password reset with OTP
- getCurrentAuthUser() - Get current authenticated user
- getAuthSession() - Get session with tokens
```

### Auth Context (`src/contexts/AuthContext.tsx`)
- Manages auth state globally
- Handles user profile fetching from backend
- Stores currency preferences per user
- Provides hooks: `useAuth()`

## Frontend Components Using Auth

### Login Components
- `src/components/auth/Login.tsx` - User login
- `src/pages/seller/SellerLogin.tsx` - Seller/Admin login (role-based)

### Signup Components
- `src/components/auth/Signup.tsx` - User signup with country selection
- `src/pages/seller/SellerSignup.tsx` - Seller signup with business type

### Password Reset
- `src/pages/user/ForgotPassword.tsx` - User password reset
- `src/pages/seller/SellerForgotPassword.tsx` - Seller/Admin password reset

### Protected Routes
- `/admin/*` - Protected (admin only)
- `/seller/dashboard` - Protected (seller/admin)
- `/user/dashboard` - Protected (user/seller/admin)
- `/` - Public (home page)

## Database Integration

### Connected Tables
1. **CountryList** (GraphQL)
   - Fetched on user/seller signup
   - Auto-selects currency based on country

2. **BusinessType** (GraphQL)
   - Fetched on seller signup
   - Dropdown selection required

## Testing Credentials

### Admin Account
- **Email**: admin@beauzead.com
- **Password**: Admin@123456
- **Group**: admin
- **Dashboard**: /admin

### Test User (Create via UI)
- Navigate to `/signup`
- Complete 2-step signup flow
- Test login at `/login`

### Test Seller (Create via UI)
- Navigate to `/seller/signup`
- Complete 2-step signup flow
- Login at `/seller/login` (redirects to /seller/dashboard)

## Security Best Practices

✅ **Implemented**:
- Passwords stored securely (AWS Cognito)
- Email verification required
- OTP-based password reset
- JWT tokens in session
- Role-based access control (RBAC)
- Strong password policy (8-16 chars, mixed case, numeric, special)

⚠️ **Notes**:
- No social login (email only)
- No phone number verification
- Admin accounts not creatable via UI
- Seller accounts pending approval before dashboard access

## Commands Reference

### Create Admin User
```bash
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <email> \
  --user-attributes Name=email,Value=<email> Name=email_verified,Value=true \
  --message-action SUPPRESS \
  --region us-east-1
```

### Set Password
```bash
aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <email> \
  --password '<password>' \
  --permanent \
  --region us-east-1
```

### Add to Group
```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <email> \
  --group-name <group-name> \
  --region us-east-1
```

### List Groups
```bash
aws cognito-idp list-groups \
  --user-pool-id us-east-1_PPPmNH7HL \
  --region us-east-1
```

### Get User
```bash
aws cognito-idp admin-get-user \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username <email> \
  --region us-east-1
```

## Amplify Status

```
Category | Resource name             | Operation | Provider
---------|---------------------------|-----------|----------
Api      | beauzeadecommerce         | No Change | awscloudformation
Auth     | beauzeadecommerce374a392f | No Change | awscloudformation
Auth     | userPoolGroups            | No Change | awscloudformation
```

GraphQL Endpoint: https://woqi3tosm5a2jnj4w6zit2mfye.appsync-api.us-east-1.amazonaws.com/graphql

## Next Steps

1. ✅ Amplify Auth configured with Cognito User Pool
2. ✅ User groups created (admin, seller, user)
3. ✅ Admin user created via CLI
4. ✅ Auth integrated into UI components
5. ⏳ Test complete authentication flow end-to-end
6. ⏳ Deploy to production environment
