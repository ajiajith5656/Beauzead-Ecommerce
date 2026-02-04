# Beauzead E-commerce - Project Structure

```
Beauzead-Ecommerce/
│
├── 📄 Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── tsconfig.app.json              # App-specific TypeScript config
│   ├── tsconfig.node.json             # Node-specific TypeScript config
│   ├── vite.config.ts                 # Vite bundler configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── eslint.config.js               # ESLint configuration
│   ├── amplify.yml                    # AWS Amplify deployment config
│   ├── .env.example                   # Environment variables template
│   └── AUTHENTICATION_STRUCTURE.md    # Auth documentation
│
├── 📁 public/                         # Static assets
│   ├── _redirects                     # Routing redirects
│   ├── index.html                     # Main HTML template
│   └── images/
│       ├── banners/                   # Advertisement banners
│       └── logo/                      # Brand logos
│
├── 📁 src/                            # Source code
│   │
│   ├── 📄 main.tsx                    # Application entry point
│   ├── 📄 App.tsx                     # Main app component with routes
│   ├── 📄 index.css                   # Global styles
│   ├── 📄 constants.ts                # App-wide constants
│   │
│   ├── 📁 assets/                     # Images, fonts, etc.
│   │
│   ├── 📁 components/                 # Reusable components
│   │   ├── admin/                     # Admin-specific components
│   │   ├── auth/                      # Authentication components
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── layout/                    # Layout components
│   │   │   ├── Header.tsx             # Main navigation header
│   │   │   ├── Footer.tsx             # Footer component
│   │   │   ├── MobileNav.tsx          # Mobile navigation
│   │   │   ├── Categories.tsx         # Category navigation
│   │   │   ├── Search.tsx             # Search bar
│   │   │   └── HeroCarousel.tsx       # Homepage carousel
│   │   ├── products/                  # Product components
│   │   │   └── ProductCard.tsx
│   │   ├── AddressForm.tsx
│   │   └── ImageUpload.tsx
│   │
│   ├── 📁 contexts/                   # React Context providers
│   │   ├── AuthContext.tsx            # Authentication state
│   │   ├── CartContext.tsx            # Shopping cart state
│   │   ├── WishlistContext.tsx        # Wishlist state
│   │   └── CurrencyContext.tsx        # Currency conversion
│   │
│   ├── 📁 pages/                      # Page components
│   │   │
│   │   ├── 📄 NewHome.tsx             # Homepage
│   │   ├── 📄 ProductDetailsPage.tsx  # Product details
│   │   ├── 📄 CategoryProducts.tsx    # Category listing
│   │   ├── 📄 OTPVerification.tsx     # OTP verification
│   │   ├── 📄 NewPassword.tsx         # Password reset
│   │   │
│   │   ├── 📁 Legal Pages
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── TermsService.tsx
│   │   │   ├── ShippingPolicy.tsx
│   │   │   └── RefundPolicy.tsx
│   │   │
│   │   ├── 📁 admin/                  # Admin dashboard
│   │   │   ├── AdminLayout.tsx        # Admin layout wrapper
│   │   │   ├── components/            # Admin components
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── AdminAddressManagement.tsx
│   │   │   │   └── StatusIndicators.tsx
│   │   │   └── modules/               # Admin feature modules
│   │   │       ├── AdminOverview.tsx
│   │   │       ├── UserManagement.tsx
│   │   │       ├── SellerManagement.tsx
│   │   │       ├── ProductManagement.tsx
│   │   │       ├── ProductVariantManagement.tsx
│   │   │       ├── OrderManagement.tsx
│   │   │       ├── CategoryManagement.tsx
│   │   │       ├── SubCategoryManagement.tsx
│   │   │       ├── BannerManagement.tsx
│   │   │       ├── PromotionManagement.tsx
│   │   │       ├── ReviewManagement.tsx
│   │   │       ├── ComplaintManagement.tsx
│   │   │       ├── AccountsManagement.tsx
│   │   │       ├── ReportsManagement.tsx
│   │   │       ├── AdminManagement.tsx
│   │   │       ├── ProfilePage.tsx
│   │   │       ├── SettingsPage.tsx
│   │   │       ├── SearchManagement.tsx
│   │   │       ├── AuditLogs.tsx
│   │   │       ├── SystemHealth.tsx
│   │   │       ├── TableManager.tsx
│   │   │       ├── BusinessTypeManagement.tsx
│   │   │       ├── CountryListManagement.tsx
│   │   │       ├── DashboardMetricsManagement.tsx
│   │   │       ├── KYCRequirementManagement.tsx
│   │   │       ├── SellerKYCSubmissionManagement.tsx
│   │   │       ├── ProductImageManagement.tsx
│   │   │       ├── ProductListingLayout.tsx
│   │   │       ├── AdminListings1.tsx
│   │   │       ├── AdminListings2.tsx
│   │   │       ├── AdminListings3.tsx
│   │   │       ├── AdminListing4.tsx
│   │   │       ├── AdminListing5.tsx
│   │   │       └── AdminListing6.tsx
│   │   │
│   │   ├── 📁 seller/                 # Seller dashboard
│   │   │   ├── SellerLanding.tsx      # Seller landing page (public)
│   │   │   ├── SellerLogin.tsx        # Seller login
│   │   │   ├── SellerSignup.tsx       # Seller registration
│   │   │   ├── SellerForgotPassword.tsx
│   │   │   ├── SellerDashboard.tsx    # Seller dashboard main
│   │   │   ├── SellerDashboardWrapper.tsx  # Dashboard wrapper with auth
│   │   │   ├── SellerProfile.tsx      # Seller profile
│   │   │   ├── SellerKYCVerification.tsx
│   │   │   ├── SellerProductListing.tsx
│   │   │   ├── SellerProductImageManagement.tsx
│   │   │   ├── SellerOrderManagement.tsx
│   │   │   ├── SellerWallet.tsx
│   │   │   ├── SellerVerifyUploads.tsx
│   │   │   ├── SellersVerifications.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   │
│   │   └── 📁 user/                   # User pages
│   │       ├── Cart.tsx               # Shopping cart
│   │       ├── Wishlist.tsx           # Wishlist
│   │       ├── Checkout.tsx           # Checkout page
│   │       ├── Profile.tsx            # User profile
│   │       ├── MyOrders.tsx           # Order history
│   │       ├── OrderDetails.tsx       # Single order details
│   │       ├── OrderTracking.tsx      # Order tracking (unused)
│   │       ├── Notifications.tsx      # User notifications
│   │       ├── Settings.tsx           # User settings
│   │       ├── AddressManagement.tsx  # Address book
│   │       ├── WriteReview.tsx        # Product review
│   │       └── ForgotPassword.tsx     # Password reset
│   │
│   ├── 📁 services/                   # API services
│   │   ├── admin/                     # Admin API services
│   │   ├── stripeService.ts           # Payment integration
│   │   └── ...
│   │
│   ├── 📁 lib/                        # Libraries and utilities
│   │   ├── amplifyConfig.ts           # AWS Amplify configuration
│   │   └── amplifyAuth.ts             # Auth helper functions
│   │
│   ├── 📁 graphql/                    # GraphQL queries/mutations
│   │   └── ...
│   │
│   ├── 📁 types/                      # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── 📁 data/                       # Mock/static data
│   │   └── mockData.ts
│   │
│   ├── 📁 utils/                      # Utility functions
│   │   ├── currency.ts
│   │   ├── authGuard.ts
│   │   └── ...
│   │
│   └── 📁 ui-components/              # UI component library
│       └── ...
│
├── 📁 scripts/                        # Utility scripts
│   ├── createBusinessTypeTable.py
│   ├── insertBusinessTypes.js
│   ├── insertCountries.js
│   ├── seedCountries.js
│   ├── seedCountries.sh
│   ├── seedCountriesSimple.js
│   ├── seedCountriesToDynamoDB.py
│   ├── seedMeasurementData.js
│   └── measurement-types-batch.json
│
├── 📁 graphql-schemas/                # GraphQL schema definitions
│   └── products-schema.graphql
│
├── 📁 vtl-templates/                  # VTL resolver templates
│   ├── approveProduct-request.vtl
│   ├── banUser-request.vtl
│   ├── createCategory-request.vtl
│   ├── deleteUser-request.vtl
│   ├── listCategories-response.vtl
│   ├── listProducts-request.vtl
│   ├── listProducts-response.vtl
│   ├── listUsers-request.vtl
│   ├── listUsers-response.vtl
│   ├── rejectProduct-request.vtl
│   ├── response.vtl
│   ├── toggleProductStatus-request.vtl
│   └── unbanUser-request.vtl
│
├── 📁 amplify-backup/                 # AWS Amplify backup
│   ├── cli.json
│   ├── README.md
│   ├── hooks/
│   ├── #current-cloud-backend/
│   │   └── api/beauzeadecommerce/
│   └── backend/
│       ├── amplify-meta.json
│       ├── backend-config.json
│       ├── api/beauzeadecommerce/
│       └── types/
│
├── 📁 export-amplify-stack/           # Amplify export
│   └── amplify-export-BeauzeadEcommerce/
│       ├── amplify-export-manifest.json
│       ├── category-stack-mapping.json
│       ├── export-tags.json
│       ├── api/
│       ├── auth/
│       └── function/
│
├── 📁 aws/                            # AWS CLI installation files
│   ├── install
│   ├── README.md
│   └── THIRD_PARTY_LICENSES
│
└── 📁 Deployment Scripts (root)
    ├── check-aws-free-tier.sh
    ├── configure-aurora-connection.sh
    ├── setup-aurora-custom.sh
    ├── setup-aurora-free-tier.sh
    ├── setup-aurora-free-tier-now.sh
    ├── setup-aurora-free-tier-simple.sh
    ├── setup-aurora-instant.sh
    ├── COMMANDS_COPY_PASTE.sh
    ├── GET_ENDPOINT.sh
    ├── SIMPLE_3_COMMANDS.sh
    ├── STEP2_CHECK_STATUS.sh
    ├── MANUAL_CONSOLE_STEPS.txt
    ├── IAM_POLICY_DYNAMODB_SEED.json
    ├── IAM_POLICY_KYC_S3_DYNAMODB.json
    └── populate-tables.py
```

