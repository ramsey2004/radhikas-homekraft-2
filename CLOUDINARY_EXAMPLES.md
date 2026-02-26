# Cloudinary Implementation Examples

## Component Usage Examples

### 1. Product Card with Cloudinary

```tsx
// components/ProductCard.tsx
import CloudinaryImage from '@/components/CloudinaryImage';

interface ProductCardProps {
  id: string;
  name: string;
  cloudinaryPublicId: string;
  price: number;
}

export default function ProductCard({ name, cloudinaryPublicId, price }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <CloudinaryImage
        publicId={cloudinaryPublicId}
        alt={name}
        width={300}
        height={300}
      />
      <div className="p-4">
        <h3>{name}</h3>
        <p className="text-lg font-bold">₹{price}</p>
      </div>
    </div>
  );
}
```

### 2. Product Gallery with Multiple Images

```tsx
// components/ProductGallery.tsx
import CloudinaryImage from '@/components/CloudinaryImage';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[]; // Array of Cloudinary public IDs
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Main Image */}
      <div className="flex-1">
        <CloudinaryImage
          publicId={images[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          width={600}
          height={600}
          priority
          quality="high"
        />
      </div>

      {/* Thumbnails */}
      <div className="w-24 flex flex-col gap-2">
        {images.map((publicId, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`border-2 ${
              idx === selectedIndex ? 'border-blue-600' : 'border-gray-200'
            }`}
          >
            <CloudinaryImage
              publicId={publicId}
              alt={`Thumbnail ${idx + 1}`}
              width={100}
              height={100}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 3. Hero Banner

```tsx
// app/page.tsx
import CloudinaryImage from '@/components/CloudinaryImage';

export default function HomePage() {
  return (
    <section className="relative w-full h-96 md:h-screen overflow-hidden">
      <CloudinaryImage
        publicId="luxury-collection/hero-banner-2024"
        alt="Hero Banner - New Luxury Collection"
        width={1920}
        height={1080}
        fill
        priority
        quality="high"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Luxury Handcrafted Collection</h1>
          <button className="bg-gold px-8 py-3 rounded-lg font-semibold">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
```

### 4. Product Grid

```tsx
// app/products/page.tsx
import CloudinaryProductCard from '@/components/CloudinaryProductCard';

export default function ProductsPage() {
  const products = [
    {
      id: '1',
      publicId: 'products/handmade-vase-01',
      title: 'Golden Handmade Vase',
      price: 4599,
      originalPrice: 5999,
      rating: 4.8,
      reviews: 24,
    },
    // ... more products
  ];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Our Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <CloudinaryProductCard
            key={product.id}
            publicId={product.publicId}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            reviews={product.reviews}
          />
        ))}
      </div>
    </div>
  );
}
```

### 5. Team/Artisan Gallery

```tsx
// components/ArtisanGallery.tsx
import CloudinaryImage from '@/components/CloudinaryImage';

interface Artisan {
  id: string;
  name: string;
  cloudinaryPublicId: string;
  speciality: string;
}

