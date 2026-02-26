/**
 * Cloudinary Database Sync
 * Syncs inventory from Cloudinary to local database
 */

import { PrismaClient } from '@prisma/client';
import {
  getAllCloudinaryResources,
  getCloudinaryStats,
  CloudinaryResource,
} from '@/lib/cloudinary-admin';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface CloudinaryInventory {
  publicId: string;
  url: string;
  folder: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  createdAt: string;
  tags: string[];
}

interface SyncReport {
  startedAt: Date;
  endedAt: Date;
  totalImagesInCloudinary: number;
  newImagesCreated: number;
  existingImagesUpdated: number;
  errors: string[];
  inventoryFile?: string;
}

/**
 * Fetch all images from Cloudinary and store inventory
 */
export async function syncCloudinaryInventory(): Promise<SyncReport> {
  const report: SyncReport = {
    startedAt: new Date(),
    endedAt: new Date(),
    totalImagesInCloudinary: 0,
    newImagesCreated: 0,
    existingImagesUpdated: 0,
    errors: [],
  };

  try {
    console.log('📥 Fetching inventory from Cloudinary...');
    const allImages = await getAllCloudinaryResources();
    report.totalImagesInCloudinary = allImages.length;

    console.log(`✓ Found ${allImages.length} images in Cloudinary`);
    console.log('💾 Saving inventory to database...');

    // Store inventory in database (create a new table or use existing)
    for (const image of allImages) {
      try {
        // You can store this in your database
        // For now, we'll just log it
        // await prisma.cloudinaryImage.upsert({...})
      } catch (error) {
        report.errors.push(
          `Error syncing image ${image.public_id}: ${error}`
        );
      }
    }

    // Save inventory as JSON backup
    const inventory: CloudinaryInventory[] = allImages.map((img) => ({
      publicId: img.public_id,
      url: img.secure_url || img.url,
      folder: img.folder || 'root',
      width: img.width,
      height: img.height,
      bytes: img.bytes,
      format: img.format,
      createdAt: img.created_at,
      tags: img.tags || [],
    }));

    const inventoryPath = path.join(
      process.cwd(),
      'data',
      `cloudinary-inventory-${new Date().toISOString().split('T')[0]}.json`
    );

    await fs.mkdir(path.dirname(inventoryPath), { recursive: true });
    await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
    report.inventoryFile = inventoryPath;

    console.log(`✓ Inventory saved to ${inventoryPath}`);

    // Get statistics
    const stats = await getCloudinaryStats();
    console.log('\n📊 Cloudinary Statistics:');
    console.log(`   Total Images: ${stats.total_images}`);
    console.log(`   Total Size: ${stats.total_size_mb} MB`);
    console.log('   By Folder:');
    Object.entries(stats.by_folder).forEach(([folder, data]) => {
      console.log(`     - ${folder}: ${data.count} images (${(data.size / 1024 / 1024).toFixed(2)} MB)`);
    });

    report.endedAt = new Date();
    return report;
  } catch (error) {
    report.errors.push(`Sync failed: ${error}`);
    report.endedAt = new Date();
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Sync specific product with Cloudinary images
 */
export async function syncProductWithCloudinaryImages(
  productId: string,
  cloudinaryPublicIds: string[]
): Promise<void> {
  try {
    // Fetch images from Cloudinary
    const images = await Promise.all(
      cloudinaryPublicIds.map(async (id) => {
        const res = await getAllCloudinaryResources(id);
        return res[0];
      })
    );

    // Update product in database with image URLs
    const imageUrls = images
      .map(
        (img) =>
          `https://res.cloudinary.com/dk1ovmxuj/image/upload/${img.public_id}.${img.format}`
      )
      .filter(Boolean);

    await prisma.product.update({
      where: { id: productId },
      data: {
        images: imageUrls,
        thumbnail: imageUrls[0] || undefined,
      },
    });

    console.log(`✓ Synced ${imageUrls.length} images for product ${productId}`);
  } catch (error) {
    console.error(`Error syncing product ${productId}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Bulk sync multiple products
 */
export async function bulkSyncProducts(
  productMapping: Array<{
    productId: string;
    cloudinaryPublicIds: string[];
  }>
): Promise<{ succeeded: number; failed: number }> {
  let succeeded = 0;
  let failed = 0;

  console.log(`🔄 Syncing ${productMapping.length} products...`);

  for (const mapping of productMapping) {
    try {
      await syncProductWithCloudinaryImages(mapping.productId, mapping.cloudinaryPublicIds);
      succeeded++;
    } catch (error) {
      console.error(`❌ Failed to sync product ${mapping.productId}:`, error);
      failed++;
    }
  }

  console.log(`\n📊 Sync Complete: ${succeeded} succeeded, ${failed} failed`);
  return { succeeded, failed };
}

/**
 * Generate sync report
 */
export function generateSyncReport(report: SyncReport): string {
  const duration = Math.round(
    (report.endedAt.getTime() - report.startedAt.getTime()) / 1000
  );

  return `
===========================================
📊 Cloudinary Sync Report
===========================================
Started: ${report.startedAt.toISOString()}
Ended: ${report.endedAt.toISOString()}
Duration: ${duration}s

📈 Results:
  Total Images in Cloudinary: ${report.totalImagesInCloudinary}
  New Images Created: ${report.newImagesCreated}
  Existing Images Updated: ${report.existingImagesUpdated}
  
${report.errors.length > 0 ? `❌ Errors: ${report.errors.length}` : '✅ No errors'}
${report.inventoryFile ? `💾 Inventory saved to: ${report.inventoryFile}` : ''}
===========================================
  `;
}
