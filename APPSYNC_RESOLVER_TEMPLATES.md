# AppSync SQL Resolvers for Aurora PostgreSQL

## 📌 Setup Instructions

1. **Create RDS Data Source** in AppSync
   - Type: RDS Database
   - Select: beauzead-aurora-postgres-prod cluster
   - Database: beauzeaddb
   - Username: beauzeadadmin

2. **Create IAM Role** for AppSync → RDS access
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "rds-db:connect"
         ],
         "Resource": "arn:aws:rds:us-east-1:*:dbuser:*/*"
       }
     ]
   }
   ```

---

## 🌍 COUNTRIES QUERIES

### Query: List All Countries

**GraphQL Schema:**
```graphql
type Country {
  id: Int!
  country_name: String!
  country_code: String!
  currency_code: String!
  currency_name: String
  dialing_code: String!
  region: String!
  is_active: Boolean!
  created_at: String!
  updated_at: String!
}

type Query {
  listCountries(region: String): [Country!]!
  getCountry(id: Int!): Country
  searchCountry(searchTerm: String!): [Country!]!
}
```

**AppSync Resolver - Request (Velocity Template Language):**
```velocity
#if($ctx.args.region)
  {
    "version": "2018-05-29",
    "statements": [
      "SELECT * FROM countries WHERE is_active = true AND region = :region ORDER BY country_name ASC"
    ],
    "variableValues": {
      ":region": "$ctx.args.region"
    }
  }
#else
  {
    "version": "2018-05-29",
    "statements": [
      "SELECT * FROM countries WHERE is_active = true ORDER BY country_name ASC"
    ]
  }
#end
```

**AppSync Resolver - Response:**
```velocity
$utils.rds.toJsonObject($ctx.result)
```

### Query: Get Single Country

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "SELECT * FROM countries WHERE id = :id AND is_active = true"
  ],
  "variableValues": {
    ":id": $ctx.args.id
  }
}
```

**Resolver - Response:**
```velocity
#if($ctx.result.records && $ctx.result.records.size() > 0)
  $utils.rds.toJsonObject($ctx.result.records[0])
#else
  null
#end
```

### Query: Search Countries

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "SELECT * FROM countries WHERE is_active = true AND (country_name ILIKE :search OR country_code ILIKE :search OR dialing_code LIKE :search) ORDER BY country_name ASC LIMIT 20"
  ],
  "variableValues": {
    ":search": "%$ctx.args.searchTerm%"
  }
}
```

**Resolver - Response:**
```velocity
$utils.rds.toJsonObject($ctx.result)
```

---

## 📦 PRODUCTS QUERIES

### Query: List Products with Filters

**GraphQL Schema:**
```graphql
type Product {
  id: Int!
  seller_id: Int!
  category_id: Int
  product_name: String!
  product_description: String
  sku: String
  price: Float!
  discount_percentage: Float!
  discounted_price: Float
  stock_quantity: Int!
  product_images: String  # JSON array
  main_image_url: String
  rating: Float!
  total_reviews: Int!
  total_sold: Int!
  is_featured: Boolean!
  created_at: String!
}

type Query {
  listProducts(
    limit: Int
    offset: Int
    categoryId: Int
    minPrice: Float
    maxPrice: Float
    sortBy: String
  ): [Product!]!
}
```

**Resolver - Request:**
```velocity
#set($limit = $ctx.args.limit ?: 20)
#set($offset = $ctx.args.offset ?: 0)

#set($whereConditions = ["is_active = true"])

#if($ctx.args.categoryId)
  #set($void = $whereConditions.add("category_id = :categoryId"))
#end

#if($ctx.args.minPrice)
  #set($void = $whereConditions.add("price >= :minPrice"))
#end

#if($ctx.args.maxPrice)
  #set($void = $whereConditions.add("price <= :maxPrice"))
#end

#set($whereClause = $util.join($whereConditions, " AND "))

