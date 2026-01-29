# AWS Amplify Admin Dashboard Migration

## Summary
✅ **All Supabase references have been removed from the admin dashboard and replaced with AWS Amplify API calls.**

## Changes Made

### 1. Removed Supabase from Admin Dashboard
- **File**: [src/pages/admin/AdminDashboard.tsx](src/pages/admin/AdminDashboard.tsx)
- Removed: `import { supabase } from '../../lib/supabase'`
- Removed all Supabase database queries:
  - `supabase.from('users').select()`
  - `supabase.from('users').update()`
  - `supabase.from('users').delete()`

### 2. Added AWS Amplify API Endpoints
- **File**: [src/services/admin/adminApiService.ts](src/services/admin/adminApiService.ts)
- Added new endpoints:
  - `getPendingUsers()` - Fetches pending user approvals from `/admin/users/pending`
  - `approveUser(userId)` - Approves a user via `/admin/users/{userId}/approve`
  - `rejectUser(userId)` - Rejects a user via `/admin/users/{userId}/reject`
  - Updated dashboard metrics to use AWS backend

### 3. Updated Admin Dashboard Component
- **File**: [src/pages/admin/AdminDashboard.tsx](src/pages/admin/AdminDashboard.tsx)
- Now uses `getPendingUsers()`, `approveUser()`, `rejectUser()`, and `getDashboardMetrics()`
- All data fetching uses AWS Amplify REST API with JWT authentication
- Dashboard metrics now display:
  - Total Users
  - Total Products
  - Ongoing Orders

### 4. Backend Integration
- All API calls use the centralized `APIClient` from [src/lib/api.ts](src/lib/api.ts)
- JWT tokens from AWS Amplify are automatically included in request headers
- API endpoint base URL configured via `VITE_API_ENDPOINT` environment variable

## Environment Variables Required
```
VITE_API_ENDPOINT=https://your-aws-backend-api.com
```

## Architecture
```
AdminDashboard.tsx
    ↓
adminApiService.ts (getPendingUsers, approveUser, rejectUser, getDashboardMetrics)
    ↓
APIClient (src/lib/api.ts)
    ↓
AWS Amplify Auth (JWT)
    ↓
Backend REST API
```

## No More Supabase
- ❌ Removed: [src/lib/supabase.ts](src/lib/supabase.ts) (no longer imported)
- ❌ Removed: `@supabase/supabase-js` dependency can be removed from package.json if not used elsewhere
- ✅ All admin features now use AWS Amplify + REST API

## Testing
To test the admin dashboard:
1. Ensure your AWS backend is running and accessible at `VITE_API_ENDPOINT`
2. Ensure the following endpoints exist:
   - `GET /admin/users/pending`
   - `POST /admin/users/{userId}/approve`
   - `POST /admin/users/{userId}/reject`
   - `GET /admin/dashboard/metrics`
3. Login with an admin account
4. Navigate to the Admin Dashboard to see pending users and metrics

## Next Steps
- Deploy your AWS backend with the required admin endpoints
- Configure `VITE_API_ENDPOINT` in your deployment environment
- Test all admin operations (approve, reject users, view metrics)
- Remove unused Supabase environment variables from your configuration
