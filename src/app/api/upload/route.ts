import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processImage, validateImageFile } from '@/lib/imageProcessing';
import { join } from 'path';

// POST /api/upload - Upload and process image(s)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;
    const altText = formData.get('altText') as string;
    const caption = formData.get('caption') as string;
    const order = parseInt(formData.get('order') as string) || 0;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate image file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Process image
    const processedImage = await processImage(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 85,
      format: 'webp',
    });

    let productImage = null;

    // If productId provided, save to database
    if (productId) {
      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      productImage = await prisma.productImage.create({
        data: {
          productId,
          url: processedImage.publicUrl,
          altText: altText || product.name,
          caption: caption || undefined,
          order,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          url: processedImage.publicUrl,
          filename: processedImage.filename,
          width: processedImage.width,
          height: processedImage.height,
          size: processedImage.size,
          productImage,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/:filename - Delete uploaded image
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const imageId = searchParams.get('imageId');

    if (!filename && !imageId) {
      return NextResponse.json({ error: 'Filename or imageId is required' }, { status: 400 });
    }

    if (imageId) {
      // Delete from database
      const image = await prisma.productImage.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }

      await prisma.productImage.delete({
        where: { id: imageId },
      });

      // Extract filename from URL
      const filenameToDelete = image.url.split('/').pop();
      if (filenameToDelete) {
        const filepath = join(process.cwd(), 'public', 'uploads', filenameToDelete);
        try {
          const fs = await import('fs');
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
