'use client';

import { useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Exit Intent Popup
 * Detects when user is about to leave and offers incentive
 * Captures emails for marketing campaigns
 */

interface ExitIntentPopupProps {
  onSubscribe?: (email: string) => Promise<void>;
  onClose?: () => void;
  discount?: number;
  headline?: string;
  subheadline?: string;
}

export function ExitIntentPopup({
  onSubscribe,
  onClose,
  discount = 15,
  headline = `Don't Miss Out!`,
  subheadline = `Get ${discount}% off your first order`,
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('exitIntentShown');
    if (hasSeenPopup) return;

    // Delay showing popup by 5-8 seconds
    const delay = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger if leaving from top of page
        if ((e as MouseEvent).clientY < 0) {
          setIsVisible(true);
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, 5000 + Math.random() * 3000);

    return () => clearTimeout(delay);
  }, [hasMounted]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      if (onSubscribe) {
        await onSubscribe(email);
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Subscription failed:', error);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.3 } }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Popup */}
          <motion.div
            initial={false}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header with close button */}
              <div className="relative h-32 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
                {/* Decorative elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 right-0 w-40 h-40 bg-amber-100 rounded-full opacity-20 -mr-20 -mt-20"
                />

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 hover:bg-white/50 rounded transition z-10"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Heading */}
                <div className="absolute inset-0 flex items-center justify-center p-6 relative z-10">
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{headline}</h2>
                    <p className="text-xs sm:text-sm text-gray-600">{subheadline}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {isSuccess ? (
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-4xl mb-4">✓</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Discount Code Sent!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Check your email for your {discount}% off code
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email input */}
                    <div>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>

                    {/* Submit button */}
                    <motion.button
                      whileHover={isVisible ? { scale: 1.02 } : undefined}
                      whileTap={isVisible ? { scale: 0.98 } : undefined}
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                      suppressHydrationWarning
                    >
                      {isLoading ? 'Sending...' : `Get ${discount}% Off`}
                    </motion.button>

                    {/* Disclaimer */}
                    <p className="text-xs text-gray-500 text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Discount Badge Popup - Shows floating discount badges
 */
export function DiscountBadgePopup({
  discount = 15,
  message = 'Limited Time Offer',
}: {
  discount?: number;
  message?: string;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg z-40"
    >
      <div className="text-center">
        <div className="text-2xl font-bold">{discount}% OFF</div>
        <div className="text-xs text-white/80">{message}</div>
      </div>
    </motion.div>
  );
}

/**
 * Newsletter Signup Modal
 */
export function NewsletterModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await onSubmit(email);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Subscription failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          <motion.div
            initial={false}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-full p-8 z-50"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-gray-800">Welcome!</h3>
                <p className="text-sm text-gray-600 mt-2">
                  You&apos;ve been added to our newsletter
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                  Stay Updated
                </h2>

                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <motion.button
                  whileHover={isLoading ? undefined : { scale: 1.02 }}
                  whileTap={isLoading ? undefined : { scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                  suppressHydrationWarning
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  No spam, just inspiration. Unsubscribe anytime.
                </p>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
