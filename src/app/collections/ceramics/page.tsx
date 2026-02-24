'use client';

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
    name: 'Hand-Thrown Ceramic Vase',
    price: '₹2,499',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop',
    description: 'Artisan-made ceramic vase with glazed finish',
  },
  {
    id: 2,
    name: 'Terracotta Bowl Set',
    price: '₹1,899',
    image: 'https://images.unsplash.com/photo-1578719749744-338d40b90ee0?w=500&h=500&fit=crop',
    description: 'Set of 3 natural terracotta serving bowls',
  },
  {
    id: 3,
    name: 'Ceramic Dinnerware Collection',
    price: '₹4,999',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop',
    description: 'Complete handcrafted ceramic dinner set',
  },
  {
    id: 4,
    name: 'Decorative Ceramic Vessels',
    price: '₹1,599',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=500&fit=crop',
    description: 'Artistic ceramic pieces for home decor',
  },
];

export default function CeramicsCollection() {
  return (
    <div style={{ backgroundColor: COLORS.ivory, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-5xl sm:text-6xl font-light tracking-wider mb-4">AMALA</h1>
          <p className="text-lg">Pure & Immaculate Ceramics</p>
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
            Amala represents the purity and simplicity of ceramic artistry. Our collection features hand-thrown pottery, terracotta vessels, and glazed ceramics created by master artisans. Each piece celebrates the beauty of natural materials and traditional pottery techniques, bringing organic elegance to your home and table.
          </p>
          <p style={{ color: COLORS.deepTeal }} className="font-semibold">
            🏺 Hand-Thrown • Natural Clay • Food-Safe Finishes
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
          <h2 className="text-3xl font-light mb-4">Artisan Stories</h2>
          <p className="mb-6">Learn about the pottery families behind these beautiful creations.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-medium transition-all"
            style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
          >
            Read Artisan Stories
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
