'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF3E0',
  charcoal: '#2D2D2D',
  lightBeige: '#E8D5C4',
};

export function ShoppingCart() {
  const { state, dispatch, proceedToCheckout } = useCart();
  const { items, isOpen, isLoading } = state;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace('₹', '').replace(',', ''));
    return sum + (price * item.quantity);
  }, 0);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50"
            style={{ backgroundColor: COLORS.ivory }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: COLORS.lightBeige }}>
              <h2 className="text-xl font-medium flex items-center gap-2" style={{ color: COLORS.charcoal }}>
                <ShoppingBag size={24} />
                Shopping Cart ({totalItems})
              </h2>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} style={{ color: COLORS.charcoal }} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" style={{ color: COLORS.charcoal }} />
                  <p className="text-lg" style={{ color: COLORS.charcoal }}>Your cart is empty</p>
                  <p className="text-sm mt-2" style={{ color: COLORS.charcoal }}>
                    Add some beautiful handcrafted items to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 rounded-lg border"
                      style={{ borderColor: COLORS.lightBeige, backgroundColor: COLORS.lightBeige }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium" style={{ color: COLORS.deepTeal }}>{item.name}</h3>
                        <p className="text-sm mb-2" style={{ color: COLORS.charcoal }}>{item.price}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded hover:bg-white transition-colors"
                          >
                            <Minus size={16} style={{ color: COLORS.charcoal }} />
                          </button>
                          <span className="px-2" style={{ color: COLORS.charcoal }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded hover:bg-white transition-colors"
                          >
                            <Plus size={16} style={{ color: COLORS.charcoal }} />
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                            className="p-1 rounded hover:bg-red-100 ml-auto transition-colors"
                          >
                            <Trash2 size={16} style={{ color: '#dc2626' }} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6" style={{ borderColor: COLORS.lightBeige }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium" style={{ color: COLORS.charcoal }}>Total:</span>
                  <span className="text-xl font-semibold" style={{ color: COLORS.gold }}>
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={proceedToCheckout}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: COLORS.gold, color: COLORS.deepTeal }}
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'CLEAR_CART' })}
                    className="w-full py-2 px-4 rounded-lg font-medium transition-all border-2"
                    style={{ borderColor: COLORS.charcoal, color: COLORS.charcoal }}
                  >
                    Clear Cart
                  </button>
                </div>

                <p className="text-xs text-center mt-4" style={{ color: COLORS.charcoal }}>
                  Free shipping on orders over ₹5,000
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}