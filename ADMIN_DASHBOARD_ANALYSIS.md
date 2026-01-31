# Admin Dashboard Architecture Analysis

## Current UI Dashboard Overview

### ✅ Displayed Metrics (Screenshot)
1. **Business Metrics** (8 cards):
   - Total Sales: $0
   - Total Expenses: $0
   - Total Products: 0
   - Total Users: 0
   - Total Sellers: 0
   - Total Bookings: 0
   - Ongoing Orders: 0
   - Returns & Cancellations: 0

2. **User & Seller Stats** (3 cards):
   - User Registrations (This Month): 0
   - Prime Members: 0
   - Seller Registrations (This Month): 0

3. **Top Movement Categories**:
   - Category list with "Active" status badges
   - Shows top 5 categories by movement

4. **Top Sellers (by Revenue)**:
   - Table with: Shop Name | Badge | Revenue | Orders
   - Badges: Standard | Gold | Platinum
   - Shows top 5 sellers

---

## Backend API Endpoints Required

### 1. DASHBOARD ENDPOINTS

#### `/admin/dashboard/metrics` (GET)
**Purpose**: Fetch all business metrics for overview page
**Response Type**: `DashboardData`
**Data Fields**:
```typescript
{
  metrics: {
    total_sales: number,
    total_expenses: number,
    total_products: number,
    total_users: number,
    total_sellers: number,
    total_bookings: number,
    ongoing_orders: number,
    returns_cancellations: number
  },
  top_categories: Category[],
  top_sellers: Seller[],
  user_registrations: number,
  prime_members: number,
  seller_registrations: number
}
```

### 2. USER MANAGEMENT ENDPOINTS

#### `/admin/users` (GET)
**Parameters**: 
- `page` (number, optional)
- `limit` (number, optional)
- `search` (string, optional)
- `profile_type` (string, optional - 'member' | 'prime')

**Response**: 
```typescript
{
  users: User[],
  total: number
}
```

#### `/admin/users/{userId}/approve` (POST)
**Response**: `User`

#### `/admin/users/{userId}/reject` (POST)
**Response**: `boolean`

#### `/admin/users/{userId}/ban` (POST)
**Response**: `boolean`

#### `/admin/users/{userId}/unban` (POST)
**Response**: `boolean`

#### `/admin/users/{userId}` (DELETE)
**Response**: `boolean`

---

### 3. PRODUCT MANAGEMENT ENDPOINTS

#### `/admin/products` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `search` (string, optional)
- `approval_status` (string, optional - 'pending' | 'approved' | 'rejected')
- `category_id` (string, optional)

**Response**:
```typescript
{
  products: Product[],
  total: number
}
```

#### `/admin/products/{productId}/approve` (POST)
**Response**: `boolean`

#### `/admin/products/{productId}/reject` (POST)
**Response**: `boolean`

#### `/admin/products/{productId}/toggle` (POST)
**Response**: `Product`

#### `/admin/products/{productId}` (GET)
**Response**: `Product`

---

### 4. ORDER MANAGEMENT ENDPOINTS

#### `/admin/orders` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `status` (string, optional - 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'returned')

**Response**:
```typescript
{
  orders: Order[],
  total: number
}
```

#### `/admin/orders/{orderId}/status` (PUT)
**Body**: `{ status: string }`
**Response**: `Order`

#### `/admin/orders/{orderId}/refund` (POST)
**Body**: `{ amount: number }`
**Response**: `boolean`

#### `/admin/orders/{orderId}` (GET)
**Response**: `Order` (with full details including items)

---

### 5. SELLER MANAGEMENT ENDPOINTS

#### `/admin/sellers` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `search` (string, optional)
- `kyc_status` (string, optional - 'pending' | 'approved' | 'rejected')

**Response**:
```typescript
{
  sellers: Seller[],
  total: number
}
```

#### `/admin/sellers/{sellerId}/approve` (POST)
**Response**: `boolean`

#### `/admin/sellers/{sellerId}/reject` (POST)
**Response**: `boolean`

#### `/admin/sellers/{sellerId}/badge` (PUT)
**Body**: `{ badge: 'silver' | 'gold' | 'platinum' }`
**Response**: `Seller`

#### `/admin/sellers/{sellerId}` (GET)
**Response**: `Seller` (with full details)

---

### 6. CATEGORY MANAGEMENT ENDPOINTS

#### `/admin/categories` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)

