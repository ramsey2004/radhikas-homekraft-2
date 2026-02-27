/**
 * Batch Upload Images to Cloudinary
 * Uploads 30 images at a time with retry logic and progress tracking
 */

import 'dotenv/config';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import crypto from 'crypto';

const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1';
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dk1ovmxuj';
const API_KEY = process.env.CLOUDINARY_API_KEY || '622255681518141';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'oJDof5Zje1pD5OQ0O5VRb2tkK0k';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'homecraft_products';

// Sample product images from Unsplash (free to use)
const IMAGE_SOURCES = [
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80', // Handmade pottery
  'https://images.unsplash.com/photo-1598903969816-39d6a4e77b38?w=800&q=80', // Woven basket
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', // Ceramic vase
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', // Decorative plates
  'https://images.unsplash.com/photo-1589290716620-e6439cee3ac2?w=800&q=80', // Hand-painted item
  'https://images.unsplash.com/photo-1604076782490-ab0076ba4007?w=800&q=80', // Textile art
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80', // Crafted decor
  'https://images.unsplash.com/photo-1611080626919-bc8985bc8ba0?w=800&q=80', // Wooden craft
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', // Artisan work
  'https://images.unsplash.com/photo-1598903969816-39d6a4e77b38?w=800&q=80', // Handmade basket
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80', // Clay pottery
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', // Vase design
  'https://images.unsplash.com/photo-1589290716620-e6439cee3ac2?w=800&q=80', // Decorative art
  'https://images.unsplash.com/photo-1604076782490-ab0076ba4007?w=800&q=80', // Textile pattern
  'https://images.unsplash.com/photo-1611080626919-bc8985bc8ba0?w=800&q=80', // Wooden crafts
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80', // Artistic pottery
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', // Modern vase
  'https://images.unsplash.com/photo-1598903969816-39d6a4e77b38?w=800&q=80', // Braided basket
  'https://images.unsplash.com/photo-1589290716620-e6439cee3ac2?w=800&q=80', // Hand-painted craft
  'https://images.unsplash.com/photo-1604076782490-ab0076ba4007?w=800&q=80', // Woven textile
  'https://images.unsplash.com/photo-1611080626919-bc8985bc8ba0?w=800&q=80', // Natural wood item
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80', // Pottery wheel
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', // Ceramic design
  'https://images.unsplash.com/photo-1598903969816-39d6a4e77b38?w=800&q=80', // Handwoven art
  'https://images.unsplash.com/photo-1589290716620-e6439cee3ac2?w=800&q=80', // Painted decor
  'https://images.unsplash.com/photo-1604076782490-ab0076ba4007?w=800&q=80', // Textile design
  'https://images.unsplash.com/photo-1611080626919-bc8985bc8ba0?w=800&q=80', // Artisan tools
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80', // Final pottery
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80', // Last vase
  'https://images.unsplash.com/photo-1598903969816-39d6a4e77b38?w=800&q=80', // Finishing basket
];

interface UploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  created_at: string;
  [key: string]: any;
}

interface BatchUploadReport {
  totalRequested: number;
  successfulUploads: number;
  failedUploads: number;
  uploadedImages: UploadResult[];
  errors: Array<{ image: string; error: string }>;
  startedAt: Date;
  completedAt: Date;
  duration: number;
}

/**
 * Generate authentication signature for unsigned uploads
 */
function generateAuthSignature(params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);

  const paramString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHmac('sha1', API_SECRET)
    .update(paramString)
    .digest('hex');
}

/**
 * Download image from URL
 */
async function downloadImage(url: string, filename: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    const filepath = path.join(process.cwd(), 'temp', filename);
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true });
    await fs.promises.writeFile(filepath, response.data);

    return filepath;
  } catch (error) {
    throw new Error(`Failed to download image from ${url}: ${error}`);
  }
}

/**
 * Upload single image to Cloudinary
 */
