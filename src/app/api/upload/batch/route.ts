import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processImage, validateImageFile } from '@/lib/imageProcessing';

// POST /api/upload/batch - Upload multiple images
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const productId = formData.get('productId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files per upload' },
        { status: 400 }
      );
    }

    // Verify product exists
    let product = null;
    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
    }

    // Process all files
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Validate image
        const validation = validateImageFile(file);
        if (!validation.valid) {
          errors.push({
            file: file.name,
            error: validation.error,
          });
          continue;
        }

        // Process image
        const processedImage = await processImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 85,
          format: 'webp',
        });

        let productImage = null;

        // Save to database if productId provided
        if (productId && product) {
          productImage = await prisma.productImage.create({
            data: {
              productId,
              url: processedImage.publicUrl,
              altText: product.name,
              order: i,
            },
          });
        }

        results.push({
          url: processedImage.publicUrl,
          filename: processedImage.filename,
          width: processedImage.width,
          height: processedImage.height,
          size: processedImage.size,
          productImage,
        });
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        errors.push({
          file: file.name,
          error: 'Failed to process image',
        });
      }
    }

    return NextResponse.json(
      {
        success: results.length > 0,
        data: {
          uploaded: results,
          failed: errors,
          count: {
            success: results.length,
            failed: errors.length,
          },
        },
      },
      { status: results.length > 0 ? 201 : 400 }
    );
  } catch (error) {
    console.error('Batch upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