## 📊 Project Statistics

### Page Distribution
- **Admin Pages**: 33 modules
- **Seller Pages**: 14 pages
- **User Pages**: 12 pages
- **Public Pages**: 6 pages (Home, Product Details, Categories, Legal)
- **Total**: 65+ pages

### Component Organization
- **Layout Components**: 6 (Header, Footer, Search, Categories, HeroCarousel, MobileNav)
- **Auth Components**: 2 (Login, Signup)
- **Context Providers**: 4 (Auth, Cart, Wishlist, Currency)

### Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| `src/pages/admin/` | Complete admin dashboard with 33+ management modules |
| `src/pages/seller/` | Seller onboarding, dashboard, and management tools |
| `src/pages/user/` | Customer-facing pages (cart, checkout, orders, profile) |
| `src/components/` | Reusable UI components shared across pages |
| `src/contexts/` | Global state management (auth, cart, wishlist, currency) |
| `src/services/` | API integration and business logic |
| `src/lib/` | AWS Amplify and third-party library configurations |
| `vtl-templates/` | AWS AppSync VTL resolver templates |
| `scripts/` | Database seeding and utility scripts |
| `amplify-backup/` | AWS Amplify infrastructure backup |

### Technology Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Backend**: AWS Amplify (AppSync, Cognito, Lambda)
- **Database**: DynamoDB
- **Payments**: Stripe
- **Deployment**: AWS Amplify Hosting

