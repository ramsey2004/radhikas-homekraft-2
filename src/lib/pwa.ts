/**
 * Progressive Web App (PWA) Utilities
 * Service Worker setup, installation prompts, offline support
 */

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  scope: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
  themeColor: string;
  backgroundColor: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: 'any' | 'maskable' | 'any maskable';
  }>;
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
    form_factor?: 'narrow' | 'wide';
  }>;
  categories?: string[];
  shortcuts?: Array<{
    name: string;
    shortName?: string;
    description?: string;
    url: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type: string;
    }>;
  }>;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: '/',
      updateViaCache: 'none',
    });

    console.log('✓ Service Worker registered successfully');

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Every minute

    return registration;
  } catch (error) {
    console.error('✗ Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('✓ Service Worker unregistered');
    return true;
  } catch (error) {
    console.error('✗ Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Request install prompt (add to home screen)
 */
export async function requestInstallPrompt(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User chose to ${outcome === 'accepted' ? 'install' : 'dismiss'}`);
    deferredPrompt = null;
    return outcome === 'accepted';
  }

  return false;
}

/**
 * Check if app is in offline mode
 */
export function isOffline(): boolean {
  if (typeof window === 'undefined') return false;
  return !navigator.onLine;
}

/**
 * Listen to online/offline status changes
 */
export function listenToOnlineStatus(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission !== 'granted') {
    return Notification.requestPermission();
  }

  return 'granted';
}

/**
 * Send notification
 */
export async function sendNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const permission = Notification.permission;

  if (permission === 'granted') {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options,
      });
    } else {
      new Notification(title, options);
    }
  }
}

/**
 * Clear cache
 */
export async function clearCache(cacheName?: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    const namesToDelete = cacheName ? [cacheName] : cacheNames;

    await Promise.all(namesToDelete.map((name) => caches.delete(name)));
    console.log('✓ Cache cleared');
    return true;
  } catch (error) {
    console.error('✗ Cache clear failed:', error);
    return false;
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  if (typeof window === 'undefined' || !('storage' in navigator) || !('estimate' in navigator.storage)) {
    return 0;
  }

  try {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  } catch {
    return 0;
  }
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !('storage' in navigator) || !('persist' in navigator.storage)) {
    return false;
  }

  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/**
 * Check if app can be installed
 */
export function canInstallApp(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get PWA display mode
 */
export function getDisplayMode(): string {
  if (typeof window === 'undefined') return 'browser';

  const isStandalone = (navigator as any).standalone === true;
  const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser';

  return isStandalone ? 'standalone' : displayMode;
}

/**
 * Check if running as PWA
 */
export function isRunningAsPWA(): boolean {
  return getDisplayMode() === 'standalone';
}
