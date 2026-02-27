/**
 * Generate and Upload 30 Sample Images to Cloudinary
 * Creates simple placeholder images (using Canvas) and uploads them
 */

import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1';
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dk1ovmxuj';
const API_KEY = process.env.CLOUDINARY_API_KEY || '622255681518141';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'oJDof5Zje1pD5OQ0O5VRb2tkK0k';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'homecraft_products';

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

interface BatchUploadReport {
  totalRequested: number;
  successfulUploads: number;
  failedUploads: number;
  uploadedImages: UploadResult[];
  errors: Array<{ name: string; error: string }>;
  startedAt: Date;
  completedAt: Date;
  duration: number;
}

// Pre-generated base64 sample images (simple colored rectangles)
const SAMPLE_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * Create a data URL for testing
 */
function createTestImageDataUrl(index: number): string {
  const colors = [
    'FF6B6B', 'FFA500', 'FFD700', '90EE90', '87CEEB', '4169E1', '9370DB',
    'FF69B4', 'FF8C00', '00CED1', 'F0E68C', 'DEB887', '696969', '2F4F4F',
    'B22222', '228B22', '008080', '4682B4', 'DC143C', '00FA9A', 'FF0000',
    '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF', 'A52A2A', 'FFB6C1',
    '32CD32', '8B4513',
  ];

  const color = colors[index % colors.length];
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#${color}"/>
      <text x="200" y="200" font-size="24" fill="white" text-anchor="middle" dy=".3em">
        Product ${index + 1}
      </text>
      <text x="200" y="240" font-size="14" fill="white" text-anchor="middle">
        Homecraft Item
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Upload image to Cloudinary via data URL
 */
async function uploadImageToCloudinary(
  dataUrl: string,
  publicId: string,
  tags: string[] = []
): Promise<UploadResult> {
  try {
    // Use FormData for multipart upload with unsigned preset
    const response = await axios.post(
      `${CLOUDINARY_API}/${CLOUD_NAME}/image/upload`,
      {
        file: dataUrl,
        public_id: publicId,
        folder: 'homecraft/products',
        tags: tags.join(','),
        upload_preset: UPLOAD_PRESET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      public_id: response.data.public_id,
      secure_url: response.data.secure_url,
      url: response.data.url,
      width: response.data.width,
      height: response.data.height,
      bytes: response.data.bytes,
      format: response.data.format,
    };
  } catch (error) {
    throw new Error(
      `Upload failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Upload batch of 30 images
 */
async function uploadBatch(
  batchSize: number = 30,
  delay: number = 1500
): Promise<BatchUploadReport> {
  const report: BatchUploadReport = {
    totalRequested: batchSize,
    successfulUploads: 0,
    failedUploads: 0,
    uploadedImages: [],
    errors: [],
    startedAt: new Date(),
    completedAt: new Date(),
    duration: 0,
  };

  console.log(`\n📦 Starting batch upload of ${batchSize} images...`);
  console.log(`⚙️  Batch size: ${batchSize} images`);
  console.log(`⏱️  Delay between uploads: ${delay}ms\n`);

  for (let i = 0; i < batchSize; i++) {
    const imageNumber = i + 1;
    const public_id = `homecraft-product-${Date.now()}-${imageNumber}`;

    console.log(`[${imageNumber}/${batchSize}] Uploading image...`);

    try {
      // Create data URL for test image
      console.log(`  🎨 Generating image...`);
      const dataUrl = createTestImageDataUrl(i);

      // Upload to Cloudinary
      console.log(`  📤 Uploading to Cloudinary...`);
      const result = await uploadImageToCloudinary(dataUrl, public_id, [
        'homecraft',
        'products',
        'batch-upload',
      ]);

      report.uploadedImages.push(result);
      report.successfulUploads++;

      console.log(`  ✅ Success! Public ID: ${result.public_id}`);
      console.log(`     URL: ${result.secure_url}`);
      console.log(`     Size: ${result.width}x${result.height} | ${(result.bytes / 1024).toFixed(1)}KB\n`);

      // Delay before next upload
      if (i < batchSize - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      report.failedUploads++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      report.errors.push({
        name: `Image ${imageNumber}`,
        error: errorMessage,
      });

      console.log(`  ❌ Failed: ${errorMessage}\n`);

      // Continue with next image on error
      if (i < batchSize - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  report.completedAt = new Date();
  report.duration = report.completedAt.getTime() - report.startedAt.getTime();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH UPLOAD REPORT');
  console.log('='.repeat(60));
  console.log(`Total Requested:     ${report.totalRequested}`);
  console.log(`Successful Uploads:  ${report.successfulUploads} ✅`);
  console.log(`Failed Uploads:      ${report.failedUploads} ❌`);
  console.log(
    `Success Rate:        ${((report.successfulUploads / report.totalRequested) * 100).toFixed(1)}%`
  );
  console.log(
    `Duration:            ${(report.duration / 1000).toFixed(1)}s (${(report.duration / report.totalRequested).toFixed(0)}ms per image)`
  );
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
      console.log(`   - ${err.name}: ${err.error}`);
    });
  }

  return report;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('\n🚀 Cloudinary Batch Image Upload (SVG-based)');
    console.log('===========================================\n');

    // Upload images
    const report = await uploadBatch(30, 1500);

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
      console.log(
        'Next step: Run create-products-from-uploads.ts to create products'
      );
    }

    process.exit(report.successfulUploads > 0 ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Upload batch failed:', error);
    process.exit(1);
  }
}

main();
