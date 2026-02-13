export interface EnhancedTestimonial {
  id: string;
  author: string;
  role?: string;
  location?: string;
  productPurchased?: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string;
  verified: boolean;
  verified_purchase: boolean;
  helpful_count: number;
  avatar?: string;
  videoUrl?: string; // YouTube or Vimeo URL
  images?: string[]; // Product photos submitted by customer
  sentiment?: 'positive' | 'neutral'; // For moderation
  moderated?: boolean;
  featured?: boolean;
}

export const ENHANCED_TESTIMONIALS: EnhancedTestimonial[] = [
  {
    id: '1',
    author: 'Priya Sharma',
    role: 'Interior Designer',
    location: 'Delhi',
    productPurchased: 'Indigo Handwoven Bedsheet',
    rating: 5,
    comment: 'Absolutely stunning quality! The weave is impeccable and the color has remained vibrant even after multiple washes. I\'ve recommended these to all my clients.',
    date: '2 weeks ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 287,
    avatar: '👩',
    sentiment: 'positive',
    moderated: true,
    featured: true,
  },
  {
    id: '2',
    author: 'Raj Kumar',
    role: 'Hotel Manager',
    location: 'Mumbai',
    productPurchased: 'Organic Cotton Pillow Covers (Bulk)',
    rating: 5,
    comment: 'Recently switched our hotel to these bedsheets. Guest satisfaction has skyrocketed! The durability is exceptional—they\'re holding up better than our previous premium suppliers.',
    date: '1 month ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 156,
    avatar: '👨',
    sentiment: 'positive',
    moderated: true,
    featured: true,
  },
  {
    id: '3',
    author: 'Anjali Desai',
    role: 'Yoga Instructor',
    location: 'Bangalore',
    productPurchased: 'Terracotta Wool Cushions',
    rating: 5,
    comment: 'Perfect for my studio! The natural colors create such a calm atmosphere. My students comment on the quality and authenticity. Worth every rupee!',
    date: '3 weeks ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 198,
    avatar: '👩‍🏫',
    sentiment: 'positive',
    moderated: true,
    featured: false,
  },
  {
    id: '4',
    author: 'Vikram Patel',
    role: 'Entrepreneur',
    location: 'Hyderabad',
    productPurchased: 'Sage Green Wall Hanging',
    rating: 4,
    comment: 'The colors are beautiful and the craftsmanship is evident. Slightly longer delivery than expected, but the product quality made up for it.',
    date: '1 month ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 93,
    avatar: '👨‍💼',
    sentiment: 'positive',
    moderated: true,
    featured: false,
  },
  {
    id: '5',
    author: 'Meera Singh',
    role: 'Fashion Blogger',
    location: 'Pune',
    productPurchased: 'Natural Fiber Throw Blanket',
    rating: 5,
    comment: 'I feature this in my home decor series regularly! The followers love the authentic aesthetic. This is quality that justifies the investment.',
    date: '2 weeks ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 412,
    avatar: '📸',
    images: ['🏠', '✨'],
    sentiment: 'positive',
    moderated: true,
    featured: true,
  },
  {
    id: '6',
    author: 'Arjun Gupta',
    location: 'Kolkata',
    productPurchased: 'Organic Cotton Bedsheet Set',
    rating: 5,
    comment: 'Best purchase ever! No more synthetic fabrics in my home. The bedsheets are incredibly soft and I sleep so much better. Highly recommended!',
    date: '3 weeks ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 267,
    avatar: '😴',
    sentiment: 'positive',
    moderated: true,
    featured: false,
  },
  {
    id: '7',
    author: 'Sneha Kapoor',
    role: 'Sustainable Fashion Advocate',
    location: 'Chennai',
    productPurchased: 'All-Natural Dye Cushion Collection',
    rating: 5,
    comment: 'Supporting real artisans while getting beautiful products. The natural dyes are so unique—no two pieces are identical. This is sustainable luxury!',
    date: '1 month ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 334,
    avatar: '🌿',
    sentiment: 'positive',
    moderated: true,
    featured: true,
  },
  {
    id: '8',
    author: 'Rohit Verma',
    location: 'Ahmedabad',
    productPurchased: 'Handwoven Rug',
    rating: 4,
    comment: 'Excellent quality and the rug adds so much character to my living room. Took a while to source locally but absolutely worth the wait.',
    date: '6 weeks ago',
    verified: true,
    verified_purchase: true,
    helpful_count: 145,
    avatar: '👨',
    sentiment: 'positive',
    moderated: true,
    featured: false,
  },
];

export interface TestimonialStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    five_star: number;
    four_star: number;
    three_star: number;
    two_star: number;
    one_star: number;
  };
  verified_purchases: number;
  verified_percentage: number;
  sentiment_positive: number;
}

export const TESTIMONIAL_STATS: TestimonialStats = {
  average_rating: 4.8,
  total_reviews: ENHANCED_TESTIMONIALS.length,
  rating_distribution: {
    five_star: 7,
    four_star: 1,
    three_star: 0,
    two_star: 0,
    one_star: 0,
  },
  verified_purchases: ENHANCED_TESTIMONIALS.filter(t => t.verified_purchase).length,
  verified_percentage: 100,
  sentiment_positive: ENHANCED_TESTIMONIALS.filter(t => t.sentiment === 'positive').length,
};
