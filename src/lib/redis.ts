import Redis from 'ioredis';

// Redis client configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Cache keys
export const CACHE_KEYS = {
  PRODUCTS: 'products:all',
  PRODUCT: (id: string) => `product:${id}`,
  PRODUCT_SEARCH: (query: string) => `product:search:${query}`,
  USER_SESSION: (userId: string) => `user:session:${userId}`,
  USER_WISHLIST: (userId: string) => `user:wishlist:${userId}`,
  SEARCH_HISTORY: (userId: string) => `search:history:${userId}`,
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  PRODUCTS: 300, // 5 minutes
  PRODUCT: 600, // 10 minutes
  PRODUCT_SEARCH: 180, // 3 minutes
  USER_SESSION: 3600, // 1 hour
  USER_WISHLIST: 300, // 5 minutes
  SEARCH_HISTORY: 86400, // 24 hours
} as const;

// Cache utility functions
export class CacheService {
  // Get cached data
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  // Set cached data
  static async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redis.setex(key, ttl, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  // Delete cached data
  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  // Delete multiple keys by pattern
  static async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis delPattern error:', error);
    }
  }

  // Invalidate product cache
  static async invalidateProductCache(productId?: string): Promise<void> {
    try {
      // Delete all products cache
      await this.del(CACHE_KEYS.PRODUCTS);
      
      // Delete specific product cache if provided
      if (productId) {
        await this.del(CACHE_KEYS.PRODUCT(productId));
      }
      
      // Delete all product search caches
      await this.delPattern('product:search:*');
    } catch (error) {
      console.error('Redis invalidateProductCache error:', error);
    }
  }

  // Invalidate user cache
  static async invalidateUserCache(userId: string): Promise<void> {
    try {
      await this.del(CACHE_KEYS.USER_SESSION(userId));
      await this.del(CACHE_KEYS.USER_WISHLIST(userId));
      await this.del(CACHE_KEYS.SEARCH_HISTORY(userId));
    } catch (error) {
      console.error('Redis invalidateUserCache error:', error);
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      await redis.ping();
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }
}

export default redis; 