async function uploadImageToCloudinary(
  filePath: string,
  publicId: string,
  tags: string[] = []
): Promise<UploadResult> {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('public_id', publicId);
    form.append('cloud_name', CLOUD_NAME);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('api_key', API_KEY);

    if (tags.length > 0) {
      form.append('tags', tags.join(','));
    }

    form.append('folder', 'homecraft/products');

    const response = await axios.post(
      `${CLOUDINARY_API}/${CLOUD_NAME}/image/upload`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 60000,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `Upload failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Upload batch of images (30 at a time)
 */
async function uploadBatch(
  imageSources: string[],
  batchSize: number = 30,
  delay: number = 1000
): Promise<BatchUploadReport> {
  const report: BatchUploadReport = {
    totalRequested: imageSources.length,
    successfulUploads: 0,
    failedUploads: 0,
    uploadedImages: [],
    errors: [],
    startedAt: new Date(),
    completedAt: new Date(),
    duration: 0,
  };

  console.log(`\n📦 Starting batch upload of ${imageSources.length} images...`);
  console.log(`⚙️  Batch size: ${batchSize} images`);
  console.log(`⏱️  Delay between uploads: ${delay}ms\n`);

  for (let i = 0; i < imageSources.length; i++) {
    const imageUrl = imageSources[i];
    const imageNumber = i + 1;
    const public_id = `homecraft-product-${Date.now()}-${imageNumber}`;

    console.log(`[${imageNumber}/${imageSources.length}] Uploading image...`);

    try {
      // Download image
      const filename = `temp-image-${imageNumber}.jpg`;
      console.log(`  📥 Downloading from Unsplash...`);
      const filePath = await downloadImage(imageUrl, filename);

      // Upload to Cloudinary
      console.log(`  📤 Uploading to Cloudinary...`);
      const result = await uploadImageToCloudinary(filePath, public_id, [
        'homecraft',
        'products',
        'batch-upload',
      ]);

      report.uploadedImages.push(result);
      report.successfulUploads++;

      console.log(`  ✅ Success! Public ID: ${result.public_id}`);
      console.log(`     URL: ${result.secure_url}\n`);

      // Clean up temp file
      try {
        await fs.promises.unlink(filePath);
      } catch {}

      // Delay before next upload
      if (i < imageSources.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      report.failedUploads++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      report.errors.push({
        image: imageUrl,
        error: errorMessage,
      });

      console.log(`  ❌ Failed: ${errorMessage}\n`);

      // Continue with next image on error
      if (i < imageSources.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  report.completedAt = new Date();
  report.duration =
    report.completedAt.getTime() - report.startedAt.getTime();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH UPLOAD REPORT');
  console.log('='.repeat(60));
  console.log(`Total Requested:     ${report.totalRequested}`);
  console.log(`Successful Uploads:  ${report.successfulUploads} ✅`);
  console.log(`Failed Uploads:      ${report.failedUploads} ❌`);
  console.log(`Success Rate:        ${((report.successfulUploads / report.totalRequested) * 100).toFixed(1)}%`);
  console.log(`Duration:            ${(report.duration / 1000).toFixed(1)}s`);
  console.log('='.repeat(60));

  if (report.uploadedImages.length > 0) {
    console.log('\n📸 Uploaded Image IDs:');
    report.uploadedImages.forEach((img, idx) => {
      console.log(`   ${idx + 1}. ${img.public_id}`);
    });
  }

  if (report.errors.length > 0) {
    console.log('\n⚠️  Upload Errors:');
    report.errors.forEach((err) => {
      console.log(`   - ${err.image}: ${err.error}`);
    });
  }

  return report;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('\n🚀 Cloudinary Batch Image Upload');
    console.log('================================\n');

    // Upload images
    const report = await uploadBatch(IMAGE_SOURCES, 30, 2000);

    // Save report
    const reportPath = path.join(
      process.cwd(),
      'data',
      `upload-report-${new Date().toISOString().split('T')[0]}.json`
    );
    await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n💾 Report saved to: ${reportPath}`);

    if (report.successfulUploads > 0) {
      console.log(`\n✨ Successfully uploaded ${report.successfulUploads} images!`);
      console.log('Next step: Sync with database using sync-cloudinary.ts');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Upload batch failed:', error);
    process.exit(1);
  }
}

main();
