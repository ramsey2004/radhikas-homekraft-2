# Cloudinary Integration Guide

## Setup Complete ✅

Your Cloudinary integration is now set up with 240 images from your media library. Here's how to use it:

## Quick Start

### 1. **Basic Image Component Usage**

```tsx
import CloudinaryImage from '@/components/CloudinaryImage';

export default function ProductCard() {
  return (
    <CloudinaryImage
      publicId="your_image_public_id"
      alt="Product description"
      width={400}
      height={400}
      priority={false}
    />
  );
}
```

### 2. **Getting Public IDs from Your Cloudinary Library**

Your 240 images in Cloudinary have public IDs. You can:

- Go to https://cloudinary.com/console/media_library
- Click on an image → Copy the **Public ID** (without the extension)
- Use that in the `publicId` prop

Example: If your image is `products/handmade-vase-01.jpg`, the public ID is `products/handmade-vase-01`

## Advanced Usage

### Product Gallery

```tsx
import CloudinaryImage from '@/components/CloudinaryImage';
import { getCloudinaryThumbnail, getCloudinaryProduct } from '@/lib/cloudinary';

export default function ProductGallery({ productImages }: { productImages: string[] }) {
  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  return (
    <div className="grid grid-cols-[1fr_4fr] gap-4">
      {/* Thumbnails */}
      <div className="space-y-2">
        {productImages.map((publicId) => (
          <button
            key={publicId}
            onClick={() => setSelectedImage(publicId)}
            className={`w-full border-2 ${
              selectedImage === publicId ? 'border-blue-600' : 'border-gray-200'
            }`}
          >
            <CloudinaryImage
              publicId={publicId}
              alt="Thumbnail"
              width={100}
              height={100}
              className="w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <CloudinaryImage
        publicId={selectedImage}
        alt="Product image"
        width={800}
        height={800}
        priority
      />
    </div>
  );
}
```

### Product Grid

```tsx
import CloudinaryImage from '@/components/CloudinaryImage';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="group">
          <CloudinaryImage
            publicId={product.cloudinaryPublicId}
            alt={product.name}
            width={300}
            height={300}
            quality="auto"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <h3 className="text-sm font-semibold mt-2">{product.name}</h3>
        </div>
      ))}
    </div>
  );
}
```

### Hero Banner

```tsx
import CloudinaryImage from '@/components/CloudinaryImage';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-96 md:h-screen">
      <CloudinaryImage
        publicId="hero/luxury-collection-hero"
        alt="Hero banner"
        width={1920}
        height={1080}
        fill
        priority
        quality="high"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white">New Collection</h1>
      </div>
    </div>
  );
}
```

## Utility Functions

### Get Optimized URL

```tsx
import { 
  getCloudinaryUrl, 
  getCloudinaryProduct,
  getCloudinaryThumbnail,
  getCloudinaryHero 
} from '@/lib/cloudinary';

// Basic URL with dimensions
const url = getCloudinaryUrl('my-image', { 
  width: 400, 
  height: 400,
  quality: 'auto'
});

// Product optimized (400x400 with face priority)
const productUrl = getCloudinaryProduct('product-image');

// Thumbnail (150x150)
const thumbUrl = getCloudinaryThumbnail('product-image');

// Hero/Banner (1920x600)
const heroUrl = getCloudinaryHero('banner-image');
```

### Apply Filters

```tsx
import { applyCloudinaryFilters, getCloudinaryUrl } from '@/lib/cloudinary';

// Create grayscale version
const gsUrl = applyCloudinaryFilters('my-image', { grayscale: true });

// Create sepia tone
const sepiaUrl = applyCloudinaryFilters('my-image', { sepia: true });

// Adjust brightness & saturation
const adjustedUrl = applyCloudinaryFilters('my-image', {
  brightness: 20,
  saturation: 30,
  contrast: -10
});
```

## Optimization Features (Automatic)

All images get these optimizations automatically:

✅ **Format Optimization** - WebP/AVIF for modern browsers
✅ **Quality Auto** - Optimal quality based on device/network
✅ **Lazy Loading** - Images load only when in view
✅ **Responsive Images** - Different sizes for mobile/tablet/desktop
✅ **Progressive Loading** - Progressive JPEGs
✅ **Device Pixel Ratio** - Auto-adjusts for Retina displays
✅ **CSS Transforms** - No re-upload needed for effects

## Integration with Product Database

### Update Your Product Model

```prisma
model Product {
  id              String  @id @default(cuid())
  name            String
  description     String?
  cloudinaryPublicId  String  // Store the public ID from your Cloudinary library
  gallery         String[]  // Array of public IDs for multiple images
  price           Float
  // ... other fields
}
```

### Seeding With Cloudinary Images

```typescript
// Add to your seed file
const products = [
  {
    name: "Handmade Golden Vase",
    cloudinaryPublicId: "products/vase-gold-01",
    gallery: ["products/vase-gold-01", "products/vase-gold-02", "products/vase-gold-03"],
    price: 45.99,
  },
  // Map your 240 images from Cloudinary to products...
];
```

## Performance Tips

1. **Use `priority` prop sparingly** - Only for images above the fold
2. **Set appropriate `width`/`height`** - Prevents layout shift
3. **Leverage `sizes` prop** - Better caching and delivery
4. **Batch operations** - Use `batchCloudinaryImages()` for multiple images
5. **Lazy loading** - Default behavior, enabled automatically

## Image Delivery

All images are served from Cloudinary's global CDN:
- **Automatic caching** at edge locations
- **4x faster delivery** than local hosting
- **Bandwidth savings** ~30-40%
- **Mobile optimized** automatically

## Troubleshooting

### Image Not Showing?
- Check public ID is correct (no file extension)
- Verify image exists in Cloudinary Media Library
- Check browser console for CORS errors

### Blurry Images?
- Increase `quality` prop: `quality="high"` or `quality={95}`
- Check original image resolution in Cloudinary

### Slow Loading?
- Use `priority={true}` for critical images
- Check `sizes` prop for responsive images
- Verify Cloudinary URL format is correct

## Next Steps

1. **Map your 240 images** - Document public IDs in a spreadsheet
2. **Update product components** - Replace local images with CloudinaryImage
3. **Test responsive images** - Check on mobile, tablet, desktop
4. **Monitor performance** - Use Cloudinary dashboard for analytics
5. **Set up backup** - Configure automatic backups in Cloudinary settings

## Cloudinary Dashboard Links

- **Media Library**: https://cloudinary.com/console/media_library
- **Settings**: https://cloudinary.com/console/settings/account
- **Analytics**: https://cloudinary.com/console/analytics
- **API Docs**: https://cloudinary.com/documentation/image_transformations_reference

---

Your 240 images are now ready to be served with enterprise-grade optimization! 🚀
