# Performance Optimization Setup Guide

## Quick Start (5 minutes)

### 1. Install Image Optimization Dependencies

```bash
npm install sharp glob --save-dev
```

### 2. Create Images Directory

```bash
mkdir -p public/images
# Add your product images here
```

### 3. Run Image Optimization

```bash
npm run optimize-images
```

This will create optimized WebP and AVIF versions in `public/images/optimized/`.

---

## Next.js Configuration (Required)

### Update `next.config.js`

Add image optimization config:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Modern format support
    formats: ['image/webp', 'image/avif'],
    
    // Responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache optimized images for 60 days
    minimumCacheTTL: 5184000,
    
    // External image domains (add your CDN)
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com', // If using Cloudinary
      // Add your domain here
    ],
    
    // Disable dangerouslyAllowSVG if not needed
    dangerouslyAllowSVG: false,
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Compress output
  compress: true,
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Production-only settings
  ...(process.env.NODE_ENV === 'production' && {
    swcMinify: true,
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
  }),
};

module.exports = nextConfig;
```

---

## CDN Setup Options

### Option 1: Vercel (Easiest - Free)

✅ **No setup needed!** Vercel automatically:
- Optimizes images on-the-fly
- Converts to WebP/AVIF
- Caches globally on their edge network
- Lazy loads images

Just deploy to Vercel and it works.

---

### Option 2: Cloudinary (Recommended for Scale)

#### Step 1: Sign up
1. Go to https://cloudinary.com/users/register/free
2. Note your Cloud Name, API Key, API Secret

#### Step 2: Install SDK
```bash
npm install next-cloudinary
```

#### Step 3: Add env variables
```bash
# .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Step 4: Upload images
```bash
# Upload via dashboard or CLI
cloudinary upload public/images/*.jpg
```

#### Step 5: Use in components
```tsx
import { CldImage } from 'next-cloudinary';

<CldImage
  src="products/blue-bedsheet" // Path in Cloudinary
  width={700}
  height={700}
  crop="fill"
  gravity="auto"
  alt="Blue Bedsheet"
  loading="lazy"
/>
```

**Benefits:**
- Automatic WebP/AVIF conversion
- Smart cropping with AI
- Responsive images
- 25GB storage free tier
- Lightning-fast CDN

---

### Option 3: Cloudflare R2 + Images

#### Step 1: Create R2 Bucket
1. Go to Cloudflare Dashboard → R2
2. Create bucket: `radhikas-products`

#### Step 2: Upload images
```bash
# Install Wrangler CLI
npm install -g wrangler

# Upload
wrangler r2 object put radhikas-products/bedsheet-1.jpg --file=public/images/bedsheet-1.jpg
```

#### Step 3: Enable Cloudflare Images
1. Go to Images → Enable service
2. Link to R2 bucket

#### Step 4: Use transformation URL
```tsx
<Image
  src="https://imagedelivery.net/YOUR_ACCOUNT_HASH/bedsheet-1/public"
  width={700}
  height={700}
  alt="Bedsheet"
/>
```

**Cost:** $5/month for 100k images

---

## Font Optimization (Next.js built-in)

### Update `app/layout.tsx`

```tsx
import { Inter, Playfair_Display } from 'next/font/google';

// Primary font - Light weights for luxury feel
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// Optional: Serif for headings
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false, // Only load when used
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

### Update `tailwind.config.ts`

```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
};
```

**Benefits:**
- Fonts self-hosted automatically
- No external requests to Google Fonts
- FOUT/FOIT eliminated
- Perfect Lighthouse score

---

## Bundle Size Optimization

### 1. Analyze Current Bundle

```bash
npm install @next/bundle-analyzer --save-dev
```

Update `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... your existing config
});
```

Run analysis:
```bash
ANALYZE=true npm run build
```

This opens a visual map of your bundle in the browser.

---

### 2. Dynamic Imports for Heavy Components

#### Before (loads everything upfront):
```tsx
import NewsletterSection from '@/components/Newsletter';
import TrustBadgesSection from '@/components/TrustBadges';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadgesSection />
      <NewsletterSection />
    </>
  );
}
```

#### After (loads on-demand):
```tsx
import dynamic from 'next/dynamic';

const TrustBadgesSection = dynamic(() => import('@/components/TrustBadges'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
  ssr: true, // Still render on server for SEO
});

