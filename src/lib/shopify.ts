/**
 * Shopify API Integration Service
 * Connects to your Shopify store and manages product/order operations
 */

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor?: string;
  productType?: string;
  images: Array<{
    src: string;
    alt?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    sku?: string;
    inventory?: number;
    available: boolean;
  }>;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyCheckoutInput {
  lineItems: Array<{
    variantId: string;
    quantity: number;
  }>;
  customAttributes?: Array<{
    key: string;
    value: string;
  }>;
}

class ShopifyAPI {
  private storeName: string;
  private accessToken: string;
  private graphqlEndpoint: string;

  constructor() {
    const storeName = process.env.SHOPIFY_STORE_NAME;
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeName || !accessToken) {
      throw new Error(
        'Missing Shopify credentials. Please set SHOPIFY_STORE_NAME and SHOPIFY_STOREFRONT_ACCESS_TOKEN'
      );
    }

    this.storeName = storeName;
    this.accessToken = accessToken;
    this.graphqlEndpoint = `https://${storeName}.myshopify.com/api/2024-01/graphql.json`;
  }

  /**
   * Execute a GraphQL query against Shopify API
   */
  private async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.accessToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        throw new Error(`GraphQL error: ${data.errors[0]?.message}`);
      }

      return data.data;
    } catch (error) {
      console.error('Shopify API request failed:', error);
      throw error;
    }
  }

  /**
   * Fetch all products from Shopify
   */
  async getAllProducts(first: number = 50) {
    const query = `
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              vendor
              productType
              images(first: 5) {
                edges {
                  node {
                    src
                    alt
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                    sku
                    available
                    currentlyNotInStock
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.query<any>(query, { first });
    return this.formatProducts(result.products.edges);
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string, first: number = 20) {
    const graphqlQuery = `
      query SearchProducts($query: String!, $first: Int!) {
        search(query: $query, first: $first, types: PRODUCT) {
          edges {
            node {
              ... on Product {
                id
                title
                handle
                description
                images(first: 5) {
                  edges {
                    node {
                      src
                      alt
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price
                      sku
                      available
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.query<any>(graphqlQuery, { query, first });
    return this.formatProducts(result.search.edges);
  }

  /**
   * Get a single product by handle
   */
  async getProductByHandle(handle: string) {
    const query = `
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          vendor
          productType
          images(first: 10) {
            edges {
              node {
                src
                alt
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price
                sku
                available
                currentlyNotInStock
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    `;

    const result = await this.query<any>(query, { handle });
    
    if (!result.productByHandle) {
      throw new Error(`Product not found: ${handle}`);
    }

    return this.formatProduct(result.productByHandle);
  }

  /**
   * Create a checkout
   */
  async createCheckout(input: ShopifyCheckoutInput) {
    const query = `
      mutation CreateCheckout($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            completedAt
            lineItems(first: 100) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    price
                  }
                }
              }
            }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const result = await this.query<any>(query, {
      input: {
        lineItems: input.lineItems,
        customAttributes: input.customAttributes,
      },
    });

    if (result.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(
        `Checkout creation failed: ${result.checkoutCreate.checkoutUserErrors[0].message}`
      );
    }

    return result.checkoutCreate.checkout;
  }

  /**
   * Format Shopify product data to our schema
   */
  private formatProduct(product: any): ShopifyProduct {
    return {
      id: product.id.split('/').pop(),
      title: product.title,
      handle: product.handle,
      description: product.description || '',
      vendor: product.vendor,
      productType: product.productType,
      images: product.images.edges.map((edge: any) => ({
        src: edge.node.src,
        alt: edge.node.alt || product.title,
      })),
      variants: product.variants.edges.map((edge: any) => ({
        id: edge.node.id.split('/').pop(),
        title: edge.node.title,
        price: edge.node.price,
        sku: edge.node.sku,
        available: edge.node.available && !edge.node.currentlyNotInStock,
      })),
      priceRange: {
        minVariantPrice: {
          amount: product.priceRange.minVariantPrice.amount,
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        },
        maxVariantPrice: {
          amount: product.priceRange.maxVariantPrice.amount,
          currencyCode: product.priceRange.maxVariantPrice.currencyCode,
        },
      },
    };
  }

  /**
   * Format multiple products
   */
  private formatProducts(edges: any[]): ShopifyProduct[] {
    return edges.map((edge: any) => this.formatProduct(edge.node));
  }

  /**
   * Get checkout URL
   */
  getCheckoutUrl(checkoutId: string): string {
    return `https://${this.storeName}.myshopify.com/checkout/${checkoutId}`;
  }
}

// Singleton instance
let shopifyInstance: ShopifyAPI | null = null;

export function initializeShopify(): ShopifyAPI {
  if (!shopifyInstance) {
    try {
      shopifyInstance = new ShopifyAPI();
    } catch (error) {
      console.warn('Shopify not configured:', (error as Error).message);
      return null as any;
    }
  }
  return shopifyInstance;
}

export function getShopifyAPI(): ShopifyAPI | null {
  return shopifyInstance || null;
}
