/**
 * Cloudinary API Service
 * Wrapper for Cloudinary Admin API to fetch, search, organize images
 */

import axios from 'axios';
import { createHash } from 'crypto';

const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1';
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dk1ovmxuj';

// Get API credentials at runtime to support dynamic loading (e.g., dotenv)
function getCredentials() {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return { apiKey, apiSecret };
}

interface CloudinaryResource {
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  tags: string[];
  folder: string;
  secure_url: string;
  url: string;
  type: string;
  resource_type: string;
  bytes_value?: number;
  [key: string]: any;
}

interface CloudinarySearchResult {
  resources: CloudinaryResource[];
  total_count: number;
  next_cursor?: string;
  time?: number;
  rate_limit_allowed?: number;
  rate_limit_reset_at?: string;
  rate_limit_remaining?: number;
}

interface CloudinaryListOptions {
  max_results?: number;
  prefix?: string; // Filter by folder prefix
  tags?: string[]; // Filter by tags
  resource_type?: string; // 'image', 'video', 'raw'
  type?: string; // 'upload', 'private', etc
  direction?: 'asc' | 'desc';
  next_cursor?: string;
}

/**
 * Generate authentication for Cloudinary API
 */
function generateAuth() {
  const { apiKey, apiSecret } = getCredentials();
  if (!apiKey || !apiSecret) {
    throw new Error('Cloudinary API credentials not set. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env');
  }
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  return `Basic ${auth}`;
}

/**
 * List all resources in Cloudinary
 */
export async function listCloudinaryResources(
  options: CloudinaryListOptions = {}
): Promise<CloudinarySearchResult> {
  const {
    max_results = 500,
    prefix,
    tags,
    resource_type = 'image',
    type = 'upload',
    direction = 'desc',
    next_cursor,
  } = options;

  try {
    const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/${resource_type}`;
    
    const params = new URLSearchParams({
      type,
      max_results: Math.min(max_results, 500).toString(),
      direction,
      ...(prefix && { prefix }),
      ...(next_cursor && { next_cursor }),
    });

    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }

    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: {
        Authorization: generateAuth(),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error listing Cloudinary resources:', error);
    throw error;
  }
}

/**
 * Search Cloudinary resources with advanced filtering
 */
export async function searchCloudinaryResources(params: {
  query?: string;
  folder?: string;
  tags?: string[];
  max_results?: number;
}): Promise<CloudinaryResource[]> {
  const { query, folder, tags, max_results = 500 } = params;

  try {
    const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/search`;
    
    const searchParams: any = {
      max_results: Math.min(max_results, 500),
    };

    if (query) {
      searchParams.expression = query;
    }
    if (folder) {
      searchParams.expression = `${searchParams.expression || ''} folder:"${folder}"`.trim();
    }
    if (tags && tags.length > 0) {
      const tagExpr = tags.map(tag => `tags="${tag}"`).join(' OR ');
      searchParams.expression = `${searchParams.expression || ''} (${tagExpr})`.trim();
    }

    const response = await axios.post(url, searchParams, {
      headers: {
        Authorization: generateAuth(),
        'Content-Type': 'application/json',
      },
    });

    return response.data.resources || [];
  } catch (error) {
    console.error('Error searching Cloudinary resources:', error);
    throw error;
  }
}

/**
 * Get detailed info about a single resource
 */
