/**
 * Advanced Search & Filter Utilities
 * Handles product filtering, sorting, and advanced search logic
 */

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  materials: string[];
  ratings: number[];
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

export interface SortOption {
  label: string;
  value: 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';
}

export const DEFAULT_FILTERS: FilterOptions = {
  priceRange: [0, 10000],
  categories: [],
  materials: [],
  ratings: [],
  inStock: true,
  onSale: false,
  isNew: false,
};

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

export const MATERIAL_OPTIONS = [
  'Cotton',
  'Silk',
  'Linen',
  'Wool',
  'Rayon',
  'Khadi',
  'Handloom',
  'Batik',
  'Block Print',
  'Natural Dye',
];

export const CATEGORY_OPTIONS = [
  'Bedsheets',
  'Rugs',
  'Cushions',
  'Wall Hangings',
  'Home Decor',
  'Textiles',
  'Artisan Goods',
];

export const RATING_OPTIONS = [5, 4, 3, 2, 1];

/**
 * Build filter query parameters for API requests
 */
export function buildFilterParams(filters: FilterOptions): URLSearchParams {
  const params = new URLSearchParams();

  params.append('minPrice', filters.priceRange[0].toString());
  params.append('maxPrice', filters.priceRange[1].toString());

  if (filters.categories.length > 0) {
    params.append('categories', filters.categories.join(','));
  }

  if (filters.materials.length > 0) {
    params.append('materials', filters.materials.join(','));
  }

  if (filters.ratings.length > 0) {
    params.append('ratings', filters.ratings.join(','));
  }

  if (filters.inStock) {
    params.append('inStock', 'true');
  }

  if (filters.onSale) {
    params.append('onSale', 'true');
  }

  if (filters.isNew) {
    params.append('isNew', 'true');
  }

  return params;
}

/**
 * Get display label for filter
 */
export function getFilterLabel(key: keyof FilterOptions, value: any): string {
  switch (key) {
    case 'priceRange':
      return `₹${value[0]} - ₹${value[1]}`;
    case 'categories':
    case 'materials':
      return value;
    case 'ratings':
      return `${value}+ Stars`;
    case 'onSale':
      return 'On Sale';
    case 'isNew':
      return 'New Arrivals';
    case 'inStock':
      return 'In Stock Only';
    default:
      return '';
  }
}

/**
 * Check if filters have any active selections
 */
export function hasActiveFilters(filters: FilterOptions, defaults: FilterOptions): boolean {
  return (
    filters.priceRange !== defaults.priceRange ||
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.ratings.length > 0 ||
    filters.onSale !== defaults.onSale ||
    filters.isNew !== defaults.isNew
  );
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: FilterOptions): number {
  let count = 0;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.materials.length > 0) count += filters.materials.length;
  if (filters.ratings.length > 0) count += filters.ratings.length;
  if (filters.onSale) count++;
  if (filters.isNew) count++;
  return count;
}
