/**
 * Image Optimization Utilities
 * Provides functions for responsive image generation and optimization
 */

/**
 * Generate responsive image sizes for different devices
 * Used for responsive srcset generation
 */
export const RESPONSIVE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1000, height: 1000 },
  xlarge: { width: 1600, height: 1600 },
};

/**
 * Define breakpoints for responsive images
 * These match Tailwind breakpoints
 */
export const IMAGE_BREAKPOINTS = {
  xs: '(max-width: 640px)',
  sm: '(max-width: 768px)',
  md: '(max-width: 1024px)',
  lg: '(max-width: 1280px)',
};

/**
 * Generate optimized sizes attribute for Image component
 * @param context - 'product' | 'hero' | 'thumbnail' | 'card'
 */
export function generateSizes(context: 'product' | 'hero' | 'thumbnail' | 'card' = 'product'): string {
  const sizeMap: Record<string, string> = {
    hero: '100vw',
    product: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    thumbnail: '(max-width: 640px) 80px, (max-width: 1024px) 120px, 150px',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  };
  return sizeMap[context] || sizeMap.product;
}

/**
 * Calculate aspect ratio from width and height
 */
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Generate srcset string for responsive images (for non-Next.js images)
 * @param basePath - Base path to image without format/size
 * @param formats - Image formats to support
 */
export function generateSrcSet(basePath: string, formats: string[] = ['webp', 'jpg']): string {
  const sizes = [300, 600, 1000, 1600];
  const srcsets: string[] = [];

  formats.forEach((format) => {
    sizes.forEach((size) => {
      srcsets.push(`${basePath}?w=${size}&f=${format} ${size}w`);
    });
  });

  return srcsets.join(', ');
}

/**
 * Validate image URL is from allowed sources
 */
export function isValidImageUrl(url: string): boolean {
  // Allow relative paths and specific domains
  if (url.startsWith('/')) return true;
  
  const allowedDomains = [
    'localhost',
    'images.unsplash.com',
    'your-cdn.com',
    'your-domain.com',
  ];

  try {
    const urlObj = new URL(url);
    return allowedDomains.some((domain) => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Get Next.js image loader config for external CDN
 */
export function nextImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  // Modify this based on your image hosting solution
  // Example for Cloudinary
  const q = quality || 85;
  if (src.startsWith('/')) {
    return `/api/image?src=${src}&w=${width}&q=${q}`;
  }
  return src;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
}

/**
 * Generate WebP alternative URL (if using cloudinary or similar)
 */
export function getWebPUrl(originalUrl: string): string {
  // If using Cloudinary
  if (originalUrl.includes('cloudinary.com')) {
    return originalUrl.replace('/upload/', '/upload/f_webp/');
  }
  // Add other CDN support as needed
  return originalUrl;
}

/**
 * Get average color of image for better placeholder
 * Uses a simple approach with a single pixel
 */
export function getPlaceholderColor(hexColor: string = '#e5e7eb'): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect fill="${hexColor}" width="1" height="1"/></svg>`
  ).toString('base64')}`;
}
