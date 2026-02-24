#!/usr/bin/env node

/**
 * Image Optimization Script for Radhika's Homecraft
 * 
 * This script converts all JPEG/PNG images to WebP format with quality optimization.
 * Run: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
  quality: 85,
  inputDir: './public/images',
  outputDir: './public/images/optimized',
  formats: ['webp', 'avif'], // Modern formats
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, 'blue');
  }
}

// Get file size in KB
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

// Optimize single image
async function optimizeImage(inputPath, outputPath, format) {
  try {
    const originalSize = getFileSize(inputPath);
    
    const sharpInstance = sharp(inputPath);
    
    // Apply format-specific optimization
    if (format === 'webp') {
      await sharpInstance
        .webp({ quality: CONFIG.quality, effort: 6 })
        .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    } else if (format === 'avif') {
      await sharpInstance
        .avif({ quality: CONFIG.quality, effort: 9 })
        .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.avif'));
    }
    
    const newSize = getFileSize(outputPath.replace(/\.(jpg|jpeg|png)$/i, `.${format}`));
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    log(
      `  ${format.toUpperCase()}: ${originalSize}KB → ${newSize}KB (${savings}% smaller)`,
      'green'
    );
    
    return { originalSize: parseFloat(originalSize), newSize: parseFloat(newSize) };
  } catch (error) {
    log(`  Error optimizing ${inputPath}: ${error.message}`, 'yellow');
    return null;
  }
}

// Main optimization process
async function optimizeAllImages() {
  log('\n🚀 Starting Image Optimization...', 'bright');
  log('━'.repeat(60), 'blue');
  
  ensureDir(CONFIG.outputDir);
  
  // Find all images
  const imagePattern = path.join(CONFIG.inputDir, '**/*.{jpg,jpeg,png}');
  const images = glob.sync(imagePattern, { nodir: true });
  
  if (images.length === 0) {
    log('\n⚠️  No images found to optimize.', 'yellow');
    log(`Make sure images exist in: ${CONFIG.inputDir}`, 'yellow');
    return;
  }
  
  log(`\n📦 Found ${images.length} images to optimize\n`, 'bright');
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let processedCount = 0;
  
  // Process each image
  for (const imagePath of images) {
    const relativePath = path.relative(CONFIG.inputDir, imagePath);
    const outputPath = path.join(CONFIG.outputDir, relativePath);
    const outputPathDir = path.dirname(outputPath);
    
    ensureDir(outputPathDir);
    
    log(`\n📸 ${relativePath}`, 'blue');
    
    // Optimize to each format
    for (const format of CONFIG.formats) {
      const result = await optimizeImage(imagePath, outputPath, format);
      if (result) {
        totalOriginalSize += result.originalSize;
        totalNewSize += result.newSize;
        processedCount++;
      }
    }
  }
  
  // Summary
  const totalSavings = ((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1);
  
  log('\n' + '━'.repeat(60), 'blue');
  log('✅ Optimization Complete!', 'bright');
  log('━'.repeat(60), 'blue');
  log(`\n📊 Summary:`, 'bright');
  log(`  Images processed: ${processedCount} files`, 'green');
  log(`  Original size:    ${totalOriginalSize.toFixed(2)} KB`, 'yellow');
  log(`  Optimized size:   ${totalNewSize.toFixed(2)} KB`, 'green');
  log(`  Total savings:    ${totalSavings}%`, 'bright');
  log(`\n💾 Files saved to: ${CONFIG.outputDir}\n`, 'blue');
}

// Run the script
optimizeAllImages().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, 'yellow');
  process.exit(1);
});
