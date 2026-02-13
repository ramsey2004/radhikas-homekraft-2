'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error('Global error:', error);
    
    // Example: Send to error tracking service
    // if (process.env.NODE_ENV === 'production') {
    //   logErrorToService(error, error.digest);
    // }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0 0v2m0-6V9m0 0V7m0 2a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900">
                Something went very wrong!
              </h1>
              <p className="text-gray-600">
                We apologize for the inconvenience. Our team has been notified and is working on a fix.
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-6">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Go to homepage
              </Link>
            </div>

            <div className="pt-6 border-t border-gray-300">
              <p className="text-sm text-gray-600">
                If this problem persists,{' '}
                <a
                  href="/contact"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
