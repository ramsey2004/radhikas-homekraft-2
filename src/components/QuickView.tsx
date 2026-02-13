'use client';

import { useState } from 'react';
import { FiX, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';

interface QuickViewProps {
  isOpen: boolean;
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviewCount: number;
    description: string;
    material: string;
    size: string;
    color: string;
    care: string;
    artisan: string;
    image: string;
    inStock: boolean;
  } | null;
  onClose: () => void;
}

export default function QuickView({ isOpen, product, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        slug: '',
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        category: '',
        inStock: product.inStock,
        images: [product.image],
        material: product.material,
        description: product.description,
        badge: null,
        colors: [product.color],
        dimensions: product.size,
        weight: '',
        care: [product.care],
        artisan: product.artisan,
      } as any, quantity);
    }
    onClose();
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Quick View</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg h-96">
              <div className="text-8xl">{product.image}</div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < Math.floor(product.rating) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-lg line-through text-gray-400">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-red-600 ml-2">
                    Save {discountPercent}%
                  </span>
                </div>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Product Specs */}
              <div className="border-t border-b py-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-semibold">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold">{product.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold">{product.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Artisan:</span>
                  <span className="font-semibold">{product.artisan}</span>
                </div>
              </div>

              {/* Care Instructions */}
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Care Instructions</h4>
                <p className="text-sm text-gray-700">{product.care}</p>
              </div>

              {/* Stock Status */}
              {product.inStock ? (
                <p className="text-green-600 font-semibold mb-6">✓ In Stock</p>
              ) : (
                <p className="text-red-600 font-semibold mb-6">Out of Stock</p>
              )}

              {/* Quantity & Actions */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center border-none focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiHeart
                    className={`h-5 w-5 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-3 px-6 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
              >
                <FiShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
