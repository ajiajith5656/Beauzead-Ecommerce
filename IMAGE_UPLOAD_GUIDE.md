# Image Upload Gallery - Category Management

## 📸 Image Upload Features

### Why S3 Gallery Instead of URL Upload?

**Problem with URL-only approach:**
- Admin must find and manage URLs externally
- No file organization
- Difficult to track which images belong to which category
- Poor user experience

**Benefits of S3 Gallery:**
- ✅ One-click upload from admin's computer
- ✅ Automatic compression and resizing
- ✅ File organization by category
- ✅ Real-time preview before saving
- ✅ Upload progress tracking
- ✅ Size validation and optimization

---

## 🖼️ Image Specifications

### Size & Compression
- **Original file limit**: 10 MB (before compression)
- **Compressed size**: Max **500 KB**
- **Dimensions**: Resized to **500×500 pixels**
- **Quality**: 85% JPEG compression
- **Formats**: JPEG, PNG, WebP, GIF

### Storage
- **S3 Bucket**: `beauzead-ecommerce-images-2026`
- **Region**: `us-east-1`
- **Path structure**: `category-images/{categoryId}/{timestamp}-{filename}`
- **CORS enabled**: Yes (for browser upload)

### Example Compression
```
Original: sample-image.jpg (3.2 MB, 2400×2400px)
         ↓ Compression
Uploaded: 1707062345-sample-image.jpg (245 KB, 500×500px)
         ↓ Size Reduction
Result: 92.3% smaller, instant load speed ⚡
```

---

## 🎯 How It Works

### 1. Upload Flow in Admin Dashboard

```
Admin clicks "Add Category" 
     ↓
Opens form modal
     ↓
Sees ImageUpload component
     ↓
Clicks "Click to upload image" area
     ↓
Selects file from computer
     ↓
System validates file
     ↓
Shows preview + compression progress
     ↓
Auto-compresses to 500×500px, 85% quality
     ↓
Uploads to S3 bucket
     ↓
Returns public URL
     ↓
Saves category with image URL
```

### 2. Component: ImageUpload

**Location**: `src/components/ImageUpload.tsx`

**Props:**
```typescript
interface ImageUploadProps {
  categoryId?: string;           // Organizes images in S3
  onImageUrlChange: (url: string) => void;  // Returns S3 URL
  currentImageUrl?: string;      // For edit mode, shows current image
  onError?: (error: string) => void;  // Error handling
}
```

**Features:**
- Drag & drop support (click to select)
- Real-time preview
- Upload progress with status messages
- Error handling and validation
- Image info display (original size, compressed size, dimensions)

### 3. Utility: imageUpload.ts

**Location**: `src/utils/imageUpload.ts`

**Main Functions:**

#### `validateImageFile(file: File): string | null`
```typescript
// Checks:
// ✓ File exists
// ✓ Type is image (JPEG, PNG, WebP, GIF)
// ✓ Size < 10 MB
// Returns error message or null
```

#### `compressImage(file: File, options?): Promise<Blob>`
```typescript
// Options:
// - maxWidth: 500 (default)
// - maxHeight: 500 (default)
// - quality: 0.85 (default, 85%)
// - maxSizeBytes: 512000 (500KB default)
//
// Returns compressed Blob ready for upload
```

#### `uploadImageToS3(blob, categoryId, fileName): Promise<string>`
```typescript
// Uploads to S3 with path:
// category-images/{categoryId}/{timestamp}-{filename}
//
// Returns public URL like:
// https://beauzead-ecommerce-images-2026.s3.amazonaws.com/...
```

#### `processAndUploadImage(file, categoryId, onProgress?): Promise<string>`
```typescript
// Complete workflow:
// 1. Validate
// 2. Compress
// 3. Upload
// 4. Return URL
//
// onProgress callback shows: "Validating...", "Compressing...", etc.
```

---

## 🔧 Integration with CategoryManagement

### Before (URL-only)
```tsx
<div>
  <label>Image URL</label>
  <input
    type="url"
    value={formData.image_url}
    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
  />
</div>
```

### After (Gallery Upload)
```tsx
<ImageUpload
  categoryId={editingId || 'new'}
  onImageUrlChange={(url) => setFormData({ ...formData, image_url: url })}
  currentImageUrl={formData.image_url}
  onError={(error) => setError(error)}
/>
```

---

## 📊 S3 Bucket Configuration

### S3 Setup
```bash
# Bucket created: beauzead-ecommerce-images-2026
# Region: us-east-1
# CORS enabled for cross-origin browser uploads
# Public read access enabled (images are public URLs)
```

### CORS Configuration
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### Amplify Storage Config
**File**: `src/lib/amplifyConfig.ts`
```typescript
Storage: {
  S3: {
    region: 'us-east-1',
    bucket: 'beauzead-ecommerce-images-2026',
  },
}
```

