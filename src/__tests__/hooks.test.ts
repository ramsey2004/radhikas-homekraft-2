/**
 * Comprehensive Hook Tests
 * Tests for custom React hooks with Jest and React Testing Library
 */

import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/contexts/ThemeContext';
import { useRecommendations } from '@/hooks/useRecommendations';
import { fixtures } from './testUtils';

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(fixtures.product, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.getTotalItems()).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(fixtures.product, 1);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem(fixtures.product.id);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(fixtures.product, 1);
    });

    act(() => {
      result.current.updateQuantity(fixtures.product.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(fixtures.product, 2);
    });

    const expectedTotal = fixtures.product.price * 2;
    expect(result.current.getTotalPrice()).toBe(expectedTotal);
  });

  it('should persist cart to localStorage', () => {
    const { result: result1 } = renderHook(() => useCart());

    act(() => {
      result1.current.addItem(fixtures.product, 1);
    });

    // Simulate new page load
    const { result: result2 } = renderHook(() => useCart());
    expect(result2.current.items).toHaveLength(1);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(fixtures.product, 1);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });
});

describe('useTheme Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should initialize with default theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBeDefined();
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme());
    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(initialTheme);
  });

  it('should detect dark mode availability', () => {
    const { result } = renderHook(() => useTheme());
    expect(typeof result.current.isDark).toBe('boolean');
  });

  it('should set specific theme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should persist theme preference', () => {
    const { result: result1 } = renderHook(() => useTheme());

    act(() => {
      result1.current.setTheme('dark');
    });

    const { result: result2 } = renderHook(() => useTheme());
    expect(result2.current.theme).toBe('dark');
  });
});

describe('useRecommendations Hook', () => {
  it('should provide all recommendation methods', () => {
    const { result } = renderHook(() => useRecommendations());

    expect(typeof result.current.byCategory).toBe('function');
    expect(typeof result.current.byPrice).toBe('function');
    expect(typeof result.current.byRating).toBe('function');
    expect(typeof result.current.collaborative).toBe('function');
    expect(typeof result.current.trending).toBe('function');
    expect(typeof result.current.personalized).toBe('function');
  });

  it('should return recommendations array', () => {
    const { result } = renderHook(() => useRecommendations());

    const recommendations = result.current.trending(4);
    expect(Array.isArray(recommendations)).toBe(true);
  });

  it('should filter by category', () => {
    const { result } = renderHook(() => useRecommendations());

    const recommendations = result.current.byCategory('furniture', 4);
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(4);
  });

  it('should respect limit parameter', () => {
    const { result } = renderHook(() => useRecommendations());

    const twoRecs = result.current.trending(2);
    const fourRecs = result.current.trending(4);

    expect(twoRecs.length).toBeLessThanOrEqual(2);
    expect(fourRecs.length).toBeLessThanOrEqual(4);
  });

  it('should generate personalized recommendations', () => {
    const { result } = renderHook(() => useRecommendations());

    const viewedItems = [fixtures.product];
    const wishlistItems = [fixtures.product];

    const recommendations = result.current.personalized(viewedItems, wishlistItems, 4);
    expect(Array.isArray(recommendations)).toBe(true);
  });
});

describe('Hook Error Handling', () => {
  it('should handle missing dependencies gracefully', () => {
    const { result } = renderHook(() => {
      try {
        useCart();
        return { error: null };
      } catch (error) {
        return { error };
      }
    });

    expect(result.current.error).toBeNull();
  });

  it('should recover from errors', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      try {
        result.current.addItem(null as any, -1);
      } catch {
        // Error should be caught
      }
    });

    expect(result.current.items).toBeDefined();
  });
});
