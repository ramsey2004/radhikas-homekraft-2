'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { FiTrash2, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import { useState, useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="h-screen" />;
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18); // 18% IGST
  const total = subtotal + shipping + tax;
  const itemCount = getTotalItems();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <Link
              href={ROUTES.SHOP}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <FiArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {itemCount === 0 ? (
          // Empty Cart
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <FiShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mb-8 text-gray-600">Add some beautiful handcrafted items to get started!</p>
            <Link href={ROUTES.SHOP} className="btn btn-accent">
              Shop Now
            </Link>
          </motion.div>
        ) : (
          // Cart with items
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <motion.div
              className="lg:col-span-2"
              initial={false}
              animate={{ opacity: 1 }}
            >
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${index}`}
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <OptimizedImage
                        src={`/images/products/${item.product.slug}-1.jpg` || '/api/placeholder'}
                        alt={`${item.product.name} - ${item.product.material}`}
                        width={100}
                        height={100}
                        sizes="100px"
                        priority={false}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-semibold text-gray-900 hover:text-primary-600 block mb-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600 mb-3">{item.product.material}</p>
                      <p className="text-lg font-bold text-primary-600">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(String(item.product.id), Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(String(item.product.id), item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(String(item.product.id))}
                        className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>

                    {/* Line Item Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-24 rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18% IGST)</span>
                    <span className="font-semibold">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Shipping
                      {shipping === 0 && (
                        <span className="ml-1 text-green-600 font-semibold">FREE</span>
                      )}
                    </span>
                    <span className="font-semibold">₹{shipping.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-6 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-primary-600">₹{total.toLocaleString()}</span>
                </div>

                {shipping > 0 && (
                  <p className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                    💡 Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                )}

                <Link
                  href={ROUTES.CHECKOUT}
                  className="block w-full rounded-lg bg-primary-600 px-4 py-3 text-center font-bold text-white hover:bg-primary-700 transition-colors mb-2 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </Link>

                <div className="text-center text-sm text-gray-600 mb-3 flex items-center justify-center gap-1">
                  <span className="text-lg">👤</span>
                  <span>No account needed - checkout as guest</span>
                </div>

                <button
                  onClick={() => window.history.back()}
                  className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Trust Badges */}
                <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-center text-xs text-gray-600">
                  <p>✓ 30-Day Returns</p>
                  <p>✓ Secure Checkout</p>
                  <p>✓ Handcrafted Quality</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
