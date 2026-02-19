'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
  lightBeige: '#E8D5C4',
};

// Mock search data - in a real app, this would come from an API
const searchData = [
  { id: 1, name: 'Blue Block Print Bedsheet', category: 'bedsheets', price: '₹2,570', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop' },
  { id: 2, name: 'Green Block Print Bedsheet', category: 'bedsheets', price: '₹2,570', image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=100&h=100&fit=crop' },
  { id: 3, name: 'Pink Block Print Bedsheet', category: 'bedsheets', price: '₹2,570', image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=100&h=100&fit=crop' },
  { id: 4, name: 'Traditional Lamp', category: 'lamps', price: '₹3,200', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=100&h=100&fit=crop' },
  { id: 5, name: 'Ceramic Vase', category: 'ceramics', price: '₹1,800', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop' },
  { id: 6, name: 'Wooden Furniture Set', category: 'furniture', price: '₹12,000', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop' },
  { id: 7, name: 'Handcrafted Gift Box', category: 'gifting', price: '₹2,500', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&h=100&fit=crop' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchData);

  useEffect(() => {
    if (query.trim() === '') {
      setResults(searchData);
    } else {
      const filtered = searchData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 mx-4"
          >
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Search Header */}
              <div className="p-6 border-b" style={{ borderColor: COLORS.lightBeige }}>
                <div className="flex items-center gap-4">
                  <Search size={24} style={{ color: COLORS.deepTeal }} />
                  <input
                    type="text"
                    placeholder="Search for bedsheets, lamps, ceramics..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 text-lg outline-none"
                    style={{ color: COLORS.charcoal }}
                    autoFocus
                  />
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} style={{ color: COLORS.charcoal }} />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-lg" style={{ color: COLORS.charcoal }}>
                      No products found for "{query}"
                    </p>
                    <p className="text-sm mt-2" style={{ color: COLORS.charcoal }}>
                      Try searching for bedsheets, lamps, ceramics, or furniture
                    </p>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map((item) => (
                        <Link
                          key={item.id}
                          href={`/collections/${item.category}/${item.id}`}
                          onClick={onClose}
                          className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border"
                          style={{ borderColor: COLORS.lightBeige }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium" style={{ color: COLORS.deepTeal }}>
                              {item.name}
                            </h3>
                            <p className="text-sm capitalize" style={{ color: COLORS.charcoal }}>
                              {item.category}
                            </p>
                            <p className="text-sm font-semibold mt-1" style={{ color: COLORS.gold }}>
                              {item.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="p-6 border-t bg-gray-50" style={{ borderColor: COLORS.lightBeige }}>
                <p className="text-sm font-medium mb-3" style={{ color: COLORS.charcoal }}>
                  Popular Categories:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['bedsheets', 'lamps', 'ceramics', 'furniture', 'gifting'].map((category) => (
                    <Link
                      key={category}
                      href={`/collections/${category}`}
                      onClick={onClose}
                      className="px-3 py-1 text-sm rounded-full capitalize transition-colors"
                      style={{
                        backgroundColor: COLORS.lightBeige,
                        color: COLORS.deepTeal
                      }}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}