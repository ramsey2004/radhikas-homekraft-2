/**
 * Cloudinary Image Search & Organization Utilities
 * Find, filter, categorize, and organize images
 */

import {
  getAllCloudinaryResources,
  searchCloudinaryResources,
  tagCloudinaryResources,
  CloudinaryResource,
} from '@/lib/cloudinary-admin';

export interface ImageOrganizationMap {
  [category: string]: {
    pattern?: RegExp;
    folder?: string;
    tags: string[];
    use?: string; // 'product' | 'hero' | 'testimonial' | 'artisan' | etc
  };
}

/**
 * Default organization structure
 */
export const defaultOrganization: ImageOrganizationMap = {
  products: {
    pattern: /product|item|(?<!-)image|(?<!-)photo/i,
    folder: 'products',
    tags: ['product', 'ecommerce'],
    use: 'product',
  },
  heroes: {
    pattern: /hero|banner|header|cover|promo/i,
    folder: 'heroes',
    tags: ['hero', 'promotional'],
    use: 'hero',
  },
  testimonials: {
    pattern: /testimonial|review|customer|quote/i,
    folder: 'testimonials',
    tags: ['testimonial', 'customer'],
    use: 'testimonial',
  },
  artisans: {
    pattern: /artisan|maker|creator|craftsperson|profile|portrait/i,
    folder: 'artisans',
    tags: ['artisan', 'people'],
    use: 'artisan',
  },
  collections: {
    pattern: /collection|category|curated|set|seasonal/i,
    folder: 'collections',
    tags: ['collection', 'category'],
    use: 'collection',
  },
};

/**
 * Search images by keyword
 */
export async function searchImages(
  keyword: string,
  options?: { folder?: string; limit?: number }
): Promise<CloudinaryResource[]> {
  const limit = options?.limit || 50;

  try {
    // First try exact search
    const results = await searchCloudinaryResources({
      query: keyword,
      folder: options?.folder,
      max_results: limit,
    });

    return results.slice(0, limit);
  } catch (error) {
    console.error(`Error searching for "${keyword}":`, error);
    return [];
  }
}

/**
 * Find images by tags
 */
export async function findImagesByTags(
  tags: string[],
  limit = 50
): Promise<CloudinaryResource[]> {
  try {
    return await searchCloudinaryResources({
      tags,
      max_results: limit,
    });
  } catch (error) {
    console.error(`Error finding images with tags:`, error);
    return [];
  }
}

/**
 * Find recently uploaded images
 */
export async function findRecentImages(
  days = 7,
  limit = 50
): Promise<CloudinaryResource[]> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceTimestamp = Math.floor(since.getTime() / 1000);

    const allImages = await getAllCloudinaryResources();

    return allImages
      .filter((img) => {
        const created = new Date(img.created_at).getTime() / 1000;
        return created > sinceTimestamp;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);
  } catch (error) {
    console.error(`Error finding recent images:`, error);
    return [];
  }
}

/**
 * Find images by dimensions
 */
