/**
 * Image Optimization Utilities
 * Comprehensive image optimization for Radhika's Homecraft
 * - WebP/AVIF format support
 * - Responsive srcset generation
 * - Lazy loading configuration
 * - Quality optimization
 */

/**
 * Generate responsive image srcset for different screen sizes
 */
export function generateResponsiveSrcSet(
  imageUrl: string,
  sizes: number[] = [320, 640, 1024, 1280, 1920]
): string {
  if (!imageUrl) return '';
  
  return sizes
    .map((size) => `${imageUrl}?w=${size}&q=80 ${size}w`)
    .join(', ');
}

/**
 * Get the optimal image size configuration based on device
 * Tailored for responsive image display
 */
export const RESPONSIVE_IMAGE_SIZES = {
  // Mobile-first approach
  mobile: '(max-width: 640px) 100vw',
  tablet: '(max-width: 1024px) 90vw',
  desktop: '(max-width: 1920px) 85vw',
  fullscreen: '100vw',
};

/**
 * Generate complete sizes attribute for responsive images
 */
export function generateSizesAttribute(type: 'product-card' | 'hero' | 'thumbnail' | 'full' = 'product-card'): string {
  const sizeConfigs = {
    'product-card': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1920px) 33vw, 25vw',
    'hero': '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw',
    'thumbnail': '(max-width: 640px) 100px, (max-width: 1024px) 120px, 150px',
    'full': '100vw',
  };
  return sizeConfigs[type];
}

/**
 * Image size presets for common use cases
 */
export const IMAGE_PRESETS = {
  productCard: {
    width: 400,
    height: 400,
    quality: 80,
    format: 'webp',
  },
  productDetail: {
    width: 800,
    height: 800,
    quality: 85,
    format: 'webp',
  },
  heroImage: {
    width: 1920,
    height: 600,
    quality: 80,
    format: 'webp',
  },
  thumbnail: {
    width: 100,
    height: 100,
    quality: 75,
    format: 'webp',
  },
  banner: {
    width: 1200,
    height: 400,
    quality: 80,
    format: 'webp',
  },
};

/**
 * Build srcset for multiple resolutions and formats
 */
export function buildModernSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 1024, 1280]
): string {
  if (!baseUrl) return '';
  return sizes
    .map((size) => `${baseUrl}?w=${size}&q=80&fm=webp ${size}w`)
    .join(', ');
}

/**
 * Generate fallback srcset for browsers that don't support modern formats
 */
export function buildFallbackSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 1024, 1280]
): string {
  if (!baseUrl) return '';
  return sizes
    .map((size) => `${baseUrl}?w=${size}&q=80 ${size}w`)
    .join(', ');
}

/**
 * Get blur placeholder data URL for LQIP (Low Quality Image Placeholder)
 */
export function getBlurPlaceholder(color: string = '#e5e7eb'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect fill="${color}" width="1" height="1"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Get placeholder image URL (for fallback use)
 */
export function getPlaceholderImage(id: number, width: number = 400, height: number = 400): string {
  return `https://placeholder.com/${width}x${height}?text=Product+${id}`;
}

/**
 * Generate SEO-friendly image alt text
 */
export function getImageAlt(productName: string, imageIndex?: number): string {
  const indexText = imageIndex ? ` - View ${imageIndex + 1}` : '';
  return `${productName} - Handcrafted by Radhika's Homecraft${indexText}`;
}

/**
 * Extract filename from image URL for caching strategies
 */
export function getImageFilename(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    return url.pathname.split('/').pop() || 'image';
  } catch {
    return 'image';
  }
}

/**
 * Optimize image URL with quality and format parameters
 */
export function optimizeImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
  format: 'webp' | 'auto' = 'webp'
): string {
  if (!url) return '';

  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  if (format === 'webp') params.append('fm', 'webp');

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

/**
 * Get Next.js Image component props for optimal performance
 */
export function getImageProps(
  src: string,
  alt: string,
  preset: keyof typeof IMAGE_PRESETS = 'productCard',
  options: { priority?: boolean; sizes?: string } = {}
) {
  const presetConfig = IMAGE_PRESETS[preset];
  
  return {
    src,
    alt,
    width: presetConfig.width,
    height: presetConfig.height,
    quality: presetConfig.quality,
    sizes: options.sizes || generateSizesAttribute(preset as any),
    priority: options.priority || false,
    loading: options.priority ? ('eager' as const) : ('lazy' as const),
    placeholder: 'blur' as const,
  };
}

/**
 * Legacy function for backward compatibility
 */
export function buildSrcSet(baseUrl: string, sizes: number[] = [100, 200, 400, 800]): string {
  return buildModernSrcSet(baseUrl, sizes);
}

/**
 * Responsive image sizes configuration (legacy)
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 200, height: 200 },
  medium: { width: 400, height: 400 },
  large: { width: 800, height: 800 },
  fullscreen: { width: 1200, height: 900 },
};
