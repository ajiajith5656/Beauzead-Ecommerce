# 🏗️ Admin Dashboard - Architecture & Structure

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (User)                            │
│                                                              │
│  Admin User → /seller/login (Role-based redirect)           │
└────────────────────┬────────────────────────────────────────┘
                     │ (Admin role detected)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              React Router: /admin (Protected)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AdminLayout (Role Check)                     │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  AdminHeader (Logout, User Info)              │ │  │
│  │  │  - Black background                           │ │  │
│  │  │  - Logout dialog confirmation                 │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ Sidebar (14 Menu Items)   │  Main Content     │ │  │
│  │  │                           │                   │ │  │
│  │  │ • Dashboard               │  Outlet (Route)   │ │  │
│  │  │ • Users                   │                   │ │  │
│  │  │ • Sellers                 │  ┌─────────────┐ │ │  │
│  │  │ • Products                │  │   Module    │ │ │  │
│  │  │ • Orders                  │  │ (UserMgmt,  │ │ │  │
│  │  │ • Categories              │  │ SellerMgmt, │ │ │  │
│  │  │ • Banners                 │  │ etc)        │ │ │  │
│  │  │ • Promotions              │  │             │ │ │  │
│  │  │ • Reviews                 │  │ API calls   │ │ │  │
│  │  │ • Complaints              │  │ + State     │ │ │  │
│  │  │ • Accounts                │  │ Management  │ │ │  │
│  │  │ • Reports                 │  │             │ │ │  │
│  │  │ • Admin Mgmt              │  │             │ │ │  │
│  │  │ • Settings                │  │             │ │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │ API Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              adminApiService (APIClient)                    │
│                                                              │
│  50+ Functions:                                             │
│  - Dashboard metrics                                        │
│  - User management (CRUD)                                   │
│  - Seller management (KYC, badges)                          │
│  - Product management (approve, reject, disable)            │
│  - Order management (status, refunds, returns)              │
│  - Category management (CRUD)                               │
│  - Banner management (CRUD)                                 │
│  - Promotion management (CRUD)                              │
│  - Review management (flag, delete)                         │
│  - Complaint management (update status)                     │
│  - Reports generation                                       │
│                                                              │
│  ↓ (Includes JWT token from AWS Amplify)                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API Server (REST)                      │
│                                                              │
│  /admin/dashboard/metrics                                   │
│  /admin/users (GET, POST, PUT, DELETE)                      │
│  /admin/sellers (GET, POST, PUT, DELETE)                    │
│  /admin/products (GET, POST, PUT, DELETE)                   │
│  /admin/orders (GET, POST, PUT, DELETE)                     │
│  /admin/categories (GET, POST, PUT, DELETE)                 │
│  /admin/banners (GET, POST, PUT, DELETE)                    │
│  /admin/promotions (GET, POST, PUT, DELETE)                 │
│  /admin/reviews (GET, POST, DELETE)                         │
│  /admin/complaints (GET, POST, PUT)                         │
│  /admin/admins (GET, POST, PUT, DELETE)                     │
│  ... (50+ total endpoints)                                  │
│                                                              │
│  Authentication: Bearer {JWT Token}                         │
│  Database: PostgreSQL / MongoDB / etc.                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
AdminLayout
├── AdminHeader
│   ├── Logout Button
│   └── LogoutDialog (Modal)
│       ├── Confirmation Text
│       ├── Cancel Button
│       └── Logout Button
│
├── AdminSidebar
│   ├── Menu Item (Home)
│   ├── Menu Item (Users)
│   │   └── Submenu Items
│   ├── Menu Item (Sellers)
│   ├── ... (14 items total)
│   └── Mobile Overlay
│
└── Main Content
    ├── AdminOverview (Dashboard)
    │   ├── MetricCard (8 cards)
    │   ├── Stats Grid (3 cards)
    │   ├── Top Categories Table
    │   └── Top Sellers Table
    │
    ├── UserManagement
    │   ├── Header
    │   ├── Filters
    │   ├── Table
    │   │   ├── Rows (UserCard)
    │   │   └── Actions (Ban, Delete)
    │   ├── Pagination
    │   └── DeleteConfirmDialog
    │
    ├── SellerManagement
    │   ├── Filters
    │   ├── Table
    │   ├── Actions (Approve KYC, Badge)
    │   ├── Pagination
    │   └── DetailsModal
    │       └── Badge Selection
    │
    ├── ProductManagement
    │   ├── Filters
    │   ├── Table
    │   ├── Actions (Approve, Reject, Disable)
    │   ├── Pagination
    │   └── DetailsModal
    │       └── Product Info
    │
    ├── OrderManagement
    │   ├── Status Filter
    │   ├── Table
    │   ├── Actions
    │   ├── Pagination
    │   ├── DetailsModal
    │   │   ├── Status Dropdown
    │   │   └── Refund Button
    │   └── RefundDialog
    │       └── Amount Input
    │
    ├── CategoryManagement
    │   ├── Add Button
    │   ├── Grid (3 columns)
    │   └── Form Modal
    │       ├── Name Input
    │       ├── Description
    │       ├── Image URL
    │       └── Active Checkbox
    │
    ├── BannerManagement
    │   ├── Add Button
    │   ├── Grid (2 columns)
    │   └── Form Modal
    │       ├── Title Input
    │       ├── Image URL
    │       ├── Link Input
    │       ├── Position
    │       └── Active Checkbox
    │
    ├── PromotionManagement
    │   ├── Add Button
    │   └── Table
    │
    ├── ReviewManagement
    │   ├── Table
    │   ├── Actions (Flag, Delete)
    │   └── Pagination
    │
    ├── ComplaintManagement
    │   ├── Status Filter
    │   ├── Table
    │   ├── DetailsModal
    │   │   ├── Status Dropdown
    │   │   └── Resolution Textarea
    │   └── Pagination
    │
    ├── AdminManagement
    │   └── Placeholder
    │
    └── SettingsPage
        ├── Business Rules
        ├── Master Data
        └── System Settings
