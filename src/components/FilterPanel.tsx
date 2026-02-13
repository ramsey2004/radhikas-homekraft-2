'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiX } from 'react-icons/fi';
import {
  FilterOptions,
  MATERIAL_OPTIONS,
  CATEGORY_OPTIONS,
  RATING_OPTIONS,
  getActiveFilterCount,
} from '@/lib/searchFilters';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
  showMobile?: boolean;
  onClose?: () => void;
}

/**
 * Advanced Filter Panel Component
 * Allows users to filter products by price, category, material, rating, and more
 */
export default function FilterPanel({
  filters,
  onFilterChange,
  onReset,
  onClose,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    material: false,
    rating: false,
    availability: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: [min, max] });
  };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: updatedCategories });
  };

  const handleMaterialToggle = (material: string) => {
    const updatedMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    onFilterChange({ ...filters, materials: updatedMaterials });
  };

  const handleRatingToggle = (rating: number) => {
    const updatedRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    onFilterChange({ ...filters, ratings: updatedRatings });
  };

  const activeCount = getActiveFilterCount(filters);

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeCount > 0 && (
            <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded-full text-xs font-medium">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-accent-600 hover:text-accent-700 font-medium"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="md:hidden">
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Price Filter */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max={filters.priceRange[1]}
              value={filters.priceRange[0]}
              onChange={(e) =>
                handlePriceChange(Number(e.target.value), filters.priceRange[1])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Min"
            />
            <input
              type="number"
              max="10000"
              min={filters.priceRange[0]}
              value={filters.priceRange[1]}
              onChange={(e) =>
                handlePriceChange(filters.priceRange[0], Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Max"
            />
          </div>
          <div className="text-sm text-gray-600">
            ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
          </div>
        </div>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          {CATEGORY_OPTIONS.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Material Filter */}
      <FilterSection
        title="Material"
        isExpanded={expandedSections.material}
        onToggle={() => toggleSection('material')}
      >
        <div className="space-y-2">
          {MATERIAL_OPTIONS.map((material) => (
            <label key={material} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={() => handleMaterialToggle(material)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{material}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection
        title="Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-2">
          {RATING_OPTIONS.map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => handleRatingToggle(rating)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">
                {rating}+ ★ ({rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : 'Good'})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection
        title="Availability"
        isExpanded={expandedSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => onFilterChange({ ...filters, onSale: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-700">On Sale</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isNew}
              onChange={(e) => onFilterChange({ ...filters, isNew: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-700">New Arrivals</span>
          </label>
        </div>
      </FilterSection>
    </motion.div>
  );
}

/**
 * Reusable collapsible filter section component
 */
interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0 py-4 first:pt-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-accent-600 transition-colors"
      >
        {title}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
