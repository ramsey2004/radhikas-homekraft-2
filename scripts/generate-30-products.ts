/**
 * Rapid Product Generation from Existing Cloudinary Images
 * Creates 30 products using existing Cloudinary URLs (no new uploads needed)
 * This simulates a complete Cloudinary integration workflow
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Use existing Cloudinary image that's already available
const SAMPLE_IMAGE_URL = 'https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg';

interface ProductTemplate {
  name: string;
  description: string;
  shortDescription: string;
  material: string;
  basePrice: number;
  category: string;
}

const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    name: 'Handcrafted Ceramic Vase',
    description: 'A beautiful handmade ceramic vase perfect for fresh flowers or as a standalone decor piece. Crafted with premium clay and finished with a premium glaze.',
    shortDescription: 'Ceramic vase',
    material: 'Ceramic',
    basePrice: 1299,
    category: 'home-decor',
  },
  {
    name: 'Woven Decorative Basket',
    description: 'Traditionally woven basket made from natural fibers, ideal for storage or display. Each piece is unique and handmade.',
    shortDescription: 'Woven basket',
    material: 'Natural fibers',
    basePrice: 899,
    category: 'home-decor',
  },
  {
    name: 'Artisan Ceramic Plate',
    description: 'Hand-decorated ceramic plate featuring traditional Indian patterns and motifs. Perfect for display or functional use.',
    shortDescription: 'Ceramic plate',
    material: 'Ceramic',
    basePrice: 699,
    category: 'tableware',
  },
  {
    name: 'Hand-Painted Textile Art',
    description: 'Stunning hand-painted textile wall hanging showcasing unique artistic design. A perfect accent piece for any room.',
    shortDescription: 'Textile art',
    material: 'Fabric',
    basePrice: 1599,
    category: 'textiles',
  },
  {
    name: 'Wooden Craft Sculpture',
    description: 'Intricately carved wooden sculpture representing traditional craftsmanship. A fine art piece for collectors.',
    shortDescription: 'Wood sculpture',
    material: 'Wood',
    basePrice: 1199,
    category: 'sculptures',
  },
  {
    name: 'Decorative Brass Lamp',
    description: 'Vintage-style brass lamp with hand-etched details and warm ambient lighting. Adds elegance to any space.',
    shortDescription: 'Brass lamp',
    material: 'Brass',
    basePrice: 1499,
    category: 'lighting',
  },
  {
    name: 'Handwoven Cushion Cover',
    description: 'Soft and durable cushion cover with traditional weaving patterns. Reversible design for versatility.',
    shortDescription: 'Cushion cover',
    material: 'Fabric',
    basePrice: 599,
    category: 'textiles',
  },
  {
    name: 'Ceramic Tea Set',
    description: 'Traditional ceramic tea set with hand-painted designs, includes teapot and 4 cups. Perfect for tea enthusiasts.',
    shortDescription: 'Tea set',
    material: 'Ceramic',
    basePrice: 1899,
    category: 'tableware',
  },
  {
    name: 'Artisan Mirror Frame',
    description: 'Decorative mirror with hand-carved wooden frame and intricate detailing. A statement piece for your home.',
    shortDescription: 'Mirror frame',
    material: 'Wood',
    basePrice: 1399,
    category: 'home-decor',
  },
  {
    name: 'Hand-Painted Bowl Set',
    description: 'Set of 3 ceramic bowls with unique hand-painted designs. Each bowl is one-of-a-kind.',
    shortDescription: 'Bowl set',
    material: 'Ceramic',
    basePrice: 899,
    category: 'tableware',
  },
  {
    name: 'Natural Stone Coasters',
    description: 'Set of 4 natural stone coasters with elegant finish. Protects your furniture in style.',
    shortDescription: 'Stone coasters',
    material: 'Natural stone',
    basePrice: 449,
    category: 'home-decor',
  },
  {
    name: 'Silk Scarf with Prints',
    description: 'Premium silk scarf with artistic hand-printed patterns. Versatile accessory for any occasion.',
    shortDescription: 'Silk scarf',
    material: 'Silk',
    basePrice: 799,
    category: 'textiles',
  },
  {
    name: 'Clay Pot Planter',
    description: 'Traditional clay pot planter with hand-crafted details. Perfect for indoor or outdoor plants.',
    shortDescription: 'Clay planter',
    material: 'Clay',
    basePrice: 549,
    category: 'home-decor',
  },
  {
    name: 'Carved Wooden Box',
    description: 'Beautifully carved wooden storage box with intricate patterns. Great for jewelry or keepsakes.',
    shortDescription: 'Wooden box',
    material: 'Wood',
    basePrice: 899,
    category: 'sculptures',
  },
  {
    name: 'Metal Wall Art',
    description: 'Contemporary metal wall sculpture creating visual interest. Modern yet traditional aesthetic.',
    shortDescription: 'Wall art',
    material: 'Metal',
    basePrice: 1299,
    category: 'home-decor',
  },
  {
    name: 'Ceramic Wall Tiles',
    description: 'Set of 6 decorative ceramic tiles with traditional patterns. Ideal for creating feature walls.',
    shortDescription: 'Wall tiles',
    material: 'Ceramic',
    basePrice: 1199,
    category: 'tableware',
  },
  {
    name: 'Hand-Dyed Throw Pillow',
    description: 'Comfortable throw pillow with hand-dyed fabric and traditional patterns. Adds warmth to any room.',
    shortDescription: 'Throw pillow',
    material: 'Fabric',
    basePrice: 699,
    category: 'textiles',
  },
  {
    name: 'Brass Incense Holder',
    description: 'Elegant brass incense holder with intricate designs. Perfect for aromatherapy and home decoration.',
    shortDescription: 'Incense holder',
    material: 'Brass',
    basePrice: 449,
    category: 'lighting',
  },
  {
    name: 'Ceramic Votive Candle Holder',
    description: 'Decorative ceramic holder for votive candles. Creates ambient lighting in any space.',
    shortDescription: 'Candle holder',
    material: 'Ceramic',
    basePrice: 399,
    category: 'tableware',
  },
  {
    name: 'Woven Wall Hanging',
    description: 'Large decorative wall hanging made from hand-woven natural materials. A focal point for any wall.',
    shortDescription: 'Wall hanging',
    material: 'Natural fibers',
    basePrice: 1399,
    category: 'textiles',
  },
  {
    name: 'Pottery Dinner Plate',
    description: 'Handmade earthenware dinner plate with rustic charm. Food-safe and oven-friendly.',
    shortDescription: 'Dinner plate',
    material: 'Earthenware',
    basePrice: 599,
    category: 'tableware',
  },
  {
    name: 'Carved Wooden Door Frame',
    description: 'Intricately carved wooden frame suitable for doors or as wall decoration. A traditional statement piece.',
    shortDescription: 'Door frame',
    material: 'Wood',
    basePrice: 2299,
    category: 'sculptures',
  },
  {
    name: 'Glass and Metal Candelabra',
    description: 'Contemporary candelabra combining glass and metal elements. Perfect for formal dining.',
    shortDescription: 'Candelabra',
    material: 'Glass & Metal',
    basePrice: 1599,
    category: 'lighting',
  },
  {
    name: 'Hand-Embroidered Cushion',
    description: 'Luxurious cushion with intricate hand embroidery. A premium addition to any sofa.',
    shortDescription: 'Embroidered cushion',
    material: 'Fabric',
    basePrice: 1099,
    category: 'textiles',
  },
  {
    name: 'Ceramic Fruit Bowl',
    description: 'Handmade ceramic bowl perfect for serving fruits or as a decorative centerpiece.',
    shortDescription: 'Fruit bowl',
    material: 'Ceramic',
    basePrice: 749,
    category: 'tableware',
  },
  {
    name: 'Natural Fiber Floor Mat',
    description: 'Durable floor mat made from natural fibers. Eco-friendly and stylish for any entryway.',
    shortDescription: 'Floor mat',
    material: 'Natural fibers',
    basePrice: 899,
    category: 'home-decor',
  },
  {
    name: 'Brass Prayer Bell',
    description: 'Traditional brass prayer bell with melodious sound. Used in meditation and spiritual practices.',
    shortDescription: 'Prayer bell',
    material: 'Brass',
    basePrice: 449,
    category: 'lighting',
  },
  {
    name: 'Painted Wooden Tray',
    description: 'Hand-painted decorative tray with traditional motifs. Functional art for serving or display.',
    shortDescription: 'Painted tray',
    material: 'Wood',
    basePrice: 649,
    category: 'home-decor',
  },
  {
    name: 'Ceramic Soap Dish',
    description: 'Decorative ceramic soap dish adding elegance to your bathroom. Handcrafted with care.',
    shortDescription: 'Soap dish',
    material: 'Ceramic',
    basePrice: 349,
    category: 'tableware',
  },
  {
    name: 'Kilim Floor Cushion',
    description: 'Large floor cushion with traditional kilim pattern. Perfect for seating or as a decorative element.',
    shortDescription: 'Floor cushion',
    material: 'Fabric',
    basePrice: 1299,
    category: 'textiles',
  },
];

/**
 * Get or create product categories
 */
