'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  deepTeal: '#1A7A6E',
  gold: '#C9A84C',
  ivory: '#FAF9F6',
  charcoal: '#2D2D2D',
};

interface SubLink {
  label: string;
  href: string;
}

interface MegaMenuCategory {
  label: string;
  href: string;
  moodText: string;
  shopByCategory: SubLink[];
  curatedEdits: SubLink[];
  featuredImage?: string;
}

const MEGA_MENU_DATA: Record<string, MegaMenuCategory> = {
  'Bed & Linen': {
    label: 'Bed & Linen',
    href: '/collections/bedsheets',
    moodText: 'Elevated comfort rooted in craftsmanship.',
    shopByCategory: [
      { label: 'Bed Sheet Sets', href: '/collections/bedsheets' },
      { label: 'Dohars & Quilts', href: '/collections/quilts' },
      { label: 'Cushion Covers', href: '/collections/cushions' },
      { label: 'Throws & Blankets', href: '/collections/throws' },
    ],
    curatedEdits: [
      { label: 'The Signature Bedroom', href: '/collections/signature-bedroom' },
      { label: 'Festive Linen', href: '/collections/festive-linen' },
      { label: 'Wedding Favourites', href: '/collections/wedding-favourites' },
      { label: 'Limited Editions', href: '/collections/limited-editions' },
    ],
    featuredImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=600&fit=crop',
  },
  'Dining & Serving': {
    label: 'Dining & Serving',
    href: '/collections/ceramics',
    moodText: 'Designed for gatherings that linger.',
    shopByCategory: [
      { label: 'Plates & Bowls', href: '/collections/plates-bowls' },
      { label: 'Dinner Sets', href: '/collections/dinner-sets' },
      { label: 'Serving Platters', href: '/collections/serving-platters' },
      { label: 'Table Runners & Mats', href: '/collections/table-linens' },
    ],
    curatedEdits: [
      { label: "The Host's Table", href: '/collections/hosts-table' },
      { label: 'Festive Dining', href: '/collections/festive-dining' },
      { label: 'Signature Ensembles', href: '/collections/signature-ensembles' },
      { label: 'Gifting Picks', href: '/collections/gifting-picks' },
    ],
    featuredImage: 'https://images.unsplash.com/photo-1615485925774-3e9f6c49a3db?w=400&h=600&fit=crop',
  },
  Drinkware: {
    label: 'Drinkware',
    href: '/collections/ceramics',
    moodText: 'Crafted for everyday rituals.',
    shopByCategory: [
      { label: 'Mugs & Cups', href: '/collections/mugs' },
      { label: 'Tea & Coffee Sets', href: '/collections/tea-sets' },
      { label: 'Glasses & Tumblers', href: '/collections/glasses' },
      { label: 'Water Bottles', href: '/collections/water-bottles' },
    ],
    curatedEdits: [
      { label: 'Morning Rituals', href: '/collections/morning-rituals' },
      { label: 'Tea Time Essentials', href: '/collections/tea-time' },
      { label: 'Gifting Selection', href: '/collections/drinkware-gifts' },
      { label: 'New Arrivals', href: '/collections/drinkware-new' },
    ],
    featuredImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=600&fit=crop',
  },
  'Decor & Lighting': {
    label: 'Decor & Lighting',
    href: '/collections/lamps',
    moodText: 'Thoughtful pieces for elevated spaces.',
    shopByCategory: [
      { label: 'Lamps', href: '/collections/lamps' },
      { label: 'Candle Holders', href: '/collections/candle-holders' },
      { label: 'Wall Art', href: '/collections/wall-art' },
      { label: 'Vases & Planters', href: '/collections/vases' },
    ],
    curatedEdits: [
      { label: 'Statement Pieces', href: '/collections/statement-decor' },
      { label: 'Ambient Lighting', href: '/collections/ambient-lighting' },
      { label: 'Artisan Collection', href: '/collections/artisan-decor' },
      { label: 'Seasonal Favorites', href: '/collections/seasonal-decor' },
    ],
    featuredImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=600&fit=crop',
  },
  Gifting: {
    label: 'Gifting',
    href: '/collections/gifting',
    moodText: 'Thoughtfully curated for every occasion.',
    shopByCategory: [
      { label: 'Gift Sets', href: '/collections/gift-sets' },
      { label: 'Wedding Gifts', href: '/collections/wedding-gifts' },
      { label: 'Corporate Gifting', href: '/collections/corporate-gifts' },
      { label: 'Festive Collection', href: '/collections/festive-gifts' },
    ],
    curatedEdits: [
      { label: 'Luxury Hampers', href: '/collections/luxury-hampers' },
      { label: 'Custom Gifts', href: '/collections/custom-gifts' },
      { label: 'Under ₹2000', href: '/collections/gifts-under-2000' },
      { label: 'Premium Selection', href: '/collections/premium-gifts' },
    ],
    featuredImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=600&fit=crop',
  },
};

