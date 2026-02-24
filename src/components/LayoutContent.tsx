'use client';

import { CustomCursor } from '@/components/CustomCursor';
import { StickyCartButton } from '@/components/StickyCartButton';
import { ComparisonCounter } from '@/components/ComparisonButton';
import { ShoppingCart } from '@/components/ShoppingCart';
import { SearchModal } from '@/components/SearchModal';
// import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { Footer } from '@/components/layout/Footer';
import { useSearch } from '@/contexts/SearchContext';

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { isSearchOpen, setIsSearchOpen } = useSearch();

  return (
    <>
      <CustomCursor />
      <StickyCartButton />
      <ComparisonCounter />
      <ShoppingCart />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {/* Temporarily disabled - can be re-enabled after testing 
      <ExitIntentPopup
        discount={15}
        headline="Don't Leave Empty-Handed!"
        subheadline="Get 15% off your first order"
      />
      */}
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}