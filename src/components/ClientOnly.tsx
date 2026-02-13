'use client';

import { useEffect, useState, ReactNode } from 'react';

/**
 * ClientOnly Wrapper Component
 * Delays rendering of component until client-side to prevent hydration mismatches
 * Useful for components that use conditional state or animations
 */

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default ClientOnly;
