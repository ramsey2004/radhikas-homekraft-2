# 🚀 Extension & Development Guide

Learn how to extend Radhika's Homecraft with new features and functionality.

## Table of Contents
1. [Adding New Pages](#adding-new-pages)
2. [Creating API Endpoints](#creating-api-endpoints)  
3. [Building Components](#building-components)
4. [Database Modifications](#database-modifications)
5. [Custom Hooks](#custom-hooks)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment Integration](#payment-integration)
8. [Email Templates](#email-templates)
9. [Styling & Theming](#styling--theming)
10. [Testing](#testing)

## Adding New Pages

### Creating a New Page

**File Structure:**
```
src/app/(section)/page-name/page.tsx
```

**Example: Products Listing Page**

```typescript
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products - Radhika\'s Homecraft',
  description: 'Browse our collection of handcrafted products',
};

export default function ProductsPage() {
  return (
    <div className="section">
      <div className="section-container">
        <h1 className="font-serif text-4xl font-bold mb-8">Our Products</h1>
        {/* Page content */}
      </div>
    </div>
  );
}
```

### Dynamic Routes

For product pages at `/products/[slug]`:

```typescript
// src/app/(shop)/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, reviews: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.name}</h1>
      {/* Product details */}
    </div>
  );
}
```

## Creating API Endpoints

### Simple GET Endpoint

**File:** `src/app/api/categories/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
```

### Protected POST Endpoint

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Process request
  const data = await request.json();
  
  // Validate with Zod
  const validation = yourSchema.safeParse(data);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  // Do something
  return NextResponse.json({ success: true });
}
```

### Admin-Only Endpoint

```typescript
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  // Admin operation
}
```

## Building Components

### Simple Component

```typescript
// src/components/product/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card">
      <Image
        src={product.thumbnail || '/placeholder.png'}
        alt={product.name}
        width={300}
        height={300}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h3 className="font-serif text-lg font-bold">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{product.shortDescription}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary-600">
          {formatPrice(product.discountedPrice || product.price)}
        </span>
        <Link href={`/products/${product.slug}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}
```

### Client Component with State

```typescript
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface FilterProps {
  onFilter: (filters: any) => void;
}

export function ProductFilter({ onFilter }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const handleApplyFilter = () => {
    onFilter({ category: selectedCategory, priceRange });
    toast.success('Filters applied!');
  };

  return (
    <div className="space-y-6">
      {/* Filter inputs */}
      <button onClick={handleApplyFilter} className="btn btn-primary w-full">
        Apply Filters
      </button>
    </div>
  );
}
```

### Using with Query Parameters

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('/api/products', {
        params: { page: 1, pageSize: 12 },
      });
      return response.data.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="product-grid">
      {data?.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Database Modifications

### Adding a New Model

1. **Update `prisma/schema.prisma`:**

```prisma
model Blog {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  excerpt   String?
  author    String
  published Boolean  @default(false)
  views     Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([published])
}
```

2. **Run Migration:**

```bash
npm run db:migrate -- --name add_blog_model
```

3. **Use in API:**

```typescript
const posts = await prisma.blog.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
});
```

### Updating Existing Model

1. **Modify schema**
2. **Create migration**

```bash
npm run db:migrate -- --name add_field_to_model
```

3. **Update TypeScript types in `src/types/index.ts`**

## Custom Hooks

### Creating a Data Fetching Hook

```typescript
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '@/types';

interface UseProductsOptions {
  category?: string;
  search?: string;
  page?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      const response = await axios.get('/api/products', { params: options });
      return response.data.data;
    },
  });
}
```

### Usage in Component

```typescript
export function ProductPage() {
  const { data, isLoading, error } = useProducts({ category: 'bedsheets' });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div>
      {data?.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Authentication & Authorization

### Checking User Role

```typescript
'use client';

import { useSession } from 'next-auth/react';

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session?.user?.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
}
```

### Protected API Route

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Check if user is admin
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  // Proceed with admin operation
}
```

## Payment Integration

### Adding a New Payment Method

1. **Add to PaymentMethod enum in `prisma/schema.prisma`:**

```prisma
enum PaymentMethod {
  RAZORPAY
  STRIPE
  COD
  PAYPAL  // New
}
```

2. **Create Payment Handler:**

```typescript
// src/lib/payment/paypal.ts
export async function createPayPalOrder(amount: number, orderId: string) {
  // PayPal API call
}

export async function capturePayPalPayment(paymentToken: string) {
  // Complete payment
}
```

3. **Create API Route:**

```typescript
// src/app/api/payments/paypal/route.ts
export async function POST(request: NextRequest) {
  const { amount, orderId } = await request.json();
  
  const result = await createPayPalOrder(amount, orderId);
  
  return NextResponse.json({
    success: true,
    data: result,
  });
}
```

## Email Templates

### Creating New Email Template

```typescript
// src/lib/mailer.ts - Add to emailTemplates object

export const emailTemplates = {
  // ... existing templates
  
  reviewNotification: (productName: string, reviewerName: string) => ({
    subject: `New Review on ${productName}`,
    html: `
      <h2>New Review Received</h2>
      <p>A customer left a review for <strong>${productName}</strong></p>
      <p><em>"${reviewerName}"</em></p>
      <p><a href="https://admin.radhikashomecraft.com/reviews">View Review</a></p>
      <p>Best regards,<br />Radhika's Homecraft</p>
    `,
  }),
};

// Usage
const template = emailTemplates.reviewNotification('Product Name', 'John Doe');
await sendEmail({
  to: admin@email.com,
  ...template,
});
```

## Styling & Theming

### Adding Custom Styles

1. **Update `tailwind.config.ts`:**

```typescript
theme: {
  extend: {
    colors: {
      success: {
        50: '#f0fdf4',
        600: '#16a34a',
        700: '#15803d',
      },
    },
    spacing: {
      '128': '32rem',
    },
  },
}
```

2. **Use in Components:**

```typescript
<div className="bg-success-50 text-success-700">
  Success Message
</div>
```

### Creating Utility Classes

```typescript
// Add to globals.css
@layer components {
  .card-premium {
    @apply rounded-lg bg-gradient-to-br from-primary-50 to-white p-6 shadow-lg;
  }

  .btn-success {
    @apply bg-success-600 text-white hover:bg-success-700;
  }
}
```

## Testing

### Unit Tests

```typescript
// src/__tests__/lib/utils.test.ts
import { formatPrice, calculateDiscount } from '@/lib/utils';

describe('Utils', () => {
  it('should format price correctly', () => {
    expect(formatPrice(1999)).toBe('₹1,999.00');
  });

  it('should calculate discount percentage', () => {
    expect(calculateDiscount(1000, 750)).toBe(25);
  });
});
```

### API Tests

```typescript
// src/app/api/__tests__/products.test.ts
describe('GET /api/products', () => {
  it('should return products', async () => {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data.items)).toBe(true);
  });
});
```

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Database migrated to production
- [ ] SSL certificate installed
- [ ] Payment gateways configured
- [ ] Email service configured
- [ ] Backup strategy in place
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Performance optimized
- [ ] Security audit completed

---

For more examples and patterns, check the existing code in the repository.

**Last Updated:** February 8, 2026
