/**
 * API Route: Search Recently Added Cloudinary Images
 * GET /api/cloudinary/images
 * POST /api/cloudinary/search
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  searchImages,
  findRecentImages,
  findUntaggedImages,
  findImagesByTags,
} from '@/lib/cloudinary-search';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'search'; // 'search', 'recent', 'untagged'
    const days = parseInt(searchParams.get('days') || '7');
    const limit = parseInt(searchParams.get('limit') || '50');

    let results = [];

    switch (type) {
      case 'recent':
        console.log(`🔍 Finding images from last ${days} days...`);
        results = await findRecentImages(days, limit);
        break;

      case 'untagged':
        console.log('🔍 Finding untagged images...');
        results = await findUntaggedImages();
        break;

      case 'search':
      default:
        if (!query) {
          return NextResponse.json(
            { error: 'Query parameter required for search' },
            { status: 400 }
          );
        }
        console.log(`🔍 Searching for: "${query}"`);
        results = await searchImages(query, { limit });
        break;
    }

    // Format results for API
    const formatted = results.map((img) => ({
      publicId: img.public_id,
      url: img.secure_url || img.url,
      folder: img.folder || 'root',
      width: img.width,
      height: img.height,
      size: {
        bytes: img.bytes,
        kb: Math.round(img.bytes / 1024),
        mb: (img.bytes / 1024 / 1024).toFixed(2),
      },
      format: img.format,
      createdAt: img.created_at,
      tags: img.tags || [],
    }));

    return NextResponse.json({
      success: true,
      query,
      type,
      count: formatted.length,
      results: formatted,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search images', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, tags, folder, limit = 50 } = body;

    let results = [];

    if (tags && tags.length > 0) {
      console.log(`🔍 Finding images with tags: ${tags.join(', ')}`);
      results = await findImagesByTags(tags, limit);
    } else if (query) {
      console.log(`🔍 Searching for: "${query}"`);
      results = await searchImages(query, { folder, limit });
    } else {
      return NextResponse.json(
        { error: 'Either "query" or "tags" required' },
        { status: 400 }
      );
    }

    // Format results
    const formatted = results.map((img) => ({
      publicId: img.public_id,
      url: img.secure_url || img.url,
      folder: img.folder || 'root',
      width: img.width,
      height: img.height,
      size: {
        bytes: img.bytes,
        kb: Math.round(img.bytes / 1024),
        mb: (img.bytes / 1024 / 1024).toFixed(2),
      },
      format: img.format,
      createdAt: img.created_at,
      tags: img.tags || [],
    }));

    return NextResponse.json({
      success: true,
      query,
      tags,
      count: formatted.length,
      results: formatted,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search images', details: String(error) },
      { status: 500 }
    );
  }
}
