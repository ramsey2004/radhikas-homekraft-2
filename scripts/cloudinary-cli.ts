#!/usr/bin/env node

/**
 * Cloudinary CLI Tool
 * Manage your Cloudinary images from command line
 *
 * Usage:
 *   npm run cloudinary inventory
 *   npm run cloudinary search "product"
 *   npm run cloudinary recent 7
 *   npm run cloudinary organize
 *   npm run cloudinary report
 *   npm run cloudinary sync
 */

import {
  getAllCloudinaryResources,
  getCloudinaryStats,
} from '../src/lib/cloudinary-admin';
import {
  searchImages,
  findRecentImages,
  autoOrganizeImages,
  generateImageReport,
  printImageReport,
  defaultOrganization,
} from '../src/lib/cloudinary-search';
import { syncCloudinaryInventory } from './sync-cloudinary';
import fs from 'fs/promises';
import path from 'path';

const command = process.argv[2];
const args = process.argv.slice(3);

async function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════╗
║         CLOUDINARY MANAGEMENT CLI TOOL             ║
╚════════════════════════════════════════════════════╝

Commands:

  inventory           List all images in Cloudinary
  inventory [folder]  List images in specific folder
  
  search <query>      Search for images
  search <query> <n>  Search and limit to n results
  
  recent [days]       Find images uploaded in last n days (default: 7)
  
  organize            Auto-organize images by type
  
  report              Generate detailed image report
  
  sync                Sync inventory to database
  
  help                Show this help message

Examples:

  npm run cloudinary inventory
  npm run cloudinary inventory products
  npm run cloudinary search wedding
  npm run cloudinary search vase 20
  npm run cloudinary recent 30
  npm run cloudinary organize
  npm run cloudinary report
  npm run cloudinary sync

  `);
}

async function listInventory(folder?: string) {
  console.log('📥 Fetching inventory...\n');

  try {
    const images = folder
      ? await getAllCloudinaryResources(folder)
      : await getAllCloudinaryResources();

    if (images.length === 0) {
      console.log('No images found.');
      return;
    }

    console.log(`\n📊 Found ${images.length} images\n`);
    console.log('Public ID'.padEnd(40), 'Size'.padEnd(10), 'Format', 'Created');
    console.log('─'.repeat(90));

    for (const img of images.slice(0, 20)) {
      const sizeMB = (img.bytes / 1024 / 1024).toFixed(2);
      console.log(
        img.public_id.substring(0, 40).padEnd(40),
        `${sizeMB} MB`.padEnd(10),
        img.format.padEnd(8),
        new Date(img.created_at).toLocaleDateString()
      );
    }

    if (images.length > 20) {
      console.log(`\n... and ${images.length - 20} more images`);
    }

    const stats = await getCloudinaryStats();
    console.log(`\n📈 Total Size: ${stats.total_size_mb} MB`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function searchAndDisplay(query: string, limit?: number) {
  console.log(`🔍 Searching for: "${query}"\n`);

  try {
    const results = await searchImages(
      query,
      limit ? { limit: parseInt(limit) } : undefined
    );

    if (results.length === 0) {
      console.log('No images found.');
      return;
    }

    console.log(`\n✓ Found ${results.length} images\n`);
    console.log('Match'.padEnd(40), 'Size'.padEnd(10), 'Format', 'Tags');
    console.log('─'.repeat(100));

    for (const img of results) {
      const sizeMB = (img.bytes / 1024 / 1024).toFixed(2);
      const tags = (img.tags || []).join(', ').substring(0, 20);
      console.log(
        img.public_id.substring(0, 40).padEnd(40),
        `${sizeMB} MB`.padEnd(10),
        img.format.padEnd(8),
        tags
      );
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function findAndDisplayRecent(days?: string) {
  const daysNum = days ? parseInt(days) : 7;
  console.log(`📅 Finding images from last ${daysNum} days...\n`);

  try {
    const results = await findRecentImages(daysNum, 50);

    if (results.length === 0) {
      console.log('No recent images found.');
      return;
    }

    console.log(`\n✓ Found ${results.length} recent images\n`);
    console.log('Public ID'.padEnd(40), 'Size'.padEnd(10), 'Uploaded');
    console.log('─'.repeat(75));

    for (const img of results) {
      const sizeMB = (img.bytes / 1024 / 1024).toFixed(2);
      const date = new Date(img.created_at);
      console.log(
        img.public_id.substring(0, 40).padEnd(40),
        `${sizeMB} MB`.padEnd(10),
        date.toLocaleString()
      );
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function organizeAndTag() {
  console.log('🔄 Auto-organizing images...\n');

  try {
    const { categorized, unorganized } = await autoOrganizeImages(
      defaultOrganization
    );

    console.log('\n✅ Organization Complete\n');

    for (const [category, images] of Object.entries(categorized)) {
      console.log(`\n📁 ${category}: ${images.length} images`);
      console.log('  Examples:');
      images.slice(0, 3).forEach((img) => {
        console.log(`    - ${img.public_id}`);
      });
    }

    if (unorganized.length > 0) {
      console.log(`\n⚠️  Unorganized: ${unorganized.length} images`);
      unorganized.slice(0, 3).forEach((img) => {
        console.log(`    - ${img.public_id}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function displayReport() {
  console.log('📊 Generating report...\n');

  try {
    await printImageReport();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function syncInventory() {
  console.log('🔄 Syncing inventory...\n');

  try {
    const report = await syncCloudinaryInventory();
    console.log(report);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function main() {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    await showHelp();
    return;
  }

  switch (command) {
    case 'inventory':
      await listInventory(args[0]);
      break;

    case 'search':
      if (!args[0]) {
        console.error('❌ Search query required');
        process.exit(1);
      }
      await searchAndDisplay(args[0], args[1]);
      break;

    case 'recent':
      await findAndDisplayRecent(args[0]);
      break;

    case 'organize':
      await organizeAndTag();
      break;

    case 'report':
      await displayReport();
      break;

    case 'sync':
      await syncInventory();
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run with --help for usage');
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
