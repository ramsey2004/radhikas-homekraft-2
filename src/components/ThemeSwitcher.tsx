'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiMonitor } from 'react-icons/fi';
import { ThemeMode, saveThemePreference, getSavedTheme, getResolvedTheme, listenToSystemThemeChanges } from '@/lib/theme';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  position?: 'fixed' | 'absolute' | 'relative';
}

/**
 * ThemeSwitcher Component
 * Allows users to switch between light, dark, and system themes
 * Persists preference to localStorage
 */
export default function ThemeSwitcher({
  className = '',
  showLabel = true,
  position = 'relative',
}: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const saved = getSavedTheme() || 'system';
    setTheme(saved);
    setResolvedTheme(getResolvedTheme(saved));

    // Listen for system theme changes
    const unsubscribe = listenToSystemThemeChanges((newTheme) => {
      if (saved === 'system') {
        setResolvedTheme(newTheme);
      }
    });

    return unsubscribe;
  }, []);

  // Apply theme changes to document immediately
  useEffect(() => {
    if (!mounted) return;
    
    const resolved = getResolvedTheme(theme);
    const root = document.documentElement;
    
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveThemePreference(newTheme);
    setResolvedTheme(getResolvedTheme(newTheme));
  };

  // Placeholder while hydrating
  if (!mounted) {
    return (
      <div className={`${position === 'fixed' ? 'fixed' : position === 'absolute' ? 'absolute' : 'relative'} ${className}`}>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button className="p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" disabled aria-hidden="true" />
          <button className="p-2 rounded-md text-gray-600 dark:text-gray-400" disabled aria-hidden="true" />
          <button className="p-2 rounded-md text-gray-600 dark:text-gray-400" disabled aria-hidden="true" />
        </div>
      </div>
    );
  }

  const themes: Array<{ mode: ThemeMode; icon: React.ReactNode; label: string }> = [
    { mode: 'light', icon: <FiSun className="w-4 h-4" />, label: 'Light' },
    { mode: 'dark', icon: <FiMoon className="w-4 h-4" />, label: 'Dark' },
    { mode: 'system', icon: <FiMonitor className="w-4 h-4" />, label: 'System' },
  ];

  return (
    <motion.div
      className={`${position === 'fixed' ? 'fixed' : position === 'absolute' ? 'absolute' : 'relative'} ${className}`}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {themes.map(({ mode, icon, label }) => (
          <motion.button
            key={mode}
            onClick={() => handleThemeChange(mode)}
            title={`Switch to ${label} theme`}
            className={`relative p-2 rounded-md transition-colors ${
              theme === mode
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            suppressHydrationWarning
          >
            {theme === mode && (
              <motion.div
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md -z-10"
                layoutId="theme-indicator"
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              />
            )}
            {icon}
          </motion.button>
        ))}
      </div>

      {showLabel && (
        <motion.p
          className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {theme === 'system' ? `System (${resolvedTheme})` : theme}
        </motion.p>
      )}
    </motion.div>
  );
}
