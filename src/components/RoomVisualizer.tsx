'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiMove,
  FiTrash2,
  FiRotateCw,
  FiArrowUp,
  FiArrowDown,
  FiDownload,
  FiRefreshCw,
} from 'react-icons/fi';
import { ROOM_CONFIGS, RoomBackground } from '@/lib/roomConfigs';
import { RoomType, PlacedProduct } from '@/types/visualizer';
import { useRoomVisualizer } from '@/hooks/useRoomVisualizer';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface RoomVisualizerProps {
  onProductSelect?: (product: PlacedProduct) => void;
  suggestedProducts?: Product[];
}

/**
 * Room Visualizer Component
 * Allows users to place products in a room and visualize them
 */
export function RoomVisualizer({ onProductSelect, suggestedProducts = [] }: RoomVisualizerProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    state,
    selectedProduct,
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
    dragOffsetRef,
  } = useRoomVisualizer('livingroom');

  const [draggedProduct, setDraggedProduct] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);

  // Handle product drag start
  const handleDragStart = (productId: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    if (canvasRect) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    setDraggedProduct(productId);
    selectProduct(productId);
  };

  // Handle canvas drag over
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle canvas drop
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = e.clientX - canvasRect.left - dragOffsetRef.current.x;
    const y = e.clientY - canvasRect.top - dragOffsetRef.current.y;

    if (draggedProduct && selectedProduct) {
      updateProductPosition(draggedProduct, x, y);
      setDraggedProduct(null);
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedProduct || !selectedProduct) return;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = e.clientX - canvasRect.left - dragOffsetRef.current.x;
    const y = e.clientY - canvasRect.top - dragOffsetRef.current.y;

    updateProductPosition(draggedProduct, x, y);
  };

  const handleDragEnd = () => {
    setDraggedProduct(null);
  };

  // Add suggested product
  const handleAddProduct = (product: Product) => {
    addProduct(product);
    if (onProductSelect) {
      const placedProduct = state.products[state.products.length - 1];
      if (placedProduct) {
        onProductSelect(placedProduct);
      }
    }
  };

  // Download visualization
  const handleDownload = () => {
    if (!canvasRef.current) return;

    const element = canvasRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#F5F3ED';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(element as any, 0, 0);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `room-visualization-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Room Visualizer</h2>
          <p className="text-gray-600 mt-1">
            Drag products into the room to visualize them in your space
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowTip(!showTip)}
          size="sm"
        >
          {showTip ? 'Hide' : 'Show'} Tips
        </Button>
      </div>

      {/* Tips Banner */}
      {showTip && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
        >
          💡 <strong>Pro Tips:</strong> Drag products to move them, use controls to scale/rotate, or click products in the
          list to add them to the room.
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Room Selection */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Select Room</h3>
            <div className="space-y-2">
              {(Object.keys(ROOM_CONFIGS) as RoomType[]).map(roomType => (
                <button
                  key={roomType}
                  onClick={() => changeRoom(roomType)}
                  className={`w-full px-3 py-2 text-left rounded-lg text-sm font-medium transition-all ${
                    state.room.type === roomType
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ROOM_CONFIGS[roomType].name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Controls */}
          {selectedProduct && (
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-900">Product Controls</h3>

              {/* Scale Control */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Scale: {selectedProduct.scale.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={selectedProduct.scale}
                  onChange={(e) =>
                    updateProductScale(selectedProduct.id, parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Rotation Control */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rotation: {selectedProduct.rotation}°
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateProductRotation(selectedProduct.id, selectedProduct.rotation - 15)
                    }
                    className="flex-1"
                  >
                    <FiRotateCw className="h-4 w-4 mr-1" /> -15°
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateProductRotation(selectedProduct.id, selectedProduct.rotation + 15)
                    }
                    className="flex-1"
                  >
                    +15° <FiRotateCw className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Z-Index Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bringToFront(selectedProduct.id)}
                  className="flex-1"
                >
                  <FiArrowUp className="h-4 w-4 mr-1" /> Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendToBack(selectedProduct.id)}
                  className="flex-1"
                >
                  <FiArrowDown className="h-4 w-4 mr-1" /> Back
                </Button>
              </div>

              {/* Remove Button */}
              <Button
                variant="outline"
                onClick={() => removeProduct(selectedProduct.id)}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <FiTrash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>
          )}

          {/* Room Stats */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Room Stats</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600">Products:</span>
                <span className="font-semibold">
                  {state.products.length}/{state.room.maxProducts}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-semibold">
                  {state.room.dimensions.width}x{state.room.dimensions.height}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleDownload}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              <FiDownload className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button variant="outline" onClick={clearRoom} className="w-full text-red-600">
              <FiRefreshCw className="h-4 w-4 mr-2" /> Clear Room
            </Button>
          </div>
        </motion.div>

        {/* Center - Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <div
            ref={canvasRef}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            className="relative w-full aspect-video bg-white rounded-lg shadow-lg border-4 border-gray-300 overflow-hidden cursor-move"
          >
            {/* Room Background */}
            <RoomBackground roomType={state.room.type} />

            {/* Products */}
            {state.products.map(product => (
              <motion.div
                key={product.id}
                className={`absolute cursor-move border-2 transition-all ${
                  selectedProduct?.id === product.id
                    ? 'border-indigo-500 shadow-lg'
                    : 'border-transparent hover:border-gray-400'
                }`}
                style={{
                  left: `${product.x}px`,
                  top: `${product.y}px`,
                  width: `${product.width * product.scale}px`,
                  height: `${product.height * product.scale}px`,
                  zIndex: product.zIndex,
                  transform: `rotate(${product.rotation}deg)`,
                }}
                onMouseDown={(e) => handleDragStart(product.id, e)}
                onClick={() => selectProduct(product.id)}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                  draggable={false}
                />
                {selectedProduct?.id === product.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                    <FiMove className="w-6 h-6 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Empty State */}
            {state.products.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FiMove className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">Drag products here to add them</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Product List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-full">
            <h3 className="font-semibold text-gray-900 mb-3">Available Products</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {suggestedProducts.length > 0 ? (
                suggestedProducts.map(product => (
                  <motion.button
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddProduct(product)}
                    className="w-full p-2 text-left rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">₹{product.price}</p>
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No products available. Browse products to add them.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export { useRoomVisualizer };
