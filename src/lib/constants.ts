// Store information
export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Radhika's Homecraft";
export const STORE_TAGLINE =
  process.env.NEXT_PUBLIC_STORE_TAGLINE ||
  'Artistry Unleashed - Experience the soul of tradition woven into every print';
export const STORE_DESCRIPTION =
  'Radhika\'s Homecraft is an authentic Indian handicrafts and home decor store featuring handcrafted textiles, block print bedsheets, rugs, and traditional home decor items from Jaipur, Rajasthan.';
export const STORE_EMAIL = 'radhikashomekraft.in';
export const STORE_PHONE = '+91-9829-316066';
export const STORE_ADDRESS = '11-B Purohit Ji Ka Bagh, Gopinath Marg, MI Road, Jaipur, Rajasthan 302001, India';

// Social links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/radhikashomecraft',
  instagram: 'https://instagram.com/radhikashomecraft',
  twitter: 'https://twitter.com/radhikascraft',
  youtube: 'https://youtube.com/@radhikashomecraft',
  whatsapp: 'https://wa.me/919829316066',
};

// Currency settings
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';
export const COUNTRY = 'India';

// Pagination
export const PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// Product constants
export const PRODUCT_STATUS = ['active', 'inactive', 'archived'] as const;
export const PRODUCT_SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Popularity', value: 'popular' },
] as const;

// Order constants
export const SHIPPING_COST = 100; // Free shipping above 2000
export const FREE_SHIPPING_THRESHOLD = 2000;
export const TAX_RATE = 0.18; // 18% GST

// Order statuses
export const ORDER_STATUSES = {
  PENDING: { label: 'Pending', color: 'yellow' },
  CONFIRMED: { label: 'Confirmed', color: 'blue' },
  PROCESSING: { label: 'Processing', color: 'blue' },
  SHIPPED: { label: 'Shipped', color: 'purple' },
  DELIVERED: { label: 'Delivered', color: 'green' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  RETURNED: { label: 'Returned', color: 'orange' },
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: { label: 'Pending', color: 'yellow' },
  COMPLETED: { label: 'Completed', color: 'green' },
  FAILED: { label: 'Failed', color: 'red' },
  REFUNDED: { label: 'Refunded', color: 'orange' },
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  RAZORPAY: 'Razorpay (UPI, Cards, Net Banking)',
  STRIPE: 'Stripe (Cards)',
  COD: 'Cash on Delivery',
} as const;

// File upload constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_WEAK: 'Password must contain uppercase, lowercase, number and be at least 8 characters',
  PASSWORDS_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: 'Minimum length is',
  MAX_LENGTH: 'Maximum length is',
};

// Error messages
export const ERROR_MESSAGES = {
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access forbidden.',
  INVALID_REQUEST: 'Invalid request.',
  DUPLICATE_EMAIL: 'An account with this email already exists.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully! Please log in.',
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ADDRESS_ADDED: 'Address added successfully!',
  ADDRESS_UPDATED: 'Address updated successfully!',
  ADDRESS_DELETED: 'Address deleted successfully!',
  PRODUCT_ADDED: 'Product added to cart!',
  PRODUCT_REMOVED: 'Product removed from cart!',
  WISHLIST_ADDED: 'Added to wishlist!',
  WISHLIST_REMOVED: 'Removed from wishlist!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  EMAIL_SENT: 'Email sent successfully!',
};

// Routes
export const ROUTES = {
  HOME: '/',
  SHOP: '/products',
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: (token: string) => `/reset-password?token=${token}`,
  DASHBOARD: '/dashboard',
  ORDERS: '/dashboard/orders',
  ORDER_DETAIL: (id: string) => `/dashboard/orders/${id}`,
  ADDRESSES: '/dashboard/addresses',
  PROFILE: '/dashboard/profile',
  WISHLIST: '/wishlist',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  FAQ: '/faq',
  STORIES: '/stories',
  STORY: (slug: string) => `/stories/${slug}`,
  TESTIMONIALS: '/testimonials',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_DISCOUNTS: '/admin/discounts',
};

// Contact form fields
export const CONTACT_SUBJECTS = [
  'General Inquiry',
  'Product Question',
  'Order Issue',
  'Return/Exchange',
  'Partnership',
  'Other',
];

// Review rating labels
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

// Blog categories
export const BLOG_CATEGORIES = [
  { label: 'Craft Stories', value: 'craft-stories' },
  { label: 'Interior Design', value: 'interior-design' },
  { label: 'Artisan Spotlight', value: 'artisan-spotlight' },
  { label: 'Care & Maintenance', value: 'care-maintenance' },
  { label: 'Latest Trends', value: 'latest-trends' },
];

// Product filters
export const COLORS = [
  'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Gold',
];

export const MATERIALS = [
  '100% Cotton',
  '100% Silk',
  'Cotton-Silk Blend',
  'Wool',
  'Linen',
  'Jute',
  'Polyester',
  'Mixed Fibers',
];

// SEO defaults
export const SEO_DEFAULTS = {
  title: `${STORE_NAME} - ${STORE_TAGLINE}`,
  description: STORE_DESCRIPTION,
  keywords: [
    'Indian handicrafts',
    'block print',
    'textiles',
    'home decor',
    'Jaipur',
    'artisan',
    'bedsheets',
    'rugs',
  ],
  og: {
    type: 'website',
  },
};

// Feature flags
export const FEATURES = {
  MULTI_LANGUAGE: false, // Enable multi-language support
  LOYALTY_POINTS: false, // Enable loyalty points system
  LIVE_CHAT: true, // Enable live chat
  BLOG: true, // Enable blog section
  REVIEWS: true, // Enable product reviews
  WISHLIST: true, // Enable wishlist
  GOOGLE_ADS: false, // Enable Google Ads
  ANALYTICS: true, // Enable Google Analytics
};

// API timeout
export const API_TIMEOUT = 30000; // 30 seconds

// Session timeout
export const SESSION_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds

// Image optimization
export const IMAGE_SIZES = {
  THUMBNAIL: 300,
  SMALL: 500,
  MEDIUM: 800,
  LARGE: 1200,
  HERO: 1920,
};