export default function ArtisanGallery({ artisans }: { artisans: Artisan[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {artisans.map((artisan) => (
        <div key={artisan.id} className="text-center group">
          <div className="relative overflow-hidden rounded-lg mb-4 h-80">
            <CloudinaryImage
              publicId={artisan.cloudinaryPublicId}
              alt={artisan.name}
              width={400}
              height={500}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-xl font-semibold">{artisan.name}</h3>
          <p className="text-gray-600">{artisan.speciality}</p>
        </div>
      ))}
    </div>
  );
}
```

### 6. Responsive Image with Utilities

```tsx
// components/ResponsiveProductImage.tsx
import CloudinaryImage from '@/components/CloudinaryImage';
import { getCloudinaryProduct, getCloudinaryThumbnail } from '@/lib/cloudinary';

export default function ResponsiveProductImage({ publicId }: { publicId: string }) {
  return (
    <div className="space-y-4">
      {/* Full size */}
      <CloudinaryImage
        publicId={publicId}
        alt="Product"
        width={600}
        height={600}
        quality="auto"
      />

      {/* Using utility function */}
      <img
        src={getCloudinaryProduct(publicId)}
        alt="Product optimized"
      />

      {/* Thumbnail */}
      <img
        src={getCloudinaryThumbnail(publicId, 200)}
        alt="Thumbnail"
        className="w-20 h-20"
      />
    </div>
  );
}
```

### 7. Dynamic Image Loading

```tsx
// components/LazygImageGallery.tsx
'use client';

import CloudinaryImage from '@/components/CloudinaryImage';
import { useEffect, useState } from 'react';

export default function LazyImageGallery({ publicIds }: { publicIds: string[] }) {
  const [visibleImages, setVisibleImages] = useState<Set<string>>(
    new Set([publicIds[0]]) // Load first image immediately
  );

  const handleImageLoad = (publicId: string) => {
    setVisibleImages((prev) => new Set([...prev, publicId]));
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {publicIds.map((publicId) => (
        visibleImages.has(publicId) && (
          <CloudinaryImage
            key={publicId}
            publicId={publicId}
            alt="Gallery image"
            width={300}
            height={300}
            onLoad={() => handleImageLoad(publicId)}
          />
        )
      ))}
    </div>
  );
}
```

### 8. Image with Fallback

```tsx
// components/SafeCloudinaryImage.tsx
import CloudinaryImage from '@/components/CloudinaryImage';

interface SafeCloudinaryImageProps {
  publicId: string | null;
  fallbackPublicId?: string;
  alt: string;
  [key: string]: any;
}

export default function SafeCloudinaryImage({
  publicId,
  fallbackPublicId = 'placeholder/product-placeholder',
  alt,
  ...props
}: SafeCloudinaryImageProps) {
  return (
    <CloudinaryImage
      publicId={publicId || fallbackPublicId}
      alt={alt}
      {...props}
    />
  );
}
```

## Database Integration

### 1. Add to Prisma Schema

```prisma
// prisma/schema.prisma
model Product {
  id                    String   @id @default(cuid())
  name                  String
  description           String?
  cloudinaryPublicId    String   // Main product image
  cloudinaryGallery     String[] // Multiple images (stored as JSON array)
  
  // ... other fields
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

### 2. Seed Data with Cloudinary Images

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Handmade Golden Vase',
      cloudinaryPublicId: 'products/vase-gold-01',
      cloudinaryGallery: [
        'products/vase-gold-01',
        'products/vase-gold-02',
        'products/vase-gold-03',
      ],
      price: 4599,
    },
    {
      name: 'Copper Wall Art',
      cloudinaryPublicId: 'products/wall-art-copper',
      cloudinaryGallery: [
        'products/wall-art-copper',
        'products/wall-art-copper-alt',
      ],
      price: 2999,
    },
    // Add more products mapping your 240 images from Cloudinary
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## API Routes

### 1. Get Product with Images

```typescript
// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
```

## Performance Tips

1. **Always specify width/height** to prevent layout shifts
2. **Use `priority={true}`** only for above-the-fold images
3. **Set appropriate `quality`** based on context:
   - Thumbnails: `quality={60}`
   - Product cards: `quality={auto}`
   - Detail pages: `quality="high"`
4. **Use `sizes` prop** for responsive images
5. **Leverage utility functions** for consistency

## Testing

```typescript
// __tests__/cloudinary.test.tsx
import { render } from '@testing-library/react';
import CloudinaryImage from '@/components/CloudinaryImage';
import { getCloudinaryUrl, getCloudinaryProduct } from '@/lib/cloudinary';

describe('Cloudinary Integration', () => {
  it('should render CloudinaryImage', () => {
    render(
      <CloudinaryImage
        publicId="test-image"
        alt="Test"
        width={300}
        height={300}
      />
    );
  });

  it('should generate correct URLs', () => {
    const url = getCloudinaryUrl('test-image', { width: 300, height: 300 });
    expect(url).toContain('res.cloudinary.com');
    expect(url).toContain('w_300');
    expect(url).toContain('h_300');
  });

  it('should generate product image URL', () => {
    const url = getCloudinaryProduct('product-image');
    expect(url).toContain('c_fill');
    expect(url).toContain('g_face');
  });
});
```

---

These examples show how to integrate your 240 Cloudinary images throughout your e-commerce site. Start with the Product Card example and expand from there! 🚀
