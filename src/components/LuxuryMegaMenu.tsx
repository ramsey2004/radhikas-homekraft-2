'use client';

import { useState, useEffect } from 'react';
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

interface MenuSection {
  title: string;
  links: SubLink[];
}

interface MegaMenuCategory {
  label: string;
  href: string;
  moodText: string;
  sections: MenuSection[];
  featuredImage?: string;
}

const MEGA_MENU_DATA: Record<string, MegaMenuCategory> = {
  'Bed & Linen': {
    label: 'Bed & Linen',
    href: '/collections/bedsheets',
    moodText: 'Elevated comfort rooted in craftsmanship.',
    sections: [
      {
        title: 'Shop By Category',
        links: [
          { label: 'Bed Sheet Sets', href: '/collections/bedsheets' },
          { label: 'Dohars & Quilts', href: '/collections/quilts' },
          { label: 'Cushion Covers', href: '/collections/cushions' },
          { label: 'Throws & Blankets', href: '/collections/throws' },
        ]
      },
      {
        title: 'Curated Edits',
        links: [
          { label: 'The Signature Bedroom', href: '/collections/signature-bedroom' },
          { label: 'Festive Linen', href: '/collections/festive-linen' },
          { label: 'Wedding Favourites', href: '/collections/wedding-favourites' },
          { label: 'Limited Editions', href: '/collections/limited-editions' },
        ]
      },
      {
        title: 'Explore',
        links: [
          { label: 'Styling Guide', href: '/guides/bedroom-styling' },
          { label: 'Care Instructions', href: '/guides/linen-care' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=600&fit=crop',
  },
  'Dining & Serving': {
    label: 'Dining & Serving',
    href: '/collections/ceramics',
    moodText: 'Designed for gatherings that linger.',
    sections: [
      {
        title: 'Shop By Category',
        links: [
          { label: 'Plates & Bowls', href: '/collections/plates-bowls' },
          { label: 'Dinner Sets', href: '/collections/dinner-sets' },
          { label: 'Serving Platters', href: '/collections/serving-platters' },
          { label: 'Table Runners & Mats', href: '/collections/table-linens' },
        ]
      },
      {
        title: 'Curated Edits',
        links: [
          { label: "The Host's Table", href: '/collections/hosts-table' },
          { label: 'Festive Dining', href: '/collections/festive-dining' },
          { label: 'Intimate Evenings', href: '/collections/intimate-evenings' },
          { label: 'Signature Ensembles', href: '/collections/signature-ensembles' },
        ]
      },
      {
        title: 'Explore',
        links: [
          { label: 'Table Styling Guide', href: '/guides/table-styling' },
          { label: 'Gifting Recommendations', href: '/guides/dining-gifts' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1615485925774-3e9f6c49a3db?w=400&h=600&fit=crop',
  },
  Drinkware: {
    label: 'Drinkware',
    href: '/collections/ceramics',
    moodText: 'Crafted for everyday rituals.',
    sections: [
      {
        title: 'Shop By Category',
        links: [
          { label: 'Mugs', href: '/collections/mugs' },
          { label: 'Tea Sets', href: '/collections/tea-sets' },
          { label: 'Glassware', href: '/collections/glasses' },
          { label: 'Beverage Sets', href: '/collections/beverage-sets' },
        ]
      },
      {
        title: 'Curated Edits',
        links: [
          { label: 'Morning Rituals', href: '/collections/morning-rituals' },
          { label: 'Evening Conversations', href: '/collections/evening-conversations' },
          { label: 'Gifting Picks', href: '/collections/drinkware-gifts' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=600&fit=crop',
  },
  'Decor & Lighting': {
    label: 'Decor & Lighting',
    href: '/collections/lamps',
    moodText: 'Thoughtful pieces for elevated spaces.',
    sections: [
      {
        title: 'Shop By Category',
        links: [
          { label: 'Table Lamps', href: '/collections/table-lamps' },
          { label: 'Floor Lamps', href: '/collections/floor-lamps' },
          { label: 'Wall Accents', href: '/collections/wall-accents' },
          { label: 'Rugs', href: '/collections/rugs' },
        ]
      },
      {
        title: 'Curated Edits',
        links: [
          { label: 'Statement Pieces', href: '/collections/statement-decor' },
          { label: 'Heritage Classics', href: '/collections/heritage-classics' },
          { label: 'New Arrivals', href: '/collections/decor-new' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=600&fit=crop',
  },
  Gifting: {
    label: 'Gifting',
    href: '/collections/gifting',
    moodText: 'Thoughtfully curated for every occasion.',
    sections: [
      {
        title: 'By Occasion',
        links: [
          { label: 'Wedding Gifting', href: '/collections/wedding-gifts' },
          { label: 'Housewarming', href: '/collections/housewarming' },
          { label: 'Festive Hampers', href: '/collections/festive-hampers' },
          { label: 'Corporate Gifting', href: '/collections/corporate-gifts' },
        ]
      },
      {
        title: 'Curated Sets',
        links: [
          { label: 'Bedroom Ensembles', href: '/collections/bedroom-gift-sets' },
          { label: 'Dining Collections', href: '/collections/dining-gift-sets' },
          { label: 'Custom Hampers', href: '/collections/custom-hampers' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=600&fit=crop',
  },
  B2B: {
    label: 'B2B',
    href: '/b2b',
    moodText: 'Partnerships built on craft and quality.',
    sections: [
      {
        title: 'Services',
        links: [
          { label: 'Bulk Orders', href: '/b2b/bulk-orders' },
          { label: 'Wedding Planners', href: '/b2b/wedding-planners' },
          { label: 'Interior Designers', href: '/b2b/interior-designers' },
          { label: 'Hospitality Partnerships', href: '/b2b/hospitality' },
          { label: 'Customisation Requests', href: '/b2b/customisation' },
        ]
      }
    ],
  },
  About: {
    label: 'About',
    href: '/about',
    moodText: 'Craft, tradition, and conscious design.',
    sections: [
      {
        title: 'Discover',
        links: [
          { label: 'Our Story', href: '/about#story' },
          { label: 'Craft & Artisans', href: '/about#artisans' },
          { label: 'Sustainability', href: '/about#sustainability' },
          { label: 'Press & Features', href: '/about#press' },
        ]
      }
    ],
  },
  'Visit Store': {
    label: 'Visit Store',
    href: '/visit-store',
    moodText: 'Experience our collections in person.',
    sections: [
      {
        title: 'Store Details',
        links: [
          { label: 'Jaipur Flagship', href: '/visit-store#jaipur' },
          { label: 'Store Gallery', href: '/visit-store#gallery' },
          { label: 'Timings & Directions', href: '/visit-store#directions' },
        ]
      }
    ],
  },
};

interface MegaMenuItemProps {
  category: MegaMenuCategory;
  isOpen: boolean;
  onClose: () => void;
}

function MegaMenuItem({ category, isOpen, onClose }: MegaMenuItemProps) {
  const hasImage = !!category.featuredImage;
  const gridCols = hasImage ? 'grid-cols-4' : 'grid-cols-3';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="fixed left-0 right-0 top-[80px] w-full shadow-2xl z-40 overflow-hidden"
          style={{ backgroundColor: COLORS.ivory }}
          onMouseLeave={onClose}
        >
          <div className="mx-auto max-w-7xl px-8 py-12">
            <div className={`grid ${gridCols} gap-12`}>
              {/* Column 1: Brand Mood Block */}
              <div className="border-r pr-8" style={{ borderColor: COLORS.gold }}>
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
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: COLORS.deepTeal }}
                  onClick={onClose}
                >
                  → Explore All
                </Link>
              </div>

              {/* Dynamic Sections */}
              {category.sections.map((section, index) => (
                <div 
                  key={section.title}
                  className={`${index < category.sections.length - 1 || hasImage ? 'border-r pr-8' : ''}`}
                  style={{ borderColor: COLORS.gold }}
                >
                  <h4 
                    className="text-xs uppercase tracking-widest mb-6 font-medium"
                    style={{ color: COLORS.charcoal }}
                  >
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((item) => (
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
              ))}

              {/* Featured Image Column (if exists) */}
              {hasImage && (
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={category.featuredImage!}
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

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
    setHoverTimeout(timeout);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-center gap-8">
        {/* Home Link (no dropdown) */}
        <Link
          href="/"
          className="text-xs font-normal tracking-widest uppercase text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
        </Link>

        {Object.values(MEGA_MENU_DATA).map((category) => {
          const hasDropdown = category.sections && category.sections.length > 0;
          
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
      </div>
    </div>
  );
}
