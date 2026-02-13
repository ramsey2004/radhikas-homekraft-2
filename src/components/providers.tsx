'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ReactNode, useState, useEffect } from 'react';
import RecentlyViewed from './RecentlyViewed';
import { initializeTheme } from '@/lib/theme';
import { registerServiceWorker } from '@/lib/pwa';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime)
            retry: 1,
          },
        },
      })
  );

  // Initialize theme and PWA on mount
  useEffect(() => {
    initializeTheme();
    registerServiceWorker('/sw.js').catch(err => console.warn('PWA registration failed:', err));
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ComparisonProvider>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
            <RecentlyViewed />
          </ComparisonProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
