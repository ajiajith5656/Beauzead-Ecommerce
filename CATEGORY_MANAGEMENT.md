# Category Management Implementation

## Overview
Full Category Management system with ADD, EDIT, and DELETE operations integrated with AWS AppSync GraphQL API and AWS Amplify backend.

## Architecture

### Frontend Layer
- **UI Component**: `src/pages/admin/modules/CategoryManagement.tsx`
- **Service Layer**: `src/services/categoryService.ts` (GraphQL client)
- **Admin API Layer**: `src/services/admin/adminApiService.ts` (Business logic)

### Backend Layer (AWS)
- **GraphQL API**: AWS AppSync
- **Database**: DynamoDB (auto-generated via Amplify)
- **Schema**: `amplify/backend/api/beauzeadecommerce/schema.graphql`

---

## GraphQL Schema

### Category Model
```graphql
type Category @model @auth(rules: [{ allow: public }]) {
  id: ID!
  name: String!
  description: String
  imageUrl: String
  isActive: Boolean! @default(value: "true")
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Fields**:
- `id`: Unique identifier (auto-generated UUID)
- `name`: Category name (required)
- `description`: Optional category description
- `imageUrl`: Optional category image URL
- `isActive`: Boolean flag for active/inactive status (defaults to true)
- `createdAt`: Timestamp of creation (auto-generated)
- `updatedAt`: Timestamp of last update (auto-generated)

---

## GraphQL Operations

### Queries

#### Get Single Category
**Query**: `getCategory`
```graphql
query GetCategory($id: ID!) {
  getCategory(id: $id) {
    id
    name
    description
    imageUrl
    isActive
    createdAt
    updatedAt
  }
}
```

#### List All Categories
**Query**: `listCategories`
```graphql
query ListCategories(
  $filter: ModelCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      imageUrl
      isActive
      createdAt
      updatedAt
    }
    nextToken
  }
}
```

### Mutations

#### Create Category
**Mutation**: `createCategory`
```graphql
mutation CreateCategory(
  $input: CreateCategoryInput!
  $condition: ModelCategoryConditionInput
) {
  createCategory(input: $input, condition: $condition) {
    id
    name
    description
    imageUrl
    isActive
    createdAt
    updatedAt
  }
}
```

**Input Example**:
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "imageUrl": "https://example.com/electronics.jpg",
  "isActive": true
}
```

#### Update Category
**Mutation**: `updateCategory`
```graphql
mutation UpdateCategory(
  $input: UpdateCategoryInput!
  $condition: ModelCategoryConditionInput
) {
  updateCategory(input: $input, condition: $condition) {
    id
    name
    description
    imageUrl
    isActive
    createdAt
    updatedAt
  }
}
```

**Input Example**:
```json
{
  "id": "category-id-123",
  "name": "Electronics & Gadgets",
  "isActive": true
}
```

#### Delete Category
**Mutation**: `deleteCategory`
```graphql
mutation DeleteCategory(
  $input: DeleteCategoryInput!
  $condition: ModelCategoryConditionInput
) {
  deleteCategory(input: $input, condition: $condition) {
    id
    name
  }
}
```

**Input Example**:
```json
{
  "id": "category-id-123"
}
```

---

## Service Layer Implementation

### CategoryService (`src/services/categoryService.ts`)

**Methods**:

#### 1. `getAllCategories(limit?: number)`
- **Purpose**: Fetch all categories from GraphQL
- **Parameters**: 
  - `limit` (optional): Maximum number of categories to fetch (default: 100)
- **Returns**: `Category[] | null`
- **Errors**: Logs error to console

#### 2. `getCategoryById(categoryId: string)`
- **Purpose**: Fetch single category by ID
- **Parameters**: 
  - `categoryId`: UUID of the category
- **Returns**: `Category | null`

#### 3. `createNewCategory(categoryData: CategoryInput)`
- **Purpose**: Create new category in database
- **Parameters**: 
  - `categoryData`: Object with name (required), description, imageUrl, isActive
- **Returns**: `Category | null` (returns created category)
- **Validation**: Name is required
- **Defaults**: isActive defaults to true