export async function getCloudinaryResource(publicId: string): Promise<CloudinaryResource> {
  try {
    const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/image/upload/${publicId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: generateAuth(),
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching resource ${publicId}:`, error);
    throw error;
  }
}

/**
 * Add tags to resources
 */
export async function tagCloudinaryResources(
  publicIds: string[],
  tags: string[]
): Promise<any> {
  try {
    const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/image/upload/update_tag`;

    const response = await axios.post(
      url,
      {
        resource_ids: publicIds,
        tags,
      },
      {
        headers: {
          Authorization: generateAuth(),
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error tagging resources:', error);
    throw error;
  }
}

/**
 * Rename/move a resource
 */
export async function renameCloudinaryResource(
  fromPublicId: string,
  toPublicId: string
): Promise<any> {
  try {
    const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/image/upload/rename`;

    const response = await axios.post(
      url,
      {
        from_public_id: fromPublicId,
        to_public_id: toPublicId,
        overwrite: false,
      },
      {
        headers: {
          Authorization: generateAuth(),
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error renaming resource ${fromPublicId}:`, error);
    throw error;
  }
}

/**
 * Delete a resource
 */
export async function deleteCloudinaryResource(publicId: string): Promise<any> {
  try {
    const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/image/upload`;

    const response = await axios.delete(`${url}/${publicId}`, {
      headers: {
        Authorization: generateAuth(),
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error deleting resource ${publicId}:`, error);
    throw error;
  }
}

/**
 * Get all resources recursively (handles pagination)
 */
export async function getAllCloudinaryResources(
  prefix?: string,
  allResources: CloudinaryResource[] = []
): Promise<CloudinaryResource[]> {
  try {
    const result = await listCloudinaryResources({
      max_results: 500,
      prefix,
      resource_type: 'image',
    });

    allResources.push(...result.resources);

    // If there are more results, fetch them
    if (result.next_cursor) {
      return getAllCloudinaryResources(prefix, allResources);
    }

    return allResources;
  } catch (error) {
    console.error('Error fetching all resources:', error);
    throw error;
  }
}

/**
 * Get resources by folder
 */
export async function getCloudinaryResourcesByFolder(
  folder: string
): Promise<CloudinaryResource[]> {
  try {
    return await getAllCloudinaryResources(folder);
  } catch (error) {
    console.error(`Error fetching resources for folder ${folder}:`, error);
    throw error;
  }
}

/**
 * Organize images by creating folders and tagging
 */
export async function organizeCloudinaryImages(
  imageOrganization: Array<{
    publicIds: string[];
    folder?: string;
    tags?: string[];
  }>
): Promise<void> {
  for (const group of imageOrganization) {
    const { publicIds, tags } = group;

    // Tag resources
    if (tags && tags.length > 0) {
      await tagCloudinaryResources(publicIds, tags);
      console.log(`Tagged ${publicIds.length} images with: ${tags.join(', ')}`);
    }

    // Note: Folder organization is done during upload, not after
    // You can tag for categorization instead
  }
}

/**
 * Get image stats
 */
export async function getCloudinaryStats(): Promise<{
  total_images: number;
  total_size_bytes: number;
  total_size_mb: number;
  by_folder: Record<string, { count: number; size: number }>;
}> {
  try {
    const allImages = await getAllCloudinaryResources();

    const stats = {
      total_images: allImages.length,
      total_size_bytes: 0,
      total_size_mb: 0,
      by_folder: {} as Record<string, { count: number; size: number }>,
    };

    for (const image of allImages) {
      stats.total_size_bytes += image.bytes;

      const folder = image.folder || 'root';
      if (!stats.by_folder[folder]) {
        stats.by_folder[folder] = { count: 0, size: 0 };
      }
      stats.by_folder[folder].count++;
      stats.by_folder[folder].size += image.bytes;
    }

    stats.total_size_mb = Math.round((stats.total_size_bytes / 1024 / 1024) * 100) / 100;

    return stats;
  } catch (error) {
    console.error('Error getting Cloudinary stats:', error);
    throw error;
  }
}

/**
 * Export inventory as JSON
 */
export async function exportCloudinaryInventory(): Promise<{
  exportedAt: string;
  cloudName: string;
  totalImages: number;
  images: CloudinaryResource[];
  stats: Awaited<ReturnType<typeof getCloudinaryStats>>;
}> {
  const allImages = await getAllCloudinaryResources();
  const stats = await getCloudinaryStats();

  return {
    exportedAt: new Date().toISOString(),
    cloudName: CLOUD_NAME,
    totalImages: allImages.length,
    images: allImages,
    stats,
  };
}
