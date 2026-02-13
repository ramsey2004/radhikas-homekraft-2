'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FiFilter, FiArrowRight } from 'react-icons/fi';
import { CUSTOMER_STORIES, STORY_CATEGORIES } from '@/data/stories';
import { motion } from 'framer-motion';

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredStories = useMemo(() => {
    if (!selectedCategory) return CUSTOMER_STORIES;
    return CUSTOMER_STORIES.filter((story) => story.category === selectedCategory);
  }, [selectedCategory]);

  const featuredStories = CUSTOMER_STORIES.filter((story) => story.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Customer Stories
          </h1>
          <p className="text-amber-100 text-lg">
            Real transformations from customers who chose handcrafted authenticity
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredStories.map((story, idx) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.slug}`}
                  className="group cursor-pointer"
                >
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border-2 border-amber-100 rounded-lg overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-6xl">
                      {story.image}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                          {story.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-amber-600 line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {story.customerName} • {story.customerLocation}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {story.testimonial}
                      </p>
                      <div className="flex items-center text-amber-600 font-semibold text-sm">
                        Read Story <FiArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <FiFilter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Stories
            </button>
            {STORY_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.length > 0 ? (
            filteredStories.map((story, idx) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group cursor-pointer"
              >
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 3) * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all h-full flex flex-col"
                >
                  <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-5xl">
                    {story.image}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit mb-2">
                      {story.category}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 group-hover:text-amber-600 flex-1">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">{story.customerName}</span>
                      {story.customerRole && ` • ${story.customerRole}`}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                      {story.testimonial}
                    </p>
                    <div className="flex items-center text-amber-600 font-semibold text-sm">
                      Read More <FiArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-600 text-lg">No stories found in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
