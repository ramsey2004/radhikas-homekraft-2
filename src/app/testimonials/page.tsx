'use client';

import { useState, useMemo } from 'react';
import { FiStar, FiFilter } from 'react-icons/fi';
import { ENHANCED_TESTIMONIALS, TESTIMONIAL_STATS } from '@/data/testimonials';
import { motion } from 'framer-motion';

export default function TestimonialsPage() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  const filteredTestimonials = useMemo(() => {
    let filtered = ENHANCED_TESTIMONIALS;

    if (filterRating) {
      filtered = filtered.filter((t) => t.rating >= filterRating);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'helpful') return b.helpful_count - a.helpful_count;
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return sorted;
  }, [filterRating, sortBy]);

  const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeMap = { sm: 4, md: 5, lg: 6 };
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`h-${sizeMap[size]} w-${sizeMap[size]} ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Customer Testimonials
          </h1>
          <p className="text-green-100 text-lg">
            Hear from thousands of satisfied customers worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200"
            suppressHydrationWarning
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-semibold">Average Rating</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {TESTIMONIAL_STATS.average_rating}
                </p>
              </div>
              <FiStar className="h-8 w-8 fill-yellow-400 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200"
            suppressHydrationWarning
          >
            <div>
              <p className="text-sm text-blue-600 font-semibold">Total Reviews</p>
              <p className="text-3xl font-bold text-blue-700">
                {TESTIMONIAL_STATS.total_reviews}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200"
            suppressHydrationWarning
          >
            <div>
              <p className="text-sm text-green-600 font-semibold">Verified Purchases</p>
              <p className="text-3xl font-bold text-green-700">
                {TESTIMONIAL_STATS.verified_percentage}%
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200"
            suppressHydrationWarning
          >
            <div>
              <p className="text-sm text-purple-600 font-semibold">Positive</p>
              <p className="text-3xl font-bold text-purple-700">
                {TESTIMONIAL_STATS.sentiment_positive}/{TESTIMONIAL_STATS.total_reviews}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filters & Sort */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-3">
            <FiFilter className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filter:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filterRating === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Ratings
            </button>
            {[5, 4, 3].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${
                  filterRating === rating
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rating}+ ⭐
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-600 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="bg-white border-2 border-green-100 rounded-lg p-6 hover:shadow-lg transition-all"
              suppressHydrationWarning
            >
              {/* Avatar & Name */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                  {testimonial.avatar || testimonial.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                  {testimonial.role && (
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  )}
                  {testimonial.location && (
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} size="sm" />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {testimonial.verified_purchase && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                    ✓ Verified Purchase
                  </span>
                )}
                {testimonial.verified && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Comment */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                &ldquo;{testimonial.comment}&rdquo;
              </p>

              {/* Product */}
              {testimonial.productPurchased && (
                <p className="text-xs text-gray-500 mb-4 italic">
                  Product: {testimonial.productPurchased}
                </p>
              )}

              {/* Helpful Count */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                <span>{testimonial.helpful_count} found this helpful</span>
                <span className="text-gray-600">
                  {new Date(testimonial.date).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-green-50 rounded-lg border-2 border-green-200 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Share Your Experience
          </h3>
          <p className="text-gray-600 mb-6">
            Have you purchased from us? We&apos;d love to hear about your experience
          </p>
          <button className="btn btn-primary bg-green-600 hover:bg-green-700">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
}
