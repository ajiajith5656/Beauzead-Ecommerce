# BACKEND CHECKLIST

**Last Updated:** February 1, 2026  
**Project:** Beauzead E-commerce

---

## ✅ WE CREATED

1. **AWS Cognito User Pool** - Email + Password authentication with OTP verification, 17 users created, 3 roles (admin, seller, user)

2. **GraphQL API (AppSync)** - API endpoint configured with API Key authentication (7-day expiration)

3. **S3 Storage Bucket** - beauzead-ecommerce-images-2026 for product images

4. **Frontend Application** - React 19.2.0 with TypeScript, Vite bundler, builds successfully (979 KB)

5. **Amplify Integration** - All AWS Amplify libraries installed and configured (aws-amplify, @aws-amplify/auth, @aws-amplify/ui-react)

6. **Authentication Context** - AuthContext.tsx setup for signup, login, logout, confirmSignUp with OTP verification

7. **GraphQL Queries** - listCountryListBzdcores, listBusinessTypeBzdcores imported but not yet populated

8. **Mock Data Removed** - All fallback mock data removed from signup components (Signup.tsx, SellerSignup.tsx)

9. **Error Logging** - Console logging added for debugging API calls and component rendering

10. **Database Schema Documentation** - All 19 table schemas documented and backed up

---

## 🔨 NEXT WE NEED TO DO

1. **Create CountryList table** - Populate with country data (US, Canada, India, UK, Australia)

2. **Create BusinessType table** - Add business type categories (Retail Store, Online Store, Wholesale, Distributor)

3. **Create Product table** - Main product catalog with id, name, description, price, category, seller, stock, images

4. **Create Category table** - Product categories (Electronics, Clothing, Books, etc.)

5. **Create SubCategory table** - Link to categories for organization

6. **Create GraphQL Mutations** - createProduct, updateProduct, deleteProduct for API

7. **Create GraphQL Queries** - getProducts, getCategories, getSubCategories for API

8. **Create User Profile table** - Store user details (userId, email, fullName, phone, country, businessType, role)

9. **Create Order table** - Track customer orders (orderId, userId, items, totalAmount, status, createdAt)

10. **Create OrderItem table** - Individual items in orders (orderItemId, orderId, productId, quantity, price)

11. **Create Review table** - Product reviews (reviewId, productId, userId, rating, comment, createdAt)

12. **Create Seller table** - Seller profiles and information

13. **Create Cart table** - Shopping carts for users

14. **Create CartItem table** - Items in cart

15. **Create Wishlist table** - User wishlist functionality

16. **Create Notification table** - User notifications

17. **Deploy GraphQL API** - Run `amplify push` to deploy API to production

18. **Seed Initial Data** - Populate tables with sample/required data

19. **Test API Endpoints** - Verify queries and mutations work correctly

20. **Connect Frontend to Real API** - Update components to call actual GraphQL endpoints instead of mock data

---

## 📊 TABLES DATA

### Table 1: CountryList

**Table Name:** `CountryListBzdcore`  
**Status:** ❌ Not Created  
**Required By:** User signup, Seller signup

**Data:**
```
{
  id: "country-1"
  countryName: "United States"
  shortCode: "US"
  currency: "USD"
  dialCode: "+1"
}

{
  id: "country-2"
  countryName: "Canada"
  shortCode: "CA"
  currency: "CAD"
  dialCode: "+1"
}

{
  id: "country-3"
  countryName: "India"
  shortCode: "IN"
  currency: "INR"
  dialCode: "+91"
}

{
  id: "country-4"
  countryName: "United Kingdom"
  shortCode: "GB"
  currency: "GBP"
  dialCode: "+44"
}

{
  id: "country-5"
  countryName: "Australia"
  shortCode: "AU"
  currency: "AUD"
  dialCode: "+61"
}
```

---

### Table 2: BusinessType

**Table Name:** `BusinessTypeBzdcore`  
**Status:** ❌ Not Created  
**Required By:** Seller signup

**Data:**
```
{
  id: "btype-1"
  typeName: "Retail Store"
  description: "Physical retail storefront"
}

{
  id: "btype-2"
  typeName: "Online Store"
  description: "E-commerce seller"
}

{
  id: "btype-3"
  typeName: "Wholesale"
  description: "Wholesale distributor"
}

{
  id: "btype-4"
  typeName: "Distributor"
  description: "Product distributor"
}
```

---

### Table 3: Category

**Table Name:** `Category`  
**Status:** ❌ Not Created  
**Required By:** Product listing, filtering

**Schema:**
```
{
  id: String (Primary Key)
  name: String
  description: String
  imageUrl: String
  isActive: Boolean
}
```

