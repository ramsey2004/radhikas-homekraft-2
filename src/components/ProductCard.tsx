'use client';

import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { FiStar, FiHeart, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useComparison } from '@/contexts/ComparisonContext';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  material: string;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  badge,
  description,
  material,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const inComparison = isInComparison(String(id));
  const isWishlisted = isInWishlist(String(id));

  // Calculate discount percentage
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem({
        id,
        name,
        slug,
        price,
        originalPrice,
        rating,
        reviewCount,
        category: '',
        inStock: true,
        images: [image],
        material,
        description,
        badge: null,
        colors: [],
        dimensions: '',
        weight: '',
        care: [],
        artisan: '',
      } as any, 1);
      // Toast notification (optional - can add toast library)
      setTimeout(() => setIsAdding(false), 500);
    } catch (error) {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(String(id));
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(String(id));
      toast.success('Added to wishlist');
    }
  };

  const handleComparisonToggle = () => {
    const productObj: Product = {
      id: String(id),
      name,
      slug,
      price,
      discountedPrice: price < originalPrice ? price : null,
      inventory: 0,
      sku: '',
      images: [image],
      thumbnail: image,
      categoryId: '',
      material,
      color: null,
      dimensions: null,
      weight: null,
      isFeatured: badge === 'Bestseller',
      isActive: true,
      description,
      shortDescription: description.substring(0, 100),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (inComparison) {
      removeFromComparison(String(id));
    } else {
      addToComparison(productObj);
    }
  };

  // Check if image is a valid path
  const imageUrl = image && (image.startsWith('/') || image.startsWith('http')) 
    ? image 
    : `/api/placeholder?name=${encodeURIComponent(name)}`;

  const imageAlt = `${name} - ${material} product image`;


  return (
    <div className="group h-full flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200">
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 md:h-56 flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold animate-pulse">
            {discountPercent}% off
          </div>
        )}

        {/* Status Badge */}
        {badge && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-accent-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}

        {/* Product Image */}
        <div className="w-full h-full">
          <OptimizedImage
            src={imageUrl}
            alt={imageAlt}
            width={400}
            height={400}
            className="w-full h-full"
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {/* Comparison Button */}
          <button
            onClick={handleComparisonToggle}
            className={`p-2 rounded-full shadow-md hover:scale-110 transition-all duration-200 ${
              inComparison
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            aria-label="Add to comparison"
            title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
          >
            <FiBarChart2 className="h-5 w-5" />
          </button>
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-200 hover:scale-110"
            aria-label="Add to wishlist"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart
              className={`h-5 w-5 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
          <button className="px-4 py-2 bg-white text-primary-600 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{material}</p>

        {/* Product Name */}
        <Link href={`/products/${slug}`} className="mb-3">
          <h3 className="font-serif text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl sm:text-2xl font-bold text-primary-600">₹{price.toLocaleString()}</span>
          {originalPrice > price && (
            <span className="text-xs sm:text-sm line-through text-gray-400">₹{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full py-2 sm:py-3 px-4 bg-primary-600 text-sm sm:text-base text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 disabled:bg-gray-400 flex items-center justify-center gap-2 group/btn hover:shadow-md"
        >
          <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>

        {/* View Details Link */}
        <Link
          href={`/products/${slug}`}
          className="w-full mt-2 py-2 px-4 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
