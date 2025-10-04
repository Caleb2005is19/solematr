"use client";

import type { CartItem } from '@/lib/types';
import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';

type State = {
  items: CartItem[];
};

type Action =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { shoeId: string; size: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { shoeId: string; size: number; quantity: number } }
  | { type: 'SET_STATE'; payload: State }
  | { type: 'CLEAR_CART' };

const initialState: State = {
  items: [],
};

const cartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.shoeId === action.payload.shoeId && item.size === action.payload.size
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + (action.payload.quantity || 1),
        };
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.shoeId === action.payload.shoeId && item.size === action.payload.size)
        ),
      };
    }
    case 'UPDATE_QUANTITY': {
        if (action.payload.quantity <= 0) {
            return {
                ...state,
                items: state.items.filter(
                  item => !(item.shoeId === action.payload.shoeId && item.size === action.payload.size)
                ),
            };
        }
      return {
        ...state,
        items: state.items.map(item =>
          item.shoeId === action.payload.shoeId && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
};

type CartContextType = State & {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (shoeId: string, size: number) => void;
  updateQuantity: (shoeId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem('solemate_cart');
      if (storedState) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(storedState) });
      }
    } catch (error) {
      console.error("Could not load cart from local storage", error)
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('solemate_cart', JSON.stringify(state));
    } catch (error) {
      console.error("Could not save cart to local storage", error)
    }
  }, [state]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (shoeId: string, size: number) => dispatch({ type: 'REMOVE_ITEM', payload: { shoeId, size } });
  const updateQuantity = (shoeId: string, size: number, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { shoeId, size, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
