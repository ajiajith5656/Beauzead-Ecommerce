# 🚀 Beauzead E-commerce - AWS Amplify Backend Setup

## ✅ Status: Amplify Initialized!

**Project Name:** beauzeadecommerce
**Environment:** production  
**Region:** us-east-1
**App ID:** d2vvm285dmduba

---

## 📋 Next Steps

### Option 1: Run the automated setup script
```bash
./setup-amplify-backend.sh
```

This will guide you through adding:
- 📧 **Authentication** (Cognito User Pools)
- 🔌 **API** (GraphQL + DynamoDB)
- 💾 **Storage** (S3 Buckets)

### Option 2: Manual setup

#### 1. Add Authentication
```bash
amplify add auth
```
**Choices:**
- Default configuration
- Sign in: Email
- Advanced: No, I am done

#### 2. Add GraphQL API
```bash
amplify add api
```
**Choices:**
- Service: GraphQL
- Name: beauzeadapi
- Authorization: Amazon Cognito User Pool
- Schema: Single object with fields

#### 3. Add Storage
```bash
amplify add storage
```
**Choices:**
- Service: Content
- Name: beauzeadstorage
- Auth access: create/update, read, delete
- Guest access: read

#### 4. Deploy everything
```bash
amplify push
```

---

## 🔑 AWS Credentials (Already Configured)

- **User:** bzedcorebackend
- **Region:** us-east-1
- **Account:** 422287834049

Credentials are saved in `~/.bashrc` and will persist across sessions.

---

## 🛠️ Useful Commands

```bash
# Check project status
amplify status

# Open Amplify Console
amplify console

# Open Amplify Studio (visual data modeling)
amplify console admin

# View backend resources
amplify env list

# Pull latest backend
amplify pull

# Delete resources
amplify delete
```

---

## 📂 Project Structure (After Setup)

```
Beauzead-Ecommerce/
├── amplify/
│   ├── backend/
│   │   ├── auth/          # Cognito User Pool
│   │   ├── api/           # GraphQL API & DynamoDB
│   │   └── storage/       # S3 Buckets
│   └── team-provider-info.json
├── src/
│   ├── aws-exports.js     # Auto-generated config
│   └── graphql/           # Auto-generated queries/mutations
```

---

## 🎯 Recommended Schema for beauzeadapi

After adding API, update the schema in `amplify/backend/api/beauzeadapi/schema.graphql`:

```graphql
type User @model @auth(rules: [{allow: owner}]) {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  orders: [Order] @hasMany
  wishlist: [Product] @manyToMany(relationName: "UserWishlist")
}

enum UserRole {
  USER
  SELLER
  ADMIN
}

type Seller @model @auth(rules: [{allow: owner}, {allow: groups, groups: ["Admin"]}]) {
  id: ID!
  businessName: String!
  email: String!
  verificationStatus: VerificationStatus!
  products: [Product] @hasMany
  orders: [Order] @hasMany
}

enum VerificationStatus {
  UNVERIFIED
  PENDING
  VERIFIED
}

type Product @model @auth(rules: [
  {allow: owner, operations: [create, update, delete]},
  {allow: public, operations: [read]}
]) {
  id: ID!
  name: String!
  description: String
  price: Float!
  category: String!
  images: [String]
  stock: Int!
  sellerId: ID! @index(name: "bySeller")
  seller: Seller @belongsTo
  reviews: [Review] @hasMany
}

type Order @model @auth(rules: [{allow: owner}]) {
  id: ID!
  userId: ID! @index(name: "byUser")
  sellerId: ID! @index(name: "bySeller")
  products: [OrderItem] @hasMany
  total: Float!
  status: OrderStatus!
  createdAt: AWSDateTime!
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

type OrderItem @model {
  id: ID!
  productId: ID!
  quantity: Int!
  price: Float!
}

type Review @model @auth(rules: [{allow: owner}, {allow: public, operations: [read]}]) {
  id: ID!
  productId: ID! @index(name: "byProduct")
  userId: ID!
  rating: Int!
  comment: String
  createdAt: AWSDateTime!
}
```

---

## 🌐 Amplify Studio Access

After deployment, access Amplify Studio for visual management:

```bash
amplify console admin
```

**Features:**
- Visual data modeling
- Content management
- User management
- File storage browser
- Authentication settings

---

## 📱 Frontend Integration

After `amplify push`, use this in your React app:

```typescript
// src/main.tsx or src/App.tsx
import { Amplify } from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);
```

---

## 🔒 Security Best Practices

✅ IAM user created with limited Amplify permissions
✅ Credentials stored securely in environment variables
✅ Cognito User Pools for authentication
✅ Authorization rules defined in schema
✅ HTTPS enforced for all API calls

---

## 📞 Support

**AWS Amplify Docs:** https://docs.amplify.aws/
**Amplify Studio:** https://docs.amplify.aws/console/
**GitHub Issues:** https://github.com/aws-amplify/amplify-cli/issues

---

**Created:** January 30, 2026
**Last Updated:** January 30, 2026
