# User Authentication Flow Documentation

## **USER LOGIN** (`/login`)

**Frontend:** [src/components/auth/Login.tsx](src/components/auth/Login.tsx)
- Email + password form
- Calls `signIn(email, password)` from AuthContext
- On success: redirects to `/` (homepage)
- Error handling for invalid credentials

**Backend flow:**
1. User clicks "Sign in"
2. `AuthContext.signIn()` → calls `amplifyAuthService.signin()`
3. `amplifyAuthService.signin()` → AWS Amplify `signIn()` with email + password
4. Cognito validates against User Pool
5. Returns `{isSignedIn, nextStep}`
6. AuthContext calls `resolveRoleFromSession()` to decode JWT and extract role from `cognito:groups`
7. Calls `fetchUserProfile()` to get `/users/{userId}` (fails silently if `VITE_API_ENDPOINT` not set)
8. Returns `{success, role}`

**Navigation:**
- Login success → `/` (always)
- ProtectedSellerRoute checks `authRole` to redirect admins/sellers to `/seller/dashboard`

---

## **USER SIGNUP** (`/signup`)

**Frontend:** [src/components/auth/Signup.tsx](src/components/auth/Signup.tsx)
- **Step 1 - Details:** Name + email + password + country (dropdown, fetches from GraphQL `listCountryListBzdcores`)
- **Step 2 - OTP:** Cognito sends 6-digit code to email, user enters it
- **Step 3 - Success:** Shows success message, auto-redirects to `/`

**Backend flow:**
1. User submits form (Step 1)
2. `AuthContext.signUp()` → calls `amplifyAuthService.signup()`
3. `amplifyAuthService.signup()` builds `userAttributes`:
   - `email`, `name`, ~~`phone_number`~~ (only for sellers)
4. Calls AWS Amplify `signUp()` with `autoSignIn: true`
5. Cognito sends OTP to email
6. Returns `{userId, isSignUpComplete, nextStep}`
7. Frontend stores email in `sessionStorage.setItem('signupEmail', email)`
8. User enters OTP (Step 2)
9. Calls `AuthContext.confirmSignUp()` → `amplifyAuthService.confirmSignUp()`
10. Amplify `confirmSignUp()` validates OTP
11. If valid, calls `autoSignIn()` to auto-login user
12. Cognito creates user in pool, sends to `user` group (**Lambda trigger runs here but currently only logs**)
13. Returns `{isSignUpComplete, nextStep}`
14. Frontend shows success, auto-redirects to `/` (Step 3)

**Role assignment:**
- **Current state:** No role assigned automatically (Lambda post-confirmation broken)
- User created in Cognito but **NOT added to `user` group**
- Role only resolves if manually added to group or from JWT `custom:role` attribute

**Navigation:**
- Signup success → `/` (homepage)

---

## **USER FORGOT PASSWORD** (`/forgot-password`)

**Frontend:** [src/pages/user/ForgotPassword.tsx](src/pages/user/ForgotPassword.tsx)
- **Step 1 - Email:** Enter email, calls `resetPassword(email)`
- **Step 2 - OTP:** Cognito sends code, user enters 6 digits
- **Step 3 - New Password:** Enter new password (8+ chars, uppercase, lowercase, numeric, special char)
- **Step 4 - Success:** Shows success message

**Backend flow:**
1. User enters email (Step 1)
2. `AuthContext.resetPassword()` → calls `amplifyAuthService.initiatePasswordReset()`
3. Amplify `resetPassword()` initiates Cognito forgot password flow
4. Cognito sends OTP to user's email
5. Returns `{nextStep}`
6. User enters OTP (Step 2), moves to password step
7. User enters new password (Step 3)
8. Calls `AuthContext.confirmPasswordReset(email, otp, newPassword)`
9. Amplify `confirmResetPassword()` validates OTP + sets new password
10. On success → shows success screen (Step 4)

**Navigation:**
- Success → shows "Back to Login" link
- Can go back to login at any step

---

## **AUTH FLOW DIAGRAM (USER)**

