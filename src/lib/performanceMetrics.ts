/**
 * Performance Metrics and Web Vitals Monitoring
 * Tracks Core Web Vitals (LCP, FID, CLS) and custom metrics
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; needsImprovement: number };
}

export interface CoreWebVitals {
  lcp?: PerformanceMetric; // Largest Contentful Paint
  fid?: PerformanceMetric; // First Input Delay
  cls?: PerformanceMetric; // Cumulative Layout Shift
  ttfb?: PerformanceMetric; // Time to First Byte
}

export interface PerformanceReport {
  pageUrl: string;
  timestamp: string;
  metrics: {
    coreWebVitals: CoreWebVitals;
    resourceMetrics: PerformanceMetric[];
    navigationTiming: PerformanceMetric[];
  };
  score: number;
}

// ============================================================
// Core Web Vitals Thresholds
// ============================================================

const CWV_THRESHOLDS = {
  LCP: {
    good: 2500, // 2.5 seconds
    needsImprovement: 4000, // 4 seconds
  },
  FID: {
    good: 100, // 100 milliseconds
    needsImprovement: 300, // 300 milliseconds
  },
  CLS: {
    good: 0.1, // 0.1 score
    needsImprovement: 0.25, // 0.25 score
  },
  TTFB: {
    good: 600, // 600 milliseconds
    needsImprovement: 1200, // 1200 milliseconds
  },
};

const RESOURCE_THRESHOLDS = {
  'Time to Interactive': {
    good: 2000,
    needsImprovement: 4000,
  },
  'First Paint': {
    good: 1000,
    needsImprovement: 2000,
  },
  'First Contentful Paint': {
    good: 1800,
    needsImprovement: 3000,
  },
  'DOM Content Loaded': {
    good: 2000,
    needsImprovement: 4000,
  },
  'Page Load': {
    good: 3000,
    needsImprovement: 6000,
  },
};

// ============================================================
// Performance Metric Calculation
// ============================================================

export const performanceMetrics = {
  /**
   * Determine status based on value and thresholds
   */
  getMetricStatus: (
    value: number,
    threshold: { good: number; needsImprovement: number }
  ): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  },

  /**
   * Calculate Largest Contentful Paint (LCP)
   * Measures loading performance
   * Should be under 2.5 seconds
   */
  calculateLCP: (lcpValue: number): PerformanceMetric => {
    return {
      name: 'Largest Contentful Paint (LCP)',
      value: lcpValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(lcpValue, CWV_THRESHOLDS.LCP),
      threshold: CWV_THRESHOLDS.LCP,
    };
  },

  /**
   * Calculate First Input Delay (FID)
   * Measures interactivity
   * Should be under 100ms
   */
  calculateFID: (fidValue: number): PerformanceMetric => {
    return {
      name: 'First Input Delay (FID)',
      value: fidValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(fidValue, CWV_THRESHOLDS.FID),
      threshold: CWV_THRESHOLDS.FID,
    };
  },

  /**
   * Calculate Cumulative Layout Shift (CLS)
   * Measures visual stability
   * Should be under 0.1
   */
  calculateCLS: (clsValue: number): PerformanceMetric => {
    return {
      name: 'Cumulative Layout Shift (CLS)',
      value: clsValue,
      unit: 'score',
      status: performanceMetrics.getMetricStatus(clsValue, CWV_THRESHOLDS.CLS),
      threshold: CWV_THRESHOLDS.CLS,
    };
  },

  /**
   * Calculate Time to First Byte (TTFB)
   * Measures server responsiveness
   * Should be under 600ms
   */
  calculateTTFB: (ttfbValue: number): PerformanceMetric => {
    return {
      name: 'Time to First Byte (TTFB)',
      value: ttfbValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(ttfbValue, CWV_THRESHOLDS.TTFB),
      threshold: CWV_THRESHOLDS.TTFB,
    };
  },

  /**
   * Calculate Time to Interactive (TTI)
   * Measures when page is fully interactive
   * Should be under 2 seconds
   */
  calculateTTI: (ttiValue: number): PerformanceMetric => {
    const metricsName = 'Time to Interactive';
    return {
      name: `${metricsName} (TTI)`,
      value: ttiValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(ttiValue, RESOURCE_THRESHOLDS[metricsName]),
      threshold: RESOURCE_THRESHOLDS[metricsName],
    };
  },

  /**
   * Calculate First Paint (FP)
   * Measures when browser starts rendering
   * Should be under 1 second
   */
  calculateFirstPaint: (fpValue: number): PerformanceMetric => {
    const metricsName = 'First Paint';
    return {
      name: metricsName,
      value: fpValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(fpValue, RESOURCE_THRESHOLDS[metricsName]),
      threshold: RESOURCE_THRESHOLDS[metricsName],
    };
  },

  /**
   * Calculate First Contentful Paint (FCP)
   * Measures when first content appears
   * Should be under 1.8 seconds
   */
  calculateFCP: (fcpValue: number): PerformanceMetric => {
    const metricsName = 'First Contentful Paint';
    return {
      name: `${metricsName} (FCP)`,
      value: fcpValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(fcpValue, RESOURCE_THRESHOLDS[metricsName]),
      threshold: RESOURCE_THRESHOLDS[metricsName],
    };
  },

  /**
   * Calculate DOM Content Loaded
   * Measures when DOM is fully parsed
   * Should be under 2 seconds
   */
  calculateDOMContentLoaded: (dclValue: number): PerformanceMetric => {
    const metricsName = 'DOM Content Loaded';
    return {
      name: metricsName,
      value: dclValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(dclValue, RESOURCE_THRESHOLDS[metricsName]),
      threshold: RESOURCE_THRESHOLDS[metricsName],
    };
  },

  /**
   * Calculate Page Load Time
   * Measures total page load
   * Should be under 3 seconds
   */
  calculatePageLoad: (pageLoadValue: number): PerformanceMetric => {
    const metricsName = 'Page Load';
    return {
      name: metricsName,
      value: pageLoadValue,
      unit: 'ms',
      status: performanceMetrics.getMetricStatus(pageLoadValue, RESOURCE_THRESHOLDS[metricsName]),
      threshold: RESOURCE_THRESHOLDS[metricsName],
    };
  },

  /**
   * Calculate performance score (0-100)
   */
  calculatePerformanceScore: (metrics: PerformanceMetric[]): number => {
    let score = 100;

    for (const metric of metrics) {
      if (metric.status === 'poor') {
        score -= 20;
      } else if (metric.status === 'needs-improvement') {
        score -= 10;
      }
    }

    return Math.max(0, Math.min(100, score));
  },
};

