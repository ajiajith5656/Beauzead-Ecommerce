# 🚀 BeauZead Admin Dashboard - Production-Ready Implementation

## Overview

This is a **production-ready, enterprise-grade Admin Dashboard** for the BeauZead e-commerce platform. It provides complete administrative control over users, sellers, products, orders, and platform configuration.

---

## 🔥 Key Features

### ✅ Complete Admin Control
- **Full CRUD operations** for all entities
- **Role-based access control** (Admin only)
- **Real-time data** from backend APIs (zero mock data)
- **Responsive design** (mobile, tablet, desktop)

### 📊 Dashboard Modules

#### 1. **Overview Dashboard** (`/admin`)
- Real-time business metrics
- Total sales, expenses, products, users, sellers
- Ongoing orders and returns/cancellations count
- Top categories by bookings
- Top sellers by revenue
- User & seller registration stats

#### 2. **User Management** (`/admin/users`)
- List all users with search and filtering
- Profile type: Member, Prime
- Ban/Unban users
- Delete users
- View purchase history and cancellation counts
- Pagination support

#### 3. **Seller Management** (`/admin/sellers`)
- Approve/Reject KYC applications
- Update seller badges (Silver, Gold, Platinum)
- Filter by KYC status
- View seller details (shop name, email, listings, revenue)
- Search sellers

#### 4. **Product Management** (`/admin/products`)
- Approve/Reject pending products
- Enable/Disable products
- Delete products
- Filter by approval status and category
- View detailed product information
- Search by product name

#### 5. **Order Management** (`/admin/orders`)
- View all orders with status tracking
- Update order status (New → Processing → Shipped → Delivered)
- Process refunds with amount control
- Handle returns
- Filter by order status
- View order details and items

#### 6. **Category Management** (`/admin/categories`)
- Add new categories
- Edit category details
- Upload category images
- Enable/Disable categories
- Delete categories

#### 7. **Banner Management** (`/admin/banners`)
- Create promotional banners
- Upload banner images
- Set banner position/order
- Activate/Deactivate banners
- Edit and delete banners

#### 8. **Promotion Management** (`/admin/promotions`)
- Create promotional offers
- Set discount type (percentage or fixed)
- Apply promotions to users, sellers, or common
- Expiry date control
- Track promotion usage

#### 9. **Reviews Management** (`/admin/reviews`)
- View all product reviews
- Flag abusive reviews
- Delete inappropriate reviews
- Verify purchase-based reviews
- Pagination support

#### 10. **Complaints Management** (`/admin/complaints`)
- Track customer complaints
- Update complaint status (Open → In Progress → Resolved → Closed)
- Add resolution notes
- Notify users/sellers
- Filter by status

#### 11. **Admin Management**
- Create new admin accounts
- Manage admin permissions
- Edit/Delete admins
- Control admin access

#### 12. **Settings** (`/admin/settings`)
- Business rules configuration
- Platform charges setup
- Tax settings
- Master data management (Countries, Categories, Sub-categories)
- System settings

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Authentication**: AWS Amplify
- **API Communication**: Custom APIClient (AWS Amplify auth-integrated)
- **State Management**: React Context API
- **Responsive**: Mobile-first design

---

## 📁 Project Structure

```
src/
├── services/
│   └── admin/
│       └── adminApiService.ts          # All admin API calls
├── pages/
│   └── admin/
│       ├── AdminLayout.tsx              # Main admin layout wrapper
│       ├── AdminDashboard.tsx           # Legacy dashboard
│       ├── components/
│       │   ├── AdminHeader.tsx          # Header with logout
│       │   ├── AdminSidebar.tsx         # Navigation sidebar
│       │   └── StatusIndicators.tsx     # Loading, error, success states
│       └── modules/
│           ├── AdminOverview.tsx        # Dashboard metrics
│           ├── UserManagement.tsx       # User CRUD
│           ├── SellerManagement.tsx     # Seller management
│           ├── ProductManagement.tsx    # Product approvals
│           ├── OrderManagement.tsx      # Order tracking
│           ├── CategoryManagement.tsx   # Category CRUD
│           ├── BannerManagement.tsx     # Banner management
│           ├── PromotionManagement.tsx  # Promotions
│           ├── ReviewManagement.tsx     # Review moderation
│           ├── ComplaintManagement.tsx  # Complaint tracking
│           ├── AdminManagement.tsx      # Admin users
│           └── SettingsPage.tsx         # System settings
└── types/
    └── index.ts                         # All TypeScript interfaces
```

---

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all admin features (role = 'admin')
- **Seller**: Access to seller dashboard (role = 'seller')
- **User**: Regular user access (role = 'user')
- **Guest**: Home page and product details only

