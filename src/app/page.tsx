'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useSearch } from '@/contexts/SearchContext';
import { LuxuryMegaMenu } from '@/components/LuxuryMegaMenu';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF9F6',
  charcoal: '#111111',
  lightBeige: '#E8D5C4',
  darkTeal: '#2D5252',
  white: '#FFFFFF',
};


// ========================================
// 0️⃣ SECTION 0 - ANNOUNCEMENT BAR & WHATSAPP
// ========================================
/**
 * Free Shipping Announcement Bar + WhatsApp Chat
 */
function AnnouncementBar() {
  return (
    <>
      {/* Free Shipping Announcement Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-3 px-6 text-center text-sm font-medium tracking-wide"
        style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory }}
      >
        🎁 FREE SHIPPING ON ORDERS ABOVE ₹1,499 | COD AVAILABLE PAN-INDIA
      </motion.div>

      {/* WhatsApp Chat Widget */}
      <motion.a
        href="https://wa.me/919876543210?text=Hi%20Radhika's%20Homekraft!%20I'd%20like%20to%20know%20more%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300"
        title="Chat with us on WhatsApp"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.149c-1.488.557-2.64 1.405-3.596 2.361-1.962 1.962-2.922 4.66-2.922 7.475v.006c0 3.356 1.003 6.46 2.902 8.6l-.963 2.88c-.16.48.212.945.712.945.052 0 .106-.008.16-.025l3.359-1.004c1.404.577 3.002.903 4.748.903 3.637 0 6.823-1.413 8.785-3.375 1.962-1.962 2.922-4.66 2.922-7.475v-.006c0-3.356-1.003-6.46-2.902-8.6.16-.48-.212-.945-.712-.945-.052 0-.106.008-.16.025z" />
        </svg>
      </motion.a>
    </>
  );
}

// ========================================
// 1️⃣ SECTION 1 - NAVIGATION
// ========================================
/**
 * Minimal Luxury Navigation Bar with Mega Menu Integration
 */
function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, dispatch } = useCart();
  const { setIsSearchOpen } = useSearch();
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Clean White Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.span 
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-light tracking-[0.3em] text-gray-900"
              >
                RADHIKA'S
              </motion.span>
            </Link>

            {/* Desktop Menu - Luxury Mega Menu */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <LuxuryMegaMenu />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="text-gray-700 hover:text-gray-900 transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden bg-white border-b border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-6 space-y-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/collections/bedsheets" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            Bed & Linen
          </Link>
          <Link href="/collections/ceramics" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            Dining & Serving
          </Link>
          <Link href="/collections/ceramics" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            Drinkware
          </Link>
          <Link href="/collections/lamps" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            Decor & Lighting
          </Link>
          <Link href="/collections/gifting" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            Gifting
          </Link>
          <Link href="/b2b" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            B2B
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link href="/visit-store" onClick={() => setMobileMenuOpen(false)} className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors">
            Visit Store
          </Link>
        </div>
      </motion.div>
    </>
  );
}

// ========================================
// 2️⃣ SECTION 2 - HERO SECTION
// ========================================
/**
 * Full-screen Hero Section with Bedroom Lifestyle Image
 * Headline: "Krafted for Elegance"
 */
