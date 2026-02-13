/**
 * Accessibility (a11y) Utilities
 * WCAG 2.1 AA compliance helpers
 */

/**
 * Generate unique ID for form labels and aria-describedby
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if color contrast meets WCAG AA standards
 * @param color1 - Hex color (e.g., '#ffffff')
 * @param color2 - Hex color (e.g., '#000000')
 * @returns true if contrast ratio >= 4.5:1 (AA standard)
 */
export function hasValidContrast(color1: string, color2: string): boolean {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return false;

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const contrastRatio = (lighter + 0.05) / (darker + 0.05);
  return contrastRatio >= 4.5; // WCAG AA standard
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance for contrast calculation
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Create accessible dialog attributes
 */
export function getDialogProps(id: string, _title: string) {
  return {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': `${id}-title`,
    id,
  };
}

/**
 * Create accessible button attributes
 */
export function getButtonProps(disabled?: boolean, loading?: boolean) {
  return {
    disabled: disabled || loading,
    'aria-busy': loading,
    'aria-disabled': disabled || loading,
  };
}

/**
 * Create accessible link attributes
 */
export function getLinkProps(external?: boolean, download?: boolean) {
  return {
    ...(external && {
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-external': 'true',
    }),
    ...(download && {
      rel: 'download',
    }),
  };
}

/**
 * Create accessible form input attributes
 */
export function getInputProps(
  id: string,
  label?: string,
  error?: string,
  required?: boolean,
  disabled?: boolean
) {
  const describedBy: string[] = [];

  if (error) describedBy.push(`${id}-error`);
  if (label) describedBy.push(`${id}-label`);

  return {
    id,
    'aria-label': label,
    'aria-required': required,
    'aria-disabled': disabled,
    'aria-describedby': describedBy.length > 0 ? describedBy.join(' ') : undefined,
    'aria-invalid': !!error,
  };
}

/**
 * Get CSS properties for screen reader only text
 */
export function srOnly(): Record<string, string> {
  return {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    borderWidth: '0',
  };
}

/**
 * Announce to screen readers
 */
export function announce(
  message: string,
  priority: 'polite' | 'assertive' = 'polite',
  clearAfter: number = 3000
) {
  const element = document.createElement('div');
  element.setAttribute('role', 'status');
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', 'true');
  element.className = 'sr-only';
  element.textContent = message;

  document.body.appendChild(element);

  if (clearAfter > 0) {
    setTimeout(() => element.remove(), clearAfter);
  }

  return () => element.remove();
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user preferences
 */
export function getAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: more)').matches;
}

/**
 * Get font size multiplier based on user preferences
 */
export function getUserFontScale(): number {
  if (typeof window === 'undefined') return 1;
  // Reading from CSS variable set by browser
  const scale = getComputedStyle(document.documentElement).getPropertyValue('--user-font-scale');
  return scale ? parseFloat(scale) : 1;
}

/**
 * Focus management helper
 */
export function manageFocus(element: HTMLElement | null) {
  return {
    focus: () => element?.focus(),
    blur: () => element?.blur(),
    trap: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      return {
        release: () => {
          firstElement.addEventListener('keydown', handleBackTab);
          lastElement.addEventListener('keydown', handleForwardTab);
        },
        remove: () => {
          firstElement.removeEventListener('keydown', handleBackTab);
          lastElement.removeEventListener('keydown', handleForwardTab);
        },
      };

      function handleBackTab(e: KeyboardEvent) {
        if (e.key === 'Tab' && e.shiftKey) {
          e.preventDefault();
          lastElement.focus();
        }
      }

      function handleForwardTab(e: KeyboardEvent) {
        if (e.key === 'Tab' && !e.shiftKey) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
  };
}

/**
 * Keyboard navigation helper
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  callbacks: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }
) {
  const keyMap: Record<string, (() => void) | undefined> = {
    Enter: callbacks.onEnter,
    ' ': callbacks.onSpace,
    Escape: callbacks.onEscape,
    ArrowUp: callbacks.onArrowUp,
    ArrowDown: callbacks.onArrowDown,
    ArrowLeft: callbacks.onArrowLeft,
    ArrowRight: callbacks.onArrowRight,
  };

  const handler = keyMap[event.key];
  if (handler) {
    event.preventDefault();
    handler();
  }
}
