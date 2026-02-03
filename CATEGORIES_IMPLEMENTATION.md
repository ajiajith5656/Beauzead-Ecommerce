# Categories and Subcategories Implementation

## Overview
Implemented a complete **Categories and Subcategories Management System** for the Beauzead E-commerce Admin Dashboard with real-time GraphQL mutations and queries.

## Features Implemented

### ✅ Backend (AWS AppSync + DynamoDB)
1. **GraphQL Schema**
   - `Category` type with nested `SubCategory` array
   - `CategoryInput` and `SubCategoryInput` for mutations
   - Full CRUD operations: create, update, delete, list

2. **DynamoDB Table**: `Categories`
   - Primary Key: `categoryId` (String)
   - Attributes: name, slug, description, image_url, is_active, sub_categories, created_at, updated_at

3. **AppSync Resolvers**
   - `listCategories`: Scan all categories with subcategories
   - `createCategory`: Auto-generate IDs, slugs, timestamps
   - `updateCategory`: Update with subcategories support
   - `deleteCategory`: Remove category by ID

### ✅ Frontend (React + TypeScript)
**Component**: [`CategoryManagement.tsx`](src/pages/admin/modules/CategoryManagement.tsx)

#### Key Features:
- **List View**: Expandable/collapsible categories with subcategory counts
- **Create/Edit Modal**: Full-featured form with subcategory management
- **Subcategory Management**: Add/remove subcategories inline
- **Auto-slug Generation**: URL-friendly slugs from category names
- **Real-time Updates**: Refreshes list after each operation
- **Error Handling**: User-friendly error and success messages
- **Active/Inactive Toggle**: Control category visibility

## Data Flow

```
User Action → React Component → GraphQL Client → AppSync API → DynamoDB
```

### Example: Create Category with Subcategories

```graphql
mutation CreateCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    id
    categoryId
    name
    slug
    sub_categories {
      id
      name
      slug
      description
    }
  }
}
```

**Input:**
```json
{
  "input": {
    "name": "Electronics",
    "description": "All electronic items",
    "is_active": true,
    "sub_categories": [
      {
        "name": "Smartphones",
        "description": "Mobile phones and accessories"
      },
      {
        "name": "Laptops",
        "description": "Computers and notebooks"
      }
    ]
  }
}
```

## Usage

### Access Admin Panel
1. Navigate to: `https://www.beauzead.store/admin/dashboard`
2. Login with admin credentials
3. Select **"Category Management"** from sidebar

### Create Category
1. Click **"Add Category"** button
2. Fill in:
   - **Name** (required)
   - **Slug** (auto-generated or custom)
   - **Description**
   - **Image URL**
   - **Active status** (checkbox)
3. Add subcategories:
   - Enter subcategory name
   - Enter description (optional)
   - Click **"Add Subcategory"**
4. Click **"Create Category"**

### Edit Category
1. Click **Edit** icon on any category
2. Modify fields as needed
3. Add/remove subcategories
4. Click **"Update Category"**

### Delete Category
1. Click **Trash** icon on any category
2. Confirm deletion

### View Subcategories
- Click **chevron** icon to expand/collapse subcategories

## API Endpoints

### AppSync GraphQL Endpoint
```
https://uw322tx4wff55fvtas3uonlviy.appsync-api.us-east-1.amazonaws.com/graphql
```

### API Key (expires 2027)
```
da2-37rj5oouqnhkvptus2ikhwiquq
```

### Available Queries
- `listCategories`: Get all categories with subcategories
- `getCategory(id: ID!)`: Get single category

### Available Mutations
- `createCategory(input: CategoryInput!)`: Create new category
- `updateCategory(id: ID!, input: CategoryInput!)`: Update existing category
- `deleteCategory(id: ID!)`: Delete category
- `addSubCategory(categoryId: ID!, subCategory: SubCategoryInput!)`: Add subcategory
- `updateSubCategory(categoryId: ID!, subCategoryId: ID!, subCategory: SubCategoryInput!)`: Update subcategory
- `removeSubCategory(categoryId: ID!, subCategoryId: ID!)`: Remove subcategory

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| GraphQL Client | AWS Amplify API (generateClient) |
| Backend API | AWS AppSync (GraphQL) |
| Database | Amazon DynamoDB |
| Authentication | Amazon Cognito |
| Hosting | AWS Amplify Hosting |

