'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';

interface ProductInteractionProps {
  productId: string;
  productName: string;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

/**
 * ProductInteraction Component
 * Provides animated add-to-cart and wishlist buttons
 * with success feedback via toast notifications
 */
export default function ProductInteraction({
  productId,
  productName: _productName,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
}: ProductInteractionProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(isInWishlist);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      onAddToCart?.(productId);
      setAddedToCart(true);
      // Show success for 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    setWishlistLoading(true);
    try {
      onAddToWishlist?.(productId);
      setAddedToWishlist(!addedToWishlist);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        disabled={cartLoading || addedToCart}
        className="flex-1 relative inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium text-sm transition-colors overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        suppressHydrationWarning
      >
        {addedToCart ? (
          <div className="flex items-center gap-2">
            <FiCheck className="w-5 h-5" />
            <span>Added!</span>
          </div>
        ) : cartLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          >
            <FiShoppingCart className="w-5 h-5" />
          </motion.div>
        ) : (
          <div className="flex items-center gap-2">
            <FiShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </div>
        )}
      </motion.button>

      {/* Wishlist Button */}
      <motion.button
        onClick={handleAddToWishlist}
        disabled={wishlistLoading}
        className={`px-3 py-2.5 rounded-lg border-2 transition-all ${
          addedToWishlist
            ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600'
            : 'border-gray-200 dark:border-gray-700 hover:border-red-300 text-gray-600 dark:text-gray-400'
        } disabled:opacity-50`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        suppressHydrationWarning
      >
        <FiHeart
          className="w-5 h-5"
          fill={addedToWishlist ? 'currentColor' : 'none'}
        />
      </motion.button>
    </div>
  );
}
