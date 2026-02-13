export interface CustomerStory {
  id: string;
  slug: string;
  title: string;
  customerName: string;
  customerRole: string;
  customerLocation: string;
  story: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
  testimonial: string;
  category: string;
  featured: boolean;
  datePublished: string;
}

export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    id: 'story-1',
    slug: 'hotel-luxury-bedding-upgrade',
    title: 'How Luxury Hotel Chain Transformed Guest Experience',
    customerName: 'Rajesh Patel',
    customerRole: 'Operations Manager',
    customerLocation: 'Delhi',
    story: `Five-star hotel chain was using standard synthetic bedding that frequently required replacement and guest complaints about comfort were affecting ratings. They needed a sustainable, luxury alternative that would elevate their brand and reduce operational costs.

Radhika\'s Homecraft provided custom handwoven bedsheets in their brand colors. The transition happened smoothly with staff training on proper care. Within three months, guest satisfaction scores increased significantly.

The hotel now proudly advertises "authentic handwoven bedding" as a premium amenity, justifying their premium pricing tier.`,
    challenge: 'Standard synthetic bedding causing frequent guest complaints and high replacement costs',
    solution: 'Switched to custom handwoven organic cotton bedsheets with proper care training for housekeeping staff',
    results: [
      '+35% guest satisfaction scores',
      '45% reduction in bedding replacement costs',
      'Premium amenity positioning',
      '2-year durability per set vs 6-month synthetic',
    ],
    image: '🏨',
    testimonial: 'Our guests now comment specifically on the bedding quality. It\'s become a defining part of the luxury experience we offer.',
    category: 'Hospitality',
    featured: true,
    datePublished: '2026-01-15',
  },
  {
    id: 'story-2',
    slug: 'yoga-studio-meditation-space',
    title: 'Yoga Studio Creates Serene Meditation Haven',
    customerName: 'Priya Awasthi',
    customerRole: 'Yoga Studio Owner',
    customerLocation: 'Bangalore',
    story: `Running a successful yoga studio required creating authentic, calming spaces aligned with wellness values. Synthetic decor clashed with the peaceful atmosphere they wanted to cultivate.

They outfitted the entire studio with our handwoven cushions, wall hangings, and meditation mats. The natural aesthetic immediately enhanced the space and resonated strongly with their clientele who appreciated the authentic, sustainable approach.`,
    challenge: 'Synthetic decor undermining the authentic wellness message of the yoga studio',
    solution: 'Fully redesigned spaces with handwoven natural fiber products from Radhika\'s collection',
    results: [
      '+50% new client sign-ups',
      'Increased monthly revenue by ₹85,000',
      'Strong social media presence with Instagram-worthy spaces',
      'Testimonials emphasizing authentic wellness vibes',
    ],
    image: '🧘',
    testimonial: 'The handcrafted pieces make our space feel like a sanctuary. Clients tell us they can feel the difference.',
    category: 'Wellness',
    featured: true,
    datePublished: '2026-01-10',
  },
  {
    id: 'story-3',
    slug: 'corporate-gift-strategy',
    title: 'B2B Company Builds Brand Loyalty with Gifting',
    customerName: 'Vivek Kumar',
    customerRole: 'Corporate Relations Director',
    customerLocation: 'Mumbai',
    story: `A fast-growing tech company needed unique corporate gifts for their 500+ enterprise clients. Standard gifts weren't leaving lasting impressions.

They partnered with us to create custom-branded cushions and throws featuring their brand colors and logo. The personalized, handcrafted gifts created memorable brand touchpoints and significantly strengthened client relationships.`,
    challenge: 'Generic corporate gifts failing to create meaningful brand impressions',
    solution: 'Custom handwoven products with brand integration through color and subtle design elements',
    results: [
      '78% client retention improvement',
      'Positive feedback from 92% of gift recipients',
      '₹50,000 annual savings vs premium branded gifts',
      'Enhanced corporate brand perception',
    ],
    image: '🎁',
    testimonial: 'Our clients now request our gift items specifically. It shows them we value quality and sustainability.',
    category: 'Corporate',
    featured: false,
    datePublished: '2026-01-05',
  },
  {
    id: 'story-4',
    slug: 'eco-conscious-home-makeover',
    title: 'Family Transforms Home with Sustainable Interior Design',
    customerName: 'Arun Nair',
    customerRole: 'Sustainable Living Advocate',
    customerLocation: 'Kerala',
    story: `Young family committed to reducing their environmental footprint wanted to redesign their home using only sustainable materials and ethical brands.

Over six months, they gradually replaced synthetic furnishings with handwoven textiles. The transformation created a beautiful, non-toxic living space that their children grew up appreciating craftsmanship and sustainability.`,
    challenge: 'Creating beautiful, eco-friendly home without compromising style or budget',
    solution: 'Gradual replacement with thoughtfully chosen handwoven pieces for each room',
    results: [
      'Reduced household plastic/synthetic by 60%',
      'Healthier home environment for young children',
      'Educational opportunity teaching children about sustainability',
      'Community inspiration influencing 5+ neighbors',
    ],
    image: '🏡',
    testimonial: 'Every piece has a story, and our kids understand that real beauty comes from craftsmanship and care.',
    category: 'Residential',
    featured: false,
    datePublished: '2025-12-28',
  },
  {
    id: 'story-5',
    slug: 'startup-office-branding',
    title: 'Startup Creates Unique Office Identity with Handcrafted Decor',
    customerName: 'Neha Singh',
    customerRole: 'Co-founder',
    customerLocation: 'Hyderabad',
    story: `Early-stage startup wanted their office to reflect their values: creativity, craftsmanship, and social impact. Generic office furniture wouldn't communicate this culture.

They furnished their entire office with our handwoven products, creating an inspiring workspace that staff loved and impressed potential investors. The authentic aesthetic became part of their brand story.`,
    challenge: 'Creating distinctive office culture that attracts talent and impresses investors',
    solution: 'Thoughtful integration of handwoven products throughout office spaces',
    results: [
      '30% higher employee satisfaction scores',
      'Positive investor feedback on company values',
      'Unique brand narrative differentiating them from competitors',
      'Strong employer branding for recruiting top talent',
    ],
    image: '💼',
    testimonial: 'Investors comment on how our office reflects our values. It\'s become part of our pitch.',
    category: 'Corporate',
    featured: false,
    datePublished: '2025-12-20',
  },
];

export const STORY_CATEGORIES = ['Hospitality', 'Wellness', 'Corporate', 'Residential'];
