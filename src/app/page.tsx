'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useSearch } from '@/contexts/SearchContext';
import { LuxuryMegaMenu } from '@/components/LuxuryMegaMenu';

// Temporary color constants (being migrated to Tailwind classes)
const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
  lightBeige: '#E8D5C4',
  darkTeal: '#2D5252',
};

/**
 * Minimal Luxury Navigation Bar
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

/**
 * Hero Section Component
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />

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

/**
 * Editorial Block Component
 */
function EditorialBlock() {
  return (
    <>
      {/* Editorial Block 1: The Signature Bedroom */}
      <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&h=1200&fit=crop"
          alt="Luxury bedroom with layered linens"
          fill
          className="object-cover"
          quality={85}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-16 lg:px-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-3" style={{ color: COLORS.ivory }}>
            The Signature Bedroom
          </h2>
          <p className="text-lg sm:text-xl mb-6" style={{ color: COLORS.gold }}>
            Layered. Refined. Intentional.
          </p>
          <Link href="/collections/bedsheets" className="mt-4 px-8 py-3 transition-all duration-300 text-sm tracking-widest font-medium" style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            Explore Bed & Linen
          </Link>
        </motion.div>
      </section>

      {/* Breathing Space */}
      <section className="w-full py-12 sm:py-16 md:py-20" style={{ backgroundColor: COLORS.ivory }} />

      {/* Editorial Block 2: The Art of Hosting */}
      <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551632786-de41ec802fcb?w=1600&h=1200&fit=crop"
          alt="Elegant dining table setting"
          fill
          className="object-cover"
          quality={85}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent" />
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute inset-0 flex flex-col justify-center items-end px-6 sm:px-12 md:px-16 lg:px-20 text-right"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-3" style={{ color: COLORS.ivory }}>
            The Art of Hosting
          </h2>
          <p className="text-lg sm:text-xl mb-6" style={{ color: COLORS.gold }}>
            Gatherings that linger, tables that tell stories.
          </p>
          <Link href="/collections/ceramics" className="mt-4 px-8 py-3 transition-all duration-300 text-sm tracking-widest font-medium" style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            Discover Dining & Serving
          </Link>
        </motion.div>
      </section>
    </>
  );
}

/**
 * Image Gallery Section
 */
function GallerySection() {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1546039907-2024a578cc6d?w=800&h=800&fit=crop',
      alt: 'Man on beach wearing light blue shirt',
      label: 'SERENE',
      category: 'COLLECTIONS',
    },
    {
      src: 'https://images.unsplash.com/photo-1589939705066-5a101c786e97?w=800&h=800&fit=crop',
      alt: 'Green vase on beach with tropical backdrop',
      label: 'VESSELS',
      category: 'CERAMICS',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: COLORS.ivory }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Top Spacing */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24" />

        {/* Two Column Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative aspect-square overflow-hidden"
              style={{ backgroundColor: COLORS.lightBeige }}
            >
              {/* Image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                quality={85}
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                <h3 className="text-2xl sm:text-3xl font-light tracking-wider mb-3" style={{ color: COLORS.ivory }}>
                  {image.label}
                </h3>
                <p className="text-sm tracking-widest mb-6" style={{ color: COLORS.ivory }}>{image.category}</p>
                <Link href="/collections" className="px-6 py-2 border text-sm tracking-wider transition-all" style={{ borderColor: COLORS.gold, color: COLORS.gold, backgroundColor: `rgba(201, 168, 76, 0.1)` }}>
                  EXPLORE
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Spacing */}
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24" />
      </div>
    </section>
  );
}

/**
 * Featured Section
 */
function FeaturedSection() {
  const features = [
    {
      title: 'ARTISAN CRAFTED',
      description: 'Each piece is handmade by skilled artisans using traditional techniques passed through generations.',
    },
    {
      title: 'ETHICAL SOURCING',
      description: 'Direct relationships with makers, fair wages, and transparent supply chains.',
    },
    {
      title: 'TIMELESS DESIGN',
      description: 'Minimal aesthetic that transcends trends, designed to age beautifully.',
    },
    {
      title: 'SUSTAINABLY MADE',
      description: 'Natural materials, eco-conscious processes, and packaging that respects the planet.',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-sm sm:text-base font-medium tracking-widest mb-3" style={{ color: COLORS.deepTeal }}>
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: COLORS.charcoal }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Newsletter Section
 */
/**
 * Newsletter Section - Subtle & Refined
 */
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="w-full py-12 sm:py-16 md:py-20" style={{ backgroundColor: COLORS.ivory }}>
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-serif mb-3" style={{ color: COLORS.deepTeal }}>
            Receive Curated Updates
          </h2>
          <p className="text-sm mb-8" style={{ color: COLORS.charcoal }}>
            Stories from our artisans, new collections, and occasions worth celebrating.
          </p>

          {/* Minimal Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 items-center justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 max-w-sm px-4 py-3 text-sm border-b-2 focus:outline-none transition-colors bg-transparent"
              style={{ borderColor: subscribed ? COLORS.gold : COLORS.charcoal, color: COLORS.charcoal }}
            />
            <button
              type="submit"
              className="mt-4 sm:mt-0 sm:ml-4 px-6 py-3 text-xs tracking-widest font-medium transition-all duration-300"
              style={{ 
                backgroundColor: subscribed ? COLORS.gold : COLORS.deepTeal, 
                color: COLORS.ivory,
              }}
            >
              {subscribed ? '✓ SUBSCRIBED' : 'SUBSCRIBE'}
            </button>
          </form>

          {subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs mt-4"
              style={{ color: COLORS.deepTeal }}
            >
              Thank you. We'll be in touch.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Main Home Page
 */
export default function HomePage() {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: COLORS.ivory }}>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Editorial Blocks */}
      <EditorialBlock />

      {/* Features Section */}
      <FeaturedSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <footer className="text-white py-12 sm:py-16 md:py-20" style={{ backgroundColor: COLORS.deepTeal }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Section - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-serif mb-4" style={{ color: COLORS.gold }}>Radhika's Homekraft</h3>
              <p className="text-sm" style={{ color: COLORS.lightBeige }}>
                Krafted for Elegance
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-xs font-medium tracking-widest mb-6" style={{ color: COLORS.gold }}>SHOP</h4>
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
                  <Link href="/collections/gifting" className="hover:text-white transition-colors">
                    Gifting
                  </Link>
                </li>
                <li>
                  <Link href="/craft-artisans" className="hover:text-white transition-colors">
                    Craft & Artisans
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-xs font-medium tracking-widest mb-6" style={{ color: COLORS.gold }}>CONNECT</h4>
              <div className="space-y-3" style={{ color: COLORS.lightBeige }}>
                <p className="text-sm">
                  <a href="tel:+918239316066" className="hover:text-white transition-colors">
                    +91-8239316066
                  </a>
                </p>
                <p className="text-sm">
                  <a href="mailto:radhikashomekraft.in" className="hover:text-white transition-colors">
                    radhikashomekraft.in
                  </a>
                </p>
                <div className="flex gap-4 mt-4">
                  <Link href="#" style={{ color: COLORS.gold }} className="hover:text-white transition-colors text-sm">
                    Instagram
                  </Link>
                  <Link href="#" style={{ color: COLORS.gold }} className="hover:text-white transition-colors text-sm">
                    Pinterest
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="border-t pt-8" style={{ borderColor: COLORS.gold }}>
            <p className="text-center text-xs" style={{ color: COLORS.lightBeige }}>
              &copy; 2026 Radhika's Homekraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