```
User visits /signup
    ↓
Signup form (name, email, password, country)
    ↓
signUp(email, password, role='user', name, currency)
    ↓
AWS Amplify signUp() → Cognito User Pool
    ↓
Cognito creates UNCONFIRMED user, sends OTP to email
    ↓
User enters OTP
    ↓
confirmSignUp(email, otp)
    ↓
AWS Amplify confirmSignUp() → Cognito validates
    ↓
autoSignIn() triggered → User auto-logged in
    ↓
[LAMBDA TRIGGER SHOULD RUN HERE - adds user to 'user' group]
    ↓
Success! User now in Cognito + signed in
    ↓
Redirect to / (homepage)

---

User visits /login
    ↓
Login form (email, password)
    ↓
signIn(email, password)
    ↓
AWS Amplify signIn() → Cognito validates credentials
    ↓
Success, returns {isSignedIn: true}
    ↓
resolveRoleFromSession() → decode JWT, check cognito:groups
    ↓
fetchUserProfile() → GET /users/{userId} (fails if no API)
    ↓
Return {success, role}
    ↓
Redirect to / (homepage)

---

User visits /forgot-password
    ↓
Enter email
    ↓
resetPassword(email)
    ↓
AWS Amplify resetPassword() → Cognito sends OTP
    ↓
User enters OTP (not validated at this step)
    ↓
User enters new password
    ↓
confirmPasswordReset(email, otp, newPassword)
    ↓
AWS Amplify confirmResetPassword() → validates OTP + sets password
    ↓
Success! Password reset
```

---

## **KEY ISSUES**

❌ **User group assignment broken:**
- Lambda post-confirmation supposed to add users to `user` group
- Currently only logs (no Cognito SDK working)
- Users created but NO role assigned
- JWT `cognito:groups` will be empty

