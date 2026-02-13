/**
 * Dark Mode & Theme Management
 * Handles theme switching, persistence, and system preference detection
 */

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'theme-mode';

/**
 * Get user's system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get the actual theme to apply (resolves 'system' to actual theme)
 */
export function getResolvedTheme(themeMode: ThemeMode): 'light' | 'dark' {
  if (themeMode === 'system') {
    return getSystemTheme();
  }
  return themeMode;
}

/**
 * Get theme from localStorage
 */
export function getSavedTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return (saved as ThemeMode) || null;
}

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  // Apply theme
  applyTheme(getResolvedTheme(theme));
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update or create color-scheme meta tag
  let metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  if (!metaColorScheme) {
    metaColorScheme = document.createElement('meta');
    metaColorScheme.setAttribute('name', 'color-scheme');
    document.head.appendChild(metaColorScheme);
  }
  metaColorScheme.setAttribute('content', theme);
}

/**
 * Initialize theme on app load
 * Should be called in layout or _app
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  const saved = getSavedTheme();
  const theme = saved || 'system';
  const resolved = getResolvedTheme(theme as ThemeMode);

  applyTheme(resolved);
}

/**
 * Listen to system theme changes
 */
export function listenToSystemThemeChanges(callback: (theme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);

  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
}

/**
 * Get theme colors for dynamic styling
 */
export const themeColors = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    muted: '#f5f5f5',
    mutedForeground: '#666666',
    border: '#e5e5e5',
    primary: '#2563eb',
  },
  dark: {
    background: '#0f0f0f',
    foreground: '#ffffff',
    muted: '#1a1a1a',
    mutedForeground: '#999999',
    border: '#333333',
    primary: '#3b82f6',
  },
};

/**
 * Get theme color based on current theme
 */
export function getThemeColor(key: keyof typeof themeColors['light'], theme?: 'light' | 'dark'): string {
  const currentTheme = theme || getSystemTheme();
  return themeColors[currentTheme][key];
}
