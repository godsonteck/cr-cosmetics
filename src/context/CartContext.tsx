'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'INIT_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; selectedVariant?: ProductVariant | null }; openDrawer?: boolean }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' };

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (product: Product, quantity?: number, openDrawer?: boolean, selectedVariant?: ProductVariant | null) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'cr_cart_items_v1';

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INIT_CART':
      return { ...state, items: action.payload || [] };

    case 'ADD_ITEM': {
      const { product, quantity = 1, selectedVariant } = action.payload;
      const existingIndex = state.items.findIndex(item => item.product.id === product.id);

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
          selectedVariant: selectedVariant || newItems[existingIndex].selectedVariant,
        };
      } else {
        newItems = [...state.items, { product, quantity, selectedVariant }];
      }

      return {
        ...state,
        items: newItems,
        isOpen: action.openDrawer !== false ? true : state.isOpen,
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload.productId),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'OPEN_DRAWER':
      return { ...state, isOpen: true };

    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false };

    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        dispatch({ type: 'INIT_CART', payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [state.items]);

  const addItem = (
    product: Product,
    quantity = 1,
    openDrawer = true,
    selectedVariant: ProductVariant | null = null
  ) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedVariant }, openDrawer });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const openDrawer = () => dispatch({ type: 'OPEN_DRAWER' });
  const closeDrawer = () => dispatch({ type: 'CLOSE_DRAWER' });
  const toggleDrawer = () => dispatch({ type: 'TOGGLE_DRAWER' });

  const totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => {
    const itemPrice = item.selectedVariant?.price || item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const deliveryFee = subtotal >= 300 || subtotal === 0 ? 0 : 25;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalCount,
        subtotal,
        deliveryFee,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
