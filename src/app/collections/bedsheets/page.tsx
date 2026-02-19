'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
  lightBeige: '#E8D5C4',
};

const products = [
  {
    id: 1,
    name: 'Indigo Block Print Bedsheet',
    price: '₹1,899',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    description: 'Hand-blocked traditional indigo cotton bedsheet',
  },
  {
    id: 2,
    name: 'Floral Tapestry Set',
    price: '₹2,499',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop',
    description: 'Vibrant floral printed cotton ensemble',
  },
  {
    id: 3,
    name: 'Geometric Pattern Linens',
    price: '₹1,699',
    image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&h=500&fit=crop',
    description: 'Modern geometric design on premium cotton',
  },
  {
    id: 4,
    name: 'Organic Cotton Bedding',
    price: '₹2,299',
    image: 'https://images.unsplash.com/photo-1578902050959-aa4a901a96ab?w=500&h=500&fit=crop',
    description: 'Eco-friendly organic cotton collection',
  },
];

export default function BedsheetsCollection() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: COLORS.ivory, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-5xl sm:text-6xl font-light tracking-wider mb-4">SĪVANA</h1>
          <p className="text-lg">Traditional Weaving & Textiles</p>
        </div>
      </div>

      {/* Category Description */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-lg leading-relaxed mb-6" style={{ color: COLORS.charcoal }}>
            Sīvana represents the ancient art of weaving and textile craftsmanship. Our bedsheet collection features traditional block prints, hand-woven patterns, and sustainable fabrics. Each piece tells a story of artisan skill and cultural heritage, transforming your bedroom into a sanctuary of comfort and beauty.
          </p>
          <p style={{ color: COLORS.deepTeal }} className="font-semibold">
            🧵 Hand-Woven • Block Printed • 100% Natural Fibers
          </p>
        </motion.div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProduct(product.id)}
            >
              {/* Product Card */}
              <div className="mb-4 overflow-hidden rounded-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.deepTeal }}>
                {product.name}
              </h3>
              <p className="text-sm mb-3" style={{ color: COLORS.charcoal }}>
                {product.description}
              </p>

              {/* Price and Button */}
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold" style={{ color: COLORS.gold }}>
                  {product.price}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
                >
                  <ShoppingBag size={20} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-lg"
          style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory }}
        >
          <h2 className="text-3xl font-light mb-4">Customization Available</h2>
          <p className="mb-6">Looking for custom designs? We offer personalized bedsheet collections.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-medium transition-all"
            style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
          >
            Request Custom Design
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
