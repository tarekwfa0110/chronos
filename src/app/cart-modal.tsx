"use client";
import { Drawer, DrawerContent, DrawerHeader, DrawerClose, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useCart } from './cart-context';
import { ThumbnailImage } from '@/components/ui/optimized-image';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { X, Check } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../components/ui/ProductCard';
import type { Product } from '../types';

import { ProductCardSkeleton } from '@/components/ui/skeleton';

export default function CartModal() {
  const { cart, isCartOpen, closeCart } = useCart();
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
      <DrawerContent className="fixed top-0 right-0 h-full max-w-md w-full rounded-none p-0 flex flex-col shadow-2xl border-l bg-white dark:bg-black z-50 animate-in slide-in-from-right-32" style={{ maxWidth: 400 }}>
        <DrawerTitle className="sr-only">Shopping Cart</DrawerTitle>
        {/* Header */}
        <DrawerHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-lg font-bold text-black dark:text-white">
              <Check className="text-green-600 w-6 h-6" />
              ADDED TO CART
            </div>
            <DrawerClose asChild>
              <button onClick={closeCart} aria-label="Close" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X className="w-8 h-8 text-gray-700 dark:text-white font-bold" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
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