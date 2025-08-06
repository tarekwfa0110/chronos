import { supabase } from './supabaseClient';
import type { Product } from '../types';

// Product API functions (no Redis)
export class CachedProductAPI {
  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get product by ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) return null;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Get product by name
  static async getProductByName(name: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', name.replace(/-/g, ' '))
        .single();
      if (error) throw error;
      if (!data) return null;
      return data;
    } catch (error) {
      console.error('Error fetching product by name:', error);
      return null;
    }
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}

// User API functions (no Redis)
export class CachedUserAPI {
  // Get user session
  static async getUserSession(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      if (!data) return null;
      return data;
    } catch (error) {
      console.error('Error fetching user session:', error);
      return null;
    }
  }

  // Get user wishlist
  static async getUserWishlist(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          created_at,
          product:products(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user wishlist:', error);
      return [];
    }
  }

  // Get search history (local only)
  static async getSearchHistory(userId: string): Promise<string[]> {
    return [];
  }

  // Save search history (local only)
  static async saveSearchHistory(userId: string, query: string): Promise<void> {
    return;
  }
} 