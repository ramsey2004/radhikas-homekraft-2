/**
 * API Route: Manage Cloudinary Images
 * POST /api/cloudinary/manage
 * - Tag images
 - Auto-organize
 - Bulk update
 */

import { NextRequest, NextResponse } from 'next/server';
import { tagCloudinaryResources } from '@/lib/cloudinary-admin';
import { autoOrganizeImages } from '@/lib/cloudinary-search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, publicIds, tags } = body;

    // Verify authorization (add your auth check here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let result = {};

    switch (action) {
      case 'tag':
        if (!publicIds || !Array.isArray(publicIds) || !tags || !Array.isArray(tags)) {
          return NextResponse.json(
            { error: 'publicIds and tags arrays required' },
            { status: 400 }
          );
        }
        console.log(`📝 Tagging ${publicIds.length} images with: ${tags.join(', ')}`);
        result = await tagCloudinaryResources(publicIds, tags);
        break;

      case 'organize':
        console.log('🔄 Auto-organizing images...');
        result = await autoOrganizeImages();
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Management failed', details: String(error) },
      { status: 500 }
    );
  }
}
