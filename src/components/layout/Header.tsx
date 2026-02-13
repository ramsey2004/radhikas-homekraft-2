'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import { ROUTES } from '@/lib/constants';
import { PremiumSearch } from '@/components/PremiumSearch';
import { Logo } from '@/components/Logo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { getTotalItems } = useCart();
  const router = useRouter();
  const cartItems = getTotalItems();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="hidden border-b border-neutral-200 bg-neutral-50 px-4 py-2 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-gray-600">
          <div className="flex gap-6 items-center">
            <a href="tel:+918239316066" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              📞 +91-8239316066
            </a>
            <a href="mailto:radhikashomekraft.in" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              📧 radhikashomekraft.in
            </a>
            <span className="flex items-center gap-1">🚚 Free shipping on ₹2000+</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Search bar - Hidden on mobile */}
          <div className="hidden flex-1 px-6 md:block">
            <PremiumSearch onSearch={handleSearch} />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Desktop menu */}
            <div className="hidden gap-6 md:flex">
              <Link href={ROUTES.SHOP} className="text-sm font-medium hover:text-primary-600">
                Shop
              </Link>
              <Link href={ROUTES.ABOUT} className="text-sm font-medium hover:text-primary-600">
                About
              </Link>
              <Link href={ROUTES.CONTACT} className="text-sm font-medium hover:text-primary-600">
                Contact
              </Link>
            </div>

            {/* Icons */}
            <Link
              href={ROUTES.WISHLIST}
              className="relative p-2 transition-colors hover:text-primary-600 hover:bg-gray-100 rounded-lg"
              title="Wishlist"
            >
              <FiHeart className="h-5 w-5" />
            </Link>

            {session?.user ? (
              <Link
                href={ROUTES.DASHBOARD}
                className="relative p-2 transition-colors hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                title="Account"
              >
                <FiUser className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium hover:text-primary-600"
              >
                Login
              </Link>
            )}

            {/* Cart */}
            <Link
              href={ROUTES.CART}
              className="relative p-2 transition-colors hover:text-primary-600 hover:bg-gray-100 rounded-lg"
              title="Cart"
            >
              <FiShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
              title="Menu"
            >
              {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-4 border-t border-gray-200 pt-4 md:hidden">
            <div className="mb-4">
              <input
                type="search"
                placeholder="Search products..."
                className="input w-full"
              />
            </div>
            <div className="space-y-2">
              <Link
                href={ROUTES.SHOP}
                className="block px-4 py-2 hover:bg-neutral-50"
              >
                Shop
              </Link>
              <Link
                href={ROUTES.ABOUT}
                className="block px-4 py-2 hover:bg-neutral-50"
              >
                About
              </Link>
              <Link
                href={ROUTES.CONTACT}
                className="block px-4 py-2 hover:bg-neutral-50"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