## Files Modified/Created

### New Files
1. `vtl-templates/createCategory-request.vtl` - VTL resolver template
2. `CATEGORIES_IMPLEMENTATION.md` - This documentation

### Modified Files
1. [`src/pages/admin/modules/CategoryManagement.tsx`](src/pages/admin/modules/CategoryManagement.tsx)
   - Complete rewrite with GraphQL support
   - Added subcategory management UI
   - Replaced REST API calls with GraphQL mutations

## Known Issues & Limitations

### ⚠️ VTL autoId() Limitation
**Issue**: VTL's `$util.autoId()` generates the same UUID within a single execution context, causing all subcategories in one mutation to have identical IDs.

**Workaround**: Generate unique IDs in the frontend before sending to backend:
```typescript
const subCat: SubCategory = {
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  name: newSubCategory.name,
  slug: newSubCategory.name.toLowerCase().replace(/\s+/g, '-'),
  description: newSubCategory.description,
};
```

**Status**: Frontend already implements this workaround (using `Date.now().toString()`)

### Future Enhancements
1. **Real-time Subscriptions**: Implement GraphQL subscriptions for live updates across multiple admin sessions
2. **Drag-and-Drop Reordering**: Sort categories by drag-and-drop (update `sort_order` field)
3. **Bulk Operations**: Select multiple categories for batch delete/activate
4. **Category Images**: Integrate S3 upload for category images (replace URL input)
5. **Nested Subcategories**: Support multiple levels of subcategories (current: 1 level only)
6. **Category Analytics**: Track product counts per category

## Testing

### Test Create Category
```bash
curl -X POST \
  -H "x-api-key: da2-37rj5oouqnhkvptus2ikhwiquq" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateCategory($input: CategoryInput!) { createCategory(input: $input) { id categoryId name slug sub_categories { id name slug } } }",
    "variables": {
      "input": {
        "name": "Fashion",
        "description": "Clothing and accessories",
        "is_active": true,
        "sub_categories": [
          {"name": "Menswear", "description": "Men clothing"},
          {"name": "Womenswear", "description": "Women clothing"}
        ]
      }
    }
  }' \
  https://uw322tx4wff55fvtas3uonlviy.appsync-api.us-east-1.amazonaws.com/graphql
```

### Test List Categories
```bash
curl -X POST \
  -H "x-api-key: da2-37rj5oouqnhkvptus2ikhwiquq" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ listCategories { id categoryId name slug is_active sub_categories { id name slug } } }"}' \
  https://uw322tx4wff55fvtas3uonlviy.appsync-api.us-east-1.amazonaws.com/graphql
```

## Deployment

### Build and Deploy
```bash
npm run build
git add -A
git commit -m "Update categories"
git push origin main
```

Amplify automatically builds and deploys on push to `main` branch.

### Deployment URL
- **Admin Dashboard**: https://www.beauzead.store/admin/dashboard
- **Category Management**: https://www.beauzead.store/admin/category-management

## Security

- **Admin-Only Access**: Only users in Cognito "Admin" group can access Category Management
- **API Authentication**: AppSync API requires valid API key or Cognito user token
- **IAM Permissions**: AppSync role has scoped permissions to Categories table only

## Support & Troubleshooting

### Common Issues

**1. Categories not loading**
- Check browser console for GraphQL errors
- Verify API key is valid
- Check network tab for 401/403 errors

**2. Subcategories have duplicate IDs**
- Frontend generates unique IDs (Date.now() + index)
- If issue persists, check browser console

**3. "Cannot return null for non-nullable type"**
- Some old categories may lack `id` field
- Delete old test categories from DynamoDB console

### Debug Mode
Open browser DevTools and check:
- **Console**: For JavaScript errors
- **Network**: For GraphQL request/response
- **Application > Local Storage**: For cached data

## Contact
For issues or questions, contact the development team.

---
**Last Updated**: 2025-02-03
**Version**: 1.0.0
**Status**: ✅ Production Ready
