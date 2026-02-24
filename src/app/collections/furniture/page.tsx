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
    name: 'Solid Wood Coffee Table',
    price: '₹8,999',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    description: 'Artisan-crafted reclaimed wood coffee table',
  },
  {
    id: 2,
    name: 'Hand-Carved Wooden Stool',
    price: '₹3,499',
    image: 'https://images.unsplash.com/photo-1589939705066-5a101c786e97?w=500&h=500&fit=crop',
    description: 'Traditional hand-carved decorative stool',
  },
  {
    id: 3,
    name: 'Woven Rattan Shelving Unit',
    price: '₹6,499',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop',
    description: 'Sustainable rattan storage solution',
  },
  {
    id: 4,
    name: 'Wooden Wall Mounted Shelf',
    price: '₹4,199',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop',
    description: 'Minimalist wooden wall shelving',
  },
];

export default function FurnitureCollection() {
  return (
    <div style={{ backgroundColor: COLORS.ivory, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-5xl sm:text-6xl font-light tracking-wider mb-4">GRIHKALĀ</h1>
          <p className="text-lg">Home Art & Furniture Design</p>
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
            GrihaKalā celebrates the art of home design through functional and aesthetic furniture pieces. Our collection features sustainably sourced wood, traditional joinery techniques, and minimalist contemporary designs. Each furniture piece is created to be a focal point while maintaining harmony with your living space.
          </p>
          <p style={{ color: COLORS.deepTeal }} className="font-semibold">
            🪑 Sustainable Wood • Handcrafted • Timeless Designs
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
          <h2 className="text-3xl font-light mb-4">Made to Order Available</h2>
          <p className="mb-6">Need bespoke furniture? We create custom pieces tailored to your space.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-medium transition-all"
            style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
          >
            Schedule Consultation
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