async function setupCategories() {
  const categoryData = [
    { name: 'Home Decor', slug: 'home-decor', description: 'Beautiful decorative items for your home' },
    { name: 'Tableware', slug: 'tableware', description: 'Elegant dinnerware and table accessories' },
    { name: 'Textiles', slug: 'textiles', description: 'Traditional woven and embroidered fabrics' },
    { name: 'Lighting', slug: 'lighting', description: 'Decorative lamps and lighting fixtures' },
    { name: 'Sculptures', slug: 'sculptures', description: 'Carved and crafted sculptures' },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
        },
      })
    )
  );

  return categories;
}

/**
 * Create products from templates
 */
async function createProducts(categories: any[]) {
  const categoryMap: { [key: string]: any } = {};
  categories.forEach((cat) => {
    categoryMap[cat.slug] = cat;
  });

  console.log('\n🏪 Creating 30 products...\n');

  const createdProducts = [];

  for (let i = 0; i < PRODUCT_TEMPLATES.length; i++) {
    const template = PRODUCT_TEMPLATES[i];
    const category = categoryMap[template.category];
    const priceVariation = Math.floor(Math.random() * 400) - 200; // ±200 price variation
    const actualPrice = Math.max(template.basePrice + priceVariation, 299);

    const product = {
      name: `${template.name} - Piece ${i + 1}`,
      slug: `${template.shortDescription.toLowerCase().replace(/\s+/g, '-')}-${i + 1}-${Date.now()}`,
      description: template.description,
      shortDescription: template.shortDescription,
      price: actualPrice,
      maxPrice: actualPrice + Math.floor(Math.random() * 300) + 100, // Changed from originalPrice to maxPrice
      material: template.material,
      sku: `SKU-HMK-${Date.now()}-${String(i + 1).padStart(2, '0')}`,
      inventory: Math.floor(Math.random() * 25) + 5,
      thumbnail: SAMPLE_IMAGE_URL,
      images: [SAMPLE_IMAGE_URL],
      categoryId: category.id,
      isFeatured: i < 6, // First 6 are featured
      isActive: true,
    };

    try {
      const created = await prisma.product.create({
        data: product as any,
      });

      createdProducts.push(created);
      console.log(`✅ [${i + 1}/30] ${product.name}`);
      console.log(`   Price: ₹${actualPrice} | Category: ${category.name}`);
      console.log(`   Inventory: ${product.inventory} units\n`);
    } catch (error) {
      console.error(`❌ Failed to create product "${product.name}":`, error);
    }
  }

  return createdProducts;
}

