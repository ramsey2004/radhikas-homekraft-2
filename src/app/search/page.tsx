'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import FilterPanel from '@/components/FilterPanel';
import { Product } from '@/types';
import { FilterOptions, SORT_OPTIONS } from '@/lib/searchFilters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Search Results Page
 * Displays filtered and sorted products based on search parameters
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    categories: [],
    materials: [],
    ratings: [],
    inStock: false,
    onSale: false,
    isNew: false,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        
        // Add search query
        if (query) {
          params.append('search', query);
        }
        
        // Add price range
        params.append('minPrice', filters.priceRange[0].toString());
        params.append('maxPrice', filters.priceRange[1].toString());
        
        // Add categories
        filters.categories.forEach(cat => params.append('category', cat));
        
        // Add materials
        filters.materials.forEach(mat => params.append('material', mat));
        
        // Add ratings
        filters.ratings.forEach(rating => params.append('rating', String(rating)));
        
        // Add availability filters
        if (filters.inStock) params.append('inStock', 'true');
        if (filters.onSale) params.append('onSale', 'true');
        if (filters.isNew) params.append('isNew', 'true');
        
        // Add sort
        params.append('sort', sortBy);
        
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query, filters, sortBy]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      categories: [],
      materials: [],
      ratings: [],
      inStock: false,
      onSale: false,
      isNew: false,
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.materials.length > 0) count += filters.materials.length;
    if (filters.ratings.length > 0) count += filters.ratings.length;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.isNew) count++;
    return count;
  }, [filters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12"
    >
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FiSearch className="w-8 h-8 text-indigo-600" />
            Search Results
          </h1>
          {query && (
            <p className="text-lg text-gray-600">
              Results for &quot;<span className="font-semibold">{query}</span>&quot;
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Found {products.length} {products.length === 1 ? 'product' : 'products'}
            {activeFilterCount > 0 && ` • ${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}`}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block lg:sticky lg:top-24 h-fit`}
          >
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {/* Sort Bar */}
            <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FiChevronDown className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-white text-indigo-600 rounded text-sm font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-gray-700 font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-80 bg-white rounded-lg animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && products.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group border border-gray-200"
                  >
                    {/* Product Image */}
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer">
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        {product.discountedPrice && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                            -
                            {Math.round(
                              ((product.price - product.discountedPrice) / product.price) * 100
                            )}
                            %
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2 cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-indigo-600">
                          ₹{product.discountedPrice || product.price}
                        </span>
                        {product.discountedPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* Category and Material */}
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                        {product.material && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {product.material}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        <Link href={`/products/${product.slug}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No products found
                </h2>
                <p className="text-gray-600 mb-6">
                  {query
                    ? `We couldn't find any products matching "${query}"`
                    : 'Try adjusting your search or filters'}
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/products">
                    <Button>Browse All Products</Button>
                  </Link>
                  {(query || activeFilterCount > 0) && (
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
