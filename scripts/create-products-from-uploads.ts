/**
 * Create Products from Cloudinary Images
 * Creates product records with uploaded images from Cloudinary
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1';
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dk1ovmxuj';
const API_KEY = process.env.CLOUDINARY_API_KEY || '622255681518141';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'oJDof5Zje1pD5OQ0O5VRb2tkK0k';

// Sample product names and descriptions
const PRODUCT_TEMPLATES = [
  {
    name: 'Handcrafted Ceramic Vase',
    description: 'A beautiful handmade ceramic vase perfect for fresh flowers or as a standalone decor piece.',
    shortDescription: 'Ceramic vase',
    material: 'Ceramic',
    price: 1299,
  },
  {
    name: 'Woven Decorative Basket',
    description: 'Traditionally woven basket made from natural fibers, ideal for storage or display.',
    shortDescription: 'Woven basket',
    material: 'Natural fibers',
    price: 899,
  },
  {
    name: 'Artisan Ceramic Plate',
    description: 'Hand-decorated ceramic plate featuring traditional Indian patterns and motifs.',
    shortDescription: 'Ceramic plate',
    material: 'Ceramic',
    price: 699,
  },
  {
    name: 'Hand-Painted Textile Art',
    description: 'Stunning hand-painted textile wall hanging showcasing unique artistic design.',
    shortDescription: 'Textile art',
    material: 'Fabric',
    price: 1599,
  },
  {
    name: 'Wooden Craft Sculpture',
    description: 'Intricately carved wooden sculpture representing traditional craftsmanship.',
    shortDescription: 'Wood sculpture',
    material: 'Wood',
    price: 1199,
  },
  {
    name: 'Decorative Brass Lamp',
    description: 'Vintage-style brass lamp with hand-etched details and warm ambient lighting.',
    shortDescription: 'Brass lamp',
    material: 'Brass',
    price: 1499,
  },
  {
    name: 'Handwoven Cushion Cover',
    description: 'Soft and durable cushion cover with traditional weaving patterns.',
    shortDescription: 'Cushion cover',
    material: 'Fabric',
    price: 599,
  },
  {
    name: 'Ceramic Tea Set',
    description: 'Traditional ceramic tea set with hand-painted designs, includes teapot and 4 cups.',
    shortDescription: 'Tea set',
    material: 'Ceramic',
    price: 1899,
  },
  {
    name: 'Artisan Mirror Frame',
    description: 'Decorative mirror with hand-carved wooden frame and intricate detailing.',
    shortDescription: 'Mirror frame',
    material: 'Wood',
    price: 1399,
  },
  {
    name: 'Hand-Painted Bowl Set',
    description: 'Set of 3 ceramic bowls with unique hand-painted designs.',
    shortDescription: 'Bowl set',
    material: 'Ceramic',
    price: 899,
  },
];

interface CloudinaryUploadedImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

/**
 * Fetch uploaded images from Cloudinary
 */
async function fetchUploadedImages(): Promise<CloudinaryUploadedImage[]> {
  try {
    console.log('📥 Fetching uploaded images from Cloudinary...');

    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

    const response = await axios.get(
      `${CLOUDINARY_API}/${CLOUD_NAME}/resources/search?expression=tags:"batch-upload"&max_results=30`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        timeout: 30000,
      }
    );

    const images = response.data.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      width: resource.width,
      height: resource.height,
    }));

    console.log(`✅ Found ${images.length} uploaded images`);
    return images;
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return [];
  }
}

/**
 * Get or create categories
 */
async function getOrCreateCategories() {
  try {
    console.log('\n📁 Setting up categories...');

    const categoryNames = [
      { name: 'Home Decor', slug: 'home-decor' },
      { name: 'Tableware', slug: 'tableware' },
      { name: 'Textiles', slug: 'textiles' },
      { name: 'Lighting', slug: 'lighting' },
      { name: 'Sculptures', slug: 'sculptures' },
    ];

    const categories = await Promise.all(
      categoryNames.map((cat) =>
        prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: {
            name: cat.name,
            slug: cat.slug,
            description: `Our collection of ${cat.name.toLowerCase()}`,
          },
        })
      )
    );

    console.log(`✅ Setup ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('Failed to setup categories:', error);
    throw error;
  }
}

/**
 * Create products from images
 */
async function createProductsFromImages(
  images: CloudinaryUploadedImage[],
  categories: any[]
) {
  try {
    console.log(
      `\n🏪 Creating products from ${images.length} images...\n`
    );

    const createdProducts = [];

    for (let i = 0; i < Math.min(images.length, PRODUCT_TEMPLATES.length); i++) {
      const image = images[i];
      const template = PRODUCT_TEMPLATES[i];
      const categoryIndex = i % categories.length;

      const product = {
        name: `${template.name} #${i + 1}`,
        slug: `${template.shortDescription.toLowerCase().replace(/\s+/g, '-')}-${i + 1}-${Date.now()}`,
        description: template.description,
        shortDescription: template.shortDescription,
        price: template.price,
        originalPrice: template.price + Math.floor(Math.random() * 500),
        material: template.material,
        sku: `SKU-${Date.now()}-${i + 1}`,
        inventory: Math.floor(Math.random() * 20) + 5,
        thumbnail: image.secure_url,
        images: [image.secure_url],
        categoryId: categories[categoryIndex].id,
        isFeatured: i < 5, // First 5 are featured
        isActive: true,
        rating: (Math.random() * 2 + 3.5).toFixed(1), // 3.5-5.5
        reviewCount: Math.floor(Math.random() * 50) + 10,
      };

      try {
        const created = await prisma.product.create({
          data: product as any,
        });

        createdProducts.push(created);
        console.log(`✅ Created: ${product.name}`);
        console.log(`   Image: ${image.secure_url}`);
        console.log(`   Category: ${categories[categoryIndex].name}\n`);
      } catch (error) {
        console.error(`❌ Failed to create product "${product.name}":`, error);
      }
    }

    return createdProducts;
  } catch (error) {
    console.error('Failed to create products:', error);
    throw error;
  }
}

/**
 * Generate report
 */
async function generateReport(
  uploadedImages: number,
  createdProducts: number
) {
  const report = {
    timestamp: new Date().toISOString(),
    uploadedImages,
    createdProducts,
    productCount: await prisma.product.count(),
    categoryCount: await prisma.category.count(),
    status: 'complete',
  };

  const reportPath = path.join(
    process.cwd(),
    'data',
    `product-creation-report-${new Date().toISOString().split('T')[0]}.json`
  );

  await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 PRODUCT CREATION REPORT');
  console.log('='.repeat(60));
  console.log(`Uploaded Images:     ${uploadedImages}`);
  console.log(`Created Products:    ${createdProducts}`);
  console.log(`Total Products:      ${report.productCount}`);
  console.log(`Total Categories:    ${report.categoryCount}`);
  console.log(`Status:              ${report.status}`);
  console.log('='.repeat(60));
  console.log(`\n📄 Report saved to: ${reportPath}\n`);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('\n🎨 Cloudinary Product Creation');
    console.log('==============================\n');

    // Fetch images from Cloudinary
    const uploadedImages = await fetchUploadedImages();

    if (uploadedImages.length === 0) {
      console.log(
        '⚠️  No uploaded images found. Run upload-images-batch.ts first.'
      );
      process.exit(1);
    }

    // Get categories
    const categories = await getOrCreateCategories();

    // Create products
    const createdProducts = await createProductsFromImages(
      uploadedImages,
      categories
    );

    // Generate report
    await generateReport(uploadedImages.length, createdProducts.length);

    console.log('✨ Product creation complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Product creation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
