import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  displayOrder: number;
  isMainImage: boolean;
  uploadedBy: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all images for a product
 */
export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  try {
    const query = `
      query ListProductImages {
        listProductImages(filter: {productId: {eq: "${productId}"}}) {
          items {
            id
            productId
            imageUrl
            thumbnailUrl
            displayOrder
            isMainImage
            uploadedBy
            description
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result: any = await client.graphql({ query });
    return result.data?.listProductImages?.items || [];
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};

/**
 * Create product image record in database
 */
export const createProductImage = async (
  productId: string,
  imageUrl: string,
  thumbnailUrl: string | undefined,
  displayOrder: number,
  isMainImage: boolean,
  uploadedBy: string,
  description?: string
): Promise<ProductImage | null> => {
  try {
    const mutation = `
      mutation CreateProductImage {
        createProductImage(input: {
          productId: "${productId}"
          imageUrl: "${imageUrl}"
          thumbnailUrl: "${thumbnailUrl || ''}"
          displayOrder: ${displayOrder}
          isMainImage: ${isMainImage}
          uploadedBy: "${uploadedBy}"
          description: "${description || ''}"
        }) {
          id
          productId
          imageUrl
          thumbnailUrl
          displayOrder
          isMainImage
          uploadedBy
          description
          createdAt
          updatedAt
        }
      }
    `;

    const result: any = await client.graphql({ query: mutation });
    return result.data?.createProductImage || null;
  } catch (error) {
    console.error('Error creating product image:', error);
    return null;
  }
};

/**
 * Update product image
 */
export const updateProductImage = async (
  id: string,
  data: Partial<ProductImage>
): Promise<boolean> => {
  try {
    const updateData = Object.entries(data)
      .filter(([key]) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}: "${value}"`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');

    const mutation = `
      mutation UpdateProductImage {
        updateProductImage(input: {
          id: "${id}"
          ${updateData}
        }) {
          id
        }
      }
    `;

    const result: any = await client.graphql({ query: mutation });
    return !!result.data?.updateProductImage;
  } catch (error) {
    console.error('Error updating product image:', error);
    return false;
  }
};

/**
 * Delete product image
 */
export const deleteProductImage = async (id: string): Promise<boolean> => {
  try {
    const mutation = `
      mutation DeleteProductImage {
        deleteProductImage(input: {
          id: "${id}"
        }) {
          id
        }
      }
    `;

    const result: any = await client.graphql({ query: mutation });
    return !!result.data?.deleteProductImage;
  } catch (error) {
    console.error('Error deleting product image:', error);
    return false;
  }
};

/**
 * Upload image file to S3 and return URL
 */
export const uploadProductImageFile = async (
  productId: string,
  file: File,
  _sellerId: string
): Promise<string | null> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${productId}/${timestamp}-${file.name}`;
    const key = `products/${fileName}`;

    // Upload to S3
    await uploadData({
      key,
      data: file,
      options: {
        contentType: file.type,
      },
    }).result;

    // Get public URL
    const urlResult = await getUrl({
      key,
    });

    return urlResult.url.toString();
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

/**
 * Reorder product images
 */
export const reorderProductImages = async (
  images: Array<{ id: string; displayOrder: number }>
): Promise<boolean> => {
  try {
    const updates = await Promise.all(
      images.map((img) =>
        updateProductImage(img.id, { displayOrder: img.displayOrder })
      )
    );

    return updates.every((success) => success);
  } catch (error) {
    console.error('Error reordering images:', error);
    return false;
  }
};

/**
 * Set main image for product
 */
export const setMainProductImage = async (
  _productId: string,
  newMainImageId: string,
  oldMainImageId?: string
): Promise<boolean> => {
  try {
    const updates = [];

    // Unset old main image if exists
    if (oldMainImageId) {
      updates.push(updateProductImage(oldMainImageId, { isMainImage: false }));
    }

    // Set new main image
    updates.push(updateProductImage(newMainImageId, { isMainImage: true }));

    const results = await Promise.all(updates);
    return results.every((success) => success);
  } catch (error) {
    console.error('Error setting main image:', error);
    return false;
  }
};
