'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';

/**
 * Sticky Cart Button for Mobile
 * Displays a floating action button on mobile devices for easy cart access
 */
export function StickyCartButton() {
  const { getTotalItems, getTotalPrice } = useCart();
  const cartItems = getTotalItems();
  const total = getTotalPrice();

  // Only show on mobile
  return (
    <>
      {/* Mobile Sticky Cart Button */}
      <Link href={ROUTES.CART}>
        <motion.div
          className="md:hidden fixed bottom-6 right-6 z-30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          suppressHydrationWarning
        >
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors font-semibold">
              <FiShoppingCart className="h-5 w-5" />
              <span className="hidden xs:inline text-sm">Cart</span>
            </button>
            
            <div className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white transition-opacity ${cartItems > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} suppressHydrationWarning>
              {cartItems > 9 ? '9+' : cartItems}
            </div>
            
            <div className={`absolute -bottom-8 right-0 whitespace-nowrap text-xs font-semibold text-primary-600 bg-white px-2 py-1 rounded border border-primary-200 transition-opacity ${total > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} suppressHydrationWarning>
              ₹{total.toLocaleString()}
            </div>
          </div>
        </motion.div>
      </Link>
    </>
  );
}
