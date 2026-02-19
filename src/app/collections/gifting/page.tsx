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
    name: 'Artisan Hamper Gift Set',
    price: '₹3,999',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=500&fit=crop',
    description: 'Curated collection in premium packaging',
  },
  {
    id: 2,
    name: 'Ceramic & Textile Gift Box',
    price: '₹2,799',
    image: 'https://images.unsplash.com/photo-1599599810694-2202d0ffc1b6?w=500&h=500&fit=crop',
    description: 'Thoughtfully paired home decor items',
  },
  {
    id: 3,
    name: 'Sustainable Living Kit',
    price: '₹3,499',
    image: 'https://images.unsplash.com/photo-1596552183317-4da0f8c6d8e8?w=500&h=500&fit=crop',
    description: 'Eco-friendly essentials for conscious living',
  },
  {
    id: 4,
    name: 'Luxury Wellness Collection',
    price: '₹4,299',
    image: 'https://images.unsplash.com/photo-1599599810694-2202d0ffc0b9?w=500&h=500&fit=crop',
    description: 'Premium spa and wellness products',
  },
];

export default function GiftingCollection() {
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
          <h1 className="text-5xl sm:text-6xl font-light tracking-wider mb-4">PUNĪTA</h1>
          <p className="text-lg">Sacred & Thoughtful Gifting</p>
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
            Punīta curates meaningful gift collections for every occasion. Our thoughtfully designed gift sets combine the finest artisan products from our collections—ceramics, textiles, and home decor—beautifully packaged to celebrate life's special moments. Each gift is crafted with intention and wrapped with care.
          </p>
          <p style={{ color: COLORS.deepTeal }} className="font-semibold">
            🎁 Thoughtfully Curated • Premium Packaging • Occasion-Specific
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
          <h2 className="text-3xl font-light mb-4">Custom Gift Wrapping</h2>
          <p className="mb-6">Add a personalized message and premium gift wrapping to make your gift extra special.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-medium transition-all"
            style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
          >
            Customize Your Gift
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
