# Professional Website Setup Guide

## 📸 Setting Up Real Product Images

### Current Image Structure

Your products are now configured to use real images. Here's the file structure:

```
public/
├── images/
│   └── products/
│       ├── bedsheet-indigo-1.jpg
│       ├── bedsheet-indigo-2.jpg
│       ├── bedsheet-indigo-3.jpg
│       ├── rug-red-gold-1.jpg
│       ├── rug-red-gold-2.jpg
│       ├── rug-red-gold-3.jpg
│       └── ... (more products)
```

### Step 1: Create Folder Structure

```bash
mkdir -p public/images/products
```

### Step 2: Add Product Images

You need 3 images per product:
1. **Image 1**: Main product shot
2. **Image 2**: Lifestyle shot (product in use)
3. **Image 3**: Detail shot or alternative angle

### Image Requirements

| Aspect | Specification |
|--------|---------------|
| **Format** | JPG or PNG |
| **Resolution** | 1200x1200px (square) |
| **File Size** | < 500KB each |
| **Optimization** | Run through TinyPNG |
| **Aspect Ratio** | 1:1 (square) |

### Image Naming Convention

```
{category}-{product-name}-{image-number}.jpg

Examples:
- bedsheet-indigo-1.jpg
- bedsheet-indigo-2.jpg
- bedsheet-indigo-3.jpg
- rug-red-gold-1.jpg
- rug-red-gold-2.jpg
- rug-red-gold-3.jpg
- tapestry-mandala-1.jpg
- tapestry-mandala-2.jpg
- tapestry-mandala-3.jpg
```

### Quick Setup: Using Placeholder Service

While creating real product images, you can use a placeholder service:

**Option 1: Unsplash (Free, Real Images)**
```javascript
// In src/data/products.ts update:
images: [
  'https://images.unsplash.com/photo-[id1]?w=1200&h=1200&fit=crop',
  'https://images.unsplash.com/photo-[id2]?w=1200&h=1200&fit=crop',
  'https://images.unsplash.com/photo-[id3]?w=1200&h=1200&fit=crop',
]
```

**Option 2: DiceBear Avatars (Instant Placeholders)**
```javascript
images: [
  'https://api.dicebear.com/7.x/shapes/svg?seed=bedsheet-indigo-1',
  'https://api.dicebear.com/7.x/shapes/svg?seed=bedsheet-indigo-2',
  'https://api.dicebear.com/7.x/shapes/svg?seed=bedsheet-indigo-3',
]
```

**Option 3: Local Placeholders (Recommended During Development)**
```javascript
// The ProductCard component already handles missing images
// with a beautiful fallback gradient placeholder
// No additional setup needed!
```

---

## 🎨 Professional Icons - Full API Reference

### Available Icons

#### Trust & Feature Icons
```typescript
import { 
  ShippingIcon,      // Fast delivery truck
  ShieldIcon,        // Security/protection
  ReturnIcon,        // Return/undo arrow
  VerifiedIcon,      // Checkmark circle
  TruckIcon,         // Delivery truck (larger)
  CheckIcon         // Simple checkmark
} from '@/components/Icons';

// Usage
<ShippingIcon className="h-8 w-8" />
<ShieldIcon className="h-8 w-8" />
```

#### Category Icons
```typescript
import { getCategoryIcon } from '@/components/Icons';

// Available categories: 'bedsheet', 'rug', 'art', 'cushion', 'tableware'
{getCategoryIcon('bedsheet', 'w-12 h-12')}
{getCategoryIcon('rug', 'w-12 h-12')}
{getCategoryIcon('art', 'w-12 h-12')}
{getCategoryIcon('cushion', 'w-12 h-12')}
{getCategoryIcon('tableware', 'w-12 h-12')}
```

#### Feature Icons
```typescript
import { getFeatureIcon } from '@/components/Icons';

// Available features: 'shipping', 'shield', 'return', 'verified'
{getFeatureIcon('shipping', 'w-8 h-8')}
{getFeatureIcon('shield', 'w-8 h-8')}
{getFeatureIcon('return', 'w-8 h-8')}
{getFeatureIcon('verified', 'w-8 h-8')}
```

### Customizing Icon Colors

Icons inherit color from parent via Tailwind classes:

```tsx
// Red icons
<ShippingIcon className="h-8 w-8 text-red-500" />

// Green icons
<CheckIcon className="h-8 w-8 text-green-600" />

// Custom colors
<ShieldIcon className="h-8 w-8 text-primary-600" />
```

---

## 👤 Avatar Component - Full API Reference

### Basic Usage

```typescript
import Avatar from '@/components/Avatar';

// Automatically generates from initials
<Avatar initials="PS" name="Priya Sharma" size="md" />
```

### Props

| Prop | Type | Values | Default | Description |
|------|------|--------|---------|-------------|
| `initials` | string | 1-2 chars | Required | What to display (e.g., "PS", "R", "AD") |
| `name` | string | Any string | Required | Full name (used for color selection) |
| `size` | enum | 'sm' \| 'md' \| 'lg' | 'md' | Avatar size |
| `className` | string | Tailwind classes | '' | Additional CSS classes |

### Size Reference

```
sm: 8x8 (text-xs)   - Sidebar, small lists
md: 10x10 (text-sm) - Testimonials, comments
lg: 12x12 (text-base) - Profile pages, headers
```