function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Full-width lifestyle bedroom image */}
      <Image
        src="https://res.cloudinary.com/dk1ovmxuj/image/upload/c_fill,w_1920,h_1200,q_auto,f_auto/v1772086712/DSCF0770_ozkc37.jpg"
        alt="Luxury bedroom - Timeless Indian Craftsmanship for Modern Homes"
        fill
        className="object-cover"
        priority
        quality={90}
      />

      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent" />

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 md:px-16 lg:px-20 max-w-4xl"
      >
        {/* Main Headline */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-tight mb-6"
          style={{ color: COLORS.ivory }}
        >
          Timeless Indian Craftsmanship for Modern Homes
        </h1>

        {/* Subheadline */}
        <p 
          className="text-lg sm:text-xl md:text-2xl font-light tracking-wide mb-8 max-w-2xl"
          style={{ color: COLORS.gold }}
        >
          Discover elegant home décor and gifting pieces inspired by heritage, designed for refined living.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wider font-medium transition-all duration-300"
            style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
            onClick={() => window.location.href = '/shop'}
          >
            Shop Bestsellers
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wider font-medium transition-all duration-300 border-2"
            style={{ borderColor: COLORS.gold, color: COLORS.ivory, backgroundColor: 'transparent' }}
            onClick={() => window.location.href = '/collections/gifting'}
          >
            Explore Gifting
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

// ========================================
// 3️⃣ SECTION 3 - BESTSELLERS (ABOVE FOLD)
// ========================================
/**
 * Bestsellers Section
 * 4 featured products with bestseller badges and ratings
 * Positioned immediately after hero for maximum visibility
 */
function BestsellersSection() {
  const bestsellers = [
    {
      id: 1,
      name: 'Handcrafted Brass Lotus Tealight Holder',
      price: 1299,
      originalPrice: 1799,
      rating: 4.8,
      reviews: 142,
      publicId: 'v1772086712/DSCF0770_ozkc37',
      badge: 'Bestseller',
    },
    {
      id: 2,
      name: 'Organic Cotton Bedsheet Set',
      price: 2499,
      originalPrice: 3499,
      rating: 4.7,
      reviews: 98,
      publicId: 'v1772086712/DSCF0770_ozkc37',
      badge: 'Bestseller',
    },
    {
      id: 3,
      name: 'Indigo Hand-Block Printed Cushion',
      price: 899,
      originalPrice: 1299,
      rating: 4.6,
      reviews: 76,
      publicId: 'v1772086712/DSCF0770_ozkc37',
      badge: 'Bestseller',
    },
    {
      id: 4,
      name: 'Ceramic Serving Platter Set',
      price: 1599,
      originalPrice: 2199,
      rating: 4.9,
      reviews: 125,
      publicId: 'v1772086712/DSCF0770_ozkc37',
      badge: 'Bestseller',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32" style={{ backgroundColor: COLORS.ivory }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20 md:mb-28 text-center"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4"
            style={{ color: COLORS.charcoal }}
          >
            Customer Favorites
          </h2>
          <p className="text-sm md:text-base" style={{ color: COLORS.charcoal }}>
            Join 500+ happy homes with our bestselling pieces
          </p>
        </motion.div>

        {/* 4-Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestsellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Bestseller Badge */}
              <div className="absolute top-3 left-3 z-10 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {product.badge}
              </div>

              {/* Product Image */}
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={`https://res.cloudinary.com/dk1ovmxuj/image/upload/c_fill,w_400,h_400,q_auto,f_auto/${product.publicId}.jpg`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  quality={85}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition-colors duration-300">
                  Add to Cart
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>COD</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>3–5 Days</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Returns</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 md:mt-20"
        >
          <Link href="/all-products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wider font-medium transition-all duration-300 border-2"
              style={{ borderColor: COLORS.deepTeal, color: COLORS.deepTeal }}
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ========================================
// 3B️⃣ SECTION 3B - CATEGORY TILES
// ========================================
/**
 * Category Tiles Section
 * 4 category cards: Gifting, Dining, Decor, Bed & Linen
 * Simplified product discovery
 */
function CategoryTilesSection() {
  const categories = [
    {
      name: 'Gifting Collections',
      description: 'Curated gift sets for every occasion',
      image: 'https://images.unsplash.com/photo-1513651179975-59663e0ac1ad?w=400&h=300&fit=crop',
      link: '/collections/gifting',
      color: '#E8B4B8',
    },
    {
      name: 'Dining & Tableware',
      description: 'Premium ceramic & serving pieces',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop',
      link: '/collections/ceramics',
      color: '#D4C4A0',
    },
    {
      name: 'Decor & Lighting',
      description: 'Artisan crafted home accents',
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=300&fit=crop',
      link: '/collections/lamps',
      color: '#C9A84C',
    },
    {
      name: 'Bed & Linen',
      description: 'Luxurious organic bedsheets',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      link: '/collections/bedsheets',
      color: '#A8C9C3',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20 md:mb-28"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4"
            style={{ color: COLORS.charcoal }}
          >
            Shop by Category
          </h2>
          <p className="text-sm md:text-base" style={{ color: COLORS.charcoal }}>
            Browse our curated collections
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link href={category.link} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, translateY: -10 }}
                className="group relative overflow-hidden rounded-lg cursor-pointer h-48 sm:h-56 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  quality={85}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-lg sm:text-xl font-semibold" style={{ color: COLORS.ivory }}>
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 opacity-90" style={{ color: COLORS.ivory }}>
                    {category.description}
                  </p>
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block text-xs font-medium tracking-wider mt-4 opacity-75"
                    style={{ color: COLORS.gold }}
                  >
                    EXPLORE →
                  </motion.span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================================
// 4️⃣ SECTION 4 - PHILOSOPHY BLOCK
// ========================================
/**
 * Philosophy Section
 * Centered text: "Rooted in Craft. Refined for Living."
 * White background with description and "Our Story →" CTA
 */
function PhilosophySection() {
  return (
    <section className="w-full py-28 sm:py-36 md:py-44" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Philosophy Headline */}
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-serif leading-tight mb-6"
            style={{ color: COLORS.charcoal }}
          >
            Rooted in Craft.
            <br />
            Refined for Living.
          </h2>

          {/* Description */}
          <p 
            className="text-lg sm:text-xl leading-relaxed mb-12"
            style={{ color: COLORS.charcoal }}
          >
            Every piece in our collection tells a story of heritage, skill, and intention. We believe that 
            true luxury lies not in excess, but in the thoughtful curation of objects that enhance your daily life. 
            From the hands of artisans in Rajasthan to your home, we preserve tradition while embracing modern elegance.
          </p>

          {/* CTA - Our Story */}
          <Link href="/about">
            <motion.span
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
              className="inline-block text-sm sm:text-base tracking-widest font-medium transition-colors"
              style={{ color: COLORS.charcoal }}
            >
              Our Story →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ========================================
// 5️⃣ SECTION 5 - CURATED COLLECTIONS
// ========================================
/**
 * Editorial Collections Block
 * 2 curated blocks: "The Signature Bedroom" and "The Art of Hosting"
 * Large images with links to collections
 */
function CuratedCollectionsSection() {
  return (
    <>
      {/* Collection 1: The Signature Bedroom */}
      <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&h=1200&fit=crop"
          alt="Luxury bedroom with signature linens"
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
          quality={85}
        />
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-16 lg:px-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif" style={{ color: COLORS.ivory }}>
            The Signature Bedroom
          </h2>
          <Link href="/collections/bedsheets" className="mt-6 px-8 py-3 transition-all duration-300 text-sm tracking-widest font-medium hover:opacity-80" style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}>
            Explore Bed & Linen →
          </Link>
        </motion.div>
      </section>

      {/* Collection 2: The Art of Hosting */}
      <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1600&h=1200&fit=crop"
          alt="Elegant dining setup with artisan ceramics"
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
          quality={85}
        />

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute inset-0 flex flex-col justify-center items-end px-6 sm:px-12 md:px-16 lg:px-20 text-right"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif" style={{ color: COLORS.ivory }}>
            The Art of Hosting
          </h2>
          <Link href="/collections/ceramics" className="mt-6 px-8 py-3 transition-all duration-300 text-sm tracking-widest font-medium hover:opacity-80" style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}>
            ← Explore Dining & Tableware
          </Link>
        </motion.div>
      </section>
    </>
  );
}

// ========================================
// 6️⃣ SECTION 6 - SIGNATURE PIECES
// ========================================
/**
 * Signature Products Grid
 * 6-product grid with name + price only
 * Minimalist design, no borders
 */
function SignaturePiecesSection() {
  const signature_products = [
    {
      id: 1,
      name: 'Linen Bedsheet - Ivory',
      price: '₹4,500',
      image: 'https://images.unsplash.com/photo-1589939705066-5a101c786e97?w=400&h=400&fit=crop',
      link: '/collections/bedsheets',
    },
    {
      id: 2,
      name: 'Printed Dinner Plate',
      price: '₹1,500',
      image: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/c_fill,w_400,h_400,q_auto,f_auto/v1772086391/DSCF0673_dqm9rk.jpg',
      link: '/collections/ceramics',
    },
    {
      id: 3,
      name: 'Artisan Vase - Terracotta',
      price: '₹3,200',
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
      link: '/collections/ceramics',
    },
    {
      id: 4,
      name: 'Handwoven Lamp - Natural',
      price: '₹5,800',
      image: 'https://images.unsplash.com/photo-1565182999555-01b89b855ad1?w=400&h=400&fit=crop',
      link: '/collections/lamps',
    },
    {
      id: 5,
      name: 'Pillow Cover Set - Gold',
      price: '₹2,400',
      image: 'https://images.unsplash.com/photo-1594622666175-e18e1ba00f7a?w=400&h=400&fit=crop',
      link: '/collections/bedsheets',
    },
    {
      id: 6,
      name: 'Serving Bowl - Charcoal',
      price: '₹1,800',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
      link: '/collections/ceramics',
    },
    {
      id: 7,
      name: 'Single Saucer and Teacup Set',
      price: '₹1,400',
      image: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/c_fill,w_400,h_400,q_auto,f_auto/v1772086521/DSCF0712_ojoyil.jpg',
      link: '/collections/ceramics',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20 md:mb-28"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-serif"
            style={{ color: COLORS.charcoal }}
          >
            Signature Pieces
          </h2>
          <p className="text-sm mt-2" style={{ color: COLORS.charcoal }}>
            Curated selections from our collections
          </p>
        </motion.div>

        {/* 6-Product Grid - Larger Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 md:gap-14">
          {signature_products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              {/* Product Image */}
              <Link href={product.link}>
                <div className="relative aspect-square mb-4 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    quality={85}
                  />
                </div>
              </Link>

              {/* Product Details - Minimalist */}
              <Link href={product.link}>
                <motion.h3
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm tracking-wide font-medium transition-colors"
                  style={{ color: COLORS.charcoal }}
                >
                  {product.name}
                </motion.h3>
              </Link>
              <p className="text-sm mt-2" style={{ color: COLORS.charcoal }}>
                {product.price}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================================
// 6️⃣ SECTION 6 - SOCIAL PROOF
// ========================================
/**
 * Social Proof Section
 * Customer testimonials, ratings, and trust metrics
 */
function SocialProofSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      text: 'The quality is exceptional. Every piece feels like an investment in my home\'s beauty. Highly recommended!',
      avatar: '👩‍🦱',
    },
    {
      name: 'Amit Kumar',
      location: 'Bangalore',
      rating: 5,
      text: 'Outstanding craftsmanship. The bedsheets feel like sleeping in luxury. Customer service was prompt too!',
      avatar: '👨‍💼',
    },
    {
      name: 'Neha Patel',
      location: 'Pune',
      rating: 5,
      text: 'I gift these pieces to friends regularly. They always appreciate the authentic Indian artistry and quality.',
      avatar: '👩‍🦰',
    },
    {
      name: 'Rohan Singh',
      location: 'Delhi',
      rating: 5,
      text: 'Worth every penny. The attention to detail is remarkable. My home looks more elegant now!',
      avatar: '👨‍🎤',
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Homes' },
    { number: '4.8★', label: 'Average Rating' },
    { number: '1000+', label: 'Reviews' },
    { number: '100%', label: 'Authentic' },
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32" style={{ backgroundColor: COLORS.ivory }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20 md:mb-28 text-center"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4"
            style={{ color: COLORS.charcoal }}
          >
            Loved by Hundreds of Homes
          </h2>
          <p className="text-sm md:text-base" style={{ color: COLORS.charcoal }}>
            Read what our customers have to say about their Radhika's experience
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 md:mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <h3 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ color: COLORS.deepTeal }}
              >
                {stat.number}
              </h3>
              <p className="text-sm" style={{ color: COLORS.charcoal }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700 mb-4 italic">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: COLORS.charcoal }}>
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================================
// 7️⃣ SECTION 7 - CRAFT STORY STRIP
// ========================================
/**
 * Craft Story Strip
 * Split layout: Fabric image left, text right
 * "Crafted in Rajasthan" heading with artisan story
 */
function CraftStorySection() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          {/* Left: Fabric/Craft Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1596182388944-bf87f6fdd49e?w=600&h=600&fit=crop"
              alt="Handwoven fabric from Rajasthan"
              fill
              className="object-cover"
              quality={85}
            />
          </motion.div>

          {/* Right: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 sm:mb-6"
              style={{ color: COLORS.charcoal }}
            >
              Crafted in Rajasthan
            </h2>

            <p 
              className="text-base sm:text-lg leading-relaxed mb-8"
              style={{ color: COLORS.charcoal }}
            >
              Master artisans in Rajasthan source the finest natural materials—Egyptian cotton, organic linens, reclaimed wood, and mineral ceramics. Each material undergoes rigorous quality checks. Our finishing process emphasizes durability and timeless beauty: hand-stitched hems, natural dyes, hand-painted ceramics, and protective mineral treatments ensure every piece withstands decades of use.
            </p>

            {/* Craft Story CTA */}
            <Link href="/craft-artisans">
              <motion.span
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="inline-block text-sm tracking-widest font-medium transition-colors"
                style={{ color: COLORS.deepTeal }}
              >
                Discover Our Craft →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ========================================
// 7️⃣ SECTION 7 - VISIT STORE SECTION
// ========================================
/**
 * Visit Store Section
 * Full-width hero with Jaipur flagship image
 * "Visit Our Jaipur Flagship" heading with "Get Directions" CTA
 */
function VisitStoreSection() {
  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Store Image */}
      <Image
        src="https://images.unsplash.com/photo-1599927053471-33a502e4cbf6?w=1600&h=900&fit=crop"
        alt="Radhika's Homekraft Jaipur Flagship Store"
        fill
        className="object-cover"
        quality={85}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex flex-col items-center justify-end px-6 sm:px-12 pb-12 sm:pb-16 md:pb-20"
      >
        <h2 
          className="text-4xl sm:text-5xl md:text-6xl font-serif mb-4 text-center max-w-2xl"
          style={{ color: COLORS.ivory }}
        >
          Visit Our Jaipur Flagship
        </h2>

        <p 
          className="text-lg mb-8 text-center"
          style={{ color: COLORS.gold }}
        >
          Experience our collections in person.
        </p>

        {/* Get Directions CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 text-sm tracking-widest font-medium transition-all duration-300"
          style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
          onClick={() => window.location.href = '/visit-store'}
        >
          Get Directions →
        </motion.button>
      </motion.div>
    </section>
  );
}

// ========================================
// 8️⃣ SECTION 8 - TRUST STRIP
// ========================================
/**
 * Trust & Benefits Strip
 * 4 minimal benefit icons: Artisan Crafted, Ethically Sourced, Secure Payments, Cash on Delivery
 */
function TrustStripSection() {
  const benefits = [
    {
      title: 'Artisan Crafted',
    },
    {
      title: 'Ethically Sourced',
    },
    {
      title: 'Secure Payments',
    },
    {
      title: 'Cash on Delivery',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm sm:text-base font-medium tracking-wide" style={{ color: COLORS.charcoal }}>
                {benefit.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================================
// 9️⃣ SECTION 9 - FOOTER
// ========================================
/**
 * Simplified 4-Column Footer Layout
 * Brand, Shop, Connect, Follow sections
 */
function Footer() {
  return (
    <footer className="text-white py-12 sm:py-16 md:py-20" style={{ backgroundColor: COLORS.deepTeal }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Column 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-serif mb-4" style={{ color: COLORS.gold }}>
              Radhika's Homekraft
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.lightBeige }}>
              Luxury home essentials from the artisans of Rajasthan. Krafted for Elegance.
            </p>
          </motion.div>

          {/* Column 2: Shop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-medium tracking-widest mb-6" style={{ color: COLORS.gold }}>
              SHOP
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: COLORS.lightBeige }}>
              <li>
                <Link href="/collections/bedsheets" className="hover:text-white transition-colors">
                  Bed & Linen
                </Link>
              </li>
              <li>
                <Link href="/collections/ceramics" className="hover:text-white transition-colors">
                  Dining & Serving
                </Link>
              </li>
              <li>
                <Link href="/collections/lamps" className="hover:text-white transition-colors">
                  Decor & Lighting
                </Link>
              </li>
              <li>
                <Link href="/collections/gifting" className="hover:text-white transition-colors">
                  Gifting
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-medium tracking-widest mb-6" style={{ color: COLORS.gold }}>
              CONNECT
            </h4>
            <div className="space-y-3" style={{ color: COLORS.lightBeige }}>
              <p className="text-sm">
                <a href="tel:+918239316066" className="hover:text-white transition-colors">
                  +91-8239316066
                </a>
              </p>
              <p className="text-sm">
                <a href="mailto:hello@radhikashomekraft.in" className="hover:text-white transition-colors">
                  hello@radhikashomekraft.in
                </a>
              </p>
              <p className="text-sm">
                <Link href="/visit-store" className="hover:text-white transition-colors">
                  Jaipur Flagship Store
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Column 4: Follow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-medium tracking-widest mb-6" style={{ color: COLORS.gold }}>
              FOLLOW
            </h4>
            <div className="flex gap-6">
              <Link href="#" style={{ color: COLORS.gold }} className="hover:text-white transition-colors text-sm font-medium">
                Instagram
              </Link>
              <Link href="#" style={{ color: COLORS.gold }} className="hover:text-white transition-colors text-sm font-medium">
                Pinterest
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Divider & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t pt-8"
          style={{ borderColor: COLORS.gold }}
        >
          <p className="text-center text-xs" style={{ color: COLORS.lightBeige }}>
            &copy; 2026 Radhika's Homekraft. All rights reserved. | 
            <Link href="/privacy" className="ml-2 hover:text-white transition-colors">Privacy</Link> | 
            <Link href="/terms" className="ml-2 hover:text-white transition-colors">Terms</Link>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

// ========================================
// MAIN HOMEPAGE
// ========================================
/**
 * Luxury Homepage - 12 Sections
 * 1. Navigation + Announcement Bar + WhatsApp
 * 2. Hero Section
 * 3. Bestsellers (Above Fold)
 * 4. Category Tiles
 * 5. Philosophy Block
 * 6. Curated Collections
 * 7. Signature Pieces
 * 8. Social Proof
 * 9. Craft Story Strip
 * 10. Visit Store Section
 * 11. Trust Strip
 * 12. Footer
 */
export default function HomePage() {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: 'white' }}>
      {/* 0️⃣ Announcement Bar & WhatsApp Chat */}
      <AnnouncementBar />

      {/* 1️⃣ Navigation */}
      <Navigation />

      {/* 2️⃣ Hero Section */}
      <HeroSection />

      {/* 3️⃣ Bestsellers (Above Fold) */}
      <BestsellersSection />

      {/* 3B️⃣ Category Tiles */}
      <CategoryTilesSection />

      {/* 4️⃣ Philosophy Block */}
      <PhilosophySection />

      {/* 5️⃣ Curated Collections */}
      <CuratedCollectionsSection />

      {/* 6️⃣ Signature Pieces */}
      <SignaturePiecesSection />

      {/* 7️⃣ Social Proof */}
      <SocialProofSection />

      {/* 8️⃣ Craft Story Strip */}
      <CraftStorySection />

      {/* 9️⃣ Visit Store Section */}
      <VisitStoreSection />

      {/* 🔟 Trust Strip */}
      <TrustStripSection />

      {/* 1️⃣1️⃣ Footer */}
      <Footer />
    </div>
  );
}
