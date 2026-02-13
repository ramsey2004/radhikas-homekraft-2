'use client';

import { motion } from 'framer-motion';
import { FiX, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Product } from '@/types';

/**
 * Product Comparison Modal Component
 * Displays a modal with comparison table for selected products
 */
interface ComparisonModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
}

export function ComparisonModal({ isOpen, products, onClose }: ComparisonModalProps) {
  if (!isOpen || products.length === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Compare {products.length} Products
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6">
          <div className="grid gap-6 min-w-max" style={{
            gridTemplateColumns: `repeat(${products.length}, minmax(300px, 1fr))`,
          }}>
            {products.map((product) => (
              <ComparisonCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Footer with CTA */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Select products to add to cart
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Individual product card in comparison
 */
function ComparisonCard({ product }: { product: Product }) {
  const originalPrice = product.originalPrice || product.price;
  const discount = originalPrice > product.price 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {/* Image */}
      <div className="mb-4 relative">
        <OptimizedImage
          src={product.images?.[0] || product.thumbnail || '/placeholder.png'}
          alt={product.name}
          width={280}
          height={280}
          className="rounded-lg"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Name */}
      <Link href={`/products/${product.slug}`}>
        <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-accent-600 transition-colors mb-2">
          {product.name}
        </h3>
      </Link>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold text-accent-600">
            ₹{product.price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > product.price && (
            <span className="text-sm line-through text-gray-400">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600">{product.material}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`h-4 w-4 ${i <= ((product as any).rating || 0) ? '⭐' : '☆'}`}
            >
              {i <= ((product as any).rating || 0) ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-600">({(product as any).reviewCount || 0})</span>
      </div>

      {/* Specifications */}
      <div className="space-y-3 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Category</p>
          <p className="font-medium text-gray-900">{typeof product.category === 'string' ? product.category : product.category?.name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">Material</p>
          <p className="font-medium text-gray-900">{product.material}</p>
        </div>
        <div>
          <p className="text-gray-600">Stock</p>
          <p className="font-medium text-green-600">In Stock</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {product.description}
      </p>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Link
          href={`/products/${product.slug}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-accent-600 border border-accent-600 rounded-lg font-medium hover:bg-accent-50 transition-colors"
        >
          View Details
          <FiArrowRight className="h-4 w-4" />
        </Link>
        <button className="w-full px-4 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/**
 * Comparison Page Component
 * Full-page comparison view
 */
interface ComparisonPageProps {
  products: Product[];
}

export function ComparisonPage({ products }: ComparisonPageProps) {
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No products to compare</h1>
          <p className="text-gray-600 mb-6">
            Add products from the catalog to compare them side by side.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Product Comparison
        </h1>
        <p className="text-gray-600">
          Compare {products.length} products side by side
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ComparisonCard key={product.id} product={product} />
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ComparisonTableDetail products={products} />
      </div>
    </div>
  );
}

/**
 * Detailed comparison table
 */
function ComparisonTableDetail({ products }: { products: Product[] }) {
  const rows = [
    { label: 'Price', key: 'price' },
    { label: 'Original Price', key: 'originalPrice' },
    { label: 'Rating', key: 'rating' },
    { label: 'Reviews', key: 'reviewCount' },
    { label: 'Material', key: 'material' },
    { label: 'Category', key: 'category' },
    { label: 'Description', key: 'description' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key}
              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              <th className="text-left px-6 py-4 font-semibold text-gray-900 bg-gray-50 min-w-{40]">
                {row.label}
              </th>
              {products.map((product) => {
                const productOriginalPrice = product.originalPrice || product.price;
                return (
                <td
                  key={product.id}
                  className="px-6 py-4 text-gray-700 border-l border-gray-200"
                >
                  {row.key === 'price' && `₹${product.price.toLocaleString()}`}
                  {row.key === 'originalPrice' && productOriginalPrice &&
                    `₹${productOriginalPrice.toLocaleString()}`}
                  {row.key === 'rating' && `${(product as any).rating || 'N/A'} ⭐`}
                  {row.key === 'reviewCount' && `${(product as any).reviewCount || 0} reviews`}
                  {row.key === 'material' && product.material}
                  {row.key === 'category' && (typeof product.category === 'string' ? product.category : product.category?.name || 'N/A')}
                  {row.key === 'description' && (
                    <span className="line-clamp-2">{product.description}</span>
                  )}
                </td>
              );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
