'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Heart, Share2, Truck, RotateCcw, Shield, 
  ChevronDown, ChevronUp, Star, MapPin, Package, CreditCard 
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
  lightBeige: '#E8D5C4',
};

interface ProductPageProps {
  product: {
    id: number;
    name: string;
    price: string;
    originalPrice?: string;
    images: string[];
    description: string;
    material: string;
    fabricDetails: string;
    care: string;
    dimensions: string;
    weight?: string;
    delivery: string;
    cod: boolean;
    returns: string;
    inStock: boolean;
    artisan?: string;
    origin?: string;
    category: string;
    reviews: Array<{
      id: number;
      name: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
}

export default function ProductPageTemplate({ product }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('details');
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category
      }
    });
    toast.success(`${product.name} added to cart!`);
  };

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div style={{ backgroundColor: COLORS.ivory, minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: COLORS.charcoal }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href={`/collections/${product.category}`} className="hover:underline">{product.category}</Link>
          <span>/</span>
          <span style={{ color: COLORS.gold }}>{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image - Lifestyle shot first */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-square overflow-hidden rounded-lg"
              style={{ backgroundColor: COLORS.lightBeige }}
            >
              <Image
                src={product.images[selectedImage]}
                alt={`${product.name} - ${selectedImage === 0 ? 'Lifestyle image' : 'Detail view'}`}
                width={700}
                height={700}
                className="w-full h-full object-cover"
                priority={selectedImage === 0}
              />
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? `border-[${COLORS.gold}]` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label={`View ${index === 0 ? 'lifestyle' : 'detail'} image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Image indicator */}
            <p className="text-sm text-center" style={{ color: COLORS.charcoal }}>
              {selectedImage === 0 ? '📸 Lifestyle Image' : selectedImage === 1 ? '🔍 Detail Close-up' : '🎨 Additional View'}
            </p>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-light mb-3" style={{ color: COLORS.charcoal }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(averageRating) ? COLORS.gold : 'none'}
                      stroke={i < Math.floor(averageRating) ? COLORS.gold : COLORS.charcoal}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: COLORS.charcoal }}>
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-semibold" style={{ color: COLORS.gold }}>
                  {product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl line-through" style={{ color: COLORS.charcoal, opacity: 0.5 }}>
                      {product.originalPrice}
                    </span>
                    <span className="text-sm font-medium px-2 py-1 rounded" style={{ backgroundColor: COLORS.gold, color: 'white' }}>
                      SAVE {Math.round((1 - parseFloat(product.price.replace(/[^0-9.]/g, '')) / parseFloat(product.originalPrice.replace(/[^0-9.]/g, ''))) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-lg leading-relaxed" style={{ color: COLORS.charcoal }}>
                {product.description}
              </p>
            </motion.div>

            {/* Delivery & COD Info - Prominently displayed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border-2 rounded-lg p-4 space-y-3"
              style={{ borderColor: COLORS.gold, backgroundColor: 'white' }}
            >
              <div className="flex items-start gap-3">
                <Truck size={20} style={{ color: COLORS.deepTeal }} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium" style={{ color: COLORS.charcoal }}>Delivery Timeline</p>
                  <p className="text-sm" style={{ color: COLORS.charcoal, opacity: 0.8 }}>{product.delivery}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard size={20} style={{ color: COLORS.deepTeal }} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium" style={{ color: COLORS.charcoal }}>Cash on Delivery</p>
                  <p className="text-sm" style={{ color: COLORS.charcoal, opacity: 0.8 }}>
{product.cod ? '✅ Available' : '❌ Not available'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw size={20} style={{ color: COLORS.deepTeal }} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium" style={{ color: COLORS.charcoal }}>Returns Policy</p>
                  <p className="text-sm" style={{ color: COLORS.charcoal, opacity: 0.8 }}>{product.returns}</p>
                </div>
              </div>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <label className="font-medium" style={{ color: COLORS.charcoal }}>Quantity:</label>
              <div className="flex items-center border-2 rounded-lg" style={{ borderColor: COLORS.lightBeige }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-50 transition-colors"
                  style={{ color: COLORS.charcoal }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-6 py-2 font-medium" style={{ color: COLORS.charcoal }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-50 transition-colors"
                  style={{ color: COLORS.charcoal }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4"
            >
              <button
                onClick={addToCart}
                disabled={!product.inStock}
                className="flex-1 py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
              >
                <ShoppingBag size={20} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-4 rounded-lg border-2 transition-all"
                style={{
                  borderColor: COLORS.gold,
                  backgroundColor: isWishlisted ? COLORS.gold : 'white'
                }}
                aria-label="Add to wishlist"
              >
                <Heart size={20} fill={isWishlisted ? 'white' : 'none'} stroke={isWishlisted ? 'white' : COLORS.charcoal} />
              </button>
              <button
                className="p-4 rounded-lg border-2 transition-all"
                style={{ borderColor: COLORS.gold, color: COLORS.charcoal, backgroundColor: 'white' }}
                aria-label="Share product"
              >
                <Share2 size={20} />
              </button>
            </motion.div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <Shield size={24} className="mx-auto mb-2" style={{ color: COLORS.deepTeal }} />
                <p className="text-xs font-medium" style={{ color: COLORS.charcoal }}>Secure Payment</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <Package size={24} className="mx-auto mb-2" style={{ color: COLORS.deepTeal }} />
                <p className="text-xs font-medium" style={{ color: COLORS.charcoal }}>Quality Assured</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <MapPin size={24} className="mx-auto mb-2" style={{ color: COLORS.deepTeal }} />
                <p className="text-xs font-medium" style={{ color: COLORS.charcoal }}>Handcrafted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mt-12 max-w-4xl mx-auto space-y-2">
          {/* Material & Fabric */}
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: COLORS.lightBeige, backgroundColor: 'white' }}>
            <button
              onClick={() => toggleSection('material')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-lg" style={{ color: COLORS.charcoal }}>
                🧵 Material & Fabric Details
              </span>
              {expandedSection === 'material' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSection === 'material' && (
              <div className="px-6 pb-4" style={{ color: COLORS.charcoal }}>
                <p className="mb-2"><strong>Material:</strong> {product.material}</p>
                <p className="leading-relaxed">{product.fabricDetails}</p>
              </div>
            )}
          </div>

          {/* Size & Dimensions */}
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: COLORS.lightBeige, backgroundColor: 'white' }}>
            <button
              onClick={() => toggleSection('size')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-lg" style={{ color: COLORS.charcoal }}>
                📏 Size & Dimensions
              </span>
              {expandedSection === 'size' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSection === 'size' && (
              <div className="px-6 pb-4" style={{ color: COLORS.charcoal }}>
                <p className="mb-2"><strong>Dimensions:</strong> {product.dimensions}</p>
                {product.weight && <p><strong>Weight:</strong> {product.weight}</p>}
              </div>
            )}
          </div>

          {/* Care Instructions */}
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: COLORS.lightBeige, backgroundColor: 'white' }}>
            <button
              onClick={() => toggleSection('care')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-lg" style={{ color: COLORS.charcoal }}>
                🧼 Care Instructions
              </span>
              {expandedSection === 'care' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSection === 'care' && (
              <div className="px-6 pb-4" style={{ color: COLORS.charcoal }}>
                <p className="leading-relaxed">{product.care}</p>
              </div>
            )}
          </div>

          {/* Artisan Info */}
          {product.artisan && (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: COLORS.lightBeige, backgroundColor: 'white' }}>
              <button
                onClick={() => toggleSection('artisan')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-lg" style={{ color: COLORS.charcoal }}>
                  👨‍🎨 About the Artisan
                </span>
                {expandedSection === 'artisan' ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSection === 'artisan' && (
                <div className="px-6 pb-4" style={{ color: COLORS.charcoal }}>
                  <p><strong>Artisan:</strong> {product.artisan}</p>
                  {product.origin && <p><strong>Origin:</strong> {product.origin}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-6" style={{ color: COLORS.charcoal }}>
              Customer Reviews ({product.reviews.length})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-6" style={{ borderColor: COLORS.lightBeige, backgroundColor: 'white' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: COLORS.charcoal }}>{review.name}</span>
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
                    <span className="text-sm" style={{ color: COLORS.charcoal, opacity: 0.6 }}>{review.date}</span>
                  </div>
                  <p style={{ color: COLORS.charcoal }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
