/**
 * Mobile Optimization Utilities
 * Provides mobile-first design patterns and responsive utilities
 */

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Mobile detection and utilities
 */
export const mobile = {
  isTouchDevice: () => {
    if (typeof window === 'undefined') return false;
    return (
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0 ||
      ('ontouchstart' in window) ||
      ('onmsgesturechange' in window)
    );
  },

  isSmallScreen: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < BREAKPOINTS.md;
  },

  isMobile: () => {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },

  isPortrait: () => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth;
  },

  isLandscape: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight;
  },

  getSafeArea: () => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };
    const root = document.documentElement;
    return {
      top: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-top') || '0'),
      bottom: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-left') || '0'),
      right: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-right') || '0'),
    };
  },
};

/**
 * Touch-friendly tap target size (minimum 44x44px for accessibility)
 */
export const TOUCH_TARGET_SIZE = 44;

/**
 * Mobile viewport meta tags checker
 */
export const validateViewportMeta = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    console.warn('Viewport meta tag not found. Add: <meta name="viewport" content="width=device-width, initial-scale=1" />');
    return false;
  }
  return true;
};

/**
 * Mobile gesture utilities
 */
export const gestures = {
  swipeThreshold: 50,
  
  detectSwipe: (startX: number, endX: number, startY: number, endY: number) => {
    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      return diffX > gestures.swipeThreshold
        ? 'left'
        : diffX < -gestures.swipeThreshold
        ? 'right'
        : null;
    } else {
      // Vertical swipe
      return diffY > gestures.swipeThreshold
        ? 'up'
        : diffY < -gestures.swipeThreshold
        ? 'down'
        : null;
    }
  },

  detectDoubleTap: (lastTapTime: number, tapThreshold: number = 300) => {
    return Date.now() - lastTapTime < tapThreshold;
  },

  detectLongPress: (duration: number, threshold: number = 500) => {
    return duration >= threshold;
  },
};

/**
 * Responsive image utilities
 */
export const responsive = {
  /**
   * Generate srcSet for responsive images
   */
  generateSrcSet: (basePath: string): string => {
    const sizes = [320, 640, 1024, 1280, 1920];
    return sizes
      .map((size) => {
        const filename = basePath.split('.').slice(0, -1).join('.');
        const ext = basePath.split('.').pop();
        return `${filename}-${size}w.${ext} ${size}w`;
      })
      .join(', ');
  },

  /**
   * Get optimal image size for device
   */
  getOptimalImageSize: (): number => {
    if (typeof window === 'undefined') return 1024;
    const dpr = window.devicePixelRatio || 1;
    return Math.ceil(window.innerWidth * dpr);
  },
};

/**
 * Mobile performance metrics
 */
export const metrics = {
  recordMetric: (name: string, value: number) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark(`${name}-${value}`);
    }
  },

  measureMetric: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        window.performance.measure(name, `${name}-start`, `${name}-end`);
        const measures = window.performance.getEntriesByName(name);
        return measures[measures.length - 1]?.duration || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  },
};