❌ **User profile fetch fails:**
- `VITE_API_ENDPOINT` not configured in frontend
- `fetchUserProfile()` silently fails
- Role only from JWT (empty if Lambda doesn't assign group)

✅ **What works:**
- Cognito user creation ✓
- Email verification (OTP) ✓
- Auto-login after signup ✓
- Password reset flow ✓
- Login with credentials ✓

---

## **COMPONENTS INVOLVED**

| File | Role |
|------|------|
| [src/components/auth/Login.tsx](src/components/auth/Login.tsx) | User login UI |
| [src/components/auth/Signup.tsx](src/components/auth/Signup.tsx) | User signup UI |
| [src/pages/user/ForgotPassword.tsx](src/pages/user/ForgotPassword.tsx) | User forgot password UI |
| [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) | Auth state + role resolution |
| [src/lib/amplifyAuth.ts](src/lib/amplifyAuth.ts) | Amplify auth service wrapper |
| [src/lib/amplifyConfig.ts](src/lib/amplifyConfig.ts) | Cognito credentials |
| [src/App.tsx](src/App.tsx) | Route definitions |

---

## **SUMMARY**

User auth works end-to-end but **no role is assigned** because the Lambda trigger is broken. Users get created and can login but have no `user` group membership.

---

# Seller Authentication Flow Documentation

## **SELLER LOGIN** (`/seller/login`)

**Frontend:** [src/pages/seller/SellerLogin.tsx](src/pages/seller/SellerLogin.tsx)
- Email + password form (same as user login)
- Calls `signIn(email, password)` from AuthContext
- **Role-based routing:**
  - If `role === 'admin'` → redirects to `/admin`
  - If `role === 'seller'` → redirects to `/seller/dashboard`
  - If no role → redirects to `/` (homepage)
- Error handling for invalid credentials

**Backend flow:**
1. User clicks "Sign in"
2. `AuthContext.signIn()` → calls `amplifyAuthService.signin()`
3. Amplify `signIn()` validates email + password against Cognito
4. Returns `{isSignedIn, nextStep}`
5. AuthContext calls `resolveRoleFromSession()` to decode JWT and extract role from `cognito:groups`
6. Calls `fetchUserProfile()` (fails silently if no API)
7. **CRITICAL:** Role resolution from JWT `cognito:groups` - **EMPTY if Lambda didn't assign seller group**
8. Returns `{success, role}`

**Key difference from user login:**
- Uses role to route to `/seller/dashboard` or `/admin` instead of always to `/`
- Checks for both `seller` and `admin` roles

**Navigation:**
- Admin → `/admin`
- Seller → `/seller/dashboard`
- No role → `/` (fallback)

---

## **SELLER SIGNUP** (`/seller/signup`)

**Frontend:** [src/pages/seller/SellerSignup.tsx](src/pages/seller/SellerSignup.tsx)
- **Step 1 - Details:** 
  - Full name
  - Email
  - Password (8-16 chars, uppercase, lowercase, number, special char)
  - Country (dropdown, fetches from GraphQL)
  - Business type (dropdown, fetches from GraphQL)
  - Mobile number (with country dial code prefix)
- **Step 2 - OTP:** 6-digit code verification
- **Step 3 - Success:** Success message, auto-redirects to `/seller/dashboard`

**Backend flow:**
1. User submits form (Step 1)
2. Builds phone number: `${selectedCountry.dialCode}${formData.mobile}`
3. `AuthContext.signUp()` → calls `amplifyAuthService.signup()`
4. `amplifyAuthService.signup()` builds `userAttributes`:
   - `email`, `name`, `phone_number` (**INCLUDES phone for sellers**)
5. Calls AWS Amplify `signUp()` with `autoSignIn: true`
6. Cognito sends OTP to email
7. Frontend stores email in `sessionStorage.setItem('sellerSignupEmail', email)`
8. User enters OTP (Step 2)
9. Calls `AuthContext.confirmSignUp()` → `amplifyAuthService.confirmSignUp()`
10. Amplify `confirmSignUp()` validates OTP
11. Calls `autoSignIn()` to auto-login
12. **[LAMBDA TRIGGER RUNS HERE]** Should add user to `seller` group (because `phone_number` is set)
13. Returns `{isSignUpComplete, nextStep}`
14. Frontend shows success (Step 3), auto-redirects to `/seller/dashboard`

**Key difference from user signup:**
- Includes `phone_number` in signup → Lambda should detect and assign `seller` group
- Redirects to `/seller/dashboard` instead of `/`
- More form fields (business type, mobile, country)
- Better password validation UI (shows error list)

**Role assignment:**
- **Current state:** Lambda broken, seller NOT added to group automatically
- Seller created in Cognito but **NO group membership**
- Must manually add to `seller` group via AWS CLI

**Navigation:**
- Signup success → `/seller/dashboard` (after 2 second delay)

---

## **SELLER FORGOT PASSWORD** (`/seller/forgot-password`)

**Frontend:** [src/pages/seller/SellerForgotPassword.tsx](src/pages/seller/SellerForgotPassword.tsx)
- **Step 1 - Email:** Enter email, calls reset
- **Step 2 - OTP:** Cognito sends code, user enters 6 digits
- **Step 3 - New Password:** Enter new password (6+ chars minimum)
- **Step 4 - Success:** Success message with "Continue to Login" button

**Backend flow:**
1. User enters email (Step 1)
2. **SIMULATED** `await new Promise((r) => setTimeout(r, 1500))` - **NO REAL COGNITO CALL**
3. Frontend moves to OTP step
4. **SIMULATED** OTP verification - **NO REAL COGNITO CALL**
5. Frontend moves to password step
6. User enters new password (Step 3)
7. **SIMULATED** password reset - **NO REAL COGNITO CALL**
8. Shows success (Step 4)
9. "Continue to Login" button → `/seller/login`

**🔴 CRITICAL ISSUE:**
- **SellerForgotPassword uses ONLY fake timeouts, NO Cognito integration**
- Compares to UserForgotPassword which uses real `resetPassword()` and `confirmPasswordReset()`
- Sellers cannot actually reset their password via this flow
- All steps are UI-only simulations

**Navigation:**
- Success → `/seller/login` (via button click)

---

## **COMPARISON TABLE**

| Feature | User | Seller |
|---------|------|--------|
| **Login redirect** | Always `/` | `/seller/dashboard` or `/admin` based on role |
| **Signup form fields** | name, email, password, country | name, email, password, country, business type, mobile |
| **Phone number in signup** | ❌ No | ✅ Yes (formatted with dial code) |
| **Lambda group assignment** | Should add to `user` | Should add to `seller` |
| **Forgot password** | ✅ Real Cognito calls | ❌ Simulated only, no real calls |
| **Redirect after signup** | `/` | `/seller/dashboard` |

---

## **KEY ISSUES - SELLER AUTH**

❌ **Lambda post-confirmation broken:**
- Seller signup should add to `seller` group (phone_number is passed)
- Currently only logs, doesn't actually assign group
- Sellers created but NO `seller` group membership
- Role resolution fails, seller sees homepage instead of dashboard

❌ **Forgot password completely broken:**
- SellerForgotPassword uses fake `setTimeout()` only
- No actual Cognito calls
- Sellers CANNOT reset passwords
- Compare to UserForgotPassword which works (uses real API)

❌ **Role-based routing on login fails:**
- Tries to check `role === 'seller'`
- Role is empty because Lambda didn't add group
- Falls back to `/` (homepage)

✅ **What works:**
- Cognito user creation ✓
- Email verification (OTP) ✓
- Auto-login after signup ✓
- Login with credentials ✓
- Form validation ✓

---

## **SELLER COMPONENTS**

| File | Status |
|------|--------|
| [src/pages/seller/SellerLogin.tsx](src/pages/seller/SellerLogin.tsx) | ✅ Frontend OK, backend role detection fails |
| [src/pages/seller/SellerSignup.tsx](src/pages/seller/SellerSignup.tsx) | ✅ Frontend OK, Lambda trigger broken |
| [src/pages/seller/SellerForgotPassword.tsx](src/pages/seller/SellerForgotPassword.tsx) | ❌ **Completely simulated, no real backend** |

---

## **OVERALL SUMMARY**

**User auth:** Works end-to-end but no role assigned (Lambda broken). Users created, can login, but NO `user` group.

**Seller auth:** Works partially. Seller signup creates users, but Lambda doesn't assign `seller` group. Seller login fails role detection. Seller forgot password is completely fake.

---

# Admin Authentication Documentation

## **ADMIN CREATION (CLI ONLY)**

**No UI signup/login for creation.** Admin accounts are created exclusively via AWS CLI:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username admin@example.com \
  --user-attributes Name=email,Value=admin@example.com Name=name,Value="Admin Name" \
  --region us-east-1 --message-action SUPPRESS

aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_PPPmNH7HL \
  --username admin@example.com \
  --group-name admin \
  --region us-east-1
```

**Why CLI only:**
- Admins are high-privilege accounts
- Should only be created by system administrators
- No self-signup to prevent unauthorized admin creation

---

## **ADMIN LOGIN** (`/seller/login` → `/admin`)

**Frontend:** [src/pages/seller/SellerLogin.tsx](src/pages/seller/SellerLogin.tsx)
- **No separate admin login page**
- `/admin/login` redirects to `/seller/login` (same form as sellers)
- Admin enters email + password created via CLI
- **Role-based routing after login:**
  - If `role === 'admin'` → redirects to `/admin`
  - If `role === 'seller'` → redirects to `/seller/dashboard`
  - If no role → redirects to `/` (homepage)

**Backend flow:**
1. Admin enters email + password in SellerLogin
2. `signIn(email, password)` calls AWS Amplify
3. Amplify authenticates against Cognito User Pool
4. Returns `{isSignedIn, nextStep}`
5. AuthContext calls `resolveRoleFromSession()`:
   - Decodes JWT token
   - Checks `cognito:groups` claim for roles
   - Looks for `'admin'` group membership ✓ (added via CLI)
6. Returns `{success, role: 'admin'}`
7. SellerLogin checks: `if (role === 'admin')`
8. Navigates to `/admin` dashboard

**Navigation:**
- Successful admin login → `/admin`
- Admin JWT contains `cognito:groups: ['admin']`

---

## **ADMIN DASHBOARD & LAYOUT**

**Layout Component:** [src/pages/admin/AdminLayout.tsx](src/pages/admin/AdminLayout.tsx)
- Protected route that checks: `effectiveRole === 'admin'`
- If not admin → redirects to `/` (homepage)
- Renders two-part layout:
  - Fixed header (AdminHeader)
  - Responsive sidebar (AdminSidebar)
  - Main content area (Outlet)

**Header Component:** [src/pages/admin/components/AdminHeader.tsx](src/pages/admin/components/AdminHeader.tsx)
- Shows admin name (from `user.full_name` or `currentAuthUser.username`)
- Shows admin ID
- Logout button with confirmation dialog
- Mobile hamburger menu

**Logout flow:**
1. Click logout button
2. Confirmation dialog: "Are you sure?"
3. Click "Logout"
4. Calls `signOut()` from Amplify
5. Clears Cognito session
6. Redirects to `/seller/login`

---

## **ADMIN NAVIGATION - SIDEBAR MENU**

**Sidebar Component:** [src/pages/admin/components/AdminSidebar.tsx](src/pages/admin/components/AdminSidebar.tsx)

**15 Admin Menu Items:**

| # | Menu Item | Route | Component |
|---|-----------|-------|-----------|
| 1 | Dashboard | `/admin` | AdminOverview |
| 2 | Users | `/admin/users` | UserManagement |
| 3 | Sellers | `/admin/sellers` | SellerManagement |
| 4 | Products | `/admin/products` | ProductManagement |
| 5 | Orders | `/admin/orders` | OrderManagement |
| 6 | Categories | `/admin/categories` | CategoryManagement |
| 7 | Banners | `/admin/banners` | BannerManagement |
| 8 | Promotions | `/admin/promotions` | PromotionManagement |
| 9 | Reviews | `/admin/reviews` | ReviewManagement |
| 10 | Complaints | `/admin/complaints` | ComplaintManagement |
| 11 | Accounts | `/admin/accounts` | AccountsManagement |
| 12 | Reports | `/admin/reports` | ReportsManagement |
| 13 | Admin Management | `/admin/admins` | AdminManagement |
| 14 | Profile | `/admin/profile` | ProfilePage |
| 15 | Settings | `/admin/settings` | SettingsPage |

**Features:**
- All routes protected by AdminLayout (role check)
- Highlights current active route
- Responsive: collapses on mobile, toggle via hamburger
- Each menu item navigates to respective admin module

**Admin Overview Dashboard:**
- Shows business metrics:
  - Total sales, expenses, products, users, sellers
  - Bookings, ongoing orders, returns/cancellations
  - User/seller registrations (this month)
  - Prime members count
  - Top movement categories
  - Top sellers

---

## **ADMIN FORGOT PASSWORD**

**No UI needed.**

**Why:**
- Admin created via CLI only (not through signup)
- Admin password is set during CLI creation
- If admin forgets password:
  1. System admin resets via AWS CLI: 
     ```bash
     aws cognito-idp admin-set-user-password \
       --user-pool-id us-east-1_PPPmNH7HL \
       --username admin@example.com \
       --password NewPassword123! \
       --permanent \
       --region us-east-1
     ```
  2. Or admin-reset-user-password (temporary password sent to email)
- No self-service forgot password UI required

---

## **ADMIN ROUTES**

**All routes protected by AdminLayout in [src/App.tsx](src/App.tsx):**
```tsx
<Route element={<AdminLayout />}>
  <Route path="/admin" element={<AdminOverview />} />
  <Route path="/admin/users" element={<UserManagement />} />
  <Route path="/admin/sellers" element={<SellerManagement />} />
  ... (15 routes total)
</Route>
```

**Routing redirects:**
- `/admin/login` → `/seller/login` (no separate admin login page)
- `/admin/signup` → `/seller/login` (no admin signup)

---

## **ADMIN COMPONENTS**

| File | Purpose |
|------|---------|
| [src/pages/admin/AdminLayout.tsx](src/pages/admin/AdminLayout.tsx) | Main layout wrapper, role protection |
| [src/pages/admin/components/AdminHeader.tsx](src/pages/admin/components/AdminHeader.tsx) | Top header with admin info + logout |
| [src/pages/admin/components/AdminSidebar.tsx](src/pages/admin/components/AdminSidebar.tsx) | Navigation menu (15 items) |
| [src/pages/admin/modules/AdminOverview.tsx](src/pages/admin/modules/AdminOverview.tsx) | Dashboard with metrics |
| [src/pages/admin/modules/\*Management.tsx](src/pages/admin/modules/) | 14 other admin modules |

---

## **ADMIN FLOW DIAGRAM**

```
System Admin runs CLI
    ↓
aws cognito-idp admin-create-user (creates account)
    ↓
aws cognito-idp admin-add-user-to-group (adds to 'admin' group)
    ↓
Admin visits /seller/login (or /admin/login)
    ↓
Enters email + password (from CLI creation)
    ↓
signIn() → Cognito authenticates
    ↓
JWT decoded, 'admin' found in cognito:groups
    ↓
authRole = 'admin'
    ↓
SellerLogin checks: if (role === 'admin')
    ↓
Navigate to /admin
    ↓
AdminLayout verifies: role === 'admin' ✓
    ↓
Renders layout + sidebar + content
    ↓
Admin can navigate via 15 menu items
    ↓
Click logout → redirects to /seller/login
    ↓
Session cleared
```

---

## **KEY POINTS**

✅ **Admin authentication works perfectly:**
- CLI creation + group assignment ✓
- Login detects role from Cognito group ✓
- Routes to `/admin` correctly ✓
- Dashboard and sidebar navigation fully functional ✓
- Logout works ✓

✅ **Security by design:**
- No self-signup (prevents unauthorized admin creation)
- CLI-only creation (requires AWS access)
- Protected routes check role === 'admin'
- Password reset via CLI only (no self-service UI)

✅ **No forgot password UI needed:**
- Admin is CLI-created account
- System admin can reset via AWS CLI anytime
- No user-facing forgot password required

---

## **ADMIN AUTHENTICATION SUMMARY**

Admin authentication is **simple and secure:**
1. Create admin account via AWS CLI
2. Add to `admin` Cognito group
3. Admin logs in via `/seller/login` (shared form)
4. Role detected from JWT `cognito:groups`
5. Routed to `/admin` dashboard
6. Full navigation + access to 15 admin modules
7. Logout redirects to `/seller/login`
8. Password reset via CLI only (no UI needed)
