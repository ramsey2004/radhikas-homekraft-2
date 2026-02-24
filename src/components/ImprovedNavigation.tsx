'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { NAVIGATION_CATEGORIES } from '@/config/navigation';
import { useCart } from '@/contexts/CartContext';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
};

export function ImprovedNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useCart();
  
  const mainCategories = [
    NAVIGATION_CATEGORIES.BED_LINEN,
    NAVIGATION_CATEGORIES.DINING_SERVING,
    NAVIGATION_CATEGORIES.DRINKWARE,
    NAVIGATION_CATEGORIES.DECOR_LIGHTING,
    NAVIGATION_CATEGORIES.GIFTING,
    NAVIGATION_CATEGORIES.B2B,
  ];

  const secondaryLinks = [
    NAVIGATION_CATEGORIES.ABOUT,
    NAVIGATION_CATEGORIES.VISIT_STORE,
  ];

  return (
    <nav style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}>
      {/* Top Bar - Announcement */}
      <div style={{ backgroundColor: COLORS.deepTeal, color: COLORS.ivory }} className="py-2 px-4 text-center text-sm">
        <p>🚚 Free Shipping on orders above ₹2000 | ✨ Handcrafted with Love</p>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-light tracking-wide" style={{ color: COLORS.deepTeal }}>
              Radhika's Homecraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainCategories.map((category) => (
              <div
                key={category.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={category.href}
                  className="px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-white/20 transition-colors"
                  style={{ color: COLORS.deepTeal }}
                >
                  {category.label}
                  {category.subcategories.length > 0 && <ChevronDown size={16} />}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {activeDropdown === category.label && category.subcategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-1 w-56 rounded-lg shadow-lg overflow-hidden z-50"
                      style={{ backgroundColor: COLORS.ivory }}
                    >
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-3 hover:bg-white transition-colors"
                          style={{ color: COLORS.charcoal }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Desktop Secondary Links */}
            <div className="hidden lg:flex items-center gap-4">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                  style={{ color: COLORS.deepTeal }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <Search size={20} style={{ color: COLORS.deepTeal }} />
            </button>

            <Link href="/wishlist" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <Heart size={20} style={{ color: COLORS.deepTeal }} />
            </Link>

            <Link href="/account" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <User size={20} style={{ color: COLORS.deepTeal }} />
            </Link>

            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-white/20 transition-colors">
              <ShoppingBag size={20} style={{ color: COLORS.deepTeal }} />
              {state.items.length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ backgroundColor: COLORS.deepTeal, color: COLORS.gold }}
                >
                  {state.items.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={24} style={{ color: COLORS.deepTeal }} />
              ) : (
                <Menu size={24} style={{ color: COLORS.deepTeal }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 space-y-2"
            >
              {[...mainCategories, ...secondaryLinks].map((category) => (
                <div key={category.label}>
                  <Link
                    href={category.href}
                    className="block px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                    style={{ color: COLORS.deepTeal }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.label}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors"
                          style={{ color: COLORS.deepTeal, opacity: 0.8 }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
