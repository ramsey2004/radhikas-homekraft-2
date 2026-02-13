/**
 * Advanced E-Commerce Features
 * Product Recommendations, Advanced Search, Reviews & Ratings
 */

export interface ProductRecommendation {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  reason: 'often-bought-together' | 'similar-products' | 'trending' | 'personalized';
  score: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  unhelpful: number;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  relevanceScore: number;
}

export interface SearchFilters {
  query?: string;
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  material?: string[];
  color?: string[];
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  description?: string;
}

// Search & Filter functions
export async function searchProducts(filters: SearchFilters): Promise<{ results: SearchResult[]; total: number; facets: any }> {
  const params = new URLSearchParams();
  if (filters.query) params.append('query', filters.query);
  if (filters.category?.length) params.append('category', filters.category.join(','));
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.rating) params.append('rating', filters.rating.toString());
  if (filters.material?.length) params.append('material', filters.material.join(','));
  if (filters.color?.length) params.append('color', filters.color.join(','));
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/search?${params}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}

export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
  const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to get suggestions');
  return response.json();
}

// Recommendation functions
export async function getProductRecommendations(productId: string, limit: number = 6): Promise<ProductRecommendation[]> {
  const response = await fetch(`/api/recommendations/products/${productId}?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  return response.json();
}

export async function getPersonalizedRecommendations(limit: number = 6): Promise<ProductRecommendation[]> {
  const response = await fetch(`/api/recommendations/personalized?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch personalized recommendations');
  return response.json();
}

export async function getTrendingProducts(limit: number = 6): Promise<ProductRecommendation[]> {
  const response = await fetch(`/api/recommendations/trending?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch trending products');
  return response.json();
}

export async function getOftenBoughtTogether(productId: string): Promise<ProductRecommendation[]> {
  const response = await fetch(`/api/recommendations/often-bought/${productId}`);
  if (!response.ok) throw new Error('Failed to fetch often bought together');
  return response.json();
}

// Review functions
export async function fetchProductReviews(productId: string, page: number = 1, limit: number = 20): Promise<{ reviews: ProductReview[]; total: number; averageRating: number }> {
  const response = await fetch(`/api/reviews?productId=${productId}&page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

export async function submitProductReview(productId: string, review: Omit<ProductReview, 'id' | 'productId' | 'status' | 'helpful' | 'unhelpful' | 'createdAt' | 'updatedAt' | 'userId' | 'userImage'>): Promise<ProductReview> {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, ...review }),
  });
  if (!response.ok) throw new Error('Failed to submit review');
  return response.json();
}

export async function updateProductReview(reviewId: string, updates: Partial<ProductReview>): Promise<ProductReview> {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update review');
  return response.json();
}

export async function deleteProductReview(reviewId: string): Promise<void> {
  const response = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete review');
}

export async function markReviewAsHelpful(reviewId: string): Promise<void> {
  const response = await fetch(`/api/reviews/${reviewId}/helpful`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to mark review as helpful');
}

export async function markReviewAsUnhelpful(reviewId: string): Promise<void> {
  const response = await fetch(`/api/reviews/${reviewId}/unhelpful`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to mark review as unhelpful');
}

// Variant functions
export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  const response = await fetch(`/api/products/${productId}/variants`);
  if (!response.ok) throw new Error('Failed to fetch variants');
  return response.json();
}

export async function createProductVariant(productId: string, variant: Omit<ProductVariant, 'id' | 'productId'>): Promise<ProductVariant> {
  const response = await fetch(`/api/products/${productId}/variants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variant),
  });
  if (!response.ok) throw new Error('Failed to create variant');
  return response.json();
}

export async function updateProductVariant(productId: string, variantId: string, updates: Partial<ProductVariant>): Promise<ProductVariant> {
  const response = await fetch(`/api/products/${productId}/variants/${variantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update variant');
  return response.json();
}

export async function deleteProductVariant(productId: string, variantId: string): Promise<void> {
  const response = await fetch(`/api/products/${productId}/variants/${variantId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete variant');
}
