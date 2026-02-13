# Image Handling - Quick Implementation Guide

## 🎯 Priority 1: Fix Text/Emoji Display (1 hour)

### Issue Overview
5 components are currently displaying image paths as text or emoji instead of actual Image components.

---

## Component 1: Product Detail Page
**File:** [src/app/products/[slug]/page.tsx](src/app/products/[slug]/page.tsx#L125-L150)

### BEFORE (Current - Broken)
```tsx
<div className="mb-4 h-96 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center overflow-hidden">
  <div className="text-8xl animate-bounce">{product.images[selectedImage]}</div>
</div>
```
**Problem:** Shows `/images/products/bedsheet-indigo-1.jpg` as bouncing text

### AFTER (Fixed)
```tsx
import Image from 'next/image';

<div className="mb-4 h-96 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center overflow-hidden relative">
  <Image
    src={product.images[selectedImage]}
    alt={`${product.name} - Image ${selectedImage + 1}`}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
    priority={selectedImage === 0}
  />
</div>
```

### Thumbnail Gallery
```tsx
<div className="flex gap-2 overflow-x-auto pb-2">
  {product.images.map((image, idx) => (
    <button
      key={idx}
      onClick={() => setSelectedImage(idx)}
      className={`flex-shrink-0 h-20 w-20 rounded-lg flex items-center justify-center relative ${
        selectedImage === idx
          ? 'ring-2 ring-primary-600'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <Image
        src={image}
        alt={`${product.name} thumbnail ${idx + 1}`}
        fill
        className="object-cover"
        sizes="80px"
      />
    </button>
  ))}
</div>
```

---

## Component 2: QuickView Modal
**File:** [src/components/QuickView.tsx](src/components/QuickView.tsx#L88-L96)

### BEFORE
```tsx
<div className="flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg h-96">
  <div className="text-8xl">{product.image}</div>
</div>
```

### AFTER
```tsx
import Image from 'next/image';

<div className="relative w-full h-96 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg overflow-hidden">
  <Image
    src={product.image}
    alt={`${product.name} - Quick View`}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

---

