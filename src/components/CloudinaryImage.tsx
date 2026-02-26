'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';
import { motion } from 'framer-motion';
import 'next-cloudinary/dist/cld-image.css';

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  sizes?: string;
  onLoad?: () => void;
  quality?: 'auto' | 'low' | 'medium' | 'high' | number;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  objectPosition?: string;
  transformations?: any[];
}

/**
 * CloudinaryImage Component
 * Optimized for Cloudinary media library with:
 * - Automatic format optimization (WebP, AVIF)
 * - Responsive sizing
 * - Quality auto-adjustment
 * - Lazy loading
 * - Fade-in animation
 * - Perfect for e-commerce product images
 */
export default function CloudinaryImage({
  publicId,
  alt,
  width = 600,
  height = 400,
  className = '',
  priority = false,
  placeholder = 'blur',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 85vw',
  onLoad,
  quality = 'auto',
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  transformations = [],
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  const defaultTransformations = [
    {
      quality: quality === 'auto' ? 'auto' : quality,
      fetch_format: 'auto', // Automatically returns WebP/AVIF if supported
      dpr: 'auto', // Device pixel ratio auto-detection
      flags: 'progressive', // Progressive JPEG
    },
    ...transformations,
  ];

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

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
        <CldImage
          src={publicId}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          priority={priority}
          placeholder={placeholder}
          sizes={sizes}
          className={`w-full h-auto ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{
            objectFit: fill ? undefined : objectFit,
            objectPosition: fill ? undefined : objectPosition,
          }}
          transformations={defaultTransformations}
          onLoad={handleLoadingComplete}
          onError={handleError}
        />
      )}
    </motion.div>
  );
}
