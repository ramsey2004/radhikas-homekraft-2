'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import { ROUTES } from '@/lib/constants';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Logo } from '@/components/Logo';

export function StickyHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { getTotalItems } = useCart();
  const cartItems = getTotalItems();

  // Handle scroll for sticky effect
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    top: {
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      backgroundColor: 'rgb(255, 255, 255, 0)',
    },
    scrolled: {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
    },
  };

  return (
    <>
      {/* Top promotional bar */}
      <motion.div
        className="hidden border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-2 sm:block"
        initial={false}
        animate={false}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-gray-700">
          <div className="hidden gap-6 lg:flex">
            <span className="flex items-center gap-2">📞 +91-8239316066</span>
            <span className="flex items-center gap-2">✉️ radhikashomekraft.in</span>
          </div>
          <div className="w-full text-center lg:w-auto">
            <span className="font-medium">Free shipping on orders above ₹2000</span>
          </div>
        </div>
      </motion.div>

      {/* Sticky main header */}
      <motion.header
        initial="top"
        animate={isScrolled ? 'scrolled' : 'top'}
        variants={headerVariants}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 w-full bg-white"
      >
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Logo />

            {/* Desktop Search */}
            <div className="hidden flex-1 px-6 md:block">
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <input
                  type="search"
                  placeholder="Search handcrafted items..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pl-4 pr-10 text-sm transition-all focus:border-primary-600 focus:bg-white focus:outline-none"
                />
                <FiSearch className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </motion.div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Desktop Navigation */}
              <div className="hidden items-center gap-6 lg:flex">
                <Link
                  href={ROUTES.SHOP}
                  className="relative text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
                >
                  Shop
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary-600"
                    whileHover={mounted ? { width: '100%' } : undefined}
                    initial={false}
                    transition={{ duration: 0.3 }}
                    suppressHydrationWarning
                  />
                </Link>

                <Link
                  href="/visualizer"
                  className="relative text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
                >
                  Visualizer
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary-600"
                    whileHover={mounted ? { width: '100%' } : undefined}
                    initial={false}
                    transition={{ duration: 0.3 }}
                    suppressHydrationWarning
                  />
                </Link>

                <Link
                  href={ROUTES.ABOUT}
                  className="relative text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
                >
                  About
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary-600"
                    whileHover={mounted ? { width: '100%' } : undefined}
                    initial={false}
                    transition={{ duration: 0.3 }}
                    suppressHydrationWarning
                  />
                </Link>

                <Link
                  href={ROUTES.CONTACT}
                  className="relative text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
                >
                  Contact
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary-600"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </div>

              {/* Theme Switcher */}
              <ThemeSwitcher className="hidden sm:flex" />

              {/* Icon buttons */}
              <motion.div
                className="flex items-center gap-4"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {/* Search mobile */}
                <motion.button
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSearch className="h-5 w-5 text-gray-700" />
                </motion.button>

                {/* Wishlist */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={ROUTES.WISHLIST}
                    className="p-2 text-gray-700 transition-colors hover:text-primary-600 hover:bg-gray-100 rounded-lg inline-flex"
                    title="Wishlist"
                  >
                    <FiHeart className="h-5 w-5" />
                  </Link>
                </motion.div>

                {/* Account */}
                {session?.user ? (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={ROUTES.DASHBOARD}
                      className="p-2 text-gray-700 transition-colors hover:text-primary-600 hover:bg-gray-100 rounded-lg inline-flex"
                      title="Account"
                    >
                      <FiUser className="h-5 w-5" />
                    </Link>
                  </motion.div>
                ) : (
                  <Link
                    href={ROUTES.LOGIN}
                    className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 sm:inline"
                  >
                    Login
                  </Link>
                )}

                {/* Cart */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={ROUTES.CART}
                    className="p-2 text-gray-700 transition-colors hover:text-primary-600 hover:bg-gray-100 rounded-lg inline-flex"
                    title="Cart"
                  >
                    <FiShoppingCart className="h-5 w-5" />
                  </Link>
                  <motion.span
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={cartItems > 0 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    suppressHydrationWarning
                  >
                    {cartItems}
                  </motion.span>
                </motion.div>

                {/* Mobile menu button */}
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden"
                  title="Menu"
                  whileTap={{ scale: 0.95 }}
                >
                  {isMenuOpen ? (
                    <FiX className="h-5 w-5" />
                  ) : (
                    <FiMenu className="h-5 w-5" />
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden border-t border-gray-200 pt-4 lg:hidden"
              suppressHydrationWarning
            >
                <div className="mb-4 flex gap-2">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all focus:border-primary-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <motion.div
                  className="space-y-2"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                  initial={false}
                  animate={false}
                >
                  {[
                    { label: 'Shop', href: ROUTES.SHOP },
                    { label: 'Visualizer', href: '/visualizer' },
                    { label: 'About', href: ROUTES.ABOUT },
                    { label: 'Contact', href: ROUTES.CONTACT },
                  ].map(({ label, href }) => (
                    <motion.div
                      key={label}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={href}
                        className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-50 hover:text-primary-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
        </nav>
      </motion.header>
    </>
  );
}
