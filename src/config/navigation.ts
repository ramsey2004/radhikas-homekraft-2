/**
 * Navigation Categories & Structure
 * Based on lagavi.com reference with proper product categorization
 */

export const NAVIGATION_CATEGORIES = {
  HOME: {
    label: 'Home',
    href: '/',
    subcategories: []
  },
  BED_LINEN: {
    label: 'Bed & Linen',
    href: '/collections/bed-linen',
    subcategories: [
      { label: 'Bedsheets', href: '/collections/bedsheets' },
      { label: 'Duvet Covers', href: '/collections/duvet-covers' },
      { label: 'Pillow Covers', href: '/collections/pillow-covers' },
      { label: 'Quilts & Comforters', href: '/collections/quilts' },
      { label: 'Bed Runners', href: '/collections/bed-runners' },
    ]
  },
  DINING_SERVING: {
    label: 'Dining & Serving',
    href: '/collections/dining-serving',
    subcategories: [
      { label: 'Table Linens', href: '/collections/table-linens' },
      { label: 'Placemats', href: '/collections/placemats' },
      { label: 'Napkins', href: '/collections/napkins' },
      { label: 'Table Runners', href: '/collections/table-runners' },
      { label: 'Serving Sets', href: '/collections/serving-sets' },
    ]
  },
  DRINKWARE: {
    label: 'Drinkware',
    href: '/collections/drinkware',
    subcategories: [
      { label: 'Mugs', href: '/collections/mugs' },
      { label: 'Glasses', href: '/collections/glasses' },
      { label: 'Cups & Saucers', href: '/collections/cups-saucers' },
      { label: 'Water Bottles', href: '/collections/water-bottles' },
      { label: 'Tea Sets', href: '/collections/tea-sets' },
    ]
  },
  DECOR_LIGHTING: {
    label: 'Decor & Lighting',
    href: '/collections/decor-lighting',
    subcategories: [
      { label: 'Lamps', href: '/collections/lamps' },
      { label: 'Candle Holders', href: '/collections/candle-holders' },
      { label: 'Wall Art', href: '/collections/wall-art' },
      { label: 'Vases', href: '/collections/vases' },
      { label: 'Mirrors', href: '/collections/mirrors' },
      { label: 'Cushions', href: '/collections/cushions' },
    ]
  },
  GIFTING: {
    label: 'Gifting',
    href: '/collections/gifting',
    subcategories: [
      { label: 'Gift Sets', href: '/collections/gift-sets' },
      { label: 'Corporate Gifts', href: '/collections/corporate-gifts' },
      { label: 'Festive Collection', href: '/collections/festive' },
      { label: 'Wedding Gifts', href: '/collections/wedding-gifts' },
    ]
  },
  B2B: {
    label: 'B2B',
    href: '/b2b',
    subcategories: [
      { label: 'Bulk Orders', href: '/b2b/bulk-orders' },
      { label: 'Custom Products', href: '/b2b/custom' },
      { label: 'Hotel & Restaurant', href: '/b2b/hospitality' },
      { label: 'Corporate Solutions', href: '/b2b/corporate' },
    ]
  },
  ABOUT: {
    label: 'About',
    href: '/about',
    subcategories: [
      { label: 'Our Story', href: '/about#story' },
      { label: 'Our Artisans', href: '/about#artisans' },
      { label: 'Sustainability', href: '/about#sustainability' },
    ]
  },
  VISIT_STORE: {
    label: 'Visit Store',
    href: '/visit-store',
    subcategories: [
      { label: 'Store Locations', href: '/visit-store#locations' },
      { label: 'Book Appointment', href: '/visit-store/book' },
      { label: 'Store Events', href: '/visit-store#events' },
    ]
  }
};

/**
 * Product Page Requirements Checklist
 * Must include all these elements for every product
 */
export const PRODUCT_PAGE_REQUIREMENTS = {
  images: {
    required: true,
    order: [
      'Lifestyle image first',
      'Detail close-up second',
      'Additional views'
    ],
    minCount: 2
  },
  details: {
    fabricMaterial: {
      required: true,
      label: 'Fabric/Material Explanation',
      description: 'Detailed explanation of materials used, weaving technique, origin'
    },
    sizeInfo: {
      required: true,
      label: 'Size Information',
      description: 'Dimensions, weight, available sizes'
    },
    careInstructions: {
      required: true,
      label: 'Care Instructions',
      description: 'How to wash, maintain, and store the product'
    },
    deliveryTimeline: {
      required: true,
      label: 'Delivery Timeline',
      description: 'Estimated delivery time, dispatch information'
    },
    codReturns: {
      required: true,
      label: 'COD + Returns',
      description: 'Cash on Delivery availability and Returns policy clearly mentioned'
    }
  },
  prominentElements: [
    'COD availability badge',
    'Returns policy badge',
    'Delivery timeline',
    'Price with discounts',
    'Stock status'
  ]
};

/**
 * Sample Product Data Structure
 * Following lagavi.com reference
 */
export const PRODUCT_STRUCTURE_EXAMPLE = {
  id: 1,
  name: 'Hand Block Print Bedsheet Set',
  slug: 'hand-block-print-bedsheet-set',
  price: '₹2,570',
  originalPrice: '₹3,200',
  category: 'bed-linen',
  subcategory: 'bedsheets',
  
  // Images - Lifestyle first, then details
  images: [
    '/products/bedsheet-lifestyle.jpg',     // Lifestyle shot
    '/products/bedsheet-detail-1.jpg',      // Close-up of fabric
    '/products/bedsheet-detail-2.jpg',      // Pattern detail
    '/products/bedsheet-room-view.jpg'      // In-room usage
  ],
  
  description: 'Premium hand block printed bedsheet featuring traditional Rajasthani motifs',
  
  // Required details
  material: '100% Pure Cotton',
  fabricDetails: 'Hand block printed with natural vegetable dyes on 200 TC pure cotton fabric. The traditional Sanganeri printing technique has been used by our artisans in Jaipur.',
  care: 'Machine wash cold with like colors. Use mild detergent. Tumble dry low. Iron on medium heat if needed.',
  dimensions: 'King Size: 108" x 108" (274cm x 274cm) | Includes 2 pillow covers: 18" x 28"',
  weight: '1.2 kg',
  
  // Delivery & Payment info - Must be prominent
  delivery: 'Ships within 2-3 business days. Delivery in 5-7 days.',
  cod: true,
  returns: 'Easy returns within 30 days of delivery. No questions asked.',
  
  // Additional info
  inStock: true,
  artisan: 'Ramesh Meghwal',
  origin: 'Jaipur, Rajasthan',
  
  // Reviews
  reviews: [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Beautiful craftsmanship! The colors are vibrant.',
      date: '2024-02-15'
    }
  ]
};

export default NAVIGATION_CATEGORIES;
