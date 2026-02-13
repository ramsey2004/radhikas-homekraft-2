'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import Breadcrumb from '@/components/Breadcrumb';

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  ratings: number[];
  sortBy: string;
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    categories: [decodeURIComponent(params.category)],
    ratings: [],
    sortBy: 'relevance',
  });

  const category = CATEGORIES.find(
    (c) => c.name.toLowerCase() === decodeURIComponent(params.category).toLowerCase()
  );

  const categoryProducts = useMemo(() => {
    const result = PRODUCTS.filter((product) => {
      if (product.category !== category?.name) return false;

      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      if (
        filters.ratings.length > 0 &&
        !filters.ratings.some((r) => product.rating >= r)
      ) {
        return false;
      }

      return true;
    });

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
        break;
    }

    return result;
  }, [filters, category?.name]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category not found</h1>
          <Link href={ROUTES.SHOP} className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.SHOP} className="inline-flex items-center gap-2 mb-4 hover:opacity-80">
            <FiArrowLeft className="h-5 w-5" />
            Back to Shop
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">{category.icon}</span>
            <h1 className="font-serif text-4xl font-bold">{category.name}</h1>
          </div>
          <p className="text-primary-100 text-lg">{category.description}</p>
          <p className="text-primary-100 mt-2">{categoryProducts.length} products available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Shop', href: ROUTES.SHOP },
            { label: category.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <ProductFilter onFilterChange={setFilters} categories={CATEGORIES} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <strong>{categoryProducts.length}</strong>{' '}
                {categoryProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
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
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">
                  No products found in this category with your current filters
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 10000],
                      categories: [category.name],
                      ratings: [],
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
    </div>
  );
}