### Color Selection Algorithm

Initials use deterministic color selection based on **first character of name**:

```
A, I, Q, Y → Blue (#3B82F6)
B, J, R, Z → Purple (#A855F7)
C, K, S    → Pink (#EC4899)
D, L, T    → Green (#22C55E)
E, M, U    → Orange (#F97316)
F, N, V    → Red (#EF4444)
G, O, W    → Indigo (#6366F1)
H, P, X    → Teal (#14B8A6)
```

### Examples

```typescript
// Simple
<Avatar initials="PS" name="Priya Sharma" />

// Large with custom styling
<Avatar 
  initials="RP" 
  name="Raj Patel" 
  size="lg"
  className="border-2 border-primary-600"
/>

// Small for avatars in list
<Avatar initials="AD" name="Anjali Desai" size="sm" />

// Get initials from full name (just use first letters)
<Avatar 
  initials={`${first[0]}${last[0]}`} 
  name={`${first} ${last}`}
/>
```

---

## 🖼️ ProductCard Image Handling

### Automatic Image Fallback

The ProductCard component handles missing images automatically:

```typescript
// If image path is valid:
✓ Uses Next.js Image component (optimized)

// If image path is invalid or fails to load:
✓ Shows professional gradient placeholder
✓ Displays product category first letter
✓ Shows material type underneath
```

### Supported Image Formats

- ✅ JPEG/JPG
- ✅ PNG
- ✅ WebP (preferred)
- ✅ SVG
- ✅ Absolute URLs
- ✅ Relative paths

### Example Images Array

```typescript
// Valid local paths
images: [
  '/images/products/bedsheet-indigo-1.jpg',
  '/images/products/bedsheet-indigo-2.jpg',
  '/images/products/bedsheet-indigo-3.jpg',
]

// Valid external URLs
images: [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
]

// Will use fallback placeholder if missing
images: ['invalid-path.jpg']
```

---

## 🚀 Next Steps Checklist

### Immediate (Today)
- [ ] Create `/public/images/products/` folder
- [ ] Add sample images for 2-3 products
- [ ] Test image display in browser
- [ ] Verify image loading performance

### This Week
- [ ] Complete all product images for existing products
- [ ] Optimize images with TinyPNG
- [ ] Point images to correct file paths in products.ts
- [ ] Add alt text metadata to products

### This Month
- [ ] Commission professional product photography
- [ ] Create lifestyle/styling photos
- [ ] Set up artisan/maker photos for avatars
- [ ] Add hero section background image

---

## 🔧 Troubleshooting

### Images Not Showing?

1. **Check file path**
   ```
   ✓ /images/products/name.jpg (relative to /public)
   ✓ NOT public/images/products/name.jpg
   ```

2. **Check file exists**
   ```bash
   ls public/images/products/
   ```

3. **Check file permissions**
   ```bash
   chmod 644 public/images/products/*.jpg
   ```

4. **Try absolute path**
   ```typescript
   images: [
     'https://yourdomain.com/images/products/name.jpg'
   ]
   ```

### Images Load Slowly?

1. **Compress images**
   - Use TinyPNG.com
   - Reduce to < 300KB each

2. **Use WebP format**
   ```bash
   # Convert with cwebp tool
   cwebp image.jpg -o image.webp
   ```

3. **Resize to exact dimensions**
   ```bash
   # Use ImageMagick
   convert image.jpg -resize 1200x1200 optimized.jpg
   ```

### Fallback Showing Instead of Image?

Check browser console for errors:
```javascript
// In DevTools console
// Look for CORS errors or 404s
// The image element will show the error in console
```

---

## 📱 Responsive Image Sizes

The ProductCard uses Next.js Image with these sizes:
```typescript
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
```

This ensures optimal image sizes for:
- **Mobile**: Full width
- **Tablet**: 50% width
- **Desktop**: 33% width

---

## 💾 Deployment Considerations

### Before Going Live

1. **Ensure all images are in place**
   ```bash
   npm run build
   # Check for warnings about missing images
   ```

2. **Test on production domain**
   - Verify images load with correct paths
   - Check CDN caching if using one

3. **Enable image optimization**
   ```bash
   # Vercel: Automatic
   # Self-hosted: Use next export with static optimization
   ```

4. **Set up image CDN** (Optional but recommended)
   - Cloudinary
   - Imgix
   - AWS CloudFront
   - Vercel Image Optimization

---

## 🎯 Quick Start Command

Get beautiful placeholder images instantly:

```bash
# Option 1: Download sample images from Unsplash
curl -o public/images/products/bedsheet-indigo-1.jpg \
  "https://images.unsplash.com/photo-1570186034853-feb0fcdfb1dc?w=1200&h=1200&fit=crop"

# Option 2: Use Placeholder service  
# Update products.ts to use:
'https://via.placeholder.com/1200x1200?text=Product+Image'
```

---

## 📚 Resources

- **Next.js Image Docs**: https://nextjs.org/docs/app/api-reference/components/image
- **Image Optimization**: https://web.dev/image-optimization/
- **Unsplash API**: https://unsplash.com/api
- **TinyPNG**: https://tinypng.com

---

**Happy Crafting! 🎨**

Your website is now ready for professional product photography. The placeholder fallback ensures the site looks great while you're setting up real images.
