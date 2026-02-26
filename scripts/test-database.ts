/**
 * Test database connection
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🧪 Testing database connection...');
    
    const count = await prisma.product.count();
    console.log(`✅ Database connected! Current products: ${count}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

test();