**Response**:
```typescript
{
  categories: Category[],
  total: number
}
```

#### `/admin/categories` (POST)
**Body**: 
```typescript
{
  name: string,
  description?: string,
  image_url?: string
}
```
**Response**: `Category`

#### `/admin/categories/{categoryId}` (PUT)
**Body**: `Partial<Category>`
**Response**: `Category`

#### `/admin/categories/{categoryId}` (DELETE)
**Response**: `boolean`

#### `/admin/categories/{categoryId}/toggle` (POST)
**Response**: `Category`

---

### 7. BANNER MANAGEMENT ENDPOINTS

#### `/admin/banners` (GET)
**Response**: `Banner[]`

#### `/admin/banners` (POST)
**Body**:
```typescript
{
  title: string,
  image_url: string,
  link?: string,
  position: number
}
```
**Response**: `Banner`

#### `/admin/banners/{bannerId}` (PUT)
**Body**: `Partial<Banner>`
**Response**: `Banner`

#### `/admin/banners/{bannerId}` (DELETE)
**Response**: `boolean`

#### `/admin/banners/{bannerId}/toggle` (POST)
**Response**: `Banner`

---

### 8. PROMOTION MANAGEMENT ENDPOINTS

#### `/admin/promotions` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `status` (string, optional)

**Response**:
```typescript
{
  promotions: Promotion[],
  total: number
}
```

#### `/admin/promotions` (POST)
**Body**: `Partial<Promotion>`
**Response**: `Promotion`

#### `/admin/promotions/{promotionId}` (PUT)
**Body**: `Partial<Promotion>`
**Response**: `Promotion`

#### `/admin/promotions/{promotionId}` (DELETE)
**Response**: `boolean`

---

### 9. REVIEW MANAGEMENT ENDPOINTS

#### `/admin/reviews` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `status` (string, optional - 'flagged' | 'verified' | 'all')

**Response**:
```typescript
{
  reviews: Review[],
  total: number
}
```

#### `/admin/reviews/{reviewId}/flag` (POST)
**Response**: `boolean`

#### `/admin/reviews/{reviewId}/unflag` (POST)
**Response**: `boolean`

#### `/admin/reviews/{reviewId}` (DELETE)
**Response**: `boolean`

---

### 10. COMPLAINT MANAGEMENT ENDPOINTS

#### `/admin/complaints` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `status` (string, optional - 'open' | 'in_progress' | 'resolved' | 'closed')

**Response**:
```typescript
{
  complaints: Complaint[],
  total: number
}
```

#### `/admin/complaints/{complaintId}/status` (PUT)
**Body**: `{ status: string }`
**Response**: `Complaint`

#### `/admin/complaints/{complaintId}/assign` (POST)
**Body**: `{ admin_id: string }`
**Response**: `Complaint`

---

### 11. ACCOUNTS MANAGEMENT ENDPOINTS

#### `/admin/accounts/summary` (GET)
**Response**: `AccountSummary`

#### `/admin/accounts/daybook` (GET)
**Parameters**:
- `date_from` (string, optional)
- `date_to` (string, optional)

**Response**: `DaybookEntry[]`

#### `/admin/accounts/bankbook` (GET)
**Response**: `BankBookEntry[]`

#### `/admin/accounts/expense` (POST)
**Body**:
```typescript
{
  date: string,
  amount: number,
  category: string,
  description?: string,
  vendor?: string
}
```
**Response**: `ExpenseEntry`

---

### 12. ADMIN MANAGEMENT ENDPOINTS

#### `/admin/admins` (GET)
**Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `search` (string, optional)

**Response**:
```typescript
{
  admins: Admin[],
  total: number
}
```

#### `/admin/admins` (POST)
**Body**: `Partial<Admin>`
**Response**: `Admin`

#### `/admin/admins/{adminId}` (PUT)
**Body**: `Partial<Admin>`
**Response**: `Admin`

#### `/admin/admins/{adminId}` (DELETE)
**Response**: `boolean`

#### `/admin/profile` (GET)
**Response**: `Admin`

---

### 13. REPORTS ENDPOINTS

#### `/admin/reports/sales` (GET)
**Parameters**:
- `period` (string, optional - 'daily' | 'weekly' | 'monthly')
- `date_from` (string, optional)
- `date_to` (string, optional)

**Response**: Report data with trends

#### `/admin/reports/users` (GET)
**Response**: User analytics and growth data