```

---

## Data Flow

### User Login → Admin Access

```
User enters credentials
    ↓
/seller/login (SellerLogin component)
    ↓
POST /auth/login (with role='admin')
    ↓
Backend validates Cognito user pool
    ↓
Backend checks role attribute
    ↓
Response: { user: { role: 'admin', ... } }
    ↓
AuthContext stores user data
    ↓
Router redirects to /admin
    ↓
AdminLayout checks user.role === 'admin'
    ↓
✅ Admin Dashboard rendered
```

### View Users → CRUD Operations

```
User clicks "Users" in sidebar
    ↓
Route → /admin/users
    ↓
UserManagement component mounts
    ↓
useEffect → fetchUsers()
    ↓
adminApiService.getAllUsers(page, limit, search, profile_type)
    ↓
GET /admin/users?page=1&limit=10&search=...
    ↓
+ Authorization: Bearer {token}
    ↓
Backend processes request
    ↓
Database query (filters applied)
    ↓
Response: { users: [...], total: 150 }
    ↓
State updated: setUsers(users), setPagination(total)
    ↓
✅ Table renders with data
    ↓
User actions (ban, delete):
    ├─ Ban User
    │  ├─ POST /admin/users/{id}/ban
    │  ├─ Backend updates user.is_banned = true
    │  ├─ Response: success
    │  ├─ Show success message
    │  └─ Refresh list: fetchUsers()
    │
    └─ Delete User
       ├─ Show DeleteConfirmDialog
       ├─ User confirms
       ├─ DELETE /admin/users/{id}
       ├─ Backend deletes user record
       ├─ Response: success
       ├─ Show success message
       └─ Remove from list
```

### Update Product → Approve Flow

```
1. ProductManagement mounts
   ↓ fetchProducts()
   ↓ GET /admin/products?approval_status=pending
   ↓ Response: products with status='pending'
   ↓ Display in table

2. Admin clicks ✓ (approve icon)
   ↓ handleApprove(productId)
   ↓ POST /admin/products/{id}/approve
   ↓ setActionLoading(productId) [prevent double-click]
   ↓ Backend updates status='approved'
   ↓ Response: success
   ↓ Show success message
   ↓ fetchProducts() [refresh list]
   ↓ Product disappears from pending list
   ↓ setActionLoading(null) [enable button again]

3. Admin clicks X (reject icon)
   ↓ handleReject(productId)
   ↓ POST /admin/products/{id}/reject
   ↓ Similar flow as approve...
```

---

## State Management Pattern

### Each Module Uses

```typescript
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
const [filters, setFilters] = useState({});
const [actionLoading, setActionLoading] = useState<string | null>(null); // per-item loading

useEffect(() => {
  fetchData();
}, [pagination.page, filters]);

const fetchData = async () => {
  setLoading(true);
  try {
    const result = await apiService.getAll(...);
    setData(result.items);
    setPagination(prev => ({ ...prev, total: result.total }));
  } catch (err) {
    setError('Error message');
  } finally {
    setLoading(false);
  }
};

const handleAction = async (id: string) => {
  setActionLoading(id); // Prevent double-click
  try {
    const success = await apiService.action(id);
    if (success) {
      setSuccess('Action successful');
      fetchData(); // Refresh list
    }
  } catch (err) {
    setError('Action failed');
  } finally {
    setActionLoading(null);
  }
};
```

---

## API Request Pattern

```typescript
// Every API function follows this pattern

