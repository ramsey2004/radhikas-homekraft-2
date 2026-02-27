/**
 * Bulk Sync with Pagination - Avoids Rate Limits
 * Fetches images in smaller paginated batches
 */

import 'dotenv/config';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1';
const CLOUD_NAME = 'dk1ovmxuj';
const API_KEY = '622255681518141';
const API_SECRET = 'oJDof5Zje1pD5OQ0O5VRb2tkK0k';

// Sleep utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate auth header
function generateAuth() {
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
  return `Basic ${auth}`;
}

/**
 * Fetch images with pagination - smaller batches to avoid rate limits
 */
async function fetchImagesWithPagination() {
  console.log('📡 Fetching images with pagination (50 per request)...\n');
  
  const allImages = [];
  let nextCursor = null;
  let batchNum = 1;
  const BATCH_SIZE = 50; // Smaller batch to avoid limits
  const DELAY_MS = 3000; // 3 second delay between batches

  try {
    while (true) {
      console.log(`   Batch ${batchNum}: Fetching ${BATCH_SIZE} images...`);
      
      const paramsObj: Record<string, string> = {
        type: 'upload',
        max_results: BATCH_SIZE.toString(),
        direction: 'desc',
      };
      
      if (nextCursor) {
        paramsObj.next_cursor = nextCursor;
      }
      
      const params = new URLSearchParams(paramsObj);

      const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/image?${params}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': generateAuth(),
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      const resources = response.data.resources || [];
      allImages.push(...resources);
      
      console.log(`      Got ${resources.length} images (Total: ${allImages.length})`);

      // Check if there are more results
      nextCursor = response.data.next_cursor;
      if (!nextCursor || resources.length === 0) {
        console.log(`\n✅ Fetched ${allImages.length} total images\n`);
        break;
      }

      // Wait before next batch
      console.log(`      ⏳ Waiting ${DELAY_MS}ms before next batch...\n`);
      await sleep(DELAY_MS);
      batchNum++;
    }
  } catch (error: any) {
    console.error('❌ Error fetching images:', error.response?.status, error.message);
    throw error;
  }

  return allImages;
}

/**
 * Process images into product categories
 */
function categorizeImages(images: any[]) {
  const categories: Record<string, any[]> = {
    products: [],
    collections: [],
    heroes: [],
    testimonials: [],
    artisans: [],
  };

  for (const image of images) {
    const publicId = image.public_id.toLowerCase();
    
    if (publicId.includes('product') || publicId.includes('item')) {
      categories.products.push(image);
    } else if (publicId.includes('collection') || publicId.includes('set')) {
      categories.collections.push(image);
    } else if (publicId.includes('hero') || publicId.includes('banner')) {
      categories.heroes.push(image);
    } else if (publicId.includes('testimonial') || publicId.includes('review')) {
      categories.testimonials.push(image);
    } else if (publicId.includes('artisan') || publicId.includes('maker')) {
      categories.artisans.push(image);
    } else {
      categories.products.push(image); // Default to products
    }
  }

  return categories;
}

/**
 * Generate product name from public ID
 */
function generateProductName(publicId: string): string {
  const filename = publicId.split('/').pop() || publicId;
  const clean = filename
    .replace(/\-\d+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return clean;
}

/**
 * Generate SKU
 */
function generateSKU(publicId: string): string {
  return `SKU-${publicId.replace(/\//g, '-').toUpperCase()}`;
}

/**
 * Create or update products in database
 */
async function createOrUpdateProducts(categoryImages: Record<string, any[]>) {
  console.log('💾 Creating/updating products in database...\n');

  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const [categoryName, images] of Object.entries(categoryImages)) {
    if (images.length === 0) continue;

    console.log(`\n📦 ${categoryName}: ${images.length} products`);

    // Get or create category
    let category = await prisma.category.findUnique({
      where: { slug: categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          slug: categoryName,
          description: `Handcrafted ${categoryName}`,
        },
      });
      console.log(`   ✓ Created category`);
    }

    // Create products
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const sku = generateSKU(image.public_id);
      const imageUrl = image.secure_url || `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${image.public_id}`;

      try {
        const existing = await prisma.product.findUnique({
          where: { sku },
        });

        if (existing) {
          await prisma.product.update({
            where: { sku },
            data: {
              name: generateProductName(image.public_id),
              price: 1500 + (i % 20) * 100,
              thumbnail: imageUrl,
              images: [imageUrl],
            },
          });
          updated++;
        } else {
          await prisma.product.create({
            data: {
              name: generateProductName(image.public_id),
              slug: `${image.public_id.replace(/\//g, '-')}-${Date.now()}`,
              description: `Handcrafted ${generateProductName(image.public_id)}`,
              shortDescription: generateProductName(image.public_id),
              price: 1500 + (i % 20) * 100,
              sku,
              inventory: 999,
              thumbnail: imageUrl,
              images: [imageUrl],
              categoryId: category.id,
              isFeatured: created < 20,
              isActive: true,
            },
          });
          created++;
        }

        // Progress every 50 products
        if ((created + updated) % 50 === 0) {
          console.log(`   ✓ Processed ${created + updated} products...`);
        }
      } catch (error: any) {
        errors.push(`Failed to create "${sku}": ${error.message}`);
      }
    }

    console.log(`   ✓ Completed ${categoryName}`);
  }

  return { created, updated, errors };
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║      BULK UPLOAD: 740+ Images (Paginated)                     ║
╚════════════════════════════════════════════════════════════════╝
`);

    // Step 1: Fetch images with pagination
    const allImages = await fetchImagesWithPagination();

    // Step 2: Categorize
    console.log('🏷️  Categorizing images...');
    const categoryImages = categorizeImages(allImages);
    
    console.log('\n📊 Category breakdown:');
    for (const [cat, imgs] of Object.entries(categoryImages)) {
      if (imgs.length > 0) {
        console.log(`   ${cat}: ${imgs.length}`);
      }
    }

    // Step 3: Create/update products
    const result = await createOrUpdateProducts(categoryImages);

    console.log(`\n
╔════════════════════════════════════════════════════════════════╗
║                    UPLOAD COMPLETE! ✅                         ║
╚════════════════════════════════════════════════════════════════╝

📊 Results:
   • Created: ${result.created}
   • Updated: ${result.updated}
   • Errors: ${result.errors.length}
   • Total: ${result.created + result.updated}
`);

    if (result.errors.length > 0) {
      console.log('⚠️  Errors:');
      result.errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
      if (result.errors.length > 10) {
        console.log(`   ... and ${result.errors.length - 10} more errors`);
      }
    }

    console.log('\n✨ Visit your pages:');
    console.log('   http://localhost:3000/all-products');
    console.log('   http://localhost:3000/categories');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
