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
        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1200&fit=crop"
        alt="Luxury bedroom - Krafted for Elegance"
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
          Krafted for Elegance
        </h1>

        {/* Subheadline */}
        <p 
          className="text-lg sm:text-xl md:text-2xl font-light tracking-wide mb-8 max-w-2xl"
          style={{ color: COLORS.gold }}
        >
          Heritage craftsmanship designed for modern homes.
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wider font-medium transition-all duration-300"
          style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
          onClick={() => window.location.href = '/collections/bedsheets'}
        >
          EXPLORE COLLECTION
        </motion.button>
      </motion.div>
    </section>
  );
}

// ========================================
// 3️⃣ SECTION 3 - PHILOSOPHY BLOCK
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
// 4️⃣ SECTION 4 - CURATED COLLECTIONS
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
          src="https://images.unsplash.com/photo-1551632786-de41ec802fcb?w=1600&h=1200&fit=crop"
          alt="Elegant dining table setting"
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
          className="absolute inset-0 flex flex-col justify-center items-end px-6 sm:px-12 md:px-16 lg:px-20 text-right"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif" style={{ color: COLORS.ivory }}>
            The Art of Hosting
          </h2>
          <Link href="/collections/ceramics" className="mt-6 px-8 py-3 transition-all duration-300 text-sm tracking-widest font-medium hover:opacity-80" style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}>
            Explore Dining & Serving →
          </Link>
        </motion.div>
      </section>
    </>
  );
}

// ========================================
// 5️⃣ SECTION 5 - SIGNATURE PIECES
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
      name: 'Ceramic Dinner Plate - Sage',
      price: '₹1,200',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
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
// 6️⃣ SECTION 6 - CRAFT STORY STRIP
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
 * Luxury Homepage - 9 Sections
 * 1. Navigation
 * 2. Hero Section
 * 3. Philosophy Block
 * 4. Curated Collections
 * 5. Signature Pieces
 * 6. Craft Story Strip
 * 7. Visit Store Section
 * 8. Trust Strip
 * 9. Footer
 */
export default function HomePage() {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: 'white' }}>
      {/* 1️⃣ Navigation */}
      <Navigation />

      {/* 2️⃣ Hero Section */}
      <HeroSection />

      {/* 3️⃣ Philosophy Block */}
      <PhilosophySection />

      {/* 4️⃣ Curated Collections */}
      <CuratedCollectionsSection />

      {/* 5️⃣ Signature Pieces */}
      <SignaturePiecesSection />

      {/* 6️⃣ Craft Story Strip */}
      <CraftStorySection />

      {/* 7️⃣ Visit Store Section */}
      <VisitStoreSection />

      {/* 8️⃣ Trust Strip */}
      <TrustStripSection />

      {/* 9️⃣ Footer */}
      <Footer />
    </div>
  );
}
