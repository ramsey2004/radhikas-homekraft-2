/**
 * Google Analytics 4 Setup & Event Tracking
 */

export interface AnalyticsEvent {
  name: string;
  value?: string | number;
  currency?: string;
  category?: string;
  label?: string;
}

/**
 * Track custom event in Google Analytics
 */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  window.gtag('event', event.name, {
    value: event.value,
    currency: event.currency,
    event_category: event.category,
    event_label: event.label,
  });
}

/**
 * Track product view
 */
export function trackProductView(productId: string, productName: string, _price: number) {
  trackEvent({
    name: 'view_item',
    value: productName,
    currency: 'INR',
    label: productId,
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(productId: string, _productName: string, quantity: number, _price: number) {
  trackEvent({
    name: 'add_to_cart',
    value: quantity,
    currency: 'INR',
    label: productId,
  });
}

/**
 * Track add to wishlist
 */
export function trackAddToWishlist(productId: string, productName: string) {
  trackEvent({
    name: 'add_to_wishlist',
    value: productName,
    label: productId,
  });
}

/**
 * Track purchase
 */
export function trackPurchase(orderId: string, amount: number, _items: number) {
  trackEvent({
    name: 'purchase',
    value: amount,
    currency: 'INR',
    label: orderId,
  });
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string) {
  trackEvent({
    name: 'search',
    value: searchTerm,
  });
}

/**
 * Track page view (automatically tracked by GA4, but can be called manually)
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Track user sign up
 */
export function trackSignup(method: string = 'email') {
  trackEvent({
    name: 'sign_up',
    value: method,
  });
}

/**
 * Track login
 */
export function trackLogin(method: string = 'email') {
  trackEvent({
    name: 'login',
    value: method,
  });
}

/**
 * Track newsletter subscription
 */
export function trackNewsletterSignup(email?: string) {
  trackEvent({
    name: 'newsletter_signup',
    label: email || 'direct',
  });
}

/**
 * Google Analytics global type augmentation
 */
declare global {
  interface Window {
    gtag?: (command: any, ...args: any[]) => void;
    GA_ID?: string;
  }
}
