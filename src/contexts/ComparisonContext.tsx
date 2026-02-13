'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from '@/types';

interface ComparisonContextType {
  comparisonItems: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  getComparisonCount: () => number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

/**
 * Comparison Provider
 * Manages product comparison state globally
 */
export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);

  const addToComparison = useCallback((product: Product) => {
    setComparisonItems((prev) => {
      // Limit to 4 products
      if (prev.length >= 4) {
        return [...prev.slice(1), product];
      }
      // Prevent duplicates
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeFromComparison = useCallback((productId: string) => {
    setComparisonItems((prev) => prev.filter((p) => String(p.id) !== productId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonItems([]);
  }, []);

  const isInComparison = useCallback(
    (productId: string) => {
      return comparisonItems.some((p) => String(p.id) === productId);
    },
    [comparisonItems]
  );

  const getComparisonCount = useCallback(() => {
    return comparisonItems.length;
  }, [comparisonItems]);

  const value: ComparisonContextType = {
    comparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonCount,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

/**
 * Hook to use comparison context
 */
export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}
