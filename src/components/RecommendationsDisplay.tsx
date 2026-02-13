'use client';

import { useRecommendations } from '@/hooks/useRecommendations';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

interface RecommendationsDisplayProps {
  title: string;
  algorithm: 'trending' | 'byRating' | 'byCategory';
  params?: any;
  limit?: number;
}

export function RecommendationsDisplay({
  title,
  algorithm,
  params,
  limit = 4,
}: RecommendationsDisplayProps) {
  const recommendations = useRecommendations();
  
  let products: Product[] = [];
  
  switch (algorithm) {
    case 'trending':
      products = recommendations.trending(limit);
      break;
    case 'byRating':
      products = recommendations.byRating(4.5, limit);
      break;
    case 'byCategory':
      products = recommendations.byCategory(params?.category || 'Bedsheets', limit);
      break;
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            id={typeof product.id === 'string' ? parseInt(product.id) : product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            originalPrice={product.originalPrice || product.price}
            rating={4.5}
            reviewCount={0}
            image={product.thumbnail || product.images?.[0] || '/images/placeholder.png'}
            badge={product.isFeatured ? 'Featured' : undefined}
            description={product.shortDescription || product.description}
            material={product.material || 'Premium Quality'}
          />
        ))}
      </motion.div>
    </section>
  );
}
