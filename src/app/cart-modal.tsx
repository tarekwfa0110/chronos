"use client";
import { Drawer, DrawerContent, DrawerHeader, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useCart } from './cart-context';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { X, Check, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartModal() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, addToCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch all products for 'You May Also Like'
  const { data: products } = useQuery({
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
      <DrawerContent className="fixed top-0 right-0 h-full max-w-md w-full rounded-none p-0 flex flex-col shadow-2xl border-l bg-white z-50 animate-in slide-in-from-right-32" style={{ maxWidth: 420 }}>
        {/* Enhanced Header */}
        <DrawerHeader className="px-6 py-5 border-b bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 rounded-full p-2">
                <Check className="text-white w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">ADDED TO CART</div>
                <div className="text-sm text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</div>
              </div>
            </div>
            <DrawerClose asChild>
              <button 
                onClick={closeCart} 
                aria-label="Close" 
                className="p-2 hover:bg-white/50 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <div className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</div>
              <div className="text-gray-500">Add some items to get started</div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="px-6 py-4">
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                        <Image 
                          src={item.image_url || '/placeholder.png'} 
                          alt={item.name} 
                          fill 
                          style={{ objectFit: 'cover' }} 
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm uppercase mb-1 truncate">{item.name}</div>
                        <div className="font-semibold text-gray-900 mb-2">EGP {item.price.toFixed(2)}</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-2 py-1 min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700 font-medium">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="text-xl font-bold text-gray-900">EGP {total.toFixed(2)}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link href="/checkout" className="w-full">
                      <Button className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                        Checkout • EGP {total.toFixed(2)}
                      </Button>
                    </Link>
                    <Link href="/cart" className="w-full">
                      <Button variant="outline" className="w-full py-3 text-base font-semibold border-2 hover:bg-gray-50 transition-colors">
                        View Full Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* You May Also Like */}
              {suggestions.length > 0 && (
                <div className="border-t bg-gray-50/30 px-6 py-6">
                  <div className="font-bold text-lg mb-4 text-gray-900 uppercase tracking-wide">You May Also Like</div>
                  <div className="space-y-4">
                    {suggestions.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image 
                            src={item.image_url || '/placeholder.png'} 
                            alt={item.name} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            className="rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm uppercase mb-1 truncate">{item.name}</div>
                          <div className="font-bold text-gray-900">EGP {item.price.toFixed(2)}</div>
                        </div>
                        <Button 
                          size="sm" 
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
                          onClick={() => addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image_url: item.image_url,
                          })}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}