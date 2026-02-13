'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import { ComparisonPage as ComparisonPageComponent } from '@/components/ComparisonModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * Comparison Page - Full page comparison view
 * Displays 4 products side-by-side with detailed specs
 */
export default function ComparisonPageRoute() {
  const { comparisonItems, clearComparison } = useComparison();

  if (comparisonItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 px-4 pb-12"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Product Comparison
            </h1>
            <p className="text-gray-600">
              Compare up to 4 products side-by-side
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4h6a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No products to compare
            </h2>
            <p className="text-gray-600 mb-6">
              Add products to your comparison to view them side-by-side
            </p>
            <Link href="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 px-4 pb-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Product Comparison
            </h1>
            <Button
              variant="outline"
              onClick={clearComparison}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              Clear All
            </Button>
          </div>
          <p className="text-gray-600">
            Comparing {comparisonItems.length} {comparisonItems.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Comparison Component */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ComparisonPageComponent products={comparisonItems} />
        </div>

        {/* Footer CTA */}
        {comparisonItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200"
          >
            <p className="text-gray-700 mb-4">
              Ready to purchase? Add your selected products to cart and proceed to checkout.
            </p>
            <Link href="/products">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
