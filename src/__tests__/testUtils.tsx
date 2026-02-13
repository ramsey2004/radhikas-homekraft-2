/**
 * Testing Setup and Utilities
 * Provides common test utilities, fixtures, and helpers
 */

import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

/**
 * Custom render function with providers
 */
export function renderWithProviders(
  ui: ReactNode,
  {
    session = null,
    ...renderOptions
  }: RenderOptions & { session?: any } = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Mock data fixtures
 */
export const fixtures = {
  product: {
    id: 1,
    name: 'Test Product',
    slug: 'test-product',
    price: 999,
    originalPrice: 1499,
    description: 'A test product description',
    shortDescription: 'Test product',
    discountedPrice: 899,
    inventory: 10,
    sku: 'TEST-001',
    images: ['https://example.com/image.jpg'],
    thumbnail: 'https://example.com/thumb.jpg',
    categoryId: 'cat-1',
    material: 'Premium Wood',
    color: 'Brown',
    dimensions: '100x50x50cm',
    weight: 5,
    isFeatured: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    image: null,
    emailVerified: null,
  },

  order: {
    id: 'ORD-123456',
    userId: 'user-1',
    items: [
      {
        productId: 1,
        quantity: 2,
        price: 999,
      },
    ],
    total: 1998,
    shippingInfo: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    paymentStatus: 'completed',
    orderStatus: 'shipped',
    createdAt: new Date(),
  },

  cart: {
    product: {
      id: 1,
      name: 'Test Product',
      price: 999,
    },
    quantity: 2,
  },
};

/**
 * Mock functions
 */
export const mockFunctions = {
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),

  useSession: (session = fixtures.user) => ({
    data: { user: session },
    status: 'authenticated',
    update: jest.fn(),
  }),

  useCart: () => ({
    items: [fixtures.cart],
    total: 999,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getTotalItems: jest.fn(() => 1),
    getTotalPrice: jest.fn(() => 999),
  }),
};

/**
 * Test wait utilities
 */
export const waitFor = async (condition: () => boolean, timeout = 5000) => {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

/**
 * API mock utilities
 */
export const mockApi = {
  fetchMock: (response: any, options?: { status?: number; delay?: number }) => {
    const { status = 200, delay = 0 } = options || {};
    return jest.fn(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: status === 200,
            status,
            json: async () => response,
            text: async () => JSON.stringify(response),
          });
        }, delay);
      })
    );
  },

  setupFetchMocks: () => {
    global.fetch = jest.fn();
  },

  resetFetchMocks: () => {
    (global.fetch as jest.Mock).mockReset();
  },
};

/**
 * Snapshot testing utilities
 */
export const snapshotConfig = {
  ignoreProps: ['key', 'style', 'className'],

  sanitizeSnapshot: (html: string): string => {
    return html
      .replace(/data-testid="[^"]*"/g, '')
      .replace(/data-rbd-[^=]*="[^"]*"/g, '')
      .replace(/style="[^"]*"/g, '')
      .trim();
  },
};

/**
 * Performance testing utilities
 */
export const performanceTests = {
  measureRenderTime: async (renderFn: () => void): Promise<number> => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
  },

  assertRenderPerformance: (renderTime: number, maxTime: number = 100) => {
    if (renderTime > maxTime) {
      throw new Error(
        `Render time (${renderTime}ms) exceeded max time (${maxTime}ms)`
      );
    }
  },
};

/**
 * Accessibility testing utilities
 */
export const a11y = {
  getAccessibilityViolations: (container: HTMLElement) => {
    const violations: string[] = [];

    // Check for missing alt text on images
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.getAttribute('alt')) {
        violations.push(`Image missing alt text: ${img.src}`);
      }
    });

    // Check for missing labels on inputs
    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      if (!input.getAttribute('aria-label') && !container.querySelector(`label[for="${input.id}"]`)) {
        violations.push(`Input missing label: ${input.name}`);
      }
    });

    // Check for proper heading hierarchy
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((h) => {
      const level = parseInt(h.tagName[1]);
      if (level - lastLevel > 1) {
        violations.push(`Heading hierarchy broken: jumped from h${lastLevel} to h${level}`);
      }
      lastLevel = level;
    });

    return violations;
  },

  assertAccessible: (violations: string[]) => {
    if (violations.length > 0) {
      throw new Error(`Accessibility violations:\n${violations.join('\n')}`);
    }
  },
};
