import getShopifyClient from './client';

/**
 * Shopify Product Type
 */
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: Array<{
    id: string;
    src: string;
    altText: string | null;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    availableForSale: boolean;
  }>;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale: boolean;
  productType: string;
  tags: string[];
}

/**
 * Fetch all products from Shopify
 */
export async function fetchProducts(limit: number = 20): Promise<ShopifyProduct[]> {
  const client = getShopifyClient();
  
  if (!client) {
    console.warn('Shopify client not initialized. Using fallback data.');
    return [];
  }

  try {
    const products = await client.product.fetchAll(limit);
    return products as ShopifyProduct[];
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
}

/**
 * Fetch products by collection
 */
export async function fetchProductsByCollection(
  collectionId: string,
  limit: number = 20
): Promise<ShopifyProduct[]> {
  const client = getShopifyClient();
  
  if (!client) {
    console.warn('Shopify client not initialized. Using fallback data.');
    return [];
  }

  try {
    const collection = await client.collection.fetchWithProducts(collectionId, { productsFirst: limit });
    return collection.products as ShopifyProduct[];
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    return [];
  }
}

/**
 * Fetch products by tag (e.g., 'bedsheets', 'lamps', etc.)
 */
export async function fetchProductsByTag(tag: string): Promise<ShopifyProduct[]> {
  const client = getShopifyClient();
  
  if (!client) {
    console.warn('Shopify client not initialized. Using fallback data.');
    return [];
  }

  try {
    const products = await client.product.fetchAll();
    return products.filter((product: any) => 
      product.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())
    ) as ShopifyProduct[];
  } catch (error) {
    console.error('Error fetching products by tag:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(productId: string): Promise<ShopifyProduct | null> {
  const client = getShopifyClient();
  
  if (!client) {
    console.warn('Shopify client not initialized.');
    return null;
  }

  try {
    const product = await client.product.fetch(productId);
    return product as ShopifyProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Fetch a single product by handle (URL slug)
 */
export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const client = getShopifyClient();
  
  if (!client) {
    console.warn('Shopify client not initialized.');
    return null;
  }

  try {
    const product = await client.product.fetchByHandle(handle);
    return product as ShopifyProduct;
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
}

/**
 * Format Shopify price for display
 */
export function formatShopifyPrice(amount: string, currencyCode: string = 'INR'): string {
  const price = parseFloat(amount);
  
  if (currencyCode === 'INR') {
    return `₹${Math.round(price).toLocaleString('en-IN')}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}

/**
 * Convert Shopify product to our app's product format
 */
export function convertShopifyProduct(shopifyProduct: ShopifyProduct) {
  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    price: formatShopifyPrice(
      shopifyProduct.priceRange.minVariantPrice.amount,
      shopifyProduct.priceRange.minVariantPrice.currencyCode
    ),
    image: shopifyProduct.images[0]?.src || '',
    images: shopifyProduct.images.map(img => img.src),
    description: shopifyProduct.description,
    inStock: shopifyProduct.availableForSale,
    category: shopifyProduct.productType,
    handle: shopifyProduct.handle,
    variants: shopifyProduct.variants,
  };
}
