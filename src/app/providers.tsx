"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { CartProvider } from './cart-context';
import { AuthProvider } from './auth-context';
import { WishlistProvider } from './wishlist-context';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
} 