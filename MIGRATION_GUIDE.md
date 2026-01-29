# Supabase to AWS Amplify Migration Guide

This document outlines the changes made to migrate from Supabase to AWS Amplify.

## Files Modified

### 1. **Authentication Context** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx))
**Changes:**
- Replaced `@supabase/supabase-js` with AWS Amplify auth methods
- Changed from `session` to `currentAuthUser` for storing user information
- Updated all auth methods to use Amplify service methods
- Added `confirmSignUp` method for email verification
- Added `confirmPasswordReset` method for password reset completion

**Migration Notes:**
- `session` (Supabase) → `currentAuthUser` (Amplify)
- `verifyOTP` → `confirmSignUp`
- Database user profile fetching is now through your backend API (see `fetchUserProfile`)

### 2. **Environment Variables** ([.env](.env))
**Changes:**
```diff
- VITE_SUPABASE_URL=https://placeholder.supabase.co
- VITE_SUPABASE_ANON_KEY=placeholder_anon_key
+ VITE_AWS_REGION=us-east-1
+ VITE_AWS_USER_POOL_ID=your-user-pool-id
+ VITE_AWS_USER_POOL_CLIENT_ID=your-user-pool-client-id
+ VITE_AWS_IDENTITY_POOL_ID=your-identity-pool-id
+ VITE_API_ENDPOINT=your-api-gateway-endpoint
+ VITE_S3_BUCKET=your-s3-bucket-name
```

### 3. **New Files Created**

#### [src/lib/amplifyConfig.ts](src/lib/amplifyConfig.ts)
Initializes AWS Amplify with your Cognito configuration. This replaces the direct Supabase client setup.

#### [src/lib/amplifyAuth.ts](src/lib/amplifyAuth.ts)
Service layer for all Amplify authentication operations. Provides:
- `signup()` - Register new users
- `confirmSignUp()` - Confirm email verification
- `signin()` - Sign in users
- `signout()` - Sign out users
- `getCurrentAuthUser()` - Get current authenticated user
- `resetPassword()` - Initiate password reset
- `confirmPasswordReset()` - Complete password reset
- `getAuthSession()` - Get auth session with tokens

#### [src/lib/api.ts](src/lib/api.ts)
HTTP client for making authenticated requests to your backend API. Features:
- Automatic token injection from Amplify auth
- Support for GET, POST, PUT, DELETE, PATCH methods
- Error handling
- Usage: `api.get('/users/profile')`, `api.post('/products', { name: 'test' })`

#### [src/components/auth/AmplifyAuthComponents.tsx](src/components/auth/AmplifyAuthComponents.tsx)
Pre-built authentication components including:
- `AmplifyAuthExample` - Built-in Amplify UI (drag-and-drop)
- `CustomSignUp` - Custom sign-up form
- `CustomSignIn` - Custom sign-in form
- `PasswordReset` - Custom password reset form

## Dependencies Added

```json
{
  "aws-amplify": "^6.0.0",
  "@aws-amplify/ui-react": "^6.0.0",
  "@aws-amplify/core": "^6.0.0",
  "@aws-amplify/auth": "^6.0.0"
}
```

## Migration Checklist

- [x] Install AWS Amplify dependencies
- [x] Create Amplify configuration
- [x] Create Amplify auth service
- [x] Update AuthContext to use Amplify
- [x] Update environment variables
- [x] Create API client with auth token injection
- [ ] Update Login component to use new auth methods
- [ ] Update Signup component to use new auth methods
- [ ] Update seller authentication pages
- [ ] Update admin authentication pages
- [ ] Set up AWS Cognito User Pool
- [ ] Configure API Gateway endpoint
- [ ] Deploy backend to AWS Lambda/API Gateway
- [ ] Test all authentication flows
- [ ] Set up Amplify hosting

## Component Updates Required

### Before (Supabase)
```tsx
import { supabase } from '../lib/supabase';

const { data, error } = await supabase.auth.signUp({
  email,
  password,
});
```

### After (Amplify)
```tsx
import { useAuth } from '../contexts/AuthContext';

const { signUp } = useAuth();
const result = await signUp(email, password, 'user', fullName);
```

## Backend API Integration

### Old Supabase Pattern
```tsx
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### New Amplify Pattern
```tsx
import api from '../lib/api';

const { data } = await api.get(`/users/${userId}`);
```

## Database Migration

If you have data in Supabase:

1. Export data from Supabase:
   ```bash
   pg_dump postgres://user:password@host:5432/dbname > backup.sql
   ```

2. Set up AWS RDS or DynamoDB with same schema

3. Import data:
   ```bash
   psql postgres://user:password@host:5432/dbname < backup.sql
   ```

4. Create Lambda functions to expose data via API Gateway

## Storage Migration (S3)

### Old Pattern (Supabase Storage)
```tsx
const { data } = await supabase.storage
  .from('products')
  .upload(path, file);
```

### New Pattern (S3)
```tsx
import { uploadData } from 'aws-amplify/storage';

const result = await uploadData({
  path: 'products/' + fileName,
  data: file,
}).result;
```

## Testing Authentication

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { Login } from '../components/auth/Login';

test('login with valid credentials', async () => {
  render(
    <AuthProvider>
      <Login role="user" />
    </AuthProvider>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');
  const submitBtn = screen.getByText('Sign In');

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: "Missing Amplify configuration"
**Solution:** Make sure `.env` file has all required AWS variables and `amplifyConfig.ts` is imported in your root component.

### Issue: "CORS errors when calling API"
**Solution:** Enable CORS on your API Gateway endpoint and ensure credentials are properly sent.

### Issue: "User session not persisting"
**Solution:** Amplify stores sessions in localStorage by default. Check browser console for errors.

### Issue: "Email confirmation not working"
**Solution:** Verify your Cognito User Pool allows email as sign-in method and has an email verification message template configured.

## Next Steps

1. Create backend API endpoints using:
   - AWS Lambda functions
   - API Gateway
   - DynamoDB or RDS

2. Implement seller approval workflow

3. Set up Stripe payment integration

4. Configure multi-factor authentication (MFA)

5. Set up CI/CD with Amplify Hosting

## Resources

- [Amplify Documentation](https://docs.amplify.aws/)
- [Amplify Auth Documentation](https://docs.amplify.aws/javascript/build-a-backend/auth/set-up-auth/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