**Sample Data:** Electronics, Clothing, Books, Home & Garden, Sports, Food & Beverages

---

### Table 4: SubCategory

**Table Name:** `SubCategory`  
**Status:** ❌ Not Created  
**Required By:** Product organization

**Schema:**
```
{
  id: String (Primary Key)
  categoryId: String (Foreign Key to Category)
  name: String
  description: String
  imageUrl: String
  isActive: Boolean
}
```

---

### Table 5: Product

**Table Name:** `Product`  
**Status:** ❌ Not Created  
**Required By:** Product listing, catalog, shopping

**Schema:**
```
{
  id: String (Primary Key)
  name: String
  description: String
  price: Number
  currency: String
  category: String (FK to Category)
  subCategory: String (FK to SubCategory)
  seller: String (FK to Seller)
  stock: Number
  sku: String
  images: Array
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

### Table 6: User

**Table Name:** `User`  
**Status:** ❌ Not Created  
**Required By:** User profile, orders, reviews

**Schema:**
```
{
  id: String (Primary Key)
  email: String
  fullName: String
  phone: String
  country: String (FK to CountryList)
  businessType: String (FK to BusinessType) [for sellers]
  role: String (admin, seller, user)
  createdAt: DateTime
}
```

---

### Table 7: Order

**Table Name:** `Order`  
**Status:** ❌ Not Created  
**Required By:** Order management, tracking

**Schema:**
```
{
  id: String (Primary Key)
  userId: String (FK to User)
  items: Array (OrderItems)
  totalAmount: Number
  currency: String
  status: String (pending, processing, shipped, delivered)
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

### Table 8: OrderItem

**Table Name:** `OrderItem`  
**Status:** ❌ Not Created  
**Required By:** Order details

**Schema:**
```
{
  id: String (Primary Key)
  orderId: String (FK to Order)
  productId: String (FK to Product)
  quantity: Number
  price: Number
}
```

---

### Table 9: Review

**Table Name:** `Review`  
**Status:** ❌ Not Created  
**Required By:** Product reviews, ratings

**Schema:**
```
{
  id: String (Primary Key)
  productId: String (FK to Product)
  userId: String (FK to User)
  rating: Number (1-5)
  comment: String
  createdAt: DateTime
}
```

---

### Table 10: Seller

**Table Name:** `Seller`  
**Status:** ❌ Not Created  
**Required By:** Seller dashboard, product management

**Schema:**
```
{
  id: String (Primary Key)
  userId: String (FK to User)
  businessName: String
  businessType: String (FK to BusinessType)
  country: String (FK to CountryList)
  phone: String
  email: String
  verificationStatus: String (pending, approved, rejected)
  createdAt: DateTime
}
```

---

### Table 11: Cart

**Table Name:** `Cart`  
**Status:** ❌ Not Created  
**Required By:** Shopping cart functionality

**Schema:**
```
{
  id: String (Primary Key)
  userId: String (FK to User)
  items: Array (CartItems)
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

### Table 12: CartItem

**Table Name:** `CartItem`  
**Status:** ❌ Not Created  
**Required By:** Cart management

**Schema:**
```
{
  id: String (Primary Key)
  cartId: String (FK to Cart)
  productId: String (FK to Product)
  quantity: Number
  addedAt: DateTime
}
```

---

### Table 13: Wishlist

**Table Name:** `Wishlist`  
**Status:** ❌ Not Created  
**Required By:** Wishlist feature

**Schema:**
```
{
  id: String (Primary Key)
  userId: String (FK to User)
  items: Array (Product IDs)
  createdAt: DateTime
}
```

---

### Table 14: Notification

**Table Name:** `Notification`  
**Status:** ❌ Not Created  
**Required By:** User notifications

**Schema:**
```
{
  id: String (Primary Key)
  userId: String (FK to User)
  message: String
  type: String (order, product, system)
  read: Boolean
  createdAt: DateTime
}
```

---

### Table 15: KYCDocuments

**Table Name:** `KYCDocuments`  
**Status:** ❌ Not Created  
**Required By:** Seller verification

**Schema:**
```
{
  id: String (Primary Key)
  userId: String (FK to User)
  documentType: String (aadhar, pan, license)
  documentUrl: String (S3 link)
  verificationStatus: String (pending, approved, rejected)
  uploadedAt: DateTime
  verifiedAt: DateTime
}
```

---

## 📝 NOTES

- All 15 tables are currently NOT CREATED in DynamoDB
- Priority: Create CountryList and BusinessType first (needed for signup)
- GraphQL schema must be updated with all types and queries/mutations
- Use `amplify push` after schema updates to deploy
- Frontend is ready to consume data once tables are created
- No authentication required - API uses API Key method (7-day expiration)

