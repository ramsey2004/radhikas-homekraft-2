import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getBlurPlaceholder } from '@/lib/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  sizes?: string;
  onLoad?: () => void;
  quality?: number;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  objectPosition?: string;
}

/**
 * OptimizedImage Component
 * Wraps Next.js Image for:
 * - Automatic WebP/AVIF conversion
 * - Responsive srcset
 * - Lazy loading
 * - Blur placeholder
 * - Fade-in animation on load
 * - Performance optimization
 */
export default function OptimizedImage({
  src,
  alt,
  width = 600,
  height = 400,
  className = '',
  priority = false,
  placeholder = 'blur',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 85vw',
  onLoad,
  quality = 85,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Get blur placeholder
  const blurDataUrl = placeholder === 'blur' ? getBlurPlaceholder() : undefined;

  // Fallback image if needed
  const imageSource = src || '/placeholder.jpg';

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '100px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      suppressHydrationWarning
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse z-10" />
      )}

      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Image not available</p>
        </div>
      ) : (
        <Image
          src={imageSource}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder={placeholder === 'blur' ? 'blur' : undefined}
          blurDataURL={blurDataUrl}
          sizes={sizes}
          quality={quality}
          className={`w-full h-auto ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{
            objectFit,
            objectPosition,
          }}
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          decoding="async"
        />
      )}
    </motion.div>
  );
}
