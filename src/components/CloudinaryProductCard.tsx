'use client';

import CloudinaryImage from './CloudinaryImage';
import { useState } from 'react';
import { Heart, Eye } from 'lucide-react';

interface CloudinaryProductCardProps {
  publicId: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  className?: string;
  onQuickView?: () => void;
  onAddToWishlist?: () => void;
}

/**
 * Cloudinary Product Card
 * Ready-to-use product card component with Cloudinary images
 * Perfect for grids and collections
 */
export default function CloudinaryProductCard({
  publicId,
  title,
  price,
  originalPrice,
  rating = 4.5,
  reviews = 0,
  className = '',
  onQuickView,
  onAddToWishlist,
}: CloudinaryProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.();
  };

  return (
    <div className={`group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Badge Container */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {discount > 0 && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
      >
        <Heart
          size={16}
          className={`transition-colors ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`}
        />
      </button>

      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <CloudinaryImage
          publicId={publicId}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full"
          quality="auto"
        />

        {/* Quick View Button */}
        <button
          onClick={onQuickView}
          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
        >
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Eye size={20} className="text-gray-900" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          {reviews > 0 && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ({reviews})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-300">
          Add to Cart
        </button>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
            <span className="text-green-600 font-bold">✓</span>
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
            <span className="text-green-600 font-bold">✓</span>
            <span>COD Available</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
            <span className="text-green-600 font-bold">✓</span>
            <span>Ships in 3–5 Days</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
            <span className="text-green-600 font-bold">✓</span>
            <span>Easy Returns</span>
          </div>
        </div>
      </div>
