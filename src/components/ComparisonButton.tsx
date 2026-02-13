'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { FiBarChart2, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ComparisonButtonProps {
  product: Product;
  showLabel?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Comparison Button - Add product to comparison
 * Shows toggle state when product is in comparison
 */
export function ComparisonButton({
  product,
  showLabel = true,
  variant = 'outline',
  size = 'md',
}: ComparisonButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison, getComparisonCount } =
    useComparison();

  const inComparison = isInComparison(String(product.id));
  const count = getComparisonCount();

  const handleToggle = () => {
    if (inComparison) {
      removeFromComparison(String(product.id));
      toast.success('Removed from comparison');
    } else {
      if (count >= 4) {
        toast('Maximum 4 products. Oldest replaced.', {
          icon: 'ℹ️',
        });
      }
      addToComparison(product);
      toast.success('Added to comparison');
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Button
        onClick={handleToggle}
        variant={inComparison ? 'default' : variant}
        className={`
          ${sizeClasses[size]}
          flex items-center gap-2
          ${
            inComparison
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }
          transition-all duration-200
        `}
      >
        {inComparison ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <FiCheck className="w-4 h-4" />
              {showLabel && 'In Comparison'}
            </motion.div>
          </>
        ) : (
          <>
            <FiBarChart2 className="w-4 h-4" />
            {showLabel && 'Compare'}
          </>
        )}
      </Button>
    </motion.div>
  );
}

/**
 * Comparison Counter Badge - Shows number of items in comparison
 */
export function ComparisonCounter() {
  const { getComparisonCount } = useComparison();
  const count = getComparisonCount();

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <a
        href="/comparison"
        className="relative inline-flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors group"
      >
        <FiBarChart2 className="w-6 h-6" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {count > 9 ? '9+' : count}
        </motion.div>
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          View Comparison
        </div>
      </a>
    </motion.div>
  );
}
