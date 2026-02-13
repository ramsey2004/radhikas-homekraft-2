'use client';

import { motion } from 'framer-motion';

/**
 * Advanced Skeleton Loading Component
 * Replaces blank states with smooth loading animations
 * Mimics actual content layout for smooth transitions
 */

export function SkeletonProductCard() {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="relative w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4">
            <motion.div
              animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3" />
        </div>

        {/* Price and Rating */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/4" />
        </div>

        {/* Button */}
        <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded mt-4" />
      </div>
    </motion.div>
  );
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProductDetails() {
  return (
    <div className="space-y-8">
      {/* Image Gallery Skeleton */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 h-96 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg">
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3" />
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonSearchResults() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-100 rounded">
            <motion.div
              animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCartItem() {
  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg">
      <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded">
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20" />
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCheckout() {
  return (
    <div className="space-y-6">
      {/* Shipping Info */}
      <div className="space-y-3">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
        </div>
      </div>

      {/* Payment Info */}
      <div className="space-y-3">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
        </div>
      </div>

      {/* Button */}
      <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full" />
    </div>
  );
}
