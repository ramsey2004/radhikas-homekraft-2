'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  getOrCreateCheckout, 
  addLineItemsToCheckout,
  redirectToCheckout,
  isShopifyConfigured,
  type ShopifyCheckout 
} from '@/lib/shopify/index';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
  variantId?: string; // Shopify variant ID
  shopifyLineItemId?: string; // Shopify checkout line item ID
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  shopifyCheckout: ShopifyCheckout | null;
  isShopifyEnabled: boolean;
  isLoading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_SHOPIFY_CHECKOUT'; payload: ShopifyCheckout | null }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  proceedToCheckout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'SET_SHOPIFY_CHECKOUT':
      return {
        ...state,
        shopifyCheckout: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    shopifyCheckout: null,
    isShopifyEnabled: isShopifyConfigured(),
    isLoading: false,
  });

  // Initialize Shopify checkout on mount if Shopify is configured
  useEffect(() => {
    if (state.isShopifyEnabled) {
      initializeShopifyCheckout();
    }
  }, [state.isShopifyEnabled]);

  // Sync cart with Shopify when items change
  useEffect(() => {
    if (state.isShopifyEnabled && state.shopifyCheckout) {
      syncCartWithShopify();
    }
  }, [state.items]);

  const initializeShopifyCheckout = async () => {
    try {
      const checkout = await getOrCreateCheckout();
      if (checkout) {
        dispatch({ type: 'SET_SHOPIFY_CHECKOUT', payload: checkout });
      }
    } catch (error) {
      console.error('Failed to initialize Shopify checkout:', error);
    }
  };

  const syncCartWithShopify = async () => {
    if (!state.shopifyCheckout || state.isLoading) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Add new items to Shopify checkout
      const newItems = state.items.filter(item => !item.shopifyLineItemId && item.variantId);
      
      if (newItems.length > 0) {
        const lineItems = newItems.map(item => ({
          variantId: item.variantId!,
          quantity: item.quantity,
        }));
        
        const updatedCheckout = await addLineItemsToCheckout(
          state.shopifyCheckout.id,
          lineItems
        );
        
        if (updatedCheckout) {
          dispatch({ type: 'SET_SHOPIFY_CHECKOUT', payload: updatedCheckout });
        }
      }
    } catch (error) {
      console.error('Failed to sync cart with Shopify:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const proceedToCheckout = async () => {
    if (state.isShopifyEnabled && state.shopifyCheckout) {
      // Redirect to Shopify checkout
      redirectToCheckout(state.shopifyCheckout.webUrl);
    } else {
      // Fallback: show alert or custom checkout
      alert('Checkout functionality requires Shopify configuration. Please add your Shopify credentials to .env.local');
    }
  };

  return (
    <CartContext.Provider value={{ state, dispatch, proceedToCheckout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};