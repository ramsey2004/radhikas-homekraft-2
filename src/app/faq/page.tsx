'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiChevronDown, FiThumbsUp } from 'react-icons/fi';
import { FAQ_ITEMS, FAQ_CATEGORIES } from '@/data/faq';
import { motion } from 'framer-motion';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<{ [key: string]: boolean }>({});

  const filteredFAQs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleHelpful = (id: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-secondary-100 text-lg">
            Find answers to common questions about our products and services
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-12">
          <div className="relative mb-8">
            <FiSearch className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary-600 text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-secondary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Topics
            </button>
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-secondary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                suppressHydrationWarning
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  className="w-full text-left"
                >
                  <div className="bg-white border-2 border-gray-200 hover:border-secondary-500 rounded-lg p-6 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-medium text-secondary-600 bg-secondary-50 px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.helpful} found this helpful
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        suppressHydrationWarning
                      >
                        <FiChevronDown className="h-6 w-6 text-secondary-600 flex-shrink-0 ml-4" />
                      </motion.div>
                    </div>

                    {/* Expanded Content */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: expandedId === item.id ? 1 : 0,
                        height: expandedId === item.id ? 'auto' : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                      suppressHydrationWarning
                    >
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {item.answer}
                        </p>

                        {/* Helpful Button */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHelpful(item.id);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              helpfulVotes[item.id]
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <FiThumbsUp className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Helpful
                            </span>
                          </button>
                          <span className="text-xs text-gray-500">
                            Was this helpful?
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No questions found matching your search
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-secondary-50 rounded-lg border-2 border-secondary-200 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Didn&apos;t find your answer?
          </h3>
          <p className="text-gray-600 mb-4">
            Contact our customer service team for personalized assistance
          </p>
          <button className="btn btn-secondary">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
