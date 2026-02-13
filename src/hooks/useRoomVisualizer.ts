'use client';

import { useState, useCallback, useRef } from 'react';
import { PlacedProduct, RoomType, VisualizerState } from '@/types/visualizer';
import { ROOM_CONFIGS } from '@/lib/roomConfigs';
import { Product } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for managing room visualizer state and interactions
 */
export function useRoomVisualizer(initialRoomType: RoomType = 'livingroom') {
  const [state, setState] = useState<VisualizerState>({
    room: ROOM_CONFIGS[initialRoomType],
    products: [],
    selectedProductId: null,
    isDragging: false,
  });

  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Change room type
  const changeRoom = useCallback((roomType: RoomType) => {
    setState(prev => ({
      ...prev,
      room: ROOM_CONFIGS[roomType],
      products: [],
      selectedProductId: null,
    }));
    toast.success(`Changed to ${ROOM_CONFIGS[roomType].name}`);
  }, []);

  // Add product to room
  const addProduct = useCallback((product: Product) => {
    setState(prev => {
      // Check max products limit
      if (prev.products.length >= prev.room.maxProducts) {
        toast.error(`Maximum ${prev.room.maxProducts} products allowed in this room`);
        return prev;
      }

      const newProduct: PlacedProduct = {
        id: `${product.id}-${Date.now()}`,
        productId: String(product.id),
        name: product.name,
        image: product.thumbnail || product.images[0] || '',
        x: Math.random() * (prev.room.dimensions.width - 100),
        y: Math.random() * (prev.room.dimensions.height - 100),
        width: 120,
        height: 120,
        scale: 1,
        rotation: 0,
        zIndex: prev.products.length,
      };

      toast.success(`Added ${product.name} to room`);
      return {
        ...prev,
        products: [...prev.products, newProduct],
        selectedProductId: newProduct.id,
      };
    });
  }, []);

  // Remove product
  const removeProduct = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId),
      selectedProductId: prev.selectedProductId === productId ? null : prev.selectedProductId,
    }));
  }, []);

  // Select product
  const selectProduct = useCallback((productId: string | null) => {
    setState(prev => ({ ...prev, selectedProductId: productId }));
  }, []);

  // Update product position
  const updateProductPosition = useCallback((productId: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === productId
          ? {
              ...p,
              x: Math.max(0, Math.min(x, prev.room.dimensions.width - p.width)),
              y: Math.max(0, Math.min(y, prev.room.dimensions.height - p.height)),
            }
          : p
      ),
    }));
  }, []);

  // Update product scale
  const updateProductScale = useCallback((productId: string, scale: number) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === productId ? { ...p, scale: Math.max(0.5, Math.min(3, scale)) } : p
      ),
    }));
  }, []);

  // Update product rotation
  const updateProductRotation = useCallback((productId: string, rotation: number) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === productId ? { ...p, rotation: (rotation + 360) % 360 } : p
      ),
    }));
  }, []);

  // Bring to front
  const bringToFront = useCallback((productId: string) => {
    setState(prev => {
      const maxZ = Math.max(...prev.products.map(p => p.zIndex), 0);
      return {
        ...prev,
        products: prev.products.map(p =>
          p.id === productId ? { ...p, zIndex: maxZ + 1 } : p
        ),
      };
    });
  }, []);

  // Send to back
  const sendToBack = useCallback((productId: string) => {
    setState(prev => {
      const minZ = Math.min(...prev.products.map(p => p.zIndex), 0);
      return {
        ...prev,
        products: prev.products.map(p =>
          p.id === productId ? { ...p, zIndex: minZ - 1 } : p
        ),
      };
    });
  }, []);

  // Clear room
  const clearRoom = useCallback(() => {
    setState(prev => ({
      ...prev,
      products: [],
      selectedProductId: null,
    }));
  }, []);

  // Get selected product
  const selectedProduct = state.products.find(p => p.id === state.selectedProductId) || null;

  return {
    // State
    state,
    selectedProduct,

    // Actions
    changeRoom,
    addProduct,
    removeProduct,
    selectProduct,
    updateProductPosition,
    updateProductScale,
    updateProductRotation,
    bringToFront,
    sendToBack,
    clearRoom,

    // Refs
    dragOffsetRef,
  };
}
