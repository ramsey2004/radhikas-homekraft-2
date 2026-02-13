'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import QuickView from '@/components/QuickView';
import Breadcrumb from '@/components/Breadcrumb';

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  ratings: number[];
  materials: string[];
  inStock: boolean;
  sortBy: string;
}

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    categories: [],
    ratings: [],
    materials: [],
    inStock: false,
    sortBy: 'relevance',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const result = PRODUCTS.filter((product) => {
      // Price filter
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      // Rating filter
      if (
        filters.ratings.length > 0 &&
        !filters.ratings.some((r) => product.rating >= r)
      ) {
        return false;
      }

      // Material filter
      if (
        filters.materials.length > 0 &&
        !filters.materials.includes(product.material)
      ) {
        return false;
      }

      // In stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // relevance - keep original order
        break;
    }

    return result;
  }, [filters, searchQuery]);

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 mb-4 hover:opacity-80">
            <FiArrowLeft className="h-5 w-5" />
            Back Home
          </Link>
          <h1 className="font-serif text-4xl font-bold mb-2">Shop All Products</h1>
          <p className="text-primary-100">Browse our complete collection of handcrafted items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Shop' },
          ]}
        />

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-600 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilter
              onFilterChange={setFilters}
              categories={CATEGORIES}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <strong>{filteredProducts.length}</strong>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onDoubleClick={() => handleQuickView(product)}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      image={product.images[0]}
                      badge={product.badge || undefined}
                      description={product.description}
                      material={product.material}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">
                  No products found with your current filters
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 10000],
                      categories: [],
                      ratings: [],
                      materials: [],
                      inStock: false,
                      sortBy: 'relevance',
                    })
                  }
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickView
        isOpen={isQuickViewOpen}
        product={quickViewProduct}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
