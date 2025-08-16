"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'chronos_cart';

// Helper function to safely access localStorage
const getLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

const setLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const stored = getLocalStorage(CART_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    setLocalStorage(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQuantity = (id: string, quantity: number) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  const clearCart = () => setCart([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
} 