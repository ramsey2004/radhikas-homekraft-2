'use client';

import { useWishlist } from '@/hooks/useWishlist';
import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [hasMounted, setHasMounted] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<typeof PRODUCTS>([]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (wishlistItems.length > 0) {
      const productIds = new Set(wishlistItems.map(item => item.productId));
      const products = PRODUCTS.filter(p => productIds.has(String(p.id)));
      setWishlistProducts(products);
    } else {
      setWishlistProducts([]);
    }
  }, [wishlistItems]);

  if (!hasMounted) {
    return <div className="h-screen" />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiHeart className="h-6 w-6 text-red-500" />
              My Wishlist
            </h1>
            <Link
              href={ROUTES.SHOP}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {wishlistProducts.length === 0 ? (
          // Empty Wishlist
          <motion.div
            initial={hasMounted ? { opacity: 0, y: 20 } : false}
            animate={hasMounted ? { opacity: 1, y: 0 } : false}
            className="flex flex-col items-center justify-center py-16"
          >
            <FiHeart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mb-8 text-gray-600">Save your favorite items to view them later!</p>
            <Link href={ROUTES.SHOP} className="btn btn-accent">
              Explore Products
            </Link>
          </motion.div>
        ) : (
          // Wishlist Grid
          <motion.div
            className="mb-8"
            initial={hasMounted ? { opacity: 0 } : false}
            animate={hasMounted ? { opacity: 1 } : false}
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Saved Items
              </h2>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={hasMounted ? { opacity: 0, scale: 0.95 } : false}
                  animate={hasMounted ? { opacity: 1, scale: 1 } : false}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    image={(product.images && product.images.length > 0 ? product.images[0] : '') || ''}
                    badge={product.badge || undefined}
                    description={product.description}
                    material={product.material}
                  />

                  {/* Remove from Wishlist Button */}
                  <motion.button
                    onClick={() => removeFromWishlist(String(product.id))}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Remove from wishlist"
                  >
                    <FiHeart className="h-5 w-5 fill-current" />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Action Section */}
            <motion.div
              className="mt-12 rounded-lg bg-primary-50 p-8 text-center"
              initial={hasMounted ? { opacity: 0, y: 20 } : false}
              animate={hasMounted ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.3 }}
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900">Ready to purchase?</h3>
              <p className="mb-6 text-gray-600">Add all wishlist items to your cart now</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={ROUTES.CART}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  <FiShoppingCart className="h-5 w-5" />
                  Go to Cart
                </Link>
                <Link
                  href={ROUTES.SHOP}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
