'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiStar, FiHeart, FiShoppingCart, FiTruck, FiRotateCcw, FiShield, FiBarChart2, FiSmartphone } from 'react-icons/fi';
import { ROUTES } from '@/lib/constants';
import { PRODUCTS } from '@/data/products';
import Breadcrumb from '@/components/Breadcrumb';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useComparison } from '@/contexts/ComparisonContext';
import OptimizedImage from '@/components/OptimizedImage';
import { ReviewSubmitForm, ReviewsList } from '@/components/ReviewComponents';
import { Product } from '@/types';

interface ProductReview {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const product = PRODUCTS.find((p) => p.slug === params.slug);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const isWishlisted = product ? isInWishlist(String(product.id)) : false;
  const inComparison = product ? isInComparison(String(product.id)) : false;

  useEffect(() => {
    // Add to recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (!recentlyViewed.includes(product?.id)) {
      recentlyViewed.unshift(product?.id);
      if (recentlyViewed.length > 5) recentlyViewed.pop();
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [product?.id]);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;
      
      setReviewsLoading(true);
      try {
        const response = await fetch(`/api/reviews?productId=${product.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.reviews && Array.isArray(data.reviews)) {
            setReviews(
              data.reviews.map((r: any) => ({
                id: r.id,
                author: r.user?.name || 'Anonymous',
                rating: r.rating,
                comment: r.comment,
                date: new Date(r.createdAt).toLocaleDateString(),
                verified: r.verified,
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?.id]);

  const handleReviewSubmitted = (newReview: any) => {
    const formattedReview: ProductReview = {
      id: Math.random(),
      author: 'You',
      rating: newReview.rating,
      comment: newReview.comment,
      date: 'Just now',
      verified: newReview.verified,
    };
    setReviews([formattedReview, ...reviews]);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link href={ROUTES.SHOP} className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    if (product) {
      addItem(product as any, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(String(product.id));
      } else {
        addToWishlist(String(product.id));
      }
    }
  };

  const handleComparisonToggle = () => {
    if (product) {
      const productObj: Product = {
        id: String(product.id),
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountedPrice: product.price < product.originalPrice ? product.price : null,
        inventory: 0,
        sku: '',
        images: product.images,
        thumbnail: product.images[0] || null,
        categoryId: '',
        material: product.material,
        color: product.color || null,
        dimensions: product.size || null,
        weight: null,
        isFeatured: product.badge === 'Bestseller',
        isActive: true,
        description: product.description,
        shortDescription: product.description.substring(0, 100),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (inComparison) {
        removeFromComparison(String(product.id));
      } else {
        addToComparison(productObj);
      }
    }
  };

  // Available variants
  const colors = ['Natural', 'Indigo', 'Terracotta', 'Sage'];
  const sizes = ['Single', 'Double', 'Queen', 'King'];

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb
          items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Shop', href: ROUTES.SHOP },
            { label: product.category, href: `${ROUTES.SHOP}?category=${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            <div className="mb-4 h-96 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg overflow-hidden">
              <OptimizedImage
                src={`/images/products/${product.slug}-${selectedImage + 1}.jpg` || '/api/placeholder'}
                alt={`${product.name} - ${product.material} product image`}
                width={500}
                height={500}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                priority={true}
                className="w-full h-full"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'ring-2 ring-primary-600'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300'
                  }`}
                >
                  <OptimizedImage
                    src={`/images/products/${product.slug}-${idx + 1}.jpg` || '/api/placeholder'}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    width={80}
                    height={80}
                    sizes="80px"
                    priority={false}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Status Badges */}
            <div className="flex gap-2 mb-4">
              {product.badge && (
                <span className="bg-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.badge}
                </span>
              )}
              {product.inStock ? (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-primary-600">₹{product.price.toLocaleString()}</span>
                <span className="text-xl line-through text-gray-400">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-lg font-bold text-red-600 ml-2">Save {discountPercent}%</span>
              </div>
              <p className="text-green-600 font-semibold">Free shipping on orders above ₹2000</p>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 text-lg">{product.description}</p>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm">Material</p>
                <p className="font-semibold text-gray-900">{product.material}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Size</p>
                <p className="font-semibold text-gray-900">{product.size}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Color</p>
                <p className="font-semibold text-gray-900">{product.color}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Artisan</p>
                <p className="font-semibold text-gray-900">{product.artisan}</p>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
              <p className="text-gray-700">{product.care}</p>
            </div>

            {/* Variant Selection - Colors */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Choose Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 font-semibold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Selection - Sizes */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Choose Size</h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 font-semibold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <FiTruck className="h-6 w-6" />, text: 'Free Delivery' },
                { icon: <FiRotateCcw className="h-6 w-6" />, text: '30 Day Returns' },
                { icon: <FiShield className="h-6 w-6" />, text: 'Secure Payment' },
              ].map((benefit, idx) => (
                <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2 text-primary-600">{benefit.icon}</div>
                  <p className="text-sm font-semibold text-gray-900">{benefit.text}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="flex items-center border-2 border-gray-300 rounded-lg flex-shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-none focus:outline-none font-semibold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors min-w-[150px]"
              >
                <FiShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              <button
                onClick={handleComparisonToggle}
                className={`px-6 py-3 border-2 rounded-lg transition-colors flex items-center gap-2 ${
                  inComparison
                    ? 'border-primary-600 bg-primary-50 text-primary-600 hover:bg-primary-100'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
              >
                <FiBarChart2 className="h-5 w-5" />
                <span className="text-sm font-semibold hidden sm:inline">Compare</span>
              </button>

              <Link
                href={`/visualizer?product=${product.id}`}
                className="px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <FiSmartphone className="h-5 w-5" />
                <span className="text-sm font-semibold hidden sm:inline">Visualize</span>
              </Link>

              <button
                onClick={handleWishlistToggle}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FiHeart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16 border-t pt-8">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

          {/* Review Submission Form */}
          <div className="mb-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Share Your Feedback</h3>
            <ReviewSubmitForm 
              productId={String(product.id)} 
              productName={product.name}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>

          {/* Reviews Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">{averageRating}</div>
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(parseFloat(averageRating as string))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Based on {reviews.length} reviews</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <ReviewsList 
                reviews={reviews.map((r) => ({ 
                  id: String(r.id), 
                  productId: String(product.id), 
                  userId: '', 
                  rating: r.rating, 
                  comment: r.comment, 
                  title: r.comment.substring(0, 50),
                  images: [], 
                  verified: r.verified, 
                  helpful: 0, 
                  unhelpful: 0, 
                  createdAt: new Date(), 
                  updatedAt: new Date(),
                  userName: r.author,
                }))} 
                isLoading={reviewsLoading}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-3xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/products/${relProduct.slug}`}
                  className="group rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                    {relProduct.images[0]}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600">
                      {relProduct.name}
                    </h3>
                    <p className="text-primary-600 font-bold mt-2">₹{relProduct.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