export const functionName = async (params): Promise<ReturnType | null> => {
  try {
    const { data, error } = await apiClient.request<ReturnType>(
      '/endpoint',
      {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body: requestData,
      }
    );
    
    if (error) {
      console.error('Failed to ...:', error);
      return null; // Return null on error
    }
    
    return data || null; // Return data or null
  } catch (err) {
    console.error('Exception:', err);
    return null;
  }
};

// Usage in components:
const result = await adminApiService.function(...);
if (result) {
  // Success
  setSuccess('Message');
  refresh(); // Refresh data
} else {
  // Error
  setError('Failed to...');
}
```

---

## Responsive Breakpoints

```
Mobile (< 640px)
├── Hamburger menu (sidebar collapses)
├── Single column layouts
├── Full-width forms
├── Stacked cards
└── Horizontal table scroll

Tablet (640px - 1024px)
├── Sidebar drawer on toggle
├── 2 column grid
├── Adjusted form widths
└── Optimized modals

Desktop (≥ 1024px)
├── Always-visible sidebar
├── 3-4 column grid
├── Full-width tables
└── Side-by-side layouts
```

---

## Error Handling Flow

```
API Call
├── Network Error
│   └─ Catch → setError → Display ErrorMessage
├── 4xx Error (Client)
│   └─ Error response → setError → Display ErrorMessage
├── 5xx Error (Server)
│   └─ Error response → setError → Display ErrorMessage
└── Success
    └─ Data returned → Update state → Render UI
```

---

## File Dependencies

```
App.tsx
├── imports AdminLayout
├── imports all Module components
└── imports all API service functions

AdminLayout.tsx
├── imports AdminHeader
├── imports AdminSidebar
├── uses AuthContext
└── renders Outlet (for routes)

Each Module (e.g., UserManagement.tsx)
├── imports adminApiService
├── imports StatusIndicators (Loading, Error, Success)
├── imports lucide-react icons
├── uses local state
└── calls API functions

adminApiService.ts
├── imports APIClient
├── imports type definitions
├── exports 50+ functions
└── handles all API communication

TypeScript Types (types/index.ts)
├── User interface
├── Admin interface
├── Seller interface
├── Product interface
├── Order interface
├── Category interface
├── Banner interface
├── Promotion interface
├── Review interface
├── Complaint interface
└── ... (all data types)
```

---

## Security Architecture

```
Frontend Layer
├── AdminLayout checks user.role === 'admin'
├── Routes protected by role check
└── Sensitive data not stored client-side

API Layer
├── Every request includes JWT token
├── Token from AWS Amplify auth session
└── Backend validates token + role

Authentication
├── AWS Cognito user pool
├── Custom role attribute
├── Session management
└── Token refresh on expiry

CORS
├── Frontend domain whitelist
├── Credentials allowed
└── Proper headers configured
```

---

## Performance Considerations

```
Optimization Techniques
├── Pagination (10 items per page)
├── Lazy loading (modals on-demand)
├── Conditional rendering
├── useEffect dependencies
├── Prevent double-submit (actionLoading)
├── Memoization where needed
├── Tailwind CSS purging
└── Code splitting per route

Bottlenecks Addressed
├── Large dataset loading → Pagination
├── Slow API responses → Loading states
├── Multiple rapid clicks → actionLoading state
├── Unnecessary re-renders → Proper state management
├── Bundle size → Tree-shaking, code splitting
└── Initial load → Lazy routes
```

---

## Testing Checklist

```
Authentication
├── ✅ Non-admin users cannot access /admin
├── ✅ Admin users redirected to /admin on login
└── ✅ Logout works correctly

User Management
├── ✅ Search filters users
├── ✅ Profile type filter works
├── ✅ Ban/Unban toggles status
├── ✅ Delete removes from list
└── ✅ Pagination works

Seller Management
├── ✅ KYC filters work
├── ✅ Approve/Reject KYC changes status
├── ✅ Badge update changes badge
└── ✅ Details modal displays info

Product Management
├── ✅ Approval status filter works
├── ✅ Approve/Reject changes status
├── ✅ Disable works
└── ✅ Search finds products

Order Management
├── ✅ Status filter works
├── ✅ Status update changes order
├── ✅ Refund dialog works
└── ✅ Refund processes correctly

Responsive Design
├── ✅ Mobile: Hamburger menu works
├── ✅ Tablet: Drawer toggles
├── ✅ Desktop: Sidebar always visible
└── ✅ All tables scroll properly

Error Handling
├── ✅ Network errors show messages
├── ✅ API errors display correctly
├── ✅ Form validation works
└── ✅ Confirmations prevent mistakes
```

---

This architecture ensures scalability, maintainability, and professional-grade performance.

**Built with production standards in mind.** 🚀
