'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

// Navigation Links
const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'COLLECTIONS', href: '/collections' },
  { label: 'CERAMICS', href: '/collections/ceramics' },
  { label: 'TEXTILES', href: '/collections/textiles' },
  { label: 'GIFTING', href: '/collections/gifting' },
];

/**
 * Mobile Navigation Component
 */
function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -300 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-40 bg-white ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="flex flex-col h-full">
        {/* Close button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <span className="text-2xl font-bold tracking-wider">RADHIKA'S</span>
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block text-lg tracking-wide hover:opacity-60 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}

/**
 * Navigation Bar Component
 */
function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Yellow Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-yellow-300 border-b border-yellow-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold tracking-wider text-black">RADHIKA'S</span>
            </Link>

            {/* Desktop Menu - Centered */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-black tracking-wider hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons - Right */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button className="p-2 hover:bg-yellow-400 rounded-lg transition-colors">
                <Search size={20} className="text-black" />
              </button>
              <button className="hidden sm:flex p-2 hover:bg-yellow-400 rounded-lg transition-colors">
                <User size={20} className="text-black" />
              </button>
              <button className="p-2 hover:bg-yellow-400 rounded-lg transition-colors">
                <ShoppingBag size={20} className="text-black" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-yellow-400 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-black" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

/**
 * Hero Section Component
 */
function HeroSection() {
  return (
    <section className="relative w-full h-screen sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-black">
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
        <div className="absolute inset-0 bg-black/20" />
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
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-wider text-white uppercase">
            SATVAM
          </h1>
          <p className="text-base sm:text-lg tracking-widest text-white mt-4">COLLECTION</p>
        </div>

        {/* Call to Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 sm:px-10 py-3 sm:py-4 border-2 border-white text-white text-sm sm:text-base tracking-wider font-medium hover:bg-white hover:text-black transition-all duration-300"
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
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
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
              className="group relative aspect-square overflow-hidden bg-gray-100"
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
                <h3 className="text-2xl sm:text-3xl font-light text-white tracking-wider mb-3">
                  {image.label}
                </h3>
                <p className="text-sm tracking-widest text-white mb-6">{image.category}</p>
                <Link href="/collections" className="px-6 py-2 border border-white text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all">
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
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 border-t border-gray-200">
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
              <h3 className="text-sm sm:text-base font-medium tracking-widest text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
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
    <section className="w-full bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider text-gray-900 mb-4">
            STAY CONNECTED
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
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
              className="flex-1 px-4 py-3 text-sm border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
            />
            <motion.button
              whileHover={{ backgroundColor: '#000' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-gray-900 text-white text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors"
            >
              SUBSCRIBE
            </motion.button>
          </form>

          {subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-600 mt-3"
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
    <div className="w-full overflow-hidden bg-white">
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
      <footer className="bg-black text-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-medium tracking-wider mb-4">RADHIKA'S HOMEKRAFT</h3>
              <p className="text-sm text-gray-400">
                Artisan-crafted home decor celebrating India's rich cultural heritage.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-sm font-medium tracking-widest mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <ul className="space-y-2 text-sm text-gray-400">
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
              <ul className="space-y-2 text-sm text-gray-400">
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
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <p>&copy; 2026 Radhika's Homekraft. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-white transition-colors">
                Instagram
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Pinterest
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
