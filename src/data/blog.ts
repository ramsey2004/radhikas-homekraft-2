export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  featured: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'caring-for-handwoven-bedsheets',
    title: 'Complete Guide to Caring for Handwoven Bedsheets',
    excerpt: 'Learn the best practices for maintaining your handwoven bedsheets to keep them soft, vibrant, and durable for years.',
    content: `Handwoven bedsheets are a beautiful investment in quality sleep and artisan craftsmanship. To ensure they last for years, proper care is essential.

## Washing Your Bedsheets

Always use cold water (30°C max) and a gentle detergent specifically designed for delicate fabrics. Avoid bleach and harsh chemicals that can damage the natural fibers and fade the colors.

## Drying Tips

Air drying is the best method to preserve your bedsheets. Hang them in a shaded area to prevent color fading from direct sunlight. If using a dryer, select the lowest heat setting.

## Storage

Store your clean bedsheets in a cool, dry place away from direct sunlight. Use breathable cotton storage bags instead of plastic to allow air circulation.

## Stain Removal

For best results, treat stains immediately with cold water and gentle rubbing. Avoid hot water, which can set stains permanently.

With proper care, your handwoven bedsheets will maintain their beauty and comfort for a lifetime.`,
    author: 'Priya Sharma',
    authorRole: 'Textile Care Expert',
    publishedAt: '2026-02-05',
    category: 'Product Care',
    tags: ['bedsheets', 'care', 'washing', 'maintenance'],
    image: '🧺',
    readTime: 5,
    featured: true,
  },
  {
    id: '2',
    slug: 'artisan-stories-behind-our-collections',
    title: 'Artisan Stories: Behind Our Collections',
    excerpt: 'Meet the skilled artisans who create our beautiful handcrafted products and learn about their techniques.',
    content: `Our products are made by talented artisans who have dedicated their lives to preserving traditional textile arts. Each piece tells a story of heritage, skill, and passion.

## The Weavers of Jaipur

The weavers in Jaipur use traditional handlooms to create intricate patterns. Many have learned their craft from parents and grandparents, preserving techniques that go back centuries.

## Natural Dyeing Process

We use only natural dyes extracted from plants, flowers, and minerals. This process is labor-intensive but creates unique, eco-friendly colors that improve with age.

## Sustainable Practices

All our artisans work in fair-trade conditions with competitive wages and health benefits. We're committed to supporting their communities through education and skill development programs.

## The Future of Artisanal Crafts

By choosing handcrafted products, you're not just getting a beautiful item—you're supporting a vital cultural tradition and providing livelihoods for artisan families.`,
    author: 'Raj Kumar',
    authorRole: 'Founder & Artisan Relations',
    publishedAt: '2026-02-01',
    category: 'Craftsmanship',
    tags: ['artisans', 'tradition', 'fair-trade', 'heritage'],
    image: '🎨',
    readTime: 7,
    featured: true,
  },
  {
    id: '3',
    slug: 'sustainable-living-with-natural-fiber-products',
    title: 'Sustainable Living: Natural Fiber Benefits',
    excerpt: 'Discover why natural fiber products are better for you and the environment.',
    content: `Natural fibers are the foundation of sustainable living. Our products are made from organic cotton, silk, and wool—all biodegradable and environmentally friendly.

## Health Benefits

Natural fibers are hypoallergenic and breathable, making them ideal for sensitive skin. They regulate temperature naturally, keeping you cool in summer and warm in winter.

## Environmental Impact

Unlike synthetic fibers, natural materials decompose within months. They require less water and chemicals to produce, and our dyes come from renewable plant sources.

## Durability

Quality natural fiber products last longer than synthetic alternatives. With proper care, your handcrafted items will be heirlooms for future generations.

## Make the Switch

Every purchase of a natural fiber product is a vote for a healthier planet and a more ethical fashion industry.`,
    author: 'Anjali Desai',
    authorRole: 'Sustainability Director',
    publishedAt: '2026-01-28',
    category: 'Sustainability',
    tags: ['eco-friendly', 'natural-fibers', 'sustainability', 'health'],
    image: '🌿',
    readTime: 6,
    featured: false,
  },
  {
    id: '4',
    slug: 'interior-design-tips-using-handcrafted-textiles',
    title: 'Interior Design Tips: Styling with Handcrafted Textiles',
    excerpt: 'Transform your home with beautiful handcrafted cushions, rugs, and wall hangings.',
    content: `Handcrafted textiles add warmth, character, and personality to any space. Here's how to style your home with our products.

## Layering Textures

Mix different textile weights and weaves to create visual interest. Combine smooth linens with textured cushions and patterned rugs for depth.

## Color Coordination

Choose a color palette based on your personal style. Our natural dyes create earthy tones that complement both modern and traditional interiors.

## Statement Pieces

Use a bold handwoven rug or wall hanging as your room's focal point. Build your design around this centerpiece for a cohesive look.

## Spacing and Balance

Don't overcrowd—leave breathing room for your textiles to shine. A few thoughtfully chosen pieces create more impact than many scattered items.

## Seasonal Updates

Refresh your home by rotating textiles seasonally. Swap lighter summer fabrics for cozy winter pieces to keep your space feeling new.`,
    author: 'Vikram Singh',
    authorRole: 'Interior Design Consultant',
    publishedAt: '2026-01-25',
    category: 'Design',
    tags: ['interior-design', 'home-decor', 'styling', 'textiles'],
    image: '🏠',
    readTime: 5,
    featured: false,
  },
  {
    id: '5',
    slug: 'seasonal-textile-trends-for-2026',
    title: 'Textile Trends 2026: What\'s Hot This Season',
    excerpt: 'Explore the latest trends in natural fiber fashion and home textiles.',
    content: `2026 brings exciting new trends in sustainable fashion and home design. Here's what's trending this season.

## Earth-Tone Palettes

Rich terracottas, warm sages, and natural ivories dominate this season. These versatile colors work with both traditional and contemporary styles.

## Textured Weaves

Chunky knits, slub cotton, and heavily textured weaves add tactile interest. The trend is moving away from smooth surfaces toward visible, handmade imperfections.

## Zero-Waste Design

Modular pieces that can be combined and reconfigured are gaining popularity. This approach reduces waste and allows for creative flexibility.

## Cultural Patterns

Traditional patterns from around the world are being celebrated. Indigenous designs and heritage motifs are featured prominently in collections.

## Comfort First

The wellness movement continues to influence textile choices. Natural, breathable fabrics that promote better sleep and health are increasingly popular.`,
    author: 'Priya Sharma',
    authorRole: 'Textile Trend Analyst',
    publishedAt: '2026-02-03',
    category: 'Trends',
    tags: ['trends', 'fashion', 'design', '2026'],
    image: '✨',
    readTime: 4,
    featured: false,
  },
];

export const BLOG_CATEGORIES = ['Product Care', 'Craftsmanship', 'Sustainability', 'Design', 'Trends'];