/**
 * Generate report
 */
async function generateReport(createdProducts: number) {
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();

  const report = {
    timestamp: new Date().toISOString(),
    productsCreated: createdProducts,
    totalProducts,
    totalCategories,
    imageSource: SAMPLE_IMAGE_URL,
    status: 'complete',
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 PRODUCT GENERATION REPORT');
  console.log('='.repeat(60));
  console.log(`Created Products:    ${createdProducts}`);
  console.log(`Total Products DB:   ${totalProducts}`);
  console.log(`Total Categories:    ${totalCategories}`);
  console.log(`Image Source:        Cloudinary`);
  console.log(`Status:              ${report.status}`);
  console.log('='.repeat(60));
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║      🎨 CLOUDINARY PRODUCT GENERATION                  ║');
    console.log('║      Creating 30 Products with Cloudinary Images        ║');
    console.log('╚════════════════════════════════════════════════════════╝');

    // Setup categories
    console.log('\n📁 Setting up 5 product categories...');
    const categories = await setupCategories();
    console.log(`✅ Categories ready: ${categories.map((c) => c.name).join(', ')}`);

    // Create products
    const createdProducts = await createProducts(categories);

    // Generate report
    await generateReport(createdProducts.length);

    console.log('\n✨ Cloudinary integration complete!');
    console.log('📺 Your products are ready to be browsed at: localhost:3000/products');
    console.log('\n🎉 Next steps:');
    console.log('   1. Run "npm run dev" to start the development server');
    console.log('   2. Visit http://localhost:3000/products to see all products');
    console.log('   3. Check admin panel for product management');
    console.log('   4. Setup payment and shipping configuration\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Product generation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
