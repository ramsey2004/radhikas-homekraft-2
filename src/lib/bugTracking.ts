/**
 * Bug Reporting and Issue Tracking
 * Captures, categorizes, and tracks bugs found during testing
 */

export type BugSeverity = 'critical' | 'high' | 'medium' | 'low';
export type BugCategory =
  | 'functionality'
  | 'performance'
  | 'ui-ux'
  | 'accessibility'
  | 'security'
  | 'data'
  | 'compatibility'
  | 'other';
export type BugStatus = 'open' | 'in-progress' | 'resolved' | 'wontfix' | 'duplicate';

export interface BugReport {
  id: string;
  title: string;
  description: string;
  category: BugCategory;
  severity: BugSeverity;
  status: BugStatus;
  reproducible: boolean;
  steps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  affectedPages: string[];
  affectedBrowsers?: string[];
  attachments?: string[];
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  resolvedDate?: string;
  resolution?: string;
  tags: string[];
}

export interface BugSummary {
  totalBugs: number;
  openBugs: number;
  resolvedBugs: number;
  criticalBugs: number;
  bugsBySeverity: Record<BugSeverity, number>;
  bugsByCategory: Record<BugCategory, number>;
  bugsByStatus: Record<BugStatus, number>;
}

// ============================================================
// Sample Bugs Found During Testing
// ============================================================

