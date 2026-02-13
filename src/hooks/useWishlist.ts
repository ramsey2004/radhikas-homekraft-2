'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  productId: string;
}

export function useWishlist() {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    if (!session?.user) return;

    try {
      const response = await axios.get('/api/wishlist');
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  }, [session?.user]);

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Add to wishlist
  const addToWishlist = useCallback(
    async (productId: string) => {
      if (!session?.user) {
        toast.error('Please log in to add to wishlist');
        return;
      }

      setIsLoading(true);
      try {
        await axios.post('/api/wishlist', { productId });
        setWishlistItems((prev) => [
          ...prev,
          { id: `${Date.now()}`, productId },
        ]);
        toast.success('Added to wishlist!');
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        toast.error('Failed to add to wishlist');
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (productId: string) => {
      setIsLoading(true);
      try {
        await axios.delete(`/api/wishlist/${productId}`);
        setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
        toast.success('Removed from wishlist!');
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        toast.error('Failed to remove from wishlist');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.some((item) => item.productId === productId);
    },
    [wishlistItems]
  );

  // Toggle wishlist
  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    fetchWishlist,
  };
}
