export type RoomType = 'bedroom' | 'livingroom' | 'kitchen' | 'bathroom' | 'diningroom';

export interface RoomDimensions {
  width: number;
  height: number;
  color: string;
}

export interface PlacedProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface RoomConfig {
  type: RoomType;
  name: string;
  dimensions: RoomDimensions;
  backgroundColor: string;
  furnitureColor: string;
  maxProducts: number;
}

export interface VisualizerState {
  room: RoomConfig;
  products: PlacedProduct[];
  selectedProductId: string | null;
  isDragging: boolean;
}
