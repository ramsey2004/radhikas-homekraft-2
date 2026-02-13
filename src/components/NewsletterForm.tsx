'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { subscribeToNewsletter, validateEmail } from '@/lib/newsletter';

interface NewsletterFormProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: 'inline' | 'modal' | 'footer';
  onSuccess?: () => void;
  className?: string;
}

/**
 * NewsletterForm Component
 * Subscribe form with validation, loading states, and success feedback
 */
export default function NewsletterForm({
  title = 'Stay Updated',
  description = 'Get the latest news and exclusive offers delivered to your inbox.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  variant = 'inline',
  onSuccess,
  className = '',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await subscribeToNewsletter(email);

      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Successfully subscribed!');
        setEmail('');
        onSuccess?.();

        // Reset after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message || 'Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    inline: 'w-full max-w-md',
    modal: 'w-full max-w-2xl',
    footer: 'w-full',
  };

  return (
    <motion.div
      className={`${variants[variant]} ${className}`}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={variant === 'modal' ? 'space-y-4 text-center' : 'space-y-4'}>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" suppressHydrationWarning>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={isLoading || status === 'success'}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {status === 'success' && (
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  initial={false}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <FiCheck className="w-5 h-5" />
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || status === 'success' || !email}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} suppressHydrationWarning>
                    <FiLoader className="w-4 h-4" />
                  </motion.div>
                  <span className="hidden sm:inline">Loading...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribed</span>
                </>
              ) : (
                <>
                  <FiMail className="w-4 h-4" />
                  <span className="hidden sm:inline">{buttonText}</span>
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          <div suppressHydrationWarning>
            {message && (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm px-3 py-2 rounded-lg flex items-center gap-2 ${
                  status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                {status === 'success' ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                {message}
              </motion.div>
            )}
          </div>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          We&rsquo;ll never share your email. Unsubscribe anytime.
        </p>
      </div>
    </motion.div>
  );
}
