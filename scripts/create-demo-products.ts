/**
 * Create demo products for testing
 * Populate database with sample products to show the categories/display system works
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDemoProducts() {
  try {
    console.log('🎯 Creating demo products for testing...\n');

    // Clear existing products (optional)
    // await prisma.product.deleteMany({});
    // await prisma.category.deleteMany({});

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'products' },
        update: {},
        create: {
          name: 'Products',
          slug: 'products',
          description: 'Our handmade product collection',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'collections' },
        update: {},
        create: {
          name: 'Collections',
          slug: 'collections',
          description: 'Curated collections and sets',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'heroes' },
        update: {},
        create: {
          name: 'Heroes',
          slug: 'heroes',
          description: 'Featured hero products',
        },
      }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);


    // Create sample products
    const products = [
      {
        name: 'Handmade Ceramic Vase',
        slug: 'handmade-ceramic-vase',
        description: 'Beautiful handcrafted ceramic vase, perfect for home decor',
        shortDescription: 'Ceramic vase',
        price: 1500,
        sku: 'SKU-CERAMIC-VASE-001',
        inventory: 10,
        thumbnail: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg',
        images: ['https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg'],
        categoryId: categories[0].id,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Woven Basket Set',
        slug: 'woven-basket-set',
        description: 'Set of 3 traditional woven baskets',
        shortDescription: 'Basket set',
        price: 2500,
        sku: 'SKU-BASKET-SET-001',
        inventory: 15,
        thumbnail: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg',
        images: ['https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg'],
        categoryId: categories[1].id,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Artisan Hero Collection',
        slug: 'artisan-hero-collection',
        description: 'Premium handcrafted collection from our featured artisans',
        shortDescription: 'Hero collection',
        price: 3500,
        sku: 'SKU-HERO-001',
        inventory: 5,
        thumbnail: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg',
        images: ['https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg'],
        categoryId: categories[2].id,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Textile Wall Hanging',
        slug: 'textile-wall-hanging',
        description: 'Handwoven textile wall hanging',
        shortDescription: 'Wall hanging',
        price: 1800,
        sku: 'SKU-TEXTILE-001',
        inventory: 8,
        thumbnail: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg',
        images: ['https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg'],
        categoryId: categories[0].id,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Decorative Plate Set',
        slug: 'decorative-plate-set',
        description: 'Set of 6 decorative ceramic plates',
        shortDescription: 'Plate set',
        price: 2200,
        sku: 'SKU-PLATE-SET-001',
        inventory: 12,
        thumbnail: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg',
        images: ['https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg'],
        categoryId: categories[1].id,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Hand-Painted Cushion Cover',
        slug: 'hand-painted-cushion-cover',
        description: 'Beautiful hand-painted cushion cover',
        shortDescription: 'Cushion cover',
        price: 899,
        sku: 'SKU-CUSHION-001',
        inventory: 20,
        thumbnail: 'https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg',
        images: ['https://res.cloudinary.com/dk1ovmxuj/image/upload/v1772105096/DSCF1998_m5cnw0.jpg'],
        categoryId: categories[0].id,
        isFeatured: false,
        isActive: true,
      },
    ];

    const createdProducts = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdProducts.count} demo products\n`);

    // Show summary
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();

    console.log('📊 DATABASE SUMMARY:');
    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   Total Categories: ${totalCategories}`);

    console.log('\n✨ Demo data created! Visit:');
    console.log('   http://localhost:3000/all-products');
    console.log('   http://localhost:3000/categories');

  } catch (error) {
    console.error('❌ Error creating demo products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoProducts();