#set($orderBy = "created_at DESC")
#if($ctx.args.sortBy)
  #if($ctx.args.sortBy == "price_asc")
    #set($orderBy = "price ASC")
  #elseif($ctx.args.sortBy == "price_desc")
    #set($orderBy = "price DESC")
  #elseif($ctx.args.sortBy == "rating")
    #set($orderBy = "rating DESC")
  #elseif($ctx.args.sortBy == "newest")
    #set($orderBy = "created_at DESC")
  #end
#end

{
  "version": "2018-05-29",
  "statements": [
    "SELECT * FROM products WHERE $whereClause ORDER BY $orderBy LIMIT :limit OFFSET :offset"
  ],
  "variableValues": {
    ":limit": $limit,
    ":offset": $offset
    #if($ctx.args.categoryId)
      , ":categoryId": $ctx.args.categoryId
    #end
    #if($ctx.args.minPrice)
      , ":minPrice": $ctx.args.minPrice
    #end
    #if($ctx.args.maxPrice)
      , ":maxPrice": $ctx.args.maxPrice
    #end
  }
}
```

**Resolver - Response:**
```velocity
$utils.rds.toJsonObject($ctx.result)
```

### Query: Get Product with Reviews

**GraphQL Schema:**
```graphql
type ProductDetail {
  id: Int!
  product_name: String!
  price: Float!
  rating: Float!
  total_reviews: Int!
  reviews: [Review!]!
}

type Review {
  id: Int!
  rating: Int!
  review_title: String!
  review_text: String!
  user_id: Int!
  created_at: String!
}

type Query {
  getProductDetail(id: Int!): ProductDetail
}
```

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "SELECT * FROM products WHERE id = :id",
    "SELECT * FROM reviews WHERE product_id = :id AND is_published = true ORDER BY created_at DESC LIMIT 10"
  ],
  "variableValues": {
    ":id": $ctx.args.id
  }
}
```

**Resolver - Response:**
```velocity
#if($ctx.result[0].records && $ctx.result[0].records.size() > 0)
  #set($product = $ctx.result[0].records[0])
  {
    "id": $product.id,
    "product_name": "$product.product_name",
    "price": $product.price,
    "rating": $product.rating,
    "total_reviews": $product.total_reviews,
    "reviews": $utils.rds.toJsonObject($ctx.result[1])
  }
#else
  null
#end
```

---

## 🛒 ORDERS QUERIES

### Query: Get User Orders

**GraphQL Schema:**
```graphql
type OrderDetail {
  id: Int!
  order_number: String!
  total_amount: Float!
  order_status: String!
  payment_status: String!
  created_at: String!
  items: [OrderItem!]!
}

type OrderItem {
  id: Int!
  product_id: Int!
  quantity: Int!
  unit_price: Float!
  total_price: Float!
}

type Query {
  getUserOrders(userId: Int!): [OrderDetail!]!
}
```

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "SELECT * FROM orders WHERE user_id = :userId ORDER BY created_at DESC LIMIT 50",
    "SELECT oi.* FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.user_id = :userId"
  ],
  "variableValues": {
    ":userId": $ctx.args.userId
  }
}
```

**Resolver - Response:**
```velocity
#set($orders = $utils.rds.toJsonObject($ctx.result[0]))
#set($items = $utils.rds.toJsonObject($ctx.result[1]))

#set($orderMap = {})
#foreach($order in $orders)
  #set($void = $orderMap.put($order.id, $order))
  #set($void = $order.put("items", []))
#end

#foreach($item in $items)
  #if($orderMap.containsKey($item.order_id))
    #set($void = $orderMap.get($item.order_id).items.add($item))
  #end
#end

$util.toJson($orders)
```

---

## 🛍️ SHOPPING CART MUTATIONS

### Mutation: Add to Cart

**GraphQL Schema:**
```graphql
type CartItem {
  id: Int!
  user_id: Int!
  product_id: Int!
  quantity: Int!
  added_at: String!
}

type Mutation {
  addToCart(
    userId: Int!
    productId: Int!
    quantity: Int!
  ): CartItem!
}
```

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "INSERT INTO shopping_carts (user_id, product_id, quantity) VALUES (:userId, :productId, :quantity) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = shopping_carts.quantity + :quantity RETURNING *"
  ],
  "variableValues": {
    ":userId": $ctx.args.userId,
    ":productId": $ctx.args.productId,
    ":quantity": $ctx.args.quantity
  }
}
```

