/**
 * Cloudinary Image Utilities
 * Helper functions for working with Cloudinary media library
 */

export const CLOUDINARY_CONFIG = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dk1ovmxuj',
  secure: true,
};

/**
 * Generate Cloudinary secure URL for an image
 * Useful for preloading, sharing, or API calls
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'low' | 'medium' | 'high' | number;
    format?: string;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    gravity?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload`;
  const transformations: string[] = [];

  if (width || height) {
    transformations.push(
      `c_${crop},g_${gravity},${width ? `w_${width}` : ''}${
        width && height ? ',' : ''
      }${height ? `h_${height}` : ''}`
    );
  }

  if (quality !== undefined) {
    transformations.push(`q_${quality}`);
  }

  if (format) {
    transformations.push(`f_${format}`);
  }

  const transformation = transformations.length > 0 ? transformations.join('/') : '';
  const url = transformation
    ? `${baseUrl}/${transformation}/${publicId}`
    : `${baseUrl}/${publicId}`;

  return url;
}

/**
 * Generate responsive srcset for Cloudinary image
 * Perfect for responsive image optimization
 */
export function getCloudinarySrcSet(
  publicId: string,
  baseWidth: number = 600,
  quality: 'auto' | 'low' | 'medium' | 'high' | number = 'auto'
): string {
  const widths = [
    baseWidth * 0.5, // Mobile
    baseWidth * 0.75, // Tablet
    baseWidth, // Desktop
    baseWidth * 1.5, // Retina
    baseWidth * 2, // 2x Retina
  ];

  return widths
    .map((w) => {
      const url = getCloudinaryUrl(publicId, {
        width: Math.round(w),
        quality,
      });
      return `${url} ${Math.round(w)}w`;
    })
    .join(', ');
}

/**
 * Get thumbnail version of image
 * Useful for gallery previews
 */
export function getCloudinaryThumbnail(
  publicId: string,
  size: number = 150
): string {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
  });
}

/**
 * Get hero/banner version of image
 * Full width, optimized for display
 */
export function getCloudinaryHero(
  publicId: string,
  width: number = 1920,
  height: number = 600
): string {
  return getCloudinaryUrl(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Get product image version
 * Optimized for product grids
 */
export function getCloudinaryProduct(
  publicId: string,
  width: number = 400,
  height: number = 400
): string {
  return getCloudinaryUrl(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'face,auto', // Prioritize faces if product has people
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Transform Cloudinary image with filters
 * Add artistic effects without creating new images
 */
export function applyCloudinaryFilters(
  publicId: string,
  filters: {
    brightness?: number; // -100 to 100
    contrast?: number; // -100 to 100
    saturation?: number; // -100 to 100
    hue?: number; // -180 to 180
    grayscale?: boolean;
    sepia?: boolean;
    blur?: number; // 0 to 2000
    sharpen?: number; // 1 to 2000
  } = {}
): string {
  const cloudinaryUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload`;
  const transforms: string[] = [];

  if (filters.brightness !== undefined) {
    transforms.push(`brightness:${filters.brightness}`);
  }
  if (filters.contrast !== undefined) {
    transforms.push(`contrast:${filters.contrast}`);
  }
  if (filters.saturation !== undefined) {
    transforms.push(`saturation:${filters.saturation}`);
  }
  if (filters.hue !== undefined) {
    transforms.push(`hue:${filters.hue}`);
  }
  if (filters.grayscale) {
    transforms.push('grayscale');
  }
  if (filters.sepia) {
    transforms.push('sepia');
  }
  if (filters.blur !== undefined) {
    transforms.push(`blur:${filters.blur}`);
  }
  if (filters.sharpen !== undefined) {
    transforms.push(`sharpen:${filters.sharpen}`);
  }

  const effectChain = transforms.length > 0 ? `e_${transforms.join(':')}` : '';
  return effectChain ? `${cloudinaryUrl}/${effectChain}/${publicId}` : publicId;
}

/**
 * Batch convert multiple Cloudinary public IDs
 * Useful for updating all images in a section
 */
export function batchCloudinaryImages(
  publicIds: string[],
  options?: Parameters<typeof getCloudinaryUrl>[1]
): string[] {
  return publicIds.map((id) => getCloudinaryUrl(id, options));
}
