/**
 * SEO Validation and Optimization Tools
 * Checks for SEO best practices and opportunities
 */

export interface SEOCheckResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion?: string;
}

export interface SEOReport {
  url: string;
  score: number;
  results: SEOCheckResult[];
  timestamp: string;
}

// ============================================================
// SEO Validation Functions
// ============================================================

export const seoValidation = {
  /**
   * Check meta title tag
   */
  checkMetaTitle: (title: string, _url: string): SEOCheckResult => {
    if (!title) {
      return {
        check: 'Meta Title',
        status: 'fail',
        message: 'Meta title is missing',
        severity: 'critical',
        suggestion: 'Add a descriptive meta title (50-60 characters)',
      };
    }

    if (title.length < 30) {
      return {
        check: 'Meta Title',
        status: 'warning',
        message: `Meta title is too short (${title.length} chars)`,
        severity: 'high',
        suggestion: 'Aim for 50-60 characters to ensure full display in search results',
      };
    }

    if (title.length > 60) {
      return {
        check: 'Meta Title',
        status: 'warning',
        message: `Meta title is too long (${title.length} chars)`,
        severity: 'medium',
        suggestion: 'Keep titles under 60 characters to prevent truncation',
      };
    }

    return {
      check: 'Meta Title',
      status: 'pass',
      message: `Meta title is optimal (${title.length} chars)`,
      severity: 'low',
    };
  },

  /**
   * Check meta description
   */
  checkMetaDescription: (description: string, _url: string): SEOCheckResult => {
    if (!description) {
      return {
        check: 'Meta Description',
        status: 'fail',
        message: 'Meta description is missing',
        severity: 'critical',
        suggestion: 'Add a compelling meta description (150-160 characters)',
      };
    }

    if (description.length < 120) {
      return {
        check: 'Meta Description',
        status: 'warning',
        message: `Meta description is too short (${description.length} chars)`,
        severity: 'medium',
        suggestion: 'Aim for 150-160 characters for full display in search results',
      };
    }

    if (description.length > 160) {
      return {
        check: 'Meta Description',
        status: 'warning',
        message: `Meta description is too long (${description.length} chars)`,
        severity: 'medium',
        suggestion: 'Keep descriptions under 160 characters to prevent truncation',
      };
    }

    return {
      check: 'Meta Description',
      status: 'pass',
      message: `Meta description is optimal (${description.length} chars)`,
      severity: 'low',
    };
  },

  /**
   * Check heading structure (H1 tags)
   */
  checkHeadingStructure: (h1Count: number, h2Count: number): SEOCheckResult[] => {
    const results: SEOCheckResult[] = [];

    if (h1Count === 0) {
      results.push({
        check: 'H1 Tag',
        status: 'fail',
        message: 'No H1 tag found',
        severity: 'critical',
        suggestion: 'Add exactly one H1 tag per page with your main keyword',
      });
    } else if (h1Count > 1) {
      results.push({
        check: 'H1 Tag',
        status: 'warning',
        message: `Multiple H1 tags found (${h1Count})`,
        severity: 'high',
        suggestion: 'Use only one H1 tag per page as the main heading',
      });
    } else {
      results.push({
        check: 'H1 Tag',
        status: 'pass',
        message: 'Exactly one H1 tag found',
        severity: 'low',
      });
    }

    if (h2Count === 0 && h1Count === 1) {
      results.push({
        check: 'H2-H6 Tags',
        status: 'warning',
        message: 'No subheadings (H2-H6) found',
        severity: 'medium',
        suggestion: 'Use subheadings to structure your content and improve readability',
      });
    } else if (h2Count > 0) {
      results.push({
        check: 'H2-H6 Tags',
        status: 'pass',
        message: `Found ${h2Count} subheadings`,
        severity: 'low',
      });
    }

    return results;
  },

  /**
   * Check image alt tags
   */
  checkImageAltTags: (imagesWithoutAlt: number, totalImages: number): SEOCheckResult => {
    if (totalImages === 0) {
      return {
        check: 'Image Alt Tags',
        status: 'pass',
        message: 'No images on page',
        severity: 'low',
      };
    }

    const percentage = Math.round(((totalImages - imagesWithoutAlt) / totalImages) * 100);

    if (imagesWithoutAlt === totalImages) {
      return {
        check: 'Image Alt Tags',
        status: 'fail',
        message: `All ${totalImages} images missing alt tags`,
        severity: 'critical',
        suggestion: 'Add descriptive alt text to all images for accessibility and SEO',
      };
    }

    if (imagesWithoutAlt > 0) {
      return {
        check: 'Image Alt Tags',
        status: 'warning',
        message: `${imagesWithoutAlt} of ${totalImages} images missing alt tags (${percentage}% complete)`,
        severity: 'high',
        suggestion: 'Add alt tags to remaining images',
      };
    }

    return {
      check: 'Image Alt Tags',
      status: 'pass',
      message: `All ${totalImages} images have alt tags`,
      severity: 'low',
    };
  },

  /**
   * Check mobile responsiveness
   */
  checkMobileResponsiveness: (hasViewportMeta: boolean): SEOCheckResult => {
    if (!hasViewportMeta) {
      return {
        check: 'Mobile Responsiveness',
        status: 'fail',
        message: 'Viewport meta tag missing',
        severity: 'critical',
        suggestion:
          'Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">',
      };
    }

    return {
      check: 'Mobile Responsiveness',
      status: 'pass',
      message: 'Viewport meta tag configured',
      severity: 'low',
    };
  },

  /**
   * Check page load speed
   */
  checkPageLoadSpeed: (loadTime: number): SEOCheckResult => {
    if (loadTime > 5000) {
      return {
        check: 'Page Load Speed',
        status: 'fail',
        message: `Page loads in ${(loadTime / 1000).toFixed(2)}s (too slow)`,
        severity: 'critical',
        suggestion: 'Optimize images, enable caching, and minimize JavaScript',
      };
    }

    if (loadTime > 3000) {
      return {
        check: 'Page Load Speed',
        status: 'warning',
        message: `Page loads in ${(loadTime / 1000).toFixed(2)}s (could be faster)`,
        severity: 'high',
        suggestion: 'Aim for sub-3 second load times for better SEO and user experience',
      };
    }

    return {
      check: 'Page Load Speed',
      status: 'pass',
      message: `Page loads in ${(loadTime / 1000).toFixed(2)}s (excellent)`,
      severity: 'low',
    };
  },

  /**
   * Check SSL/HTTPS
   */
  checkSSL: (isSecure: boolean): SEOCheckResult => {
    if (!isSecure) {
      return {
        check: 'SSL/HTTPS',
        status: 'fail',
        message: 'Site is not using HTTPS',
        severity: 'critical',
        suggestion: 'Enable SSL/HTTPS to secure your website and improve SEO rankings',
      };
    }

    return {
      check: 'SSL/HTTPS',
      status: 'pass',
      message: 'Site is secured with HTTPS',
      severity: 'low',
    };
  },

  /**
   * Check robots.txt and sitemap
   */
  checkRobotsAndSitemap: (hasRobots: boolean, hasSitemap: boolean): SEOCheckResult[] => {
    const results: SEOCheckResult[] = [];

    if (!hasRobots) {
      results.push({
        check: 'Robots.txt',
        status: 'warning',
        message: 'robots.txt file not found',
        severity: 'medium',
        suggestion: 'Create robots.txt to guide search engine crawlers',
      });
    } else {
      results.push({
        check: 'Robots.txt',
        status: 'pass',
        message: 'robots.txt file found',
        severity: 'low',
      });
    }

    if (!hasSitemap) {
      results.push({
        check: 'Sitemap',
        status: 'warning',
        message: 'sitemap.xml not found',
        severity: 'medium',
        suggestion: 'Create and submit sitemap.xml to search engines',
      });
    } else {
      results.push({
        check: 'Sitemap',
        status: 'pass',
        message: 'sitemap.xml found',
        severity: 'low',
      });
    }

    return results;
  },
};

// ============================================================
// SEO Score Calculator
// ============================================================

export const calculateSEOScore = (results: SEOCheckResult[]): number => {
  const criticalIssues = results.filter((r) => r.severity === 'critical' && r.status !== 'pass').length;
  const highIssues = results.filter((r) => r.severity === 'high' && r.status !== 'pass').length;
  const mediumIssues = results.filter((r) => r.severity === 'medium' && r.status !== 'pass').length;

  let score = 100;
  score -= criticalIssues * 25;
  score -= highIssues * 10;
  score -= mediumIssues * 5;

  return Math.max(0, Math.min(100, score));
};

// ============================================================
// Keywords to Check
// ============================================================

export const targetKeywords = {
  home: ['Indian handicrafts', 'block print', 'home decor', 'textiles', 'Jaipur'],
  shop: ['handcrafted textiles', 'block print bedsheets', 'rugs', 'cushions', 'home decor'],
  blog: ['craft stories', 'interior design', 'artisan', 'sustainable', 'traditional'],
  admin: ['order management', 'inventory', 'analytics', 'admin dashboard'],
};
