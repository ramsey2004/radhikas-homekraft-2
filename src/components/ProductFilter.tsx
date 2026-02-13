'use client';

import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  ratings: number[];
  materials: string[];
  inStock: boolean;
  sortBy: string;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: { id: number; name: string }[];
}

export default function ProductFilter({ onFilterChange, categories }: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    categories: [],
    ratings: [],
    materials: [],
    inStock: false,
    sortBy: 'relevance',
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="mb-8">
      {/* Mobile Filter Button */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FiFilter className="h-5 w-5" />
          {isOpen ? <FiX className="h-5 w-5" /> : null}
        </button>
      </div>

      {/* Filter Panel */}
      <div
        className={`bg-gray-50 rounded-lg p-6 ${
          isOpen ? 'block' : 'hidden'
        } md:block space-y-6`}
      >
        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
          >
            <option value="relevance">Most Relevant</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Price Range
          </label>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">Min: ₹{filters.priceRange[0]}</label>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  handleFilterChange({
                    priceRange: [parseInt(e.target.value), filters.priceRange[1]],
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Max: ₹{filters.priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange({
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Categories
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(String(category.id))}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categories, String(category.id)]
                      : filters.categories.filter((c) => c !== String(category.id));
                    handleFilterChange({ categories: newCategories });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Rating
          </label>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(rating)}
                  onChange={(e) => {
                    const newRatings = e.target.checked
                      ? [...filters.ratings, rating]
                      : filters.ratings.filter((r) => r !== rating);
                    handleFilterChange({ ratings: newRatings });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  {'⭐'.repeat(rating)} & up
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Material
          </label>
          <div className="space-y-2">
            {['Cotton', 'Silk', 'Wool', 'Linen', 'Khadi', 'Jute'].map((material) => (
              <label key={material} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(material)}
                  onChange={(e) => {
                    const newMaterials = e.target.checked
                      ? [...filters.materials, material]
                      : filters.materials.filter((m) => m !== material);
                    handleFilterChange({ materials: newMaterials });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{material}</span>
              </label>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                handleFilterChange({ inStock: e.target.checked })
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-semibold text-gray-900">In Stock Only</span>
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setFilters({
              priceRange: [0, 10000],
              categories: [],
              ratings: [],
              materials: [],
              inStock: false,
              sortBy: 'relevance',
            });
            onFilterChange({
              priceRange: [0, 10000],
              categories: [],
              ratings: [],
              materials: [],
              inStock: false,
              sortBy: 'relevance',
            });
          }}
          className="w-full py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
