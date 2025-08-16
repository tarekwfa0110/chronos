"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { CartProvider } from './cart-context';
import { AuthProvider } from './auth-context';
import { WishlistProvider } from './wishlist-context';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
} 