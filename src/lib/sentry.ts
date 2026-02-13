/**
 * Sentry Error Tracking Configuration
 * - Captures exceptions and errors
 * - Tracks performance metrics
 * - User session monitoring
 * - Release tracking for debugging
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/**
 * Initialize Sentry
 * Call this in layout.tsx or _app.tsx
 */
export function initSentry() {
  if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
      release: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      integrations: [],
      // Performance & Session Replays
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    });
  }
}

/**
 * Capture exceptions manually
 */
export function captureException(error: Error | string, context?: Record<string, any>) {
  if (!SENTRY_DSN) return;

  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

/**
 * Capture messages for debugging
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (!SENTRY_DSN) return;

  Sentry.captureMessage(message, level);
}

/**
 * Set user context for Sentry
 */
export function setUserContext(userId: string, email?: string, username?: string) {
  if (!SENTRY_DSN) return;

  Sentry.setUser({
    id: userId,
    email,
    username,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  if (!SENTRY_DSN) return;

  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 * Breadcrumbs track events leading up to an error
 */
export function addBreadcrumb(
  message: string,
  category: string = 'general',
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  if (!SENTRY_DSN) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Track API calls
 */
export function trackApiCall(endpoint: string, method: string, duration: number, statusCode?: number) {
  if (!SENTRY_DSN) return;

  addBreadcrumb(
    `${method} ${endpoint}`,
    'api',
    statusCode && statusCode >= 400 ? 'warning' : 'info',
    {
      duration,
      statusCode,
    }
  );
}

/**
 * Track navigation
 */
export function trackNavigation(from: string, to: string) {
  if (!SENTRY_DSN) return;

  addBreadcrumb(
    `Navigation from ${from} to ${to}`,
    'navigation',
    'info'
  );
}

/**
 * Create performance transaction
 */
export function startTransaction(_name: string, _operation: string = 'http.request') {
  if (!SENTRY_DSN) return null;

  return null;
}

/**
 * Wrap async function with error tracking
 */
export async function withSentry<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Error in async operation'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      originalMessage: errorMessage,
    });
    throw error;
  }
}

/**
 * Wrap sync function with error tracking
 */
export function withSentrySync<T>(
  fn: () => T,
  errorMessage: string = 'Error in sync operation'
): T {
  try {
    return fn();
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      originalMessage: errorMessage,
    });
    throw error;
  }
}
