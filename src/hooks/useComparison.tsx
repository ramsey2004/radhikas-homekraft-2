'use client';

import { useState, useCallback } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import OptimizedImage from '@/components/OptimizedImage';
import { Product } from '@/types';

interface ComparisonItem {
  product: Product;
  addedAt: Date;
}

/**
 * Product Comparison Hook
 * Manages comparison list in localStorage and state
 */
export function useComparison() {
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  const loadComparisons = useCallback(() => {
    try {
      const saved = localStorage.getItem('comparisons');
      if (saved) {
        const parsed = JSON.parse(saved);
        setComparisons(parsed);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load comparisons:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  const saveComparisons = useCallback((items: ComparisonItem[]) => {
    try {
      localStorage.setItem('comparisons', JSON.stringify(items));
      setComparisons(items);
    } catch (error) {
      console.error('Failed to save comparisons:', error);
    }
  }, []);

  // Add product to comparison
  const addComparison = useCallback(
    (product: Product) => {
      const updatedItems = [
        ...comparisons,
        { product, addedAt: new Date() },
      ].slice(-4); // Keep max 4 products
      saveComparisons(updatedItems);
    },
    [comparisons, saveComparisons]
  );

  // Remove product from comparison
  const removeComparison = useCallback(
    (productId: number) => {
      const updatedItems = comparisons.filter((c) => c.product.id !== productId);
      saveComparisons(updatedItems);
    },
    [comparisons, saveComparisons]
  );

  // Clear all comparisons
  const clearComparisons = useCallback(() => {
    saveComparisons([]);
  }, [saveComparisons]);

  // Check if product is in comparison
  const isInComparison = useCallback(
    (productId: number) => {
      return comparisons.some((c) => c.product.id === productId);
    },
    [comparisons]
  );

  return {
    comparisons,
    addComparison,
    removeComparison,
    clearComparisons,
    isInComparison,
    loadComparisons,
    isLoaded,
  };
}

/**
 * Product Comparison Table Component
 */
interface ComparisonTableProps {
  items: ComparisonItem[];
  onRemoveItem: (productId: string | number) => void;
  onClearAll: () => void;
}

export function ComparisonTable({ items, onRemoveItem, onClearAll }: ComparisonTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No products to compare yet.</p>
        <p className="text-sm text-gray-500">Add products to compare their features side by side.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg border border-gray-200">
      <div className="min-w-max">
        {/* Header with remove buttons */}
        <div className="grid gap-4 p-4 border-b border-gray-200 bg-gray-50" style={{
          gridTemplateColumns: `200px repeat(${items.length}, 1fr)`,
        }}>
          <div />
          {items.map((item) => (
            <div key={item.product.id} className="flex flex-col gap-2">
              <button
                onClick={() => onRemoveItem(item.product.id)}
                className="text-gray-400 hover:text-red-500 transition-colors self-end"
                aria-label="Remove from comparison"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Product images */}
        <div className="grid gap-4 p-4 border-b border-gray-200" style={{
          gridTemplateColumns: `200px repeat(${items.length}, 1fr)`,
        }}>
          <div className="font-semibold text-gray-900">Product</div>
          {items.map((item) => (
            <div key={item.product.id} className="flex flex-col gap-2">
              <OptimizedImage
                src={item.product.thumbnail || item.product.images?.[0] || '/images/placeholder.png'}
                alt={item.product.name}
                width={150}
                height={150}
                className="rounded-lg"
              />
              <p className="font-medium text-gray-900 text-sm line-clamp-2">
                {item.product.name}
              </p>
            </div>
          ))}
        </div>

        {/* Price */}
        <ComparisonRow label="Price">
          {items.map((item) => (
            <div key={item.product.id} className="flex flex-col">
              <span className="text-lg font-bold text-accent-600">
                ₹{item.product.price.toLocaleString()}
              </span>
              {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                <span className="text-sm line-through text-gray-400">
                  ₹{item.product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </ComparisonRow>

        {/* Rating */}
        <ComparisonRow label="Rating">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-2">
              <span className="font-semibold">4.5</span>
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-500">(12)</span>
            </div>
          ))}
        </ComparisonRow>

        {/* Material */}
        <ComparisonRow label="Material">
          {items.map((item) => (
            <div key={item.product.id} className="text-sm text-gray-700">
              {item.product.material}
            </div>
          ))}
        </ComparisonRow>

        {/* Category */}
        <ComparisonRow label="Category">
          {items.map((item) => (
            <div key={item.product.id} className="text-sm text-gray-700">
              {typeof item.product.category === 'string' 
                ? item.product.category 
                : item.product.category?.name || 'N/A'}
            </div>
          ))}
        </ComparisonRow>

        {/* Stock */}
        <ComparisonRow label="Stock">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-2">
              {(item.product as any).inStock !== false ? (
                <>
                  <FiCheck className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-700">In Stock</span>
                </>
              ) : (
                <span className="text-sm text-red-700">Out of Stock</span>
              )}
            </div>
          ))}
        </ComparisonRow>

        {/* Dimensions */}
        <ComparisonRow label="Dimensions">
          {items.map((item) => (
            <div key={item.product.id} className="text-sm text-gray-700">
              {(item.product as any).dimensions || 'N/A'}
            </div>
          ))}
        </ComparisonRow>

        {/* Description */}
        <ComparisonRow label="Description">
          {items.map((item) => (
            <div key={item.product.id} className="text-sm text-gray-600 line-clamp-3">
              {item.product.description}
            </div>
          ))}
        </ComparisonRow>
      </div>

      {/* Clear button */}
      {items.length > 0 && (
        <div className="flex justify-center p-4 border-t border-gray-200">
          <button
            onClick={onClearAll}
            className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Comparison
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Comparison row component for the table
 */
function ComparisonRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
      style={{
        gridTemplateColumns: `200px repeat(auto-fit, minmax(200px, 1fr))`,
      }}
    >
      <div className="font-medium text-gray-900">{label}</div>
      {children}
    </div>
  );
}