#### 4. `updateExistingCategory(categoryId: string, categoryData: Partial<CategoryInput>)`
- **Purpose**: Update existing category
- **Parameters**: 
  - `categoryId`: UUID of category to update
  - `categoryData`: Partial object with fields to update
- **Returns**: `Category | null` (returns updated category)
- **Note**: Only specified fields are updated

#### 5. `deleteExistingCategory(categoryId: string)`
- **Purpose**: Delete category from database
- **Parameters**: 
  - `categoryId`: UUID of category to delete
- **Returns**: `boolean` (true if successful)
- **Warning**: This operation cannot be undone

#### 6. `toggleCategoryStatus(categoryId: string, isActive: boolean)`
- **Purpose**: Toggle category active/inactive status
- **Parameters**: 
  - `categoryId`: UUID of category
  - `isActive`: Boolean to set status
- **Returns**: `Category | null` (returns updated category)
- **Convenience**: Wrapper around updateExistingCategory

---

## Admin API Service Integration

### Methods in `src/services/admin/adminApiService.ts`

All category operations are wrapped for admin use:

```typescript
// Get all categories
export const getAllCategories = async (
  _page?: number,
  limit?: number
): Promise<{ categories: Category[]; total: number } | null>

// Create category
export const createCategory = async (
  categoryData: Partial<Category>
): Promise<Category | null>

// Update category
export const updateCategory = async (
  categoryId: string,
  categoryData: Partial<Category>
): Promise<Category | null>

// Delete category
export const deleteCategory = async (
  categoryId: string
): Promise<boolean>

// Toggle status
export const toggleCategoryStatus = async (
  categoryId: string,
  isActive: boolean
): Promise<Category | null>
```

---

## UI Component Usage

### CategoryManagement Component

**File**: `src/pages/admin/modules/CategoryManagement.tsx`

**Features**:

1. **Display Categories**
   - Grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
   - Shows category image, name, description, and status badge
   - Status badge: Green (ACTIVE) or Red (INACTIVE)

2. **Add Category**
   - Click "Add Category" button
   - Modal form with fields: name, description, image_url, is_active
   - Submit button to create

3. **Edit Category**
   - Click Edit icon on category card
   - Pre-populated form with existing data
   - Submit button to update

4. **Delete Category**
   - Click Delete icon on category card
   - Confirmation dialog appears
   - Click confirm to delete

5. **Status Management**
   - Toggle active/inactive status in edit form
   - Updates badge color in real-time

6. **Error & Success Messages**
   - Green success banners for completed actions
   - Red error banners for failed actions
   - Dismissible with X button

### Form Data Structure
```typescript
{
  name: string,        // Required, displayed as category title
  description: string, // Optional, shown under name
  image_url: string,   // Optional, displayed as category image
  is_active: boolean   // Active status (true/false)
}
```

---

## Data Flow

### Create Flow
```
UI Form → CategoryManagement.handleSave()
  → categoryService.createNewCategory()
    → GraphQL Mutation: createCategory
      → AWS AppSync
        → DynamoDB (stores new document)
    ← Returns created Category with ID
  → Refresh category list
  → Show success message
  → Close form
```

### Edit Flow
```
UI Edit Button → CategoryManagement.startEdit()
  → Pre-populate form with selected category data
  → User modifies fields
  → CategoryManagement.handleSave()
    → categoryService.updateExistingCategory()
      → GraphQL Mutation: updateCategory
        → AWS AppSync
          → DynamoDB (updates document)
        ← Returns updated Category
      → Refresh category list
      → Show success message
      → Close form
```

### Delete Flow
```
UI Delete Button → CategoryManagement.handleDelete()
  → categoryService.deleteExistingCategory()
    → GraphQL Mutation: deleteCategory
      → AWS AppSync
        → DynamoDB (removes document)
    ← Success confirmation
  → Refresh category list
  → Show success message
```

---

## Error Handling

### Service Layer
- All methods return `null` on error
- Errors logged to console with descriptive messages
- Try-catch blocks capture GraphQL and network errors

