import { uploadData, getUrl } from 'aws-amplify/storage';

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

/**
 * Compress image using Canvas API
 * Default sizes: 500x500px, 85% quality
 * Max file size: 500KB
 */
export const compressImage = (
  file: File,
  options: ImageUploadOptions = {}
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 500,
      maxHeight = 500,
      quality = 0.85,
      maxSizeBytes = 512000, // 500KB
    } = options;

    // Check file size before processing
    if (file.size > maxSizeBytes) {
      reject(
        new Error(
          `File size ${(file.size / 1024).toFixed(2)}KB exceeds max ${(maxSizeBytes / 1024).toFixed(2)}KB`
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (blob.size > maxSizeBytes) {
                reject(
                  new Error(
                    `Compressed file ${(blob.size / 1024).toFixed(2)}KB still exceeds limit`
                  )
                );
              } else {
                resolve(blob);
              }
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

/**
 * Upload image to S3
 * Path format: category-images/{categoryId}/{timestamp-filename}
 */
export const uploadImageToS3 = async (
  compressedBlob: Blob,
  categoryId: string,
  fileName: string
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop() || 'jpg';
    const key = `category-images/${categoryId}/${timestamp}-${fileName.replace(
      /\.[^/.]+$/,
      ''
    )}.${extension}`;

    await uploadData({
      path: key,
      data: compressedBlob,
      options: {
        contentType: compressedBlob.type,
        metadata: {
          uploadedAt: new Date().toISOString(),
          categoryId: categoryId,
        },
      },
    }).result;

    // Get public URL
    const url = await getUrl({
      path: key,
      options: {
        validateObjectExistence: false,
      },
    });

    return url.url.toString();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error}`);
  }
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): string | null => {
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB max before compression
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!file) return 'No file selected';
  if (!allowedTypes.includes(file.type))
    return 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF';
  if (file.size > maxSizeBytes)
    return `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max: 10MB`;

  return null;
};

/**
 * Process image from file input
 * 1. Validate file
 * 2. Compress image (500x500px, 85% quality, max 500KB)
 * 3. Upload to S3
 * 4. Return public URL
 */
export const processAndUploadImage = async (
  file: File,
  categoryId: string,
  onProgress?: (message: string) => void
): Promise<string> => {
  try {
    // Validate
    onProgress?.('Validating image...');
    const validationError = validateImageFile(file);
    if (validationError) throw new Error(validationError);

    // Compress
    onProgress?.('Compressing image...');
    const compressedBlob = await compressImage(file);
    onProgress?.(
      `Compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressedBlob.size / 1024).toFixed(2)}KB`
    );

    // Upload
    onProgress?.('Uploading to cloud...');
    const imageUrl = await uploadImageToS3(compressedBlob, categoryId, file.name);
    onProgress?.('Upload complete!');

    return imageUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};