## Component 3: Cart Page
**File:** [src/app/cart/page.tsx](src/app/cart/page.tsx#L77-L85)

### BEFORE
```tsx
<div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-3xl">
  {item.images?.[0] || '🎨'}
</div>
```

### AFTER
```tsx
import Image from 'next/image';

<div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
  {item.images?.[0] ? (
    <Image
      src={item.images[0]}
      alt={`${item.name} in cart`}
      fill
      className="object-cover"
      sizes="96px"
    />
  ) : (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary-100 to-secondary-100 text-2xl">
      🎨
    </div>
  )}
</div>
```

---

## Component 4: Checkout Page
**File:** [src/app/checkout/page.tsx](src/app/checkout/page.tsx#L247-L260)

### BEFORE
```tsx
<div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
  {item.product.images[0]}
</div>
```

### AFTER
```tsx
import Image from 'next/image';

<div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
  {item.product.images?.[0] ? (
    <Image
      src={item.product.images[0]}
      alt={`${item.product.name}`}
      fill
      className="object-cover"
      sizes="80px"
    />
  ) : (
    <div className="flex items-center justify-center h-full text-gray-400">
      No image
    </div>
  )}
</div>
```

---

## Component 5: RecentlyViewed
**File:** [src/components/RecentlyViewed.tsx](src/components/RecentlyViewed.tsx#L58-L68)

### BEFORE
```tsx
<div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
  {product.images[0]}
</div>
```

### AFTER
```tsx
import Image from 'next/image';

<div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-primary-100 group-hover:scale-110 transition-transform flex-shrink-0">
  {product.images?.[0] ? (
    <Image
      src={product.images[0]}
      alt={`${product.name}`}
      fill
      className="object-cover"
      sizes="64px"
    />
  ) : (
    <div className="flex items-center justify-center h-full text-sm font-bold text-slate-400">
      {product.name.charAt(0)}
    </div>
  )}
</div>
```

---

## Fix 2: Add Alt Text to ProductCard
**File:** [src/components/ProductCard.tsx](src/components/ProductCard.tsx#L98-L110)

### BEFORE
```tsx
<Image
  src={image}
  alt={name}
  fill
  className="object-cover group-hover/image:scale-110 transition-transform duration-300"
  onError={() => setImageError(true)}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### AFTER
```tsx
<Image
  src={image}
  alt={`${name} - ${material || 'handcrafted item'}`}
  fill
  className="object-cover group-hover/image:scale-110 transition-transform duration-300"
  onError={() => setImageError(true)}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false}
/>
```

---

## Fix 3: Upgrade ProductCard to Use OptimizedImage
**File:** [src/components/ProductCard.tsx](src/components/ProductCard.tsx)

### Option A: Use OptimizedImage Component
```tsx
import OptimizedImage from '@/components/OptimizedImage';

{isImagePath && !imageError ? (
  <div className="w-full h-full relative group/image">
    <OptimizedImage
      src={image}
      alt={`${name} - ${material || 'handcrafted item'}`}
      width={400}
      height={400}
      className="group-hover/image:scale-110 transition-transform duration-300"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
) : (
  // Fallback gradient placeholder
)}
```

### Option B: Enhance with Loading State
```tsx
import OptimizedImage from '@/components/OptimizedImage';
import { useState } from 'react';

export default function ProductCard({ ... }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    // ... existing structure
    {isImagePath && !imageError ? (
      <>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse z-10" />
        )}
        <OptimizedImage
          src={image}
          alt={`${name} - ${material}`}
          width={400}
          height={400}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </>
    ) : (
      // Fallback
    )}
  );
}
```

---

## 🎯 Priority 2: Set Up Image Directory Structure (15 min)

### Create Folders
```bash
mkdir -p public/images/products
mkdir -p public/images/hero
mkdir -p public/images/artisans
```

### Verify Structure
```
/public
├── images/
│   ├── products/          (30 product images go here)
│   ├── hero/              (banner images)
│   ├── artisans/          (profile photos)
│   └── ui/                (patterns, textures)
├── manifest.json
└── sw.js
```

---

## 🎯 Priority 3: Prepare Image Files

### File Naming Convention
```
Format: {category}-{name}-{number}.{format}

Examples:
✅ bedsheet-indigo-1.jpg
✅ bedsheet-indigo-2.jpg
✅ rug-red-gold-1.jpg
```

### Required Images
```
Product: 10 total (from products.ts)
├── Bedsheets: bedsheet-indigo-{1,2,3}.jpg
├── Rugs: rug-red-gold-{1,2,3}.jpg
├── Cushions: cushion-embroidered-{1,2,3}.jpg
└── Curtains: curtain-ethnic-{1,2,3}.jpg

Plus 7 more products × 3 images each = 21 total product images
Plus hero image(s) for /images/hero/
```

---

## 🎯 Priority 4: Add Image Preloading (Optional but Recommended)

### Create Preloader Component
**File:** `src/components/ImagePreloader.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { PRODUCTS } from '@/data/products';