### UI Layer
- Error state managed in component
- User-friendly error messages displayed
- Dismissible error banners
- Automatic refresh on retry

### Common Errors
1. **Network Error**: "Failed to load categories"
2. **Create Error**: "Failed to create category"
3. **Update Error**: "Failed to update category"
4. **Delete Error**: "Failed to delete category"

---

## State Management

### Component State
```typescript
{
  categories: Category[],           // List of all categories
  loading: boolean,                 // Loading state
  error: string | null,             // Error message
  success: string | null,           // Success message
  showForm: boolean,                // Show/hide form modal
  editingId: string | null,         // ID of category being edited
  formData: {                        // Current form data
    name: string,
    description: string,
    image_url: string,
    is_active: boolean
  },
  actionLoading: string | null      // ID of item being acted upon
}
```

---

## Testing Scenarios

### Test Case 1: Create Category
1. Click "Add Category" button
2. Fill form:
   - Name: "Fashion"
   - Description: "Clothing and accessories"
   - Image: (optional)
   - Status: Active
3. Click Create
4. ✅ Category appears in grid
5. ✅ Success message shows

### Test Case 2: Edit Category
1. Click Edit icon on category card
2. Change name: "Fashion & Accessories"
3. Click Save
4. ✅ Category name updated
5. ✅ Success message shows

### Test Case 3: Delete Category
1. Click Delete icon on category card
2. Confirm deletion
3. ✅ Category removed from grid
4. ✅ Success message shows

### Test Case 4: Toggle Status
1. Edit a category
2. Uncheck "is_active" checkbox
3. Save
4. ✅ Status badge changes to red (INACTIVE)
5. Edit again
6. Check "is_active" checkbox
7. Save
8. ✅ Status badge changes to green (ACTIVE)

---

## API Integration Points

### Endpoint: `/admin/dashboard/metrics` (Future)
- Will include category count in Business Metrics
- Current: Shows 0 (needs backend implementation)

### Endpoint: `/admin/products` (Future)
- Products filtered by category ID
- Category must exist before assigning products

---

## Performance Considerations

### Optimization Strategies
1. **Caching**: Categories cached in component state
2. **Pagination**: Limit parameter supports large datasets (default 100)
3. **Lazy Loading**: Images loaded on demand in grid
4. **Filtering**: GraphQL supports filter expressions

### Scalability
- Supports unlimited categories (DynamoDB scalable)
- List operation supports pagination with nextToken
- No N+1 queries (direct GraphQL calls)

---

## Security

### AWS Amplify Auth Rules
```graphql
@auth(rules: [{ allow: public }])
```
**Note**: Currently set to public for testing. Should be restricted to:
- Admins only for Create/Update/Delete
- Public for Read operations

### Recommended Auth Rules
```graphql
@auth(rules: [
  { allow: private, provider: userPools, operations: [create, update, delete] }
  { allow: public, operations: [read] }
])
```

---

## Deployment Status

### Completed ✅
- GraphQL schema created with Category model
- GraphQL mutations (create, update, delete) defined
- GraphQL queries (get, list) defined
- CategoryService implemented
- AdminApiService integration updated
- UI component connected and functional
- Build successful (no TypeScript errors)

### In Progress 🔄
- AWS Amplify push (deploying schema to DynamoDB)

### Pending ⏳
- Update dashboard metrics to fetch category count
- Add category filtering in product management
- Implement real-time subscriptions for category changes
- Add category bulk operations

---

## Code References

### Key Files
- [Schema Definition](amplify/backend/api/beauzeadecommerce/schema.graphql)
- [GraphQL Mutations](src/graphql/mutations.js)
- [GraphQL Queries](src/graphql/queries.js)
- [Category Service](src/services/categoryService.ts)
- [Admin API Service](src/services/admin/adminApiService.ts)
- [UI Component](src/pages/admin/modules/CategoryManagement.tsx)

---

## Next Steps

1. Wait for Amplify deployment to complete
2. Test category operations in admin dashboard
3. Implement Product category filtering
4. Add dashboard metrics for category count
5. Implement real-time category subscription updates
6. Add category image upload to S3
7. Implement bulk category operations
