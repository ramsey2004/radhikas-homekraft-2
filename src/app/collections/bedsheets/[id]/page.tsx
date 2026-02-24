'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, Heart, Share2, Truck, RotateCcw, MapPin, Wallet } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

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

// Related/Cross-sell products
const relatedProducts = [
  {
    id: 2,
    name: 'Indigo Pillow Covers',
    price: '₹890',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Hand-woven Throw Blanket',
    price: '₹1,850',
    image: 'https://images.unsplash.com/photo-1515447435-d3e4e16c5264?w=400&h=400&fit=crop',
  },
];

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
    <div className="bg-white min-h-screen">
      {/* Minimal Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/collections/bedsheets" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Bedsheets</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-square overflow-hidden bg-gray-100"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={700}
                height={700}
                className="w-full h-full object-cover"
                quality={90}
              />
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 overflow-hidden border transition-all ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(averageRating) ? '#000' : 'none'}
                      stroke={i < Math.floor(averageRating) ? '#000' : '#999'}
                      className="text-gray-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>

              <p className="text-2xl font-light text-gray-900 mb-8">
                {product.price}
              </p>

              <p className="text-base leading-relaxed text-gray-700 mb-8">
                {product.description}
              </p>
            </motion.div>

            {/* Trust Badges - Luxury Style */}
<motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 py-8 border-y border-gray-200"
            >
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Made in Jaipur</p>
                  <p className="text-xs text-gray-600">Handcrafted by artisans</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">Delivered in 5-7 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wallet size={20} className="text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">COD Available</p>
                  <p className="text-xs text-gray-600">Pay on delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={20} className="text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">7-Day Returns</p>
                  <p className="text-xs text-gray-600">Easy exchange policy</p>
                </div>
              </div>
            </motion.div>

            {/* Quantity & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-6">
                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  className="flex-1 py-4 px-8 bg-gray-900 text-white text-sm tracking-wide uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 border transition-colors ${
                    isWishlisted ? 'border-gray-900 bg-gray-900' : 'border-gray-300 hover:border-gray-900'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={isWishlisted ? 'text-white' : 'text-gray-700'}
                    fill={isWishlisted ? 'currentColor' : 'none'} 
                  />
                </button>
                <button className="p-4 border border-gray-300 hover:border-gray-900 transition-colors">
                  <Share2 size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-600' : 'bg-red-600'}`}></div>
                <span className="text-sm text-gray-700">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4 pt-8 border-t border-gray-200"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">Material:</span>
                  <span className="text-gray-700">{product.material}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">Dimensions:</span>
                  <span className="text-gray-700">{product.dimensions}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">Care:</span>
                  <span className="text-gray-700">{product.care}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pairs Well With Section - Conversion Psychology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 pt-16 border-t border-gray-200"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 mb-12 text-center">
            Pairs Well With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/collections/bedsheets/${item.id}`}
                className="group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-light text-gray-900 mb-2">{item.name}</h3>
                <p className="text-base text-gray-700">{item.price}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Customer Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 pt-16 border-t border-gray-200"
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 mb-12">Customer Reviews</h2>
          <div className="space-y-8 max-w-3xl">
            {product.reviews.map((review) => (
              <div key={review.id} className="pb-8 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? '#000' : 'none'}
                          stroke={i < review.rating ? '#000' : '#ccc'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}