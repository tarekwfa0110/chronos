import { supabase } from './supabaseClient';
import { CacheService, CACHE_KEYS, CACHE_TTL } from './redis';
import type { Product } from '../types';

// Cached product API functions
export class CachedProductAPI {
  // Get all products with caching
  static async getAllProducts(): Promise<Product[]> {
    try {
      // Try to get from cache first
      const cached = await CacheService.get<Product[]>(CACHE_KEYS.PRODUCTS);
      if (cached) {
        return cached;
      }

      // Fetch from database
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;

      const products = data || [];
      
      // Cache the result
      await CacheService.set(CACHE_KEYS.PRODUCTS, products, CACHE_TTL.PRODUCTS);
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get product by ID with caching
  static async getProductById(id: string): Promise<Product | null> {
    try {
      // Try to get from cache first
      const cached = await CacheService.get<Product>(CACHE_KEYS.PRODUCT(id));
      if (cached) {
        return cached;
      }

      // Fetch from database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Cache the result
      await CacheService.set(CACHE_KEYS.PRODUCT(id), data, CACHE_TTL.PRODUCT);
      
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Get product by name with caching
  static async getProductByName(name: string): Promise<Product | null> {
    try {
      // Try to get from cache first
      const cached = await CacheService.get<Product>(CACHE_KEYS.PRODUCT(name));
      if (cached) {
        return cached;
      }

      // Fetch from database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', name.replace(/-/g, ' '))
        .single();

      if (error) throw error;
      if (!data) return null;

      // Cache the result
      await CacheService.set(CACHE_KEYS.PRODUCT(name), data, CACHE_TTL.PRODUCT);
      
      return data;
    } catch (error) {
      console.error('Error fetching product by name:', error);
      return null;
    }
  }

  // Search products with caching
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      // Try to get from cache first
      const cached = await CacheService.get<Product[]>(CACHE_KEYS.PRODUCT_SEARCH(query));
      if (cached) {
        return cached;
      }

      // Fetch from database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`);

      if (error) throw error;

      const products = data || [];
      
      // Cache the result
      await CacheService.set(CACHE_KEYS.PRODUCT_SEARCH(query), products, CACHE_TTL.PRODUCT_SEARCH);
      
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Invalidate cache when products are updated
  static async invalidateCache(productId?: string): Promise<void> {
    await CacheService.invalidateProductCache(productId);
  }
}

// Cached user API functions
export class CachedUserAPI {
  // Get user session with caching
  static async getUserSession(userId: string): Promise<any> {
    try {
      // Try to get from cache first
      const cached = await CacheService.get(CACHE_KEYS.USER_SESSION(userId));
      if (cached) {
        return cached;
      }

      // Fetch from database
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Cache the result
      await CacheService.set(CACHE_KEYS.USER_SESSION(userId), data, CACHE_TTL.USER_SESSION);
      
      return data;
    } catch (error) {
      console.error('Error fetching user session:', error);
      return null;
    }
  }

  // Get user wishlist with caching
  static async getUserWishlist(userId: string): Promise<any[]> {
    try {
      // Try to get from cache first
      const cached = await CacheService.get<any[]>(CACHE_KEYS.USER_WISHLIST(userId));
      if (cached) {
        return cached;
      }

      // Fetch from database
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

      const wishlist = data || [];
      
      // Cache the result
      await CacheService.set(CACHE_KEYS.USER_WISHLIST(userId), wishlist, CACHE_TTL.USER_WISHLIST);
      
      return wishlist;
    } catch (error) {
      console.error('Error fetching user wishlist:', error);
      return [];
    }
  }

  // Get search history with caching
  static async getSearchHistory(userId: string): Promise<string[]> {
    try {
      // Try to get from cache first
      const cached = await CacheService.get<string[]>(CACHE_KEYS.SEARCH_HISTORY(userId));
      if (cached) {
        return cached;
      }

      // For now, return empty array (search history is stored in localStorage)
      return [];
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  }

  // Save search history
  static async saveSearchHistory(userId: string, query: string): Promise<void> {
    try {
      const history = await this.getSearchHistory(userId);
      const updatedHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
      
      await CacheService.set(CACHE_KEYS.SEARCH_HISTORY(userId), updatedHistory, CACHE_TTL.SEARCH_HISTORY);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  // Invalidate user cache
  static async invalidateUserCache(userId: string): Promise<void> {
    await CacheService.invalidateUserCache(userId);
  }
} 