export default function ImagePreloader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Preload hero image
    const heroLink = document.createElement('link');
    heroLink.rel = 'preload';
    heroLink.as = 'image';
    heroLink.href = '/images/hero/banner.jpg';
    document.head.appendChild(heroLink);

    // Preload featured products (first 3)
    PRODUCTS.slice(0, 3).forEach(product => {
      if (product.images[0]) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = product.images[0];
        document.head.appendChild(link);
      }
    });
  }, []);

  return null;
}
```

### Use in Layout
```tsx
import ImagePreloader from '@/components/ImagePreloader';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ImagePreloader />
        {children}
      </body>
    </html>
  );
}
```

---

## 📊 Testing Checklist

After making changes, verify:

- [ ] Product detail page shows actual image (not text)
- [ ] Image thumbnails clickable and change main image
- [ ] Cart page shows product thumbnails
- [ ] Checkout shows product images
- [ ] RecentlyViewed shows product images
- [ ] All images have descriptive alt text
- [ ] Images load responsively on mobile
- [ ] No console errors about missing images
- [ ] Images have blur placeholders while loading (if using OptimizedImage)
- [ ] Next.js Image component working (inspect `<img srcset>`)

---

## 🔧 Troubleshooting

### Images Still Show as Text
**Check:** 
1. Verify `/public/images/products/` folder exists
2. Verify image filenames match exactly in products.ts
3. Check browser console for 404 errors
4. Files are using forward slashes: `/images/products/file.jpg`

### Image Won't Load
**Check:**
1. File extension is correct (.jpg, .png, .webp)
2. File is in correct folder
3. Filename matches exactly (case-sensitive on Linux/Mac)
4. Image file is not corrupted

### Build Errors
**If error about Image component:**
```tsx
import Image from 'next/image';  // Must import
```

**If error about sizes attribute:**
```tsx
// Must have sizes attr for fill images
<Image 
  src={image} 
  alt="text"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"  // Required
/>
```

---

## Performance Optimization Tips

### Image File Sizes
**Target:** 150-200KB per image
**Tools:**
```bash
# Using TinyPNG CLI
npm install -g tinypng-cli

# Compress folder
tinypng public/images/

# Or using imagemin
npx imagemin public/images/**/*.jpg --out-dir=public/images/
```

### Format Optimization
**Next.js automatically serves:**
- AVIF (if browser supports) - smallest
- WebP (if browser supports) - medium
- JPEG/PNG fallback - largest

**You provide:** Single JPG/PNG file, Next.js handles rest

### Responsive Sizes Attribute
```tsx
// Mobile: 100vw, Tablet: 50vw, Desktop: 400px
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
```

---

## Timeline

```
Day 1 (1-2 hours):
  ✅ Update 5 components to use Image
  ✅ Add alt text to ProductCard
  ✅ Create image directories

Day 2-3 (1-2 days):
  ✅ Obtain 30 product images
  ✅ Optimize/resize images
  ✅ Place in /public/images/products/

Day 4 (30 min):
  ✅ Test all pages
  ✅ Verify images load correctly
  ✅ Check performance

Day 5+ (Optional):
  ✅ Set up image preloading
  ✅ Configure CDN (Cloudinary)
  ✅ Monitor metrics
```

---

## Code Changes Summary

**Files to Modify (5 files, ~30 lines changed per file):**

1. ✏️ [src/app/products/[slug]/page.tsx](src/app/products/[slug]/page.tsx) - Replace text display
2. ✏️ [src/components/QuickView.tsx](src/components/QuickView.tsx) - Use Image component
3. ✏️ [src/app/cart/page.tsx](src/app/cart/page.tsx) - Add Image wrapper
4. ✏️ [src/app/checkout/page.tsx](src/app/checkout/page.tsx) - Add Image wrapper
5. ✏️ [src/components/RecentlyViewed.tsx](src/components/RecentlyViewed.tsx) - Use Image component
6. ✏️ [src/components/ProductCard.tsx](src/components/ProductCard.tsx) - Add alt text and optional OptimizedImage

**Files to Create (1 file, 40 lines):**
- ➕ `src/components/ImagePreloader.tsx` (optional)

**Folders to Create:**
- ➕ `/public/images/products/`
- ➕ `/public/images/hero/`
- ➕ `/public/images/artisans/`

---

## Next Steps

1. ✅ Read this guide
2. ✅ Review [IMAGE_OPTIMIZATION_ANALYSIS.md](IMAGE_OPTIMIZATION_ANALYSIS.md) for context
3. 👉 **Update the 5 components above**
4. 👉 **Create directory structure**
5. 👉 **Add product images**
6. 👉 **Test locally**
7. 👉 **Deploy**

Each component takes 5-10 minutes to update. Total time: **1 hour for all components**.