### Login Flow
1. User navigates to `/seller/login` (shared seller/admin login)
2. Backend validates role from Cognito user pool
3. If role = 'admin' → Redirect to `/admin`
4. If role = 'seller' → Redirect to `/seller/dashboard`
5. Admin-only routes protected by role check in `AdminLayout`

### Logout Flow
- Click logout button → Show confirmation dialog
- Confirm → Show loading state
- Call Amplify signOut() → API logout
- Show success/error message → Redirect to `/seller/login`

---

## 🔌 API Integration

### Base Configuration
All API calls use the configured `APIClient` from `/src/lib/api.ts`:

```typescript
const apiClient = new APIClient();
```

### Authentication
- Automatically includes JWT token from AWS Cognito
- Token is retrieved via `fetchAuthSession()` from aws-amplify/auth
- Included in `Authorization: Bearer {token}` header

### API Endpoints (Expected Backend)
```
/admin/dashboard/metrics
/admin/users
/admin/sellers
/admin/products
/admin/orders
/admin/categories
/admin/banners
/admin/promotions
/admin/reviews
/admin/complaints
/admin/admins
... (all endpoints documented in adminApiService.ts)
```

---

## 🎨 UI/UX Design

### Color Scheme
- **Header**: Pure Black (#000000)
- **Sidebar**: White with hover states
- **Cards**: White with subtle shadows
- **Accents**: Black buttons, colored status badges
- **Status Badges**:
  - Green: Active, Approved, Delivered
  - Red: Inactive, Rejected, Cancelled, Deleted
  - Yellow: Pending, In Progress
  - Blue: Processing, Shipped
  - Purple: Prime members, Platinum badges

### Components
- **Header**: Fixed at top, responsive hamburger menu
- **Sidebar**: Collapsible on mobile, icons + labels
- **Modals**: For detailed views and confirmations
- **Tables**: Responsive with horizontal scroll on mobile
- **Forms**: Clean inputs with proper spacing
- **Pagination**: Previous/Next with page indicator
- **Loading States**: Spinner with message
- **Error/Success Messages**: Toast-like notifications

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
# Install dependencies
npm install

# Configure AWS Amplify (if not already done)
# Update .env with your AWS credentials:
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=your-pool-id
VITE_AWS_USER_POOL_CLIENT_ID=your-client-id
VITE_API_ENDPOINT=https://your-api-endpoint.com
```

### Running the Application
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Accessing the Admin Panel
1. Navigate to `http://localhost:5173/seller/login`
2. Login with admin credentials
3. Role 'admin' will redirect to `http://localhost:5173/admin`

---

## 📋 Data Types & Interfaces

All TypeScript interfaces are defined in `/src/types/index.ts`:

```typescript
// Core entities
User, Admin, Seller, Product, Order, Category, Banner, Promotion
Review, Complaint, Withdrawal

// Response types
BusinessMetrics, DashboardData

// Extended entity properties
OrderItem, SubCategory
```

---

## 🔑 Key API Service Functions

### Admin Service (`adminApiService.ts`)

**Dashboard**
```typescript
getDashboardMetrics(): Promise<DashboardData>
```

**Users**
```typescript
getAllUsers(page?, limit?, search?, profile_type?)
getUserById(userId)
updateUser(userId, userData)
banUser(userId)
unbanUser(userId)
deleteUser(userId)
```

**Sellers**
```typescript
getAllSellers(page?, limit?, search?, kyc_status?)
getSellerById(sellerId)
updateSellerKYC(sellerId, status)
updateSellerBadge(sellerId, badge)
approveSeller(sellerId)
rejectSeller(sellerId, reason?)
```

**Products**
```typescript
getAllProducts(page?, limit?, search?, approval_status?, category?)
getProductById(productId)
updateProduct(productId, productData)
approveProduct(productId)
rejectProduct(productId, reason?)
disableProduct(productId)
deleteProduct(productId)
```

**Orders**
```typescript
getAllOrders(page?, limit?, status?, dateRange?)
getOrderById(orderId)
updateOrderStatus(orderId, status, trackingNumber?)
processRefund(orderId, amount)
processReturn(orderId, reason)
```

**Categories**
```typescript
getAllCategories(page?, limit?)
createCategory(categoryData)
updateCategory(categoryId, categoryData)
deleteCategory(categoryId)
```

**Banners**
```typescript
getAllBanners(page?, limit?)
createBanner(bannerData)
updateBanner(bannerId, bannerData)
deleteBanner(bannerId)
```

**Promotions**
```typescript
getAllPromotions(page?, limit?)
createPromotion(promotionData)
updatePromotion(promotionId, promotionData)
deletePromotion(promotionId)
```

**Reviews**
```typescript
getAllReviews(page?, limit?, productId?)
flagReview(reviewId)
unflagReview(reviewId)
deleteReview(reviewId)
```

**Complaints**
```typescript
getAllComplaints(page?, limit?, status?)
getComplaintById(complaintId)
updateComplaintStatus(complaintId, status, resolution?)
```

**Reports**
```typescript
generateReport(reportType, filters?)
```

---

## 🎯 Usage Examples

### Fetch and Display Users
```typescript
const { users, total } = await adminApiService.getAllUsers(1, 10, 'john');
```

### Approve a Product
```typescript
const success = await adminApiService.approveProduct('product-id');
```

### Update Order Status
```typescript
const updatedOrder = await adminApiService.updateOrderStatus(
  'order-id',
  'shipped',
  'TRACK123456'
);
```

### Create a Banner
```typescript
const banner = await adminApiService.createBanner({
  title: 'Summer Sale',
  image_url: 'https://...',
  link: '/sale',
  is_active: true,
  position: 1
});
```

---

## 🔄 State Management

- **Authentication**: AuthContext provides `user`, `currentAuthUser`, and auth methods
- **Local State**: Each module manages its own state (users, products, etc.)
- **Loading States**: Managed per-action with `actionLoading` state
- **Error/Success Messages**: Toast-style notifications
- **Pagination**: Managed with `PaginationState` interface

---

## 📱 Responsive Design

### Mobile (< 640px)
- Hamburger menu for sidebar
- Single column layout
- Full-width tables with horizontal scroll
- Stacked dialogs and modals

### Tablet (640px - 1024px)
- Sidebar drawer on toggle
- 2-column grid for cards
- Optimized table layout

### Desktop (> 1024px)
- Always-visible sidebar
- 3-4 column grid layouts
- Full responsive tables
- Side-by-side modals and details

---

## 🔒 Security Considerations

1. **Role-Based Access**: Admin layout checks user role before rendering
2. **Token Management**: AWS Amplify handles JWT tokens securely
3. **API Authorization**: All requests include auth token
4. **CORS**: Configure backend CORS for your domain
5. **Sensitive Data**: Passwords never stored client-side
6. **Logout Cleanup**: User data cleared on logout

---

## 🐛 Error Handling

- **Network Errors**: Caught and displayed as error messages
- **API Errors**: Handled per-request with error state
- **Validation**: Form validation before submission
- **Confirmation Dialogs**: For destructive actions (delete, ban)
- **Loading States**: Prevents double-submission
- **User Feedback**: Clear success/error messages

---

## 📊 Performance Optimization

- **Pagination**: Load data in chunks (10 items per page default)
- **Search/Filter**: Applied client-side after fetch
- **Lazy Loading**: Modals loaded on-demand
- **Memoization**: Components use React.FC memo where needed
- **Asset Optimization**: Tailwind CSS purging in production

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Connect your GitHub repo
# Auto-deploys on push to main
```

### Environment Variables
```env
VITE_AWS_REGION=your-region
VITE_AWS_USER_POOL_ID=your-user-pool-id
VITE_AWS_USER_POOL_CLIENT_ID=your-client-id
VITE_API_ENDPOINT=https://your-api-endpoint.com
```

---

## 📝 Backend Requirements

### User Pool Configuration (Cognito)
```
✅ Email verification enabled
✅ Custom attributes: role (admin, seller, user)
✅ App client: Web application type
✅ Auth flows: ALLOW_USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH
```

### API Endpoints Required
All endpoints should return JSON with proper error handling:

```typescript
GET    /admin/dashboard/metrics
GET    /admin/users
POST   /admin/users
PUT    /admin/users/{id}
DELETE /admin/users/{id}
POST   /admin/users/{id}/ban
POST   /admin/users/{id}/unban
... (full list in adminApiService.ts)
```

---

## 🤝 Contributing

1. Create feature branch
2. Follow component structure
3. Add TypeScript types
4. Test responsiveness
5. Submit PR with description

---

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review API service code
3. Check browser console for errors
4. Verify AWS Amplify configuration
5. Test with Postman for API endpoints

---

## ✨ Future Enhancements

- [ ] Advanced reporting with charts (Chart.js/Recharts)
- [ ] Bulk operations (bulk approve/reject)
- [ ] Email notifications
- [ ] Audit logs
- [ ] CSV/Excel export
- [ ] Scheduled tasks
- [ ] Admin activity logging
- [ ] Advanced filters and search
- [ ] Real-time updates (WebSocket)
- [ ] Multi-language support

---

## 📄 License

Proprietary - BeauZead E-commerce Platform

---

**Built with ❤️ for BeauZead**

*Last Updated: 2026-01-29*
