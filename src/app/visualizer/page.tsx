'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoomVisualizer } from '@/components/RoomVisualizer';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { FiChevronRight } from 'react-icons/fi';

/**
 * Room Visualizer Page
 * Full page for visualizing products in different rooms
 */
export default function VisualizerPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        (PRODUCTS as any[]).filter(p => p.category === selectedCategory).slice(0, 8)
      );
    } else {
      setFilteredProducts((PRODUCTS as any[]).slice(0, 8));
    }
  }, [selectedCategory]);

  const categories = [...new Set((PRODUCTS as any[]).map(p => p.category))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-20 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-indigo-600 font-medium">Visualizer</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Room Visualizer
          </h1>
          <p className="text-gray-600 max-w-2xl">
            See how our products look in your space before you buy. Choose a room, select products,
            and visualize them in real-time.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-16">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by Category:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as string)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
        >
          <RoomVisualizer suggestedProducts={filteredProducts} />
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: '📱 Multiple Rooms',
              description: 'Visualize products in different room types - bedroom, living room, kitchen, and more.',
            },
            {
              title: '🎨 Full Control',
              description: 'Scale, rotate, and position products exactly where you want them in the room.',
            },
            {
              title: '💾 Save & Share',
              description: 'Download your visualization as an image to save or share with friends and family.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200"
            >
              <p className="text-lg font-semibold text-gray-900 mb-2">{item.title}</p>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 How to Use</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>1. Select a room type from the left panel</li>
            <li>2. Choose a product from the right panel or add from the product cards</li>
            <li>3. Drag the product to position it in the room</li>
            <li>4. Use the controls to scale, rotate, or move it to front/back</li>
            <li>5. Click "Download" to save your visualization as an image</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