const NewsletterSection = dynamic(() => import('@/components/Newsletter'));

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadgesSection />
      <NewsletterSection />
    </>
  );
}
```

**When to use:**
- Below-the-fold content
- Modals/dialogs
- Heavy libraries (charts, maps)
- Admin components

---

### 3. Tree-shake Lucide Icons

#### Before (imports all icons - 500KB+):
```tsx
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
```

#### After (imports only needed icons):
```tsx
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import Search from 'lucide-react/dist/esm/icons/search';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
```

**Savings:** ~400KB in production bundle

---

## Caching Strategy

### API Route Caching

```tsx
// app/api/products/route.ts
export async function GET() {
  const products = await fetchProducts();
  
  return Response.json(products, {
    headers: {
      // Cache for 1 hour, stale content ok for 24h
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### Static Page Generation

```tsx
// app/collections/[category]/[id]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const products = await fetchAllProducts();
  
  return products.map((product) => ({
    category: product.category,
    id: product.id.toString(),
  }));
}
```

---

## Lazy Loading & Intersection Observer

### Lazy load images below the fold

```tsx
import Image from 'next/image';

// Hero image - load immediately
<Image src="hero.jpg" priority />

// Below-fold images - lazy load
<Image src="product.jpg" loading="lazy" />
```

### Custom lazy component loader

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function LazyLoadSection({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Load 100px before visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-96 bg-gray-50" />}
    </div>
  );
}
```

Usage:
```tsx
<LazyLoadSection>
  <TrustBadgesSection />
</LazyLoadSection>
```

---

## Performance Monitoring

### Vercel Analytics (Easiest)

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Free tier includes:**
- Real User Monitoring (RUM)
- Core Web Vitals
- Page speed insights
- Geographic performance data

---

### Lighthouse CI (GitHub Actions)

Create `.github/workflows/lighthouse-ci.yml`:

```yaml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

Create `lighthouserc.js`:

```javascript
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm start',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## Quick Wins Checklist

### Immediate (Do Now)
- [ ] Run `npm run optimize-images` on all product photos
- [ ] Update `next.config.js` with image optimization settings
- [ ] Add `priority` prop to hero image
- [ ] Change loading to `lazy` for below-fold images
- [ ] Remove unused dependencies (`npm prune`)

### This Week
- [ ] Set up Cloudinary or Vercel image CDN
- [ ] Implement font optimization with `next/font`
- [ ] Add bundle analyzer and check for bloat
- [ ] Enable compression in production build
- [ ] Add cache headers to API routes

### This Month
- [ ] Implement dynamic imports for heavy components
- [ ] Set up Vercel Analytics or similar
- [ ] Configure Lighthouse CI in GitHub Actions
- [ ] Create responsive image srcsets
- [ ] Add service worker for offline support

---

## Expected Results

### Before Optimization
- **Homepage Load Time:** 3-5 seconds
- **Largest Contentful Paint (LCP):** 4-6s
- **Total Bundle Size:** 800KB-1.2MB
- **Image Payload:** 2-4MB per page
- **Lighthouse Score:** 60-70

### After Optimization
- **Homepage Load Time:** <2 seconds ✅
- **Largest Contentful Paint (LCP):** <2.5s ✅
- **Total Bundle Size:** 400-600KB ✅
- **Image Payload:** 500KB-1MB ✅
- **Lighthouse Score:** 90+ ✅

---

## Troubleshooting

### Images not optimizing?
```bash
# Check Sharp installation
npm ls sharp

# Reinstall if needed
npm uninstall sharp
npm install sharp --save-dev
```

### Bundle still large?
```bash
# Check what's included
ANALYZE=true npm run build

# Look for:
# - Duplicate dependencies
# - Unused libraries
# - Large icon sets
```

### Slow API responses?
```bash
# Add caching headers
# Check database query performance
# Consider Redis for session/data caching
```

---

## Support

Need help? Check:
- Next.js Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images
- Sharp Documentation: https://sharp.pixelplumbing.com/
- Cloudinary Next.js: https://next.cloudinary.dev/

For issues with this setup, check the files:
- `/scripts/optimize-images.js`
- `/next.config.js`
- `LUXURY_REDESIGN_SUMMARY.md`
