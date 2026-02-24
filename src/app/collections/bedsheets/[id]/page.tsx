'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
  lightBeige: '#E8D5C4',
};

interface Product {
  id: number;
  name: string;
  price: string;
  images: string[];
  description: string;
  details: string;
  material: string;
  care: string;
  dimensions: string;
  inStock: boolean;
  reviews: {
    id: number;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const product: Product = {
  id: 1,
  name: 'Blue Block Print Bedsheet',
  price: '₹2,570',
  images: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&h=600&fit=crop',
  ],
  description: 'Beautiful blue block print bedsheet with traditional patterns, handcrafted by skilled artisans using natural dyes and sustainable practices.',
  details: 'This exquisite bedsheet features intricate block printing techniques passed down through generations. The blue motifs symbolize peace and tranquility, perfect for creating a serene bedroom atmosphere.',
  material: '100% Cotton, Hand-block printed with natural dyes',
  care: 'Machine wash cold, tumble dry low, iron if needed',
  dimensions: 'King Size: 108" x 102" (274cm x 259cm)',
  inStock: true,
  reviews: [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Absolutely beautiful craftsmanship! The colors are vibrant and the quality is outstanding.',
      date: '2024-02-15'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 4,
      comment: 'Great product, true to the description. Fast shipping and excellent packaging.',
      date: '2024-02-10'
    },
    {
      id: 3,
      name: 'Meera Patel',
      rating: 5,
      comment: 'Love the traditional design. Perfect for our bedroom decor. Highly recommend!',
      date: '2024-02-08'
    }
  ]
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: 'bedsheets'
      }
    });
    toast.success(`${product.name} added to cart!`);
  };

  const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

  return (
    <div style={{ backgroundColor: COLORS.ivory, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory, paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/collections/bedsheets" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span>Back to Bedsheets</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-gold' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-light mb-2" style={{ color: COLORS.charcoal }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(averageRating) ? COLORS.gold : 'none'}
                      stroke={i < Math.floor(averageRating) ? COLORS.gold : COLORS.charcoal}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: COLORS.charcoal }}>
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>

              <p className="text-2xl font-semibold mb-6" style={{ color: COLORS.gold }}>
                {product.price}
              </p>

              <p className="text-lg leading-relaxed mb-6" style={{ color: COLORS.charcoal }}>
                {product.description}
              </p>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <label className="font-medium" style={{ color: COLORS.charcoal }}>Quantity:</label>
              <div className="flex items-center border rounded-lg" style={{ borderColor: COLORS.lightBeige }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                  style={{ color: COLORS.charcoal }}
                >
                  -
                </button>
                <span className="px-4 py-2" style={{ color: COLORS.charcoal }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-50"
                  style={{ color: COLORS.charcoal }}
                >
                  +
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4"
            >
              <button
                onClick={addToCart}
                className="flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-3 rounded-lg border-2 transition-all"
                style={{
                  borderColor: COLORS.gold,
                  color: isWishlisted ? COLORS.gold : COLORS.charcoal,
                  backgroundColor: isWishlisted ? COLORS.gold : 'transparent'
                }}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                className="p-3 rounded-lg border-2 transition-all"
                style={{ borderColor: COLORS.gold, color: COLORS.charcoal }}
              >
                <Share2 size={20} />
              </button>
            </motion.div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span style={{ color: COLORS.charcoal }}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4 pt-6 border-t"
              style={{ borderColor: COLORS.lightBeige }}
            >
              <h3 className="text-xl font-medium" style={{ color: COLORS.charcoal }}>Product Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium" style={{ color: COLORS.deepTeal }}>Material:</span>
                  <span className="ml-2" style={{ color: COLORS.charcoal }}>{product.material}</span>
                </div>
                <div>
                  <span className="font-medium" style={{ color: COLORS.deepTeal }}>Dimensions:</span>
                  <span className="ml-2" style={{ color: COLORS.charcoal }}>{product.dimensions}</span>
                </div>
                <div>
                  <span className="font-medium" style={{ color: COLORS.deepTeal }}>Care Instructions:</span>
                  <span className="ml-2" style={{ color: COLORS.charcoal }}>{product.care}</span>
                </div>
              </div>
            </motion.div>

            {/* Shipping & Returns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-3 pt-6 border-t"
              style={{ borderColor: COLORS.lightBeige }}
            >
              <div className="flex items-center gap-3">
                <Truck size={20} style={{ color: COLORS.deepTeal }} />
                <span style={{ color: COLORS.charcoal }}>Free shipping on orders over ₹5,000</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} style={{ color: COLORS.deepTeal }} />
                <span style={{ color: COLORS.charcoal }}>2-year warranty on all products</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} style={{ color: COLORS.deepTeal }} />
                <span style={{ color: COLORS.charcoal }}>30-day return policy</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 pt-8 border-t"
          style={{ borderColor: COLORS.lightBeige }}
        >
          <h3 className="text-2xl font-medium mb-6" style={{ color: COLORS.charcoal }}>Customer Reviews</h3>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="p-6 rounded-lg" style={{ backgroundColor: COLORS.lightBeige }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium" style={{ color: COLORS.deepTeal }}>{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? COLORS.gold : 'none'}
                          stroke={i < review.rating ? COLORS.gold : COLORS.charcoal}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm" style={{ color: COLORS.charcoal }}>
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: COLORS.charcoal }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}