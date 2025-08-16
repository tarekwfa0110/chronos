"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';
import { toast } from 'sonner';

type WishlistItem = {
  id: string;
  product_id: string;
  created_at: string;
  product: Product;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  loading: boolean;
  addToWishlist: (product: Product) => Promise<{ error: string | null }>;
  removeFromWishlist: (productId: string) => Promise<{ error: string | null }>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<{ error: string | null }>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  let user = null;
  try {
    const authContext = useAuth();
    user = authContext.user;
  } catch (error: unknown) {
    console.warn('Auth context not available for wishlist provider', error);
  }

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          created_at,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wishlist:', error);
        toast.error(`Failed to fetch wishlist: ${error.message}`);
        return;
      }

      setWishlist((data as unknown) as WishlistItem[] || []);
    } catch (error: unknown) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [user, fetchWishlist]);

  const addToWishlist = async (product: Product): Promise<{ error: string | null }> => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return { error: 'Please sign in to add items to your wishlist' };
    }

    try {
      // Check if already in wishlist
      const existingItem = wishlist.find(item => item.product_id === product.id);
      if (existingItem) {
        toast.info('Item is already in your wishlist');
        return { error: 'Item is already in your wishlist' };
      }

      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: product.id,
        })
        .select();

      if (error) {
        console.error('Error adding to wishlist:', error);
        toast.error(`Failed to add item to wishlist: ${error.message}`);
        return { error: `Failed to add item to wishlist: ${error.message}` };
      }

      // Refresh wishlist
      await fetchWishlist();
      toast.success(`${product.name} added to wishlist`);
      return { error: null };
    } catch (error: unknown) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
      return { error: 'Failed to add item to wishlist' };
    }
  };

  const removeFromWishlist = async (productId: string): Promise<{ error: string | null }> => {
    if (!user) {
      toast.error('Please sign in to manage your wishlist');
      return { error: 'Please sign in to manage your wishlist' };
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from wishlist:', error);
        toast.error('Failed to remove item from wishlist');
        return { error: 'Failed to remove item from wishlist' };
      }

      // Find product name for toast
      const removedItem = wishlist.find(item => item.product_id === productId);
      
      // Update local state
      setWishlist(prev => prev.filter(item => item.product_id !== productId));
      
      if (removedItem) {
        toast.success(`${removedItem.product.name} removed from wishlist`);
      }
      
      return { error: null };
    } catch (error: unknown) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
      return { error: 'Failed to remove item from wishlist' };
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.product_id === productId);
  };

  const clearWishlist = async (): Promise<{ error: string | null }> => {
    if (!user) {
      return { error: 'Please sign in to manage your wishlist' };
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing wishlist:', error);
        return { error: 'Failed to clear wishlist' };
      }

      setWishlist([]);
      return { error: null };
    } catch (error: unknown) {
      console.error('Error clearing wishlist:', error);
      return { error: 'Failed to clear wishlist' };
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}