# Cloudinary Migration Guide

## Overview

You have 240 images in your Cloudinary media library. This guide helps you:
1. Identify and organize your images
2. Map them to your products in the database
3. Migrate from local/external images to Cloudinary
4. Validate the migration

## Step 1: Export Your Cloudinary Images List

### Option A: Use Cloudinary Dashboard

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Click **Media Library**
3. Select all images (or organize by folder/tag first)
4. You'll see the **Public ID** of each image

### Option B: Use Cloudinary API

```bash
# Get list of all images in your account
curl -u "your_api_key:your_api_secret" \
  "https://api.cloudinary.com/v1_1/dk1ovmxuj/resources/image?max_results=500"
```

### Public ID Format

If your image is uploaded as:
- `products/handmade-vase-01.jpg` → Public ID = `products/handmade-vase-01`
- `collection/2024/hero.png` → Public ID = `collection/2024/hero`

**Important**: Public IDs don't include file extensions!

## Step 2: Create a Mapping Document

Create a spreadsheet (CSV/Excel) mapping your products:

```
product_name,current_image_url,cloudinary_public_id,notes
"Golden Vase","https://old-cdn.com/vase.jpg","products/vase-gold-01","Main product image"
"Copper Bowl","https://old-cdn.com/bowl.jpg","products/bowl-copper","High quality 1200x1200"
```

## Step 3: Organize Images in Cloudinary

### Best Practices

Create folder structure:
```
/products          - Individual product images
/products/gallery  - Product gallery/alternate views
/collections       - Collection banners
/heroes            - Homepage hero images
/testimonials      - Customer testimonials
/artisans          - Artisan profiles
```

### Use Cloudinary Tags

Tag images for easy filtering:

```bash
# Tag an image
curl -X POST \
  -u "api_key:api_secret" \
  https://api.cloudinary.com/v1_1/dk1ovmxuj/resources/image/update_tag \
  -d "resource_ids[]=products/vase-gold-01&tags[]=product,featured"
```

Tags help with:
- Finding images by category
- Batch operations
- Analytics tracking

## Step 4: Update Your Database

### Migration Script

Create a migration file:

```typescript
// prisma/migrations/[timestamp]_add_cloudinary_ids.sql
-- Add cloudinaryPublicId column if needed
ALTER TABLE "Product" ADD COLUMN "cloudinaryPublicId" TEXT;
ALTER TABLE "Product" ADD COLUMN "cloudinaryGallery" JSONB DEFAULT '[]';

-- Update with mapping data
UPDATE "Product" 
SET "cloudinaryPublicId" = 'products/vase-gold-01'
WHERE "id" = 'product-1';
```

### or TypeScript Migration

```typescript
// scripts/migrate-to-cloudinary.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productMappings = [
  {
    productId: 'prod-123',
    cloudinaryPublicId: 'products/vase-gold-01',
    gallery: ['products/vase-gold-01', 'products/vase-gold-02'],
  },
  // ... more products
];

async function main() {
  for (const mapping of productMappings) {
    await prisma.product.update({
      where: { id: mapping.productId },
      data: {
        cloudinaryPublicId: mapping.cloudinaryPublicId,
        cloudinaryGallery: mapping.gallery,
      },
    });
  }
  console.log('Migration complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:
```bash
npx ts-node scripts/migrate-to-cloudinary.ts
```

## Step 5: Update Components

### Before (Local Images)

```tsx
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <Image
      src={`/images/products/${product.image}`}
      alt={product.name}
      width={300}
      height={300}
    />
  );
}
```

### After (Cloudinary Images)

```tsx
import CloudinaryImage from '@/components/CloudinaryImage';

export default function ProductCard({ product }) {
  return (
    <CloudinaryImage
      publicId={product.cloudinaryPublicId}
      alt={product.name}
      width={300}
      height={300}
    />
  );
}
```

## Step 6: Migrate Component Files

Find all components using images:

```bash
# Find Image components in product sections
grep -r "Image" src/app/products/ --include="*.tsx"
grep -r "img" src/components/ --include="*.tsx"
```

### Components to Update

1. **Product Pages**
   - `src/app/products/[id]/page.tsx`
   - `src/components/ProductCard.tsx`
   - `src/components/ProductGrid.tsx`

2. **Collections**
   - `src/app/collections/page.tsx`
   - `src/components/CollectionCard.tsx`

3. **Homepage**
   - `src/app/page.tsx`
   - Hero section
   - Featured products

4. **Gallery/Shop**
   - `src/components/Gallery.tsx`
   - `src/app/shop/page.tsx`

## Step 7: Validation Checklist

- [ ] All 240 images uploaded to Cloudinary
- [ ] Public IDs documented and mapped
- [ ] Database updated with Cloudinary IDs
- [ ] `CloudinaryImage` components installed
- [ ] Product page loads with Cloudinary images
- [ ] Images load correctly on mobile/tablet/desktop
- [ ] Images are faster than before
- [ ] Old image URLs removed from codebase
- [ ] Environment variable set (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`)
- [ ] Build completes without errors

## Step 8: Cleanup

### Remove Old Images

Once migration is complete:

```bash
# Delete old public image files
rm -rf public/images/products/*

# Or keep as backup in a backup folder
mkdir public/images/backup
mv public/images/* public/images/backup/
```

### Update Environment

```bash
# Verify env variables
grep -i cloudinary .env.local
# Should show: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dk1ovmxuj
```

## Performance Comparison

### Before (Local Images)
- Unoptimized file sizes  
- No lazy loading
- No format conversion
- Manual optimization needed

### After (Cloudinary)
```
✅ 30-50% smaller file sizes (auto-optimization)
✅ Automatic WebP/AVIF format selection
✅ Lazy loading built-in
✅ Global CDN (faster delivery)
✅ Device-aware optimization
✅ No build time image processing
```

## Troubleshooting

### Images Not Loading?

```bash
# Verify Image exists in Cloudinary
curl -u "api_key:api_secret" \
  https://api.cloudinary.com/v1_1/dk1ovmxuj/resources/image \
  | grep "products/vase-gold-01"
```

### Check Public ID Format

```typescript
// Valid public IDs:
✅ products/vase-gold-01
✅ collection/2024/hero-banner
✅ artisans/john-doe

// Invalid (don't use):
❌ products/vase-gold-01.jpg (include extension)
❌ /products/vase (leading slash)
❌ products/vase-gold-01.png (extension)
```

### Rebuild Cache

```bash
# Clear Next.js build cache
rm -rf .next/
npm run build
npm run dev
```

## Quick Migration Command

```bash
# One-line migration check
npm run db:push && npm run build && npm run dev
```

## Rollback Plan

If something goes wrong:

```bash
# Revert database
prisma migrate resolve --rolled-back "add_cloudinary_ids"

# Switch back to old image component
git checkout src/components/ProductCard.tsx

# Rebuild
npm run build
```

## Next Steps

After migration:

1. ✅ Set up image optimization in Cloudinary dashboard
2. ✅ Configure cache headers for better performance
3. ✅ Set up Cloudinary webhooks for sync
4. ✅ Enable security policies for image delivery
5. ✅ Monitor analytics and performance metrics

## Resources

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Cloudinary API Reference](https://cloudinary.com/documentation/cloudinary_api_reference)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations_reference)
- [Performance Optimization](https://cloudinary.com/documentation/responsive_images_in_nextjs)

---

This migration puts your 240 images on enterprise-grade CDN with automatic optimization! 🚀
