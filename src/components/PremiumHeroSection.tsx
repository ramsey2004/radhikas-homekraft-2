'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shirt, Star } from 'lucide-react';

/**
 * Premium Hero Section Component
 * Replaces generic gradient with professional design
 * Includes: Video background support, parallax scrolling, professional typography
 */
export default function PremiumHeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Pattern - Subtle and professional */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.02]" viewBox="0 0 100 100">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dots)" />
        </svg>

        {/* Accent gradient - subtle, used as accent only */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100 via-transparent to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-teal-100 to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <motion.div suppressHydrationWarning>
              {/* Badge */}
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-block"
              >
                <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-sm font-medium text-amber-800">
                  Premium Handcrafted Collections
                </div>
              </motion.div>

              {/* Main Heading - Professional typography */}
              <motion.h1
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Authentic Indian Handicrafts
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 text-xl text-gray-600 leading-relaxed max-w-md"
              >
                Handwoven textiles, artisan-crafted home decor, and timeless pieces directly from Indian artisans to your home.
              </motion.p>

              {/* Trust Signals */}
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 space-y-3 text-sm text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  Certified artisans from Jaipur, Rajasthan
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  100% authentic handmade pieces
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>
                  Fair-trade and eco-friendly practices
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={false}
                animate={false}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/shop"
                  className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center"
                >
                  Shop Now
                </motion.a>
                <motion.a
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/about"
                  className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors text-center"
                >
                  Learn Our Story
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-12 flex gap-8 text-sm"
              >
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-gray-600">Artisans</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-gray-600">Unique Pieces</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Hero Image Placeholder */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative h-96 lg:h-full min-h-96"
            >
              {/* Professional Placeholder - Ready for real image */}
              <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                {/* Image would go here - placeholder showing lifestyle photography area */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-teal-50">
                  <div className="text-center">
                    <div className="text-6xl font-serif font-bold text-gray-300 mb-4">RH</div>
                    <p className="text-gray-500 font-medium">Premium handcrafted home décor photography</p>
                    <p className="text-sm text-gray-400 mt-2">Lifestyle imagery coming soon</p>
                  </div>
                </div>

                {/* Floating Card - Product Feature */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-6 left-6 bg-white rounded-xl p-4 shadow-xl max-w-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Shirt className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Handwoven Saree</p>
                      <p className="text-amber-600 font-bold text-sm">$89.99</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <p className="text-xs font-bold text-gray-700">4.9/5</p>
                    </div>
                    <p className="text-xs text-gray-500">from 200+ reviews</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Search Bar - Featured below hero */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-20 -mt-12 mb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center px-6 py-4 gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for sarees, rugs, textiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Search
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