---

## 📝 Example Usage

### In Category Add/Edit Form
```tsx
import ImageUpload from '../components/ImageUpload';

// Inside form state
const [imageUrl, setImageUrl] = useState('');

// In JSX
<ImageUpload
  categoryId="category-123"
  onImageUrlChange={setImageUrl}
  onError={(error) => alert(error)}
/>

// When saving
const category = {
  name: "Electronics",
  description: "Electronic devices",
  image_url: imageUrl,  // S3 public URL
  is_active: true
};
await adminApiService.createCategory(category);
```

---

## 🚨 Error Handling

### Validation Errors
```
❌ "No file selected"
❌ "Invalid image type. Allowed: JPEG, PNG, WebP, GIF"
❌ "File too large (15.2 MB). Max: 10MB"
```

### Upload Errors
```
❌ "File size 250.5KB exceeds max 500KB" (after compression)
❌ "Failed to upload image: [AWS error]"
```

### Display
- Red error box with AlertCircle icon
- Clear error message for admin
- Allows retry

---

## ✅ Success Flow

```
Admin selects file
  ↓
File preview shows (500×500px)
  ↓
Progress: "Validating image..."
  ↓
Progress: "Compressing image..."
  ↓
Shows: "Compressed: 3.2 MB → 245 KB"
  ↓
Progress: "Uploading to cloud..."
  ↓
Progress: "Upload complete!"
  ↓
✅ Green success message
  ↓
Image info displayed:
   • ✓ Original size: 3.2 MB
   • ✓ Compressed to: 245 KB
   • ✓ Dimensions: 500x500px
   • ✓ Format: JPEG (85% quality)
  ↓
Form ready to save
```

---

## 🔐 Security & Best Practices

### Public URLs
- Images stored in S3 are **publicly readable** (expected for e-commerce)
- File names include timestamp to prevent collisions
- Path organized by categoryId for easy management

### File Size Limits
- **Pre-compression**: 10 MB (browser validation)
- **Post-compression**: 500 KB (S3 requirement)
- Prevents slow uploads and storage bloat

### Compression Strategy
- 500×500px is optimal for category thumbnails
- 85% JPEG quality maintains visual quality while reducing size
- Automatic resizing prevents distortion

---

## 📈 Performance Metrics

### Before (URL Only)
- Upload time: Manual process (time-intensive)
- File size: Uncontrolled (could be 10+ MB)
- User experience: Copy-paste URLs
- Organization: No built-in structure

### After (S3 Gallery)
- Upload time: ~2-5 seconds (depends on connection)
- File size: Auto-optimized to 200-500 KB
- User experience: Click, select, done
- Organization: Auto-organized by category/timestamp

---

## 🛠️ Troubleshooting

### "Upload keeps failing"
1. Check S3 bucket exists: `beauzead-ecommerce-images-2026`
2. Verify CORS is enabled
3. Check AWS credentials in Amplify config
4. Ensure file size < 10 MB

### "Images not loading"
1. Verify S3 public read access is enabled
2. Check image URL is correct
3. Ensure CORS allows GET requests
4. Try different image format

### "Compression too aggressive"
1. Change quality from 0.85 to 0.90 in `imageUpload.ts`
2. Increase maxWidth/maxHeight from 500 to 600
3. Adjust maxSizeBytes from 512000 to 614400 (600KB)

---

## 📂 File Structure

```
src/
├── components/
│   └── ImageUpload.tsx              ← Admin upload UI component
├── utils/
│   └── imageUpload.ts               ← Upload/compress logic
├── pages/admin/modules/
│   └── CategoryManagement.tsx        ← Uses ImageUpload
└── lib/
    └── amplifyConfig.ts             ← S3 bucket config

amplify/backend/storage/beauzeadStorage/
├── s3-cloudformation-template.json
└── parameters.json

.env.local                            ← S3 bucket name
```

---

## 🚀 Next Steps

1. **Test Image Upload**
   - Log into admin dashboard
   - Go to Category Management
   - Create new category and test image upload
   - Verify image appears in category card

2. **Monitor S3 Bucket**
   - Check AWS S3 console
   - Verify images organized in `category-images/` folder
   - Monitor storage usage

3. **Similar Implementation**
   - Product images (ProductManagement)
   - Banner images (BannerManagement)
   - User avatars (UserManagement)

---

## 📚 Related Files

- **Component**: [ImageUpload.tsx](../components/ImageUpload.tsx)
- **Utility**: [imageUpload.ts](../utils/imageUpload.ts)
- **Module**: [CategoryManagement.tsx](../pages/admin/modules/CategoryManagement.tsx)
- **Config**: [amplifyConfig.ts](../lib/amplifyConfig.ts)
- **Documentation**: [CATEGORY_MANAGEMENT.md](./CATEGORY_MANAGEMENT.md)
