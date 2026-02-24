# Product Page & Navigation Implementation

## Overview
Comprehensive product page and navigation structure based on lagavi.com reference with enhanced UX and clear information architecture.

## Navigation Categories

### Main Categories (Horizontal Menu)
1. **Bed & Linen**
   - Bedsheets
   - Duvet Covers
   - Pillow Covers
   - Quilts & Comforters
   - Bed Runners

2. **Dining & Serving**
   - Table Linens
   - Placemats
   - Napkins
   - Table Runners
   - Serving Sets

3. **Drinkware**
   - Mugs
   - Glasses
   - Cups & Saucers
   - Water Bottles
   - Tea Sets

4. **Decor & Lighting**
   - Lamps
   - Candle Holders
   - Wall Art
   - Vases
   - Mirrors
   - Cushions

5. **Gifting**
   - Gift Sets
   - Corporate Gifts
   - Festive Collection
   - Wedding Gifts

6. **B2B**
   - Bulk Orders
   - Custom Products
   - Hotel & Restaurant
   - Corporate Solutions

7. **About** (Secondary)
   - Our Story
   - Our Artisans
   - Sustainability

8. **Visit Store** (Secondary)
   - Store Locations
   - Book Appointment
   - Store Events

## Product Page Requirements

### Image Order (MANDATORY)
1. **First Image**: Lifestyle/Usage shot
   - Product in real-life setting
   - Shows scale and context
   - Styled environment

2. **Second Image**: Detail close-up
   - Texture and material
   - Craftsmanship details
   - Pattern/design close-up

3. **Additional Images**: Multiple angles, colors, variations

### Required Information Sections

#### 1. Material & Fabric Explanation
- Material composition
- Weaving/crafting technique
- Origin of materials
- Quality specifications
- Example: "100% Pure Cotton, Hand block printed with natural vegetable dyes on 200 TC pure cotton fabric. Traditional Sanganeri printing technique by artisans in Jaipur."

#### 2. Size Information
- Exact dimensions in cm and inches
- Weight
- Available size variants
- Fit guide (if applicable)
- Example: "King Size: 108" x 108" (274cm x 274cm)"

#### 3. Care Instructions
- Washing instructions
- Drying method
- Ironing temperature
- Storage tips
- Example: "Machine wash cold with like colors. Tumble dry low. Iron on medium heat."

#### 4. Delivery Timeline
- Dispatch time
- Estimated delivery
- Tracking availability
- Example: "Ships within 2-3 business days. Delivery in 5-7 days."

#### 5. COD + Returns (PROMINENT)
- Cash on Delivery availability badge
- Returns policy clearly stated
- Return window
- Conditions
- Example: "✅ COD Available | Easy returns within 30 days"

### Additional Elements

#### Trust Badges
- Secure Payment
- Quality Assured
- Handcrafted
- Free Shipping (if applicable)

#### Product Details Accordion
- Collapsible sections for better UX
- Material & Fabric
- Size & Dimensions
- Care Instructions
- About the Artisan

#### Reviews Section
- Star ratings
- Customer photos (if available)
- Verified purchase badge
- Date of review

## Implementation Files

### 1. Navigation Config
**File**: `src/config/navigation.ts`
- Complete category structure
- Product page requirements checklist
- Sample data structure

### 2. Product Page Template
**File**: `src/app/products/[slug]/ProductPageTemplate.tsx`
- Reusable product page component
- All required sections included
- Responsive design
- Accessibility compliant

### 3. Improved Navigation Component
**File**: `src/components/ImprovedNavigation.tsx`
- Gold base with teal text (as requested)
- Dropdown menus for categories
- Mobile responsive
- Cart counter badge

## Color Scheme
```typescript
const COLORS = {
  deepTeal: '#1A7A6E',    // Text color
  gold: '#C9A84C',         // Base/Background
  ivory: '#FAF3E0',        // Dropdown background
  charcoal: '#2D2D2D',     // Body text
  lightBeige: '#E8D5C4',   // Accents
};
```

## Usage Example

### Using the Product Page Template

```tsx
import ProductPageTemplate from '@/app/products/[slug]/ProductPageTemplate';

const product = {
  id: 1,
  name: 'Hand Block Print Bedsheet Set',
  price: '₹2,570',
  originalPrice: '₹3,200',
  images: [
    '/products/bedsheet-lifestyle.jpg',  // Lifestyle first
    '/products/bedsheet-detail.jpg',     // Detail second
  ],
  description: 'Premium hand block printed bedsheet',
  material: '100% Pure Cotton',
  fabricDetails: 'Hand block printed with natural dyes...',
  care: 'Machine wash cold...',
  dimensions: 'King Size: 108" x 108"',
  delivery: 'Ships within 2-3 days',
  cod: true,
  returns: 'Easy returns within 30 days',
  inStock: true,
  category: 'bed-linen',
  reviews: []
};

<ProductPageTemplate product={product} />
```

### Using the Navigation

```tsx
import { ImprovedNavigation } from '@/components/ImprovedNavigation';

// In your layout file
<ImprovedNavigation />
```

## Integration Steps

1. **Update Navigation**
   - Replace current header with `ImprovedNavigation`
   - Update layout.tsx to use new navigation

2. **Update Product Pages**
   - Use `ProductPageTemplate` for all product pages
   - Ensure all products have required data fields
   - Add missing product images (lifestyle + detail)

3. **Update Product Data**
   - Add `fabricDetails` field
   - Add `delivery` timeline
   - Add `cod` boolean
   - Add `returns` policy text

4. **Create Collection Pages**
   - Create routes for all new categories
   - Add filters and sorting
   - Use consistent layout

## Mobile Responsiveness

- Hamburger menu for mobile
- Touch-optimized buttons
- Readable font sizes
- Proper spacing
- Collapsible sections

## SEO Considerations

- Proper image alt text
- Structured data for products
- Clear breadcrumbs
- Meta descriptions per category
- Schema.org markup

## Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus states

## Next Steps

1. ✅ Navigation structure defined
2. ✅ Product page template created
3. ⏳ Integrate into existing pages
4. ⏳ Update product data schema
5. ⏳ Create collection pages
6. ⏳ Add filters and search
7. ⏳ Implement sorting
8. ⏳ Add product recommendations

## Reference

Design inspiration: lagavi.com
- Clean layout
- Clear categorization
- Prominent delivery/COD info
- Lifestyle photography first
- Detailed product information
