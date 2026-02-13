'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiClock, FiX } from 'react-icons/fi';
import { PRODUCTS } from '@/data/products';
import OptimizedImage from '@/components/OptimizedImage';

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<typeof PRODUCTS>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const products = PRODUCTS.filter((p) => recentlyViewed.includes(p.id));
    setRecentProducts(products);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || recentProducts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all z-40 flex items-center gap-2"
        aria-label="Recently Viewed Products"
      >
        <FiClock className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-semibold">Recently Viewed ({recentProducts.length})</span>
      </button>

      {/* Sidebar Drawer */}
      <div
        className={`fixed bottom-0 right-0 h-screen w-92 bg-white border-l shadow-2xl transition-transform z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">Recently Viewed</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Products List */}
        <div className="p-4 space-y-4">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={() => setIsOpen(false)}
              className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-600 hover:shadow-md transition-all group"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden group-hover:scale-110 transition-transform">
                <OptimizedImage
                  src={`/images/products/${product.slug}-1.jpg` || '/api/placeholder'}
                  alt={`${product.name} - ${product.material}`}
                  width={64}
                  height={64}
                  sizes="64px"
                  priority={false}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-primary-600">
                  {product.name}
                </h3>
                <p className="text-primary-600 font-bold text-sm mt-1">
                  ₹{product.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Clear History */}
        <div className="sticky bottom-0 border-t p-4 bg-white">
          <button
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setRecentProducts([]);
              setIsOpen(false);
            }}
            className="w-full py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors text-sm"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