export const KNOWN_BUGS: BugReport[] = [
  {
    id: 'BUG-001',
    title: 'Cart not persisting across browser tabs',
    description: 'When user adds product to cart in one tab, cart is empty in another tab',
    category: 'data',
    severity: 'high',
    status: 'open',
    reproducible: true,
    steps: [
      'Open website in two browser tabs',
      'Add product to cart in tab 1',
      'Switch to tab 2',
      'Verify cart is empty',
    ],
    expectedBehavior: 'Cart should be synced across all tabs',
    actualBehavior: 'Cart is empty in other tabs',
    affectedPages: ['/shop', '/cart'],
    affectedBrowsers: ['Chrome', 'Firefox', 'Safari'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['localStorage', 'cart', 'sync'],
  },

  {
    id: 'BUG-002',
    title: 'Mobile menu not closing after navigation',
    description: 'Mobile hamburger menu remains open after clicking a navigation link',
    category: 'ui-ux',
    severity: 'medium',
    status: 'open',
    reproducible: true,
    steps: [
      'Access website on mobile device',
      'Click hamburger menu to open',
      'Click on a navigation link',
      'Verify menu closes automatically',
    ],
    expectedBehavior: 'Mobile menu should close after navigation',
    actualBehavior: 'Mobile menu remains open',
    affectedPages: ['/'],
    affectedBrowsers: ['Mobile Safari', 'Chrome Mobile'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['mobile', 'navigation', 'menu'],
  },

  {
    id: 'BUG-003',
    title: 'Search filter not persisting on pagination',
    description: 'Applied search filters reset when user navigates to next page',
    category: 'functionality',
    severity: 'high',
    status: 'open',
    reproducible: true,
    steps: [
      'Go to /shop',
      'Apply color filter (e.g., "Red")',
      'Click next page button',
      'Verify filter is still applied',
    ],
    expectedBehavior: 'Search filters should persist across pages',
    actualBehavior: 'Filters reset on page navigation',
    affectedPages: ['/shop'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['search', 'filters', 'pagination'],
  },

  {
    id: 'BUG-004',
    title: 'Admin dashboard charts not responsive',
    description: 'Charts overflow on tablet-sized screens',
    category: 'ui-ux',
    severity: 'medium',
    status: 'open',
    reproducible: true,
    steps: [
      'Login to admin dashboard',
      'View analytics page',
      'Resize browser to tablet width (768px)',
      'Verify charts are readable',
    ],
    expectedBehavior: 'Charts should resize responsively',
    actualBehavior: 'Charts overflow and are not readable',
    affectedPages: ['/admin/analytics'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['admin', 'charts', 'responsive'],
  },

  {
    id: 'BUG-005',
    title: 'Form validation message not clearing',
    description: 'Error message from previous submission remains visible after fixing the error',
    category: 'ui-ux',
    severity: 'low',
    status: 'open',
    reproducible: true,
    steps: [
      'Go to contact page',
      'Submit form without email',
      'See validation error',
      'Enter valid email',
      'Verify error message is cleared',
    ],
    expectedBehavior: 'Error message should clear as user fixes error',
    actualBehavior: 'Error message persists until form is resubmitted',
    affectedPages: ['/contact', '/admin/orders'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['forms', 'validation', 'ux'],
  },

  {
    id: 'BUG-006',
    title: 'Image loading slow on 3G connection',
    description: 'Hero images take >5s to load on slow connections',
    category: 'performance',
    severity: 'high',
    status: 'open',
    reproducible: true,
    steps: [
      'Open DevTools Network tab',
      'Set throttling to 3G Slow',
      'Navigate to home page',
      'Measure hero image load time',
    ],
    expectedBehavior: 'Images should load within 3 seconds',
    actualBehavior: 'Hero images take 5-8 seconds to load',
    affectedPages: ['/'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['performance', 'images', '3g'],
  },

  {
    id: 'BUG-007',
    title: 'Accessibility: Links not keyboard accessible',
    description: 'Some interactive elements cannot be accessed via keyboard Tab key',
    category: 'accessibility',
    severity: 'critical',
    status: 'open',
    reproducible: true,
    steps: [
      'Press Tab repeatedly to navigate page',
      'Try to access all interactive elements',
      'Verify all elements are reachable',
    ],
    expectedBehavior: 'All interactive elements should be keyboard accessible',
    actualBehavior: 'Some buttons and links cannot be accessed via keyboard',
    affectedPages: ['/shop', '/admin/dashboard'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['accessibility', 'wcag', 'keyboard'],
  },

  {
    id: 'BUG-008',
    title: 'API endpoint returning 500 error intermittently',
    description: '/api/emails/send endpoint sometimes returns 500 error',
    category: 'functionality',
    severity: 'critical',
    status: 'open',
    reproducible: false,
    steps: [
      'Send 10 consecutive email API requests',
      'Monitor for 500 errors',
    ],
    expectedBehavior: 'All requests should return 200 OK',
    actualBehavior: 'Approximately 2-3 requests fail with 500 error',
    affectedPages: ['/api/emails'],
    createdDate: '2026-02-09',
    createdBy: 'Testing Suite',
    lastUpdated: '2026-02-09',
    tags: ['api', 'email', 'error-handling'],
  },
];

// ============================================================
// Bug Management Functions
// ============================================================

export const bugManagement = {
  /**
   * Generate bug summary statistics
   */
  generateBugSummary: (bugs: BugReport[]): BugSummary => {
    const summary: BugSummary = {
      totalBugs: bugs.length,
      openBugs: bugs.filter((b) => b.status === 'open').length,
      resolvedBugs: bugs.filter((b) => b.status === 'resolved').length,
      criticalBugs: bugs.filter((b) => b.severity === 'critical').length,
      bugsBySeverity: {
        critical: bugs.filter((b) => b.severity === 'critical').length,
        high: bugs.filter((b) => b.severity === 'high').length,
        medium: bugs.filter((b) => b.severity === 'medium').length,
        low: bugs.filter((b) => b.severity === 'low').length,
      },
      bugsByCategory: {
        functionality: bugs.filter((b) => b.category === 'functionality').length,
        performance: bugs.filter((b) => b.category === 'performance').length,
        'ui-ux': bugs.filter((b) => b.category === 'ui-ux').length,
        accessibility: bugs.filter((b) => b.category === 'accessibility').length,
        security: bugs.filter((b) => b.category === 'security').length,
        data: bugs.filter((b) => b.category === 'data').length,
        compatibility: bugs.filter((b) => b.category === 'compatibility').length,
        other: bugs.filter((b) => b.category === 'other').length,
      },
      bugsByStatus: {
        open: bugs.filter((b) => b.status === 'open').length,
        'in-progress': bugs.filter((b) => b.status === 'in-progress').length,
        resolved: bugs.filter((b) => b.status === 'resolved').length,
        wontfix: bugs.filter((b) => b.status === 'wontfix').length,
        duplicate: bugs.filter((b) => b.status === 'duplicate').length,
      },
    };

    return summary;
  },

  /**
   * Get bugs by severity
   */
  getBugsBySeverity: (bugs: BugReport[], severity: BugSeverity): BugReport[] => {
    return bugs.filter((b) => b.severity === severity);
  },

  /**
   * Get bugs by category
   */
  getBugsByCategory: (bugs: BugReport[], category: BugCategory): BugReport[] => {
    return bugs.filter((b) => b.category === category);
  },

  /**
   * Get critical bugs (blocks release)
   */
  getCriticalBugs: (bugs: BugReport[]): BugReport[] => {
    return bugs.filter(
      (b) =>
        (b.severity === 'critical' || b.severity === 'high') &&
        b.status !== 'resolved' &&
        b.status !== 'wontfix'
    );
  },

  /**
   * Get bugs affecting specific page
   */
  getBugsForPage: (bugs: BugReport[], page: string): BugReport[] => {
    return bugs.filter((b) => b.affectedPages.includes(page));
  },

  /**
   * Generate bug priority list (for fixing)
   */
  prioritizeBugs: (bugs: BugReport[]): BugReport[] => {
    const priorityMap: Record<BugSeverity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return [...bugs].sort((a, b) => {
      const severityDiff = priorityMap[a.severity] - priorityMap[b.severity];
      if (severityDiff !== 0) return severityDiff;

      // Secondary sort: open bugs before resolved
      const statusDiff =
        (a.status === 'open' ? 0 : 1) - (b.status === 'open' ? 0 : 1);
      if (statusDiff !== 0) return statusDiff;

      // Tertiary sort: most recent first
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
  },

  /**
   * Create new bug report
   */
  createBugReport: (
    title: string,
    description: string,
    category: BugCategory,
    severity: BugSeverity,
    steps: string[],
    expectedBehavior: string,
    actualBehavior: string,
    affectedPages: string[]
  ): BugReport => {
    const id = `BUG-${String(KNOWN_BUGS.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    return {
      id,
      title,
      description,
      category,
      severity,
      status: 'open',
      reproducible: true,
      steps,
      expectedBehavior,
      actualBehavior,
      affectedPages,
      createdDate: now,
      createdBy: 'Testing Suite',
      lastUpdated: now,
      tags: [],
    };
  },
};

// ============================================================
// Bug Report Formatting
// ============================================================

export const formatBugReport = (bug: BugReport): string => {
  return `
═══════════════════════════════════════════════════════════
BUG REPORT #${bug.id}
═══════════════════════════════════════════════════════════

Title:          ${bug.title}
Severity:       ${bug.severity.toUpperCase()}
Status:         ${bug.status}
Category:       ${bug.category}
Reproducible:   ${bug.reproducible ? 'Yes' : 'No'}

Description:
${bug.description}

Affected Pages:
${bug.affectedPages.map((p) => `  • ${p}`).join('\n')}

Steps to Reproduce:
${bug.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

Expected Behavior:
${bug.expectedBehavior}

Actual Behavior:
${bug.actualBehavior}

Created:        ${bug.createdDate}
Last Updated:   ${bug.lastUpdated}
Created By:     ${bug.createdBy}

Tags: ${bug.tags.join(', ') || 'None'}
═══════════════════════════════════════════════════════════
  `;
};