export async function findImagesByDimensions(
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<CloudinaryResource[]> {
  try {
    const allImages = await getAllCloudinaryResources();

    return allImages.filter((img) => {
      if (minWidth && img.width < minWidth) return false;
      if (minHeight && img.height < minHeight) return false;
      if (maxWidth && img.width > maxWidth) return false;
      if (maxHeight && img.height > maxHeight) return false;
      return true;
    });
  } catch (error) {
    console.error(`Error finding images by dimensions:`, error);
    return [];
  }
}

/**
 * Find images by size (file size)
 */
export async function findImagesByFileSize(
  minSizeKB?: number,
  maxSizeKB?: number
): Promise<CloudinaryResource[]> {
  try {
    const allImages = await getAllCloudinaryResources();
    const minBytes = minSizeKB ? minSizeKB * 1024 : 0;
    const maxBytes = maxSizeKB ? maxSizeKB * 1024 : Infinity;

    return allImages.filter(
      (img) => img.bytes >= minBytes && img.bytes <= maxBytes
    );
  } catch (error) {
    console.error(`Error finding images by file size:`, error);
    return [];
  }
}

/**
 * Find images by folder
 */
export async function findImagesByFolder(
  folder: string
): Promise<CloudinaryResource[]> {
  try {
    const allImages = await getAllCloudinaryResources(folder);
    return allImages;
  } catch (error) {
    console.error(`Error finding images in folder "${folder}":`, error);
    return [];
  }
}

/**
 * Find untagged images
 */
export async function findUntaggedImages(): Promise<CloudinaryResource[]> {
  try {
    const allImages = await getAllCloudinaryResources();
    return allImages.filter((img) => !img.tags || img.tags.length === 0);
  } catch (error) {
    console.error(`Error finding untagged images:`, error);
    return [];
  }
}

/**
 * Auto-categorize images based on naming patterns
 */
export async function autoOrganizeImages(
  organization: ImageOrganizationMap = defaultOrganization
): Promise<{
  categorized: Record<string, CloudinaryResource[]>;
  unorganized: CloudinaryResource[];
}> {
  try {
    console.log('🔍 Scanning images for auto-organization...');
    const allImages = await getAllCloudinaryResources();

    const categorized: Record<string, CloudinaryResource[]> = {};
    const unorganized: CloudinaryResource[] = [];

    for (const image of allImages) {
      let found = false;

      for (const [category, config] of Object.entries(organization)) {
        if (config.pattern && config.pattern.test(image.public_id)) {
          if (!categorized[category]) {
            categorized[category] = [];
          }
          categorized[category].push(image);
          found = true;
          break;
        }
      }

      if (!found) {
        unorganized.push(image);
      }
    }

    // Apply tags
    for (const [category, config] of Object.entries(organization)) {
      if (categorized[category] && config.tags.length > 0) {
        const publicIds = categorized[category].map((img) => img.public_id);
        console.log(
          `📝 Tagging ${publicIds.length} images as "${category}"...`
        );
        await tagCloudinaryResources(publicIds, config.tags);
      }
    }

    return { categorized, unorganized };
  } catch (error) {
    console.error(`Error auto-organizing images:`, error);
    throw error;
  }
}

/**
 * Generate detailed image report
 */
export async function generateImageReport(): Promise<{
  totalImages: number;
  byFolder: Record<string, number>;
  byFormat: Record<string, number>;
  byTag: Record<string, number>;
  byCategory: Record<string, number>;
  sizeStats: {
    smallest: CloudinaryResource;
    largest: CloudinaryResource;
    averageBytes: number;
  };
}> {
  try {
    const allImages = await getAllCloudinaryResources();

    const report = {
      totalImages: allImages.length,
      byFolder: {} as Record<string, number>,
      byFormat: {} as Record<string, number>,
      byTag: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      sizeStats: {
        smallest: allImages[0],
        largest: allImages[0],
        averageBytes:
          allImages.reduce((sum, img) => sum + img.bytes, 0) / allImages.length,
      },
    };

    for (const image of allImages) {
      // By folder
      const folder = image.folder || 'root';
      report.byFolder[folder] = (report.byFolder[folder] || 0) + 1;

      // By format
      report.byFormat[image.format] = (report.byFormat[image.format] || 0) + 1;

      // By tag
      if (image.tags && image.tags.length > 0) {
        for (const tag of image.tags) {
          report.byTag[tag] = (report.byTag[tag] || 0) + 1;
        }
      }

      // Size comparison
      if (image.bytes < report.sizeStats.smallest.bytes) {
        report.sizeStats.smallest = image;
      }
      if (image.bytes > report.sizeStats.largest.bytes) {
        report.sizeStats.largest = image;
      }
    }

    return report;
  } catch (error) {
    console.error(`Error generating report:`, error);
    throw error;
  }
}

/**
 * Format and print report
 */
export async function printImageReport(): Promise<void> {
  const report = await generateImageReport();

  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║         CLOUDINARY IMAGE REPORT                   ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log(`📊 Total Images: ${report.totalImages}\n`);

  console.log('📁 By Folder:');
  Object.entries(report.byFolder)
    .sort(([, a], [, b]) => b - a)
    .forEach(([folder, count]) => {
      console.log(`   ${folder}: ${count} images`);
    });

  console.log('\n📄 By Format:');
  Object.entries(report.byFormat)
    .sort(([, a], [, b]) => b - a)
    .forEach(([format, count]) => {
      console.log(`   ${format}: ${count} images`);
    });

  console.log('\n🏷️  By Tag:');
  Object.entries(report.byTag)
    .sort(([, a], [, b]) => b - a)
    .forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count} images`);
    });

  console.log('\n📈 Size Statistics:');
  console.log(`   Smallest: ${(report.sizeStats.smallest.bytes / 1024).toFixed(2)} KB`);
  console.log(`   Largest: ${(report.sizeStats.largest.bytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `   Average: ${(report.sizeStats.averageBytes / 1024).toFixed(2)} KB\n`
  );
}
