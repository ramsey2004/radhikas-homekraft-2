'use client';

import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';

interface RecommendationAlgorithm {
  byCategory: (categoryId: string, limit?: number) => Product[];
  byPrice: (price: number, range?: number, limit?: number) => Product[];
  byRating: (minRating?: number, limit?: number) => Product[];
  collaborative: (viewedProductIds: string[], limit?: number) => Product[];
  trending: (limit?: number) => Product[];
  personalized: (
    viewedItems: Product[],
    wishlistItems: Product[],
    limit?: number
  ) => Product[];
}

export function useRecommendations(): RecommendationAlgorithm {
  const products = PRODUCTS as any[];

  // Category-based recommendations
  const byCategory = (categorySlug: string, limit = 4): Product[] => {
    return products.filter((p) =>
      p.category?.toLowerCase().includes(categorySlug.toLowerCase())
    ).slice(0, limit);
  };

  // Price-based recommendations
  const byPrice = (price: number, range = 50, limit = 4): Product[] => {
    const minPrice = price - range;
    const maxPrice = price + range;
    return products.filter((p) => p.price >= minPrice && p.price <= maxPrice)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  };

  // Rating-based recommendations
  const byRating = (minRating = 4.5, limit = 4): Product[] => {
    return products.filter((p) => (p.rating || 0) >= minRating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  };

  // Collaborative filtering - find similar products based on viewing patterns
  const collaborative = (viewedProductIds: string[], limit = 4): Product[] => {
    const viewedProducts = products.filter((p) =>
      viewedProductIds.includes(String(p.id))
    );
    const categories = new Set(viewedProducts.map((p) => p.category));

    const recommendations = products.filter(
      (p) =>
        categories.has(p.category) &&
        !viewedProductIds.includes(String(p.id))
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    return recommendations.length > 0 ? recommendations : trending(limit);
  };

  // Trending products (bestsellers)
  const trending = (limit = 4): Product[] => {
    return products.filter((p) => p.badge === 'Bestseller').slice(0, limit);
  };

  // Personalized recommendations combining multiple factors
  const personalized = (
    viewedItems: Product[],
    wishlistItems: Product[],
    limit = 6
  ): Product[] => {
    const viewed = new Set(viewedItems.map((p) => p.id));
    const wishlisted = new Set(wishlistItems.map((p) => p.id));

    // Score products based on category matches, price range, and rating
    const scored = products.filter(
      (p) => !viewed.has(p.id) && !wishlisted.has(p.id)
    ).map((product) => {
      let score = 0;

      // Boost score for matching categories
      const matchingCategories = [
        ...viewedItems,
        ...wishlistItems,
      ].filter((item) => item.category === product.category);
      score += matchingCategories.length * 10;

      // Boost score for similar price
      const avgPrice =
        ([...viewedItems, ...wishlistItems].reduce((sum, p) => sum + p.price, 0) ||
          0) / ([...viewedItems, ...wishlistItems].length || 1);
      const priceDiff = Math.abs(product.price - avgPrice);
      if (priceDiff < avgPrice * 0.3) score += 15;
      else if (priceDiff < avgPrice * 0.5) score += 10;
      else score += 5;

      // Boost score for high ratings
      if ((product.rating || 0) >= 4.5) score += 20;
      else if ((product.rating || 0) >= 4) score += 10;

      // Boost score for bestsellers
      if (product.badge === 'Bestseller') score += 15;

      return { product, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.product);
  };

  return {
    byCategory,
    byPrice,
    byRating,
    collaborative,
    trending,
    personalized,
  };
}
