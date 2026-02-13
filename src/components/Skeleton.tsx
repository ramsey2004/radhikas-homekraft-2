'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  count?: number;
  type?: 'text' | 'card' | 'circle' | 'image';
}

export function Skeleton({
  className = '',
  type = 'text',
}: SkeletonProps) {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
  };

  const baseClasses =
    'bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]';

  const typeClasses = {
    text: `${baseClasses} h-4 rounded w-full`,
    card: `${baseClasses} rounded-lg overflow-hidden`,
    circle: `${baseClasses} rounded-full`,
    image: `${baseClasses} rounded-lg aspect-square`,
  };

  return (
    <motion.div
      className={`${typeClasses[type]} ${className}`}
      animate="animate"
      variants={shimmer}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export function SkeletonProductCard() {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <Skeleton type="image" className="h-48" />
      <Skeleton type="text" className="h-4 w-3/4" />
      <Skeleton type="text" className="h-3 w-1/2" />
      <div className="space-y-2 pt-2">
        <Skeleton type="text" className="h-3" />
        <Skeleton type="text" className="h-3 w-2/3" />
      </div>
      <Skeleton type="text" className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonProductGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="space-y-6 py-16 sm:py-20 md:py-28 lg:py-36">
      <div className="space-y-4">
        <Skeleton type="text" className="h-12 w-3/4" />
        <Skeleton type="text" className="h-6 w-full" />
        <Skeleton type="text" className="h-6 w-4/5" />
      </div>
      <div className="flex gap-4">
        <Skeleton type="text" className="h-12 w-32 rounded-lg" />
        <Skeleton type="text" className="h-12 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonTestimonial() {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} type="circle" className="h-4 w-4" />
        ))}
      </div>
      <Skeleton type="text" className="h-4" />
      <Skeleton type="text" className="h-4 w-5/6" />
      <div className="flex items-center gap-3">
        <Skeleton type="circle" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton type="text" className="h-3 w-2/3" />
          <Skeleton type="text" className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTestimonials() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonTestimonial key={i} />
      ))}
    </div>
  );
}
