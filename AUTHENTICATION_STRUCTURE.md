# Authentication & Authorization Structure

## Overview
This document describes the authentication and authorization structure of the Beauzead E-commerce application.

## User Roles

### 1. **Guest User**
- Can access:
  - Home page (/)
  - Product details page (/products/:productId)
  - Category products page (/category/:categoryId)
  - Seller landing page (/seller)
  - Legal pages (Privacy Policy, Terms of Service, Shipping Policy, Refund Policy)
  - Authentication pages (Login, Signup, OTP Verification, Password Reset)

### 2. **User Role**
- Can access all Guest User pages plus:
  - Profile (/profile)
  - Cart (/cart)
  - Wishlist (/wishlist)
  - My Orders (/orders, /orders/:orderId)
  - Notifications (/notifications)
  - Settings (/settings)
  - Address Management (/user/addresses)
  - Checkout (/checkout)
  - Write Reviews (/products/:productId/review)

### 3. **Seller Role**
- Can access:
  - Seller landing page (/seller) - as guest when logged out
  - Seller authentication pages (/seller/login, /seller/signup, /seller/forgot-password)
  - Seller Dashboard (/seller/dashboard)
  - Seller Profile (/seller/profile)
  - Analytics (/seller/analytics)
  - All seller-specific features

### 4. **Admin Role**
- Can access:
  - All Admin Dashboard routes (/admin/*)
  - All Seller Dashboard routes (admin can impersonate seller functionality)
  - Seller landing page (/seller) - as guest when logged out

## Logout Behavior

### User Logout
- Redirects to: **Home page (/)** as a guest user
- Clears all authentication state
- Clears localStorage and sessionStorage

### Seller Logout
- Redirects to: **Seller Landing page (/seller)** as a guest user
- Clears all authentication state
- Clears localStorage and sessionStorage
- User can view seller landing page but cannot access dashboard without logging in

### Admin Logout
- Redirects to: **Seller Landing page (/seller)** as a guest user
- Clears all authentication state
- Clears localStorage and sessionStorage
- Admin cannot access admin dashboard without logging in

## Route Protection

The `RouteGuard` component in App.tsx enforces role-based access control:

### Admin Routes
- Protected by: Admin role only
- Redirects unauthorized users to: /seller
- Routes: /admin/*

### Seller Routes
- Protected by: Seller or Admin roles
- Redirects unauthorized users to: /seller/login
- Routes: /seller/dashboard, /seller/products, /seller/orders, /seller/wallet, /seller/analytics, /seller/profile

### User Routes
- Protected by: User role only
- Redirects unauthorized users to: /login
- Routes: /orders, /profile, /wishlist, /cart, /checkout, /settings, /notifications, /user/*

### Public Routes
- No authentication required
- Routes: /, /products/:productId, /category/:categoryId, /seller, /privacy-policy, /terms-of-service, /shipping-policy, /refund-policy
- Authentication pages: /login, /signup, /seller/login, /seller/signup, /forgot-password, /seller/forgot-password

## File Structure

### Core Files Modified
1. **src/contexts/AuthContext.tsx**
   - Enhanced `signOut()` to return the role before logout
   - Added comprehensive state clearing (localStorage, sessionStorage)

2. **src/App.tsx**
   - Updated RouteGuard with comprehensive role-based access control
   - Added Checkout route
   - Replaced inline SellerDashboard with SellerDashboardWrapper

3. **src/components/layout/Header.tsx**
   - Updated `handleSignOut()` to redirect based on user role
   - Admin/Seller → /seller
   - User → /

4. **src/pages/admin/components/AdminHeader.tsx**
   - Updated to use AuthContext instead of direct AWS Amplify
   - Logout redirects to /seller

5. **src/pages/seller/SellerDashboardWrapper.tsx** (New)
   - Wrapper component that integrates SellerDashboard with AuthContext
   - Handles logout navigation correctly

## Cleanup Completed

### Deleted Files
- BACKEND_CHECKLIST.md
- CATEGORIES_IMPLEMENTATION.md
- Important.md
- importantinput.md
- awscliv2.zip
- Junk files with unusual names
- .trigger-build

### Unused Pages Identified
- OrderTracking.tsx (not imported anywhere, can be safely deleted if confirmed)

## Testing Checklist

- [ ] Guest user can browse home page and product pages
- [ ] User can login and access user-specific pages
- [ ] User logout redirects to home page
- [ ] Seller can login and access seller dashboard
- [ ] Seller logout redirects to seller landing page
- [ ] Admin can login and access admin dashboard
- [ ] Admin logout redirects to seller landing page
- [ ] Unauthorized role access is blocked and redirected appropriately
- [ ] Checkout page is accessible for logged-in users
- [ ] Cart and Wishlist are protected routes

