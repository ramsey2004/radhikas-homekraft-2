/**
 * Performance Optimization Utilities
 * Handles code splitting, lazy loading, bundling, and caching
 */

/**
 * Dynamic imports with error handling
 */
export const lazyLoad = async (
  importFn: () => Promise<any>,
  fallback: any = null
): Promise<any> => {
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to lazy load module:', error);
    return fallback;
  }
};

/**
 * Component-level code splitting
 */
export const withCodeSplit = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  displayName: string
) => {
  return {
    importFn,
    displayName,
  };
};

/**
 * Debounce hook for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle hook for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastRun = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      fn(...args);
      lastRun = now;
    }
  };
};

/**
 * Cache management
 */
export const cache = {
  set: (key: string, value: any, ttl: number = 3600000) => {
    if (typeof window === 'undefined') return;
    const expiresAt = Date.now() + ttl;
    sessionStorage.setItem(key, JSON.stringify({ value, expiresAt }));
  },

  get: <T = any>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { value, expiresAt } = JSON.parse(cached);
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return value as T;
  },

  clear: (key?: string) => {
    if (typeof window === 'undefined') return;
    if (key) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.clear();
    }
  },

  persist: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },

  retrieve: <T = any>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as T : null;
  },
};

/**
 * Image optimization
 */
export const imageOptimization = {
  /**
   * Generate AVIF fallback with WebP support
   */
  generateImageFormats: (src: string) => {
    const withoutExt = src.substring(0, src.lastIndexOf('.'));
    return {
      avif: `${withoutExt}.avif`,
      webp: `${withoutExt}.webp`,
      original: src,
    };
  },

  /**
   * Optimize image URL for given dimensions
   */
  optimizeUrl: (src: string, width: number, height?: number, quality: number = 80): string => {
    // URL pattern for image CDN (adjust based on your CDN)
    const params = [
      `w=${width}`,
      height ? `h=${height}` : '',
      `q=${quality}`,
      'auto=format',
    ]
      .filter(Boolean)
      .join('&');

    return src.includes('?') ? `${src}&${params}` : `${src}?${params}`;
  },
};

/**
 * Bundle analysis
 */
export const bundleMetrics = {
  reportSize: (name: string, bytes: number) => {
    const mb = (bytes / 1024 / 1024).toFixed(2);
    console.log(`📦 ${name}: ${mb}MB`);
  },

  getLargeModules: () => {
    if (typeof window === 'undefined') return [];
    // This would be populated from bundle analysis tool
    return [];
  },
};

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  /**
   * Measure Core Web Vitals
   */
  vitals: {
    getCLS: (): number => {
      if (typeof window === 'undefined') return 0;
      const entries = (performance as any).getEntriesByType?.('layout-shift') || [];
      let cls = 0;
      for (const entry of entries) {
        if (!((entry as any).hadRecentInput)) {
          cls += (entry as any).value;
        }
      }
      return cls;
    },

    getFID: (): number => {
      if (typeof window === 'undefined') return 0;
      const entries = performance.getEntriesByType?.('first-input') || [];
      return (entries[0] as any)?.processingDuration || 0;
    },

    getLCP: (): number => {
      if (typeof window === 'undefined') return 0;
      const entries = performance.getEntriesByType?.('largest-contentful-paint') || [];
      return (entries[entries.length - 1] as any)?.renderTime || (entries[entries.length - 1] as any)?.loadTime || 0;
    },

    getFCP: (): number => {
      if (typeof window === 'undefined') return 0;
      const entries = performance.getEntriesByType?.('paint') || [];
      const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
      return fcp?.startTime || 0;
    },
  },

  /**
   * Report metrics to analytics service
   */
  reportMetrics: (metrics: Record<string, number>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_vitals', metrics);
    }
  },

  /**
   * Monitor memory usage (Chrome only)
   */
  getMemoryUsage: (): { usedJSHeapSize: number; jsHeapSizeLimit: number } | null => {
    if (typeof window === 'undefined') return null;
    const perf = (performance as any).memory;
    return perf
      ? {
          usedJSHeapSize: perf.usedJSHeapSize,
          jsHeapSizeLimit: perf.jsHeapSizeLimit,
        }
      : null;
  },
};

/**
 * Request prioritization
 */
export const requestPrioritization = {
  /**
   * Fetch with priority hints
   */
  fetchWithPriority: async (
    url: string,
    priority: 'high' | 'low' | 'auto' = 'auto'
  ): Promise<Response> => {
    return fetch(url, {
      priority,
    });
  },

  /**
   * Pre-connect to origins
   */
  preConnect: (origin: string) => {
    if (typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    document.head.appendChild(link);
  },

  /**
   * DNS prefetch
   */
  dnsPrefetch: (origin: string) => {
    if (typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = origin;
    document.head.appendChild(link);
  },
};
