import sharp from 'sharp';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ProcessedImage {
  filename: string;
  path: string;
  publicUrl: string;
  width?: number;
  height?: number;
  size: number;
}

const DEFAULT_OPTIONS: ImageProcessingOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 80,
  format: 'webp',
};

export async function processImage(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Read file buffer
  const buffer = await file.arrayBuffer();
  const imageBuffer = Buffer.from(buffer);

  // Process image with sharp
  let processedBuffer = sharp(imageBuffer);

  // Resize if dimensions provided
  if (opts.maxWidth || opts.maxHeight) {
    processedBuffer = processedBuffer.resize(opts.maxWidth, opts.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert to specified format and quality
  const format = opts.format || 'webp';
  if (format === 'jpeg') {
    processedBuffer = processedBuffer.jpeg({ quality: opts.quality });
  } else if (format === 'png') {
    processedBuffer = processedBuffer.png();
  } else {
    processedBuffer = processedBuffer.webp({ quality: opts.quality });
  }

  const outputBuffer = await processedBuffer.toBuffer();

  // Save to disk
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const ext = format;
  const filename = `img-${timestamp}-${random}.${ext}`;
  const filepath = join(uploadDir, filename);
  const publicUrl = `/uploads/${filename}`;

  await writeFile(filepath, outputBuffer);

  // Get image metadata
  const metadata = await sharp(outputBuffer).metadata();

  return {
    filename,
    path: filepath,
    publicUrl,
    width: metadata.width,
    height: metadata.height,
    size: outputBuffer.length,
  };
}

export async function generateThumbnail(
  imageBuffer: Buffer,
  size: number = 300,
  format: 'jpeg' | 'png' | 'webp' = 'webp'
): Promise<Buffer> {
  let processor = sharp(imageBuffer).resize(size, size, {
    fit: 'cover',
    position: 'center',
  });

  if (format === 'jpeg') {
    processor = processor.jpeg({ quality: 80 });
  } else if (format === 'png') {
    processor = processor.png();
  } else {
    processor = processor.webp({ quality: 80 });
  }

  return processor.toBuffer();
}

export function validateImageFile(
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  return { valid: true };
}