#### `/admin/reports/sellers` (GET)
**Response**: Seller performance analytics

---

## Database Tables Required

### Core Tables (GraphQL)
1. **Users** - User profiles and accounts
2. **Sellers** - Seller shop information
3. **Products** - Product listings
4. **Orders** - Order records
5. **OrderItems** - Order line items
6. **Categories** - Product categories
7. **Banners** - Homepage banners
8. **Promotions** - Discounts and promotions
9. **Reviews** - Product reviews
10. **Complaints** - Customer complaints
11. **Admins** - Admin user accounts

### Accounting Tables
12. **DaybookEntries** - Daily transactions
13. **BankbookEntries** - Bank reconciliation
14. **ExpenseEntries** - Expense tracking
15. **AccountHeads** - Chart of accounts
16. **SellerPayouts** - Seller payment records

### Configuration Tables
17. **MembershipPlans** - Prime membership plans
18. **TaxRules** - Tax configuration by region
19. **PlatformCosts** - Fixed platform costs

---

## Realtime Updates Strategy

### Option 1: WebSocket (Recommended for real-time dashboards)
- Use AWS AppSync subscriptions
- Subscribe to metrics updates
- Live metric counters on dashboard

### Option 2: Polling with Caching
- Fetch every 30-60 seconds
- Cache results in React state
- Refresh on user action

### Option 3: Event-Driven (Best for events)
- Use AWS EventBridge
- Lambda functions trigger on events
- Update metrics asynchronously

---

## Frontend Module Structure

### Current Modules Implemented:
✅ AdminOverview.tsx - Dashboard with metrics (ERROR: metrics loading failing)
✅ UserManagement.tsx - User list, ban/unban, delete
✅ ProductManagement.tsx - Product approval, toggle active
✅ OrderManagement.tsx - Order status, refunds
✅ SellerManagement.tsx - Seller approval, badge assignment
✅ CategoryManagement.tsx - Category CRUD
✅ BannerManagement.tsx - Banner management
✅ PromotionManagement.tsx - Promotion CRUD
✅ ReviewManagement.tsx - Review flagging/deletion
✅ ComplaintManagement.tsx - Complaint status tracking
✅ AccountsManagement.tsx - Financial accounting
✅ ReportsManagement.tsx - Analytics reports
✅ AdminManagement.tsx - Admin user management
✅ ProfilePage.tsx - Admin profile
✅ SettingsPage.tsx - System settings

---

## Error in Current System

**Error Message**: "Failed to load dashboard metrics"

**Root Cause**: Backend endpoint `/admin/dashboard/metrics` is not implemented

**Affected Components**:
- AdminOverview.tsx - Shows error instead of metrics
- Dashboard displays all zeros

---

## Priority Order for Backend Implementation

### Phase 1 (Critical - for dashboard to work)
1. ✅ Authentication endpoints (AWS Cognito - already done)
2. ❌ Dashboard metrics endpoint
3. ❌ User management endpoints
4. ❌ Product management endpoints
5. ❌ Order management endpoints

### Phase 2 (Important - for full admin functionality)
6. ❌ Seller management endpoints
7. ❌ Category management endpoints
8. ❌ Banner management endpoints
9. ❌ Promotion management endpoints

### Phase 3 (Enhanced features)
10. ❌ Review management endpoints
11. ❌ Complaint management endpoints
12. ❌ Accounts management endpoints
13. ❌ Reports endpoints
14. ❌ Admin management endpoints

### Phase 4 (Realtime features)
15. ❌ WebSocket subscriptions for metrics
16. ❌ Event-driven updates
17. ❌ Real-time notifications

---

## Technology Stack

**Frontend**:
- React 18 + TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons
- AWS Amplify Auth (Cognito)

**Backend Needed**:
- Node.js/Express or AWS Lambda
- PostgreSQL/DynamoDB for data storage
- GraphQL API (AWS AppSync) for queries
- REST API for admin operations
- AWS EventBridge for real-time updates

**Database**:
- AWS RDS (PostgreSQL) or DynamoDB
- Amazon S3 for image storage
- ElastiCache for caching metrics

---

## Next Steps

1. Create backend API service (Node.js or Lambda)
2. Set up PostgreSQL/DynamoDB tables
3. Implement all dashboard endpoints (Phase 1)
4. Add real-time subscriptions
5. Integrate with AWS AppSync
6. Add data validation and error handling
7. Implement pagination and filtering
8. Add admin action logging