interface MegaMenuItemProps {
  category: MegaMenuCategory;
  isOpen: boolean;
  onClose: () => void;
}

function MegaMenuItem({ category, isOpen, onClose }: MegaMenuItemProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="absolute left-0 right-0 top-full w-full shadow-2xl z-50"
          style={{ backgroundColor: COLORS.ivory }}
          onMouseLeave={onClose}
        >
          <div className="mx-auto max-w-7xl px-8 py-16">
            <div className="grid grid-cols-4 gap-12">
              {/* Column 1: Brand Mood Block */}
              <div className="border-r" style={{ borderColor: COLORS.gold }}>
                <h3 
                  className="text-3xl mb-3 font-serif"
                  style={{ color: COLORS.deepTeal }}
                >
                  {category.label}
                </h3>
                <p 
                  className="text-sm mb-6 leading-relaxed font-light"
                  style={{ color: COLORS.charcoal }}
                >
                  {category.moodText}
                </p>
                <Link
                  href={category.href}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: COLORS.deepTeal }}
                  onClick={onClose}
                >
                  → Explore All
                </Link>
              </div>

              {/* Column 2: Shop By Category */}
              <div className="border-r" style={{ borderColor: COLORS.gold }}>
                <h4 
                  className="text-xs uppercase tracking-widest mb-6 font-medium"
                  style={{ color: COLORS.charcoal }}
                >
                  Shop By Category
                </h4>
                <ul className="space-y-3">
                  {category.shopByCategory.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm transition-all duration-200 hover:translate-x-1 block"
                        style={{ color: COLORS.charcoal }}
                        onClick={onClose}
                      >
                        <span className="hover:pl-2 transition-all duration-200 inline-block">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Curated Edits */}
              <div className="border-r" style={{ borderColor: COLORS.gold }}>
                <h4 
                  className="text-xs uppercase tracking-widest mb-6 font-medium"
                  style={{ color: COLORS.charcoal }}
                >
                  Curated Edits
                </h4>
                <ul className="space-y-3">
                  {category.curatedEdits.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm transition-all duration-200 hover:translate-x-1 block"
                        style={{ color: COLORS.charcoal }}
                        onClick={onClose}
                      >
                        <span className="hover:pl-2 transition-all duration-200 inline-block">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Featured Image */}
              {category.featuredImage && (
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={category.featuredImage}
                    alt={category.label}
                    width={400}
                    height={600}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LuxuryMegaMenuProps {
  className?: string;
}

export function LuxuryMegaMenu({ className = '' }: LuxuryMegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  const menuCategories = Object.values(MEGA_MENU_DATA);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-center gap-8">
        {menuCategories.map((category) => {
          const hasDropdown = category.shopByCategory.length > 0;
          
          return (
            <div
              key={category.label}
              className="relative"
              onMouseEnter={() => hasDropdown && handleMouseEnter(category.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={category.href}
                className="text-xs font-normal tracking-widest uppercase text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group py-2 block"
              >
                {category.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
              </Link>

              {hasDropdown && (
                <MegaMenuItem
                  category={category}
                  isOpen={activeMenu === category.label}
                  onClose={() => setActiveMenu(null)}
                />
              )}
            </div>
          );
        })}

        {/* Additional Links without dropdown */}
        <Link
          href="/b2b"
          className="text-xs font-normal tracking-widest uppercase text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
        >
          B2B
          <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
        </Link>
      </div>
    </div>
  );
}