**Resolver - Response:**
```velocity
#if($ctx.result.records && $ctx.result.records.size() > 0)
  $utils.rds.toJsonObject($ctx.result.records[0])
#else
  $utils.error("Failed to add item to cart")
#end
```

### Mutation: Remove from Cart

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "DELETE FROM shopping_carts WHERE user_id = :userId AND product_id = :productId"
  ],
  "variableValues": {
    ":userId": $ctx.args.userId,
    ":productId": $ctx.args.productId
  }
}
```

**Resolver - Response:**
```velocity
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## 👤 USER OPERATIONS

### Mutation: Create User

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "INSERT INTO users (cognito_user_id, email, full_name, phone_number, country_id, role) VALUES (:cognitoUserId, :email, :fullName, :phoneNumber, :countryId, 'user') RETURNING *"
  ],
  "variableValues": {
    ":cognitoUserId": "$ctx.args.cognitoUserId",
    ":email": "$ctx.args.email",
    ":fullName": "$ctx.args.fullName",
    ":phoneNumber": "$ctx.args.phoneNumber",
    ":countryId": $ctx.args.countryId
  }
}
```

**Resolver - Response:**
```velocity
#if($ctx.result.records && $ctx.result.records.size() > 0)
  $utils.rds.toJsonObject($ctx.result.records[0])
#else
  $utils.error("Failed to create user")
#end
```

---

## 🎯 COMPLEX QUERIES

### Query: Top Sellers by Revenue

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "SELECT s.id, s.business_name, COUNT(DISTINCT o.id) as total_orders, SUM(oi.total_price) as total_revenue, AVG(r.rating) as avg_rating FROM sellers s LEFT JOIN order_items oi ON s.id = oi.seller_id LEFT JOIN orders o ON oi.order_id = o.id LEFT JOIN reviews r ON r.product_id IN (SELECT id FROM products WHERE seller_id = s.id) WHERE s.is_active = true GROUP BY s.id, s.business_name ORDER BY total_revenue DESC LIMIT 20"
  ]
}
```

**Resolver - Response:**
```velocity
$utils.rds.toJsonObject($ctx.result)
```

---

## 📊 ANALYTICS QUERIES

### Query: Sales by Category

**Resolver - Request:**
```velocity
{
  "version": "2018-05-29",
  "statements": [
    "SELECT c.category_name, COUNT(DISTINCT o.id) as total_orders, SUM(oi.total_price) as revenue, AVG(r.rating) as avg_rating FROM categories c LEFT JOIN products p ON c.id = p.category_id LEFT JOIN order_items oi ON p.id = oi.product_id LEFT JOIN orders o ON oi.order_id = o.id LEFT JOIN reviews r ON p.id = r.product_id GROUP BY c.id, c.category_name ORDER BY revenue DESC"
  ]
}
```

---

## ⚠️ Error Handling

Add to Response templates for error handling:

```velocity
#if($ctx.error)
  $utils.error("Database query failed: $ctx.error.message", "DATABASE_ERROR", $ctx.result)
#elseif(!$ctx.result.records || $ctx.result.records.size() == 0)
  $utils.error("No records found", "NOT_FOUND")
#else
  $utils.rds.toJsonObject($ctx.result)
#end
```

---

## 🔒 Security Notes

1. **Always validate input** in Request templates
2. **Use parameterized queries** (`:variableName`)
3. **Limit results** with LIMIT clause
4. **Check permissions** before returning data
5. **Log sensitive operations** in CloudWatch

---

## 🧪 Testing in AppSync Console

1. Go to AppSync Console
2. Select your API
3. Click "Queries"
4. Write your query:

```graphql
query {
  listCountries(region: "Asia") {
    id
    country_name
    currency_code
    dialing_code
  }
}
```

5. Click Play button to test

---

*Template Examples - February 2026*
