'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useSearch } from '@/contexts/SearchContext';

// Navigation Links - Luxury brand navigation
const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Bed & Linen', href: '/collections/bedsheets' },
  { label: 'Dining & Serving', href: '/collections/ceramics' },
  { label: 'Drinkware', href: '/collections/ceramics' },
  { label: 'Decor & Lighting', href: '/collections/lamps' },
  { label: 'Gifting', href: '/collections/gifting' },
  { label: 'B2B', href: '/b2b' },
  { label: 'About', href: '/about' },
  { label: 'Visit Store', href: '/visit-store' },
];

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

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              {NAV_LINKS.slice(0, 7).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-normal tracking-widest uppercase text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm tracking-wider uppercase text-gray-700 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
    <section className="relative w-full h-screen sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden" style={{ backgroundColor: COLORS.deepTeal }}>
      {/* Hero Image */}
      <div className="relative w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=1600&h=1200&fit=crop"
          alt="Woman in floral dress on tropical beach"
          fill
          className="object-cover"
          priority
          quality={85}
        />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(26, 122, 110, 0.3)` }} />
      </div>

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
      >
        {/* Product Name */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-wider uppercase" style={{ color: COLORS.ivory }}>
            SATVAM
          </h1>
          <p className="text-base sm:text-lg tracking-widest mt-4" style={{ color: COLORS.ivory }}>COLLECTION</p>
        </div>

        {/* Call to Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 sm:px-10 py-3 sm:py-4 border-2 text-sm sm:text-base tracking-wider font-medium transition-all duration-300"
          style={{ borderColor: COLORS.gold, color: COLORS.deepTeal, backgroundColor: COLORS.gold }}
        >
          SHOP WOMEN
        </motion.button>
      </motion.div>
    </section>
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
      description: 'Each piece is handmade by skilled artisans using traditional techniques',
    },
    {
      title: 'SUSTAINABLE MATERIALS',
      description: 'Ethically sourced natural materials from trusted artisan communities',
    },
    {
      title: 'TIMELESS DESIGN',
      description: 'Minimalist aesthetic that complements any modern home decor',
    },
    {
      title: 'GLOBAL SHIPPED',
      description: 'Free shipping on orders over ₹5,000 to anywhere in India',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 border-t" style={{ backgroundColor: COLORS.ivory, borderTopColor: COLORS.gold }}>
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
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: COLORS.ivory }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider mb-4" style={{ color: COLORS.deepTeal }}>
            STAY CONNECTED
          </h2>
          <p className="text-sm sm:text-base mb-8" style={{ color: COLORS.charcoal }}>
            Receive updates on new collections, artisan stories, and exclusive offers.
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 text-sm border focus:outline-none transition-colors"
              style={{ borderColor: COLORS.gold, backgroundColor: '#FFFFFF', color: COLORS.charcoal }}
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 text-sm font-medium tracking-wider transition-colors"
              style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
            >
              SUBSCRIBE
            </motion.button>
          </form>

          {subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm mt-3"
              style={{ color: COLORS.deepTeal }}
            >
              ✓ Thank you for subscribing!
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

      {/* Features Section */}
      <FeaturedSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <footer className="text-white py-12 sm:py-16 md:py-20" style={{ backgroundColor: COLORS.deepTeal }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-medium tracking-wider mb-4">RADHIKA'S HOMEKRAFT</h3>
              <p className="text-sm" style={{ color: COLORS.lightBeige }}>
                Artisan-crafted home decor celebrating India's rich cultural heritage.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-sm font-medium tracking-widest mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm" style={{ color: COLORS.lightBeige }}>
                <li>
                  <Link href="/collections" className="hover:text-white transition-colors">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link href="/collections/ceramics" className="hover:text-white transition-colors">
                    Ceramics
                  </Link>
                </li>
                <li>
                  <Link href="/collections/textiles" className="hover:text-white transition-colors">
                    Textiles
                  </Link>
                </li>
                <li>
                  <Link href="/collections/gifting" className="hover:text-white transition-colors">
                    Gifting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-medium tracking-widest mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-sm" style={{ color: COLORS.lightBeige }}>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-medium tracking-widest mb-4">LEGAL</h4>
              <ul className="space-y-2 text-sm" style={{ color: COLORS.lightBeige }}>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between text-sm" style={{ borderColor: COLORS.darkTeal, color: COLORS.lightBeige }}>
            <p>&copy; 2026 Radhika's Homekraft. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="transition-colors" style={{ color: COLORS.lightBeige }}>
                Instagram
              </Link>
              <Link href="#" className="transition-colors" style={{ color: COLORS.lightBeige }}>
                Pinterest
              </Link>
              <Link href="#" className="transition-colors" style={{ color: COLORS.lightBeige }}>
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
