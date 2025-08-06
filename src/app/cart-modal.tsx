"use client";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useCart } from './cart-context';
import { ThumbnailImage } from '@/components/ui/optimized-image';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../components/ui/ProductCard';
import type { Product } from '../types';

import { ProductCardSkeleton } from '@/components/ui/skeleton';

export default function CartModal() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch all products for 'You May Also Like'
  const { data: products, isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*');
      return data || [];
    },
  });
  // Exclude products already in cart
  const suggestions = (products || []).filter(
    (p) => !cart.some((c) => c.id === p.id)
  ).slice(0, 3);

  return (
    <Drawer open={isCartOpen} onOpenChange={closeCart} direction="right">
      <DrawerContent className="h-[85vh] sm:h-[80vh]">
        <DrawerHeader className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold">Shopping Cart</DrawerTitle>
            <button 
              onClick={closeCart} 
              aria-label="Close cart" 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started!</p>
              <Button onClick={closeCart} className="bg-red-500 hover:bg-red-600">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <ThumbnailImage 
                      src={item.image_url || '/placeholder.png'} 
                      alt={item.name} 
                      fill 
                      style={{ objectFit: 'contain' }} 
                      className="rounded" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                    <p className="text-red-500 font-bold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Cart Summary */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-black dark:text-white">Your cart is empty.</div>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 flex items-center justify-center flex-shrink-0 bg-white dark:bg-gray-800 rounded">
                    <div className="relative w-16 h-16">
                      <ThumbnailImage src={item.image_url || '/placeholder.png'} alt={item.name} fill style={{ objectFit: 'contain' }} className="rounded" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-h-[80px] text-black dark:text-white">
                    <div className="font-extrabold uppercase text-base mb-1">{item.name}</div>
                    <div className="font-semibold mb-1">EGP {item.price}</div>
                    <div className="text-sm">Quantity: {item.quantity}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center font-bold text-lg mt-2 mb-6 text-black dark:text-white">
                <span>Cart Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):</span>
                <span>EGP {total}</span>
              </div>
              <div className="flex gap-3 mb-8">
                <Link href="/cart" className="flex-1" onClick={closeCart}>
                  <Button variant="outline" className="w-full py-6 text-base font-semibold">View Cart</Button>
                </Link>
                <Link href="/checkout" className="flex-1" onClick={closeCart}>
                  <Button className="w-full py-6 text-base font-semibold">Checkout</Button>
                </Link>
              </div>
            </div>
          )}
          {/* You May Also Like */}
          {isProductsLoading ? (
            <div className="mt-6">
              <div className="font-extrabold text-lg mb-4 uppercase text-black dark:text-white">You May Also Like</div>
              <div className="flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : suggestions.length > 0 && (
            <div className="mt-6">
              <div className="font-extrabold text-lg mb-4 uppercase text-black dark:text-white">You May Also Like</div>
              <div className="flex flex-col gap-6">
                {suggestions.map((item: Product) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}