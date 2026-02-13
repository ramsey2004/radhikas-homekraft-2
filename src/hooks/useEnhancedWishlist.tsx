'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Product, WishlistItem as WishlistItemType } from '@/types';

/**
 * Enhanced Wishlist Hook
 * Manages wishlist with better state management and sync
 */
export function useEnhancedWishlist() {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<(WishlistItemType & { product: Product })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load wishlist from server
  const loadWishlist = useCallback(async () => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Load on mount
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Add to wishlist
  const addToWishlist = useCallback(
    async (product: Product) => {
      if (!session) {
        toast.error('Please sign in to add to wishlist');
        return false;
      }

      setIsSyncing(true);
      try {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setWishlistItems((prev) => [
            ...prev,
            { ...data.data, product },
          ]);
          toast.success('Added to wishlist! ❤️');
          return true;
        }
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        toast.error('Failed to add to wishlist');
      } finally {
        setIsSyncing(false);
      }
      return false;
    },
    [session]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (itemId: string) => {
      setIsSyncing(true);
      try {
        const response = await fetch(`/api/wishlist/${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
          toast.success('Removed from wishlist');
          return true;
        }
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        toast.error('Failed to remove from wishlist');
      } finally {
        setIsSyncing(false);
      }
      return false;
    },
    []
  );

  // Check if product is wishlisted
  const isWishlisted = useCallback(
    (productId: number) => {
      return wishlistItems.some((item) => item.product.id === productId);
    },
    [wishlistItems]
  );

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    const itemIds = wishlistItems.map((item) => item.id);
    for (const id of itemIds) {
      await removeFromWishlist(id);
    }
  }, [wishlistItems, removeFromWishlist]);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    clearWishlist,
    isLoading,
    isSyncing,
    loadWishlist,
  };
}

/**
 * Wishlist Button Component
 * Shows heart icon and handles adding/removing from wishlist
 */
interface WishlistButtonProps {
  product: Product;
  isWishlisted: boolean;
  onAdd: (product: Product) => Promise<boolean>;
  onRemove: (itemId: string) => Promise<boolean>;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function WishlistButton({
  product,
  isWishlisted,
  onAdd,
  onRemove,
  size = 'md',
  showLabel = false,
}: WishlistButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    if (isWishlisted) {
      // Find the wishlist item to remove
      // This would need to be passed or retrieved from parent
      // For now, we'll call onRemove with a placeholder
      await onRemove('placeholder');
    } else {
      await onAdd(product);
    }
    setIsProcessing(false);
  };

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isProcessing}
      className="flex items-center gap-2 group transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{
          scale: isWishlisted ? 1.1 : 1,
          color: isWishlisted ? '#ef4444' : undefined,
        }}
        className={sizeClasses[size]}
      >
        <FiHeart
          className={`w-full h-full ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'
          }`}
        />
      </motion.div>
      {showLabel && (
        <span className="text-sm font-medium">
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </span>
      )}
    </motion.button>
  );
}

/**
 * Wishlist Summary Component
 * Shows count and quick actions for wishlist
 */
interface WishlistSummaryProps {
  count: number;
  onClick?: () => void;
}

export function WishlistSummary({ count, onClick }: WishlistSummaryProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      whileHover={{ scale: 1.05 }}
    >
      <FiHeart className="h-5 w-5 text-red-500" />
      <span className="font-medium text-gray-900">{count}</span>
      {count > 0 && (
        <motion.span
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </motion.button>
  );
}

/**
 * Move to Cart from Wishlist
 */
export async function moveWishlistToCart(
  wishlistItemId: string,
  productId: number,
  quantity: number = 1
) {
  try {
    // Add to cart
    const cartResponse = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });

    if (cartResponse.ok) {
      // Remove from wishlist
      await fetch(`/api/wishlist/${wishlistItemId}`, {
        method: 'DELETE',
      });

      toast.success('Moved to cart!');
      return true;
    }
  } catch (error) {
    console.error('Failed to move to cart:', error);
    toast.error('Failed to move to cart');
  }

  return false;
}