// ============================================================
// Performance Report Generator
// ============================================================

export const generatePerformanceReport = (
  pageUrl: string,
  navigationData: {
    navigationStart: number;
    responseEnd: number;
    domLoading: number;
    domInteractive: number;
    domComplete: number;
    loadEventEnd: number;
  },
  cwv: { lcp?: number; fid?: number; cls?: number; ttfb?: number }
): PerformanceReport => {
  const navigationTiming = [
    performanceMetrics.calculateDOMContentLoaded(navigationData.domInteractive - navigationData.navigationStart),
    performanceMetrics.calculateTTI(navigationData.domComplete - navigationData.navigationStart),
    performanceMetrics.calculatePageLoad(navigationData.loadEventEnd - navigationData.navigationStart),
  ];

  const coreWebVitals: CoreWebVitals = {};
  const resourceMetrics: PerformanceMetric[] = [];

  if (cwv.lcp) {
    coreWebVitals.lcp = performanceMetrics.calculateLCP(cwv.lcp);
    resourceMetrics.push(coreWebVitals.lcp);
  }
  if (cwv.fid) {
    coreWebVitals.fid = performanceMetrics.calculateFID(cwv.fid);
    resourceMetrics.push(coreWebVitals.fid);
  }
  if (cwv.cls) {
    coreWebVitals.cls = performanceMetrics.calculateCLS(cwv.cls);
    resourceMetrics.push(coreWebVitals.cls);
  }
  if (cwv.ttfb) {
    coreWebVitals.ttfb = performanceMetrics.calculateTTFB(cwv.ttfb);
    resourceMetrics.push(coreWebVitals.ttfb);
  }

  const allMetrics = [...resourceMetrics, ...navigationTiming];
  const score = performanceMetrics.calculatePerformanceScore(allMetrics);

  return {
    pageUrl,
    timestamp: new Date().toISOString(),
    metrics: {
      coreWebVitals,
      resourceMetrics,
      navigationTiming,
    },
    score,
  };
};

// ============================================================
// Performance Recommendations
// ============================================================

export const performanceRecommendations = {
  getPoorMetricSuggestions: (metric: PerformanceMetric): string[] => {
    const suggestions: string[] = [];

    switch (metric.name) {
      case 'Largest Contentful Paint (LCP)':
        suggestions.push(
          'Optimize images and videos for faster loading',
          'Remove unnecessary CSS and JavaScript',
          'Use a Content Delivery Network (CDN)',
          'Enable server-side caching'
        );
        break;

      case 'First Input Delay (FID)':
        suggestions.push(
          'Break up long JavaScript tasks',
          'Defer non-critical JavaScript',
          'Use Web Workers for heavy computations',
          'Optimize third-party scripts'
        );
        break;

      case 'Cumulative Layout Shift (CLS)':
        suggestions.push(
          'Specify dimensions for images and embeds',
          'Avoid inserting content above existing content',
          'Use transform animations instead of position changes',
          'Add font-display: swap to web fonts'
        );
        break;

      case 'Time to First Byte (TTFB)':
        suggestions.push(
          'Upgrade hosting infrastructure',
          'Implement request routing optimization',
          'Use geographically distributed servers',
          'Optimize database queries'
        );
        break;

      case 'Time to Interactive (TTI)':
        suggestions.push(
          'Reduce JavaScript bundle size',
          'Use code splitting',
          'Implement lazy loading',
          'Minify and gzip resources'
        );
        break;

      default:
        suggestions.push('Review resource optimization opportunities');
        break;
    }

    return suggestions;
  },
};
