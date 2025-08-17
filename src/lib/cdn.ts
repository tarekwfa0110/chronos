// CDN configuration and utilities
export const CDN_CONFIG = {
  // Image CDN (example: Cloudinary, ImageKit, etc.)
  IMAGE_CDN: {
    BASE_URL: process.env.NEXT_PUBLIC_IMAGE_CDN_URL || 'https://res.cloudinary.com/chronos',
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'chronos',
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  
  // Static asset CDN
  STATIC_CDN: {
    BASE_URL: process.env.NEXT_PUBLIC_STATIC_CDN_URL || 'https://cdn.chronos.example.com',
  },
  
  // Edge caching configuration
  EDGE_CACHE: {
    TTL: 3600, // 1 hour
    STALE_WHILE_REVALIDATE: 86400, // 24 hours
  },
} as const;

// Image optimization utilities
export class ImageCDN {
  // Generate optimized image URL
  static getOptimizedImageUrl(
    originalUrl: string,
    width: number,
    height: number,
    quality: number = 85,
    format: 'webp' | 'avif' | 'jpeg' = 'webp'
  ): string {
    if (!originalUrl || originalUrl.startsWith('data:')) {
      return originalUrl;
    }

    // If using Cloudinary
    if (CDN_CONFIG.IMAGE_CDN.BASE_URL.includes('cloudinary')) {
      const cloudName = CDN_CONFIG.IMAGE_CDN.CLOUD_NAME;
      const transformations = [
        `w_${width}`,
        `h_${height}`,
        `q_${quality}`,
        `f_${format}`,
        'c_fill',
        'g_auto',
      ].join(',');

      return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${encodeURIComponent(originalUrl)}`;
    }

    // Fallback to basic URL parameters
    const params = new URLSearchParams({
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
      fm: format,
    });

    return `${originalUrl}?${params.toString()}`;
  }

  // Generate responsive image URLs
  static getResponsiveImageUrls(
    originalUrl: string,
    sizes: { width: number; height: number }[]
  ): string[] {
    return sizes.map(({ width, height }) =>
      this.getOptimizedImageUrl(originalUrl, width, height)
    );
  }

  // Generate srcset for responsive images
  static getSrcSet(
    originalUrl: string,
    sizes: { width: number; height: number }[]
  ): string {
    return sizes
      .map(({ width, height }) => {
        const url = this.getOptimizedImageUrl(originalUrl, width, height);
        return `${url} ${width}w`;
      })
      .join(', ');
  }

  // Upload image to CDN
  static async uploadImage(
    file: File,
    folder: string = 'chronos'
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'chronos');
      formData.append('folder', folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CDN_CONFIG.IMAGE_CDN.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

// Static asset CDN utilities
export class StaticCDN {
  // Get static asset URL
  static getAssetUrl(path: string): string {
    return `${CDN_CONFIG.STATIC_CDN.BASE_URL}${path}`;
  }

  // Get optimized font URL
  static getFontUrl(fontName: string, weight: string = '400'): string {
    return this.getAssetUrl(`/fonts/${fontName}-${weight}.woff2`);
  }

  // Get optimized CSS URL
  static getCssUrl(filename: string): string {
    return this.getAssetUrl(`/css/${filename}`);
  }

  // Get optimized JS URL
  static getJsUrl(filename: string): string {
    return this.getAssetUrl(`/js/${filename}`);
  }
}

// Edge caching utilities
export class EdgeCache {
  // Set cache headers for Next.js API routes
  static setCacheHeaders(res: Response, ttl: number = CDN_CONFIG.EDGE_CACHE.TTL): void {
    res.headers.set('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=${CDN_CONFIG.EDGE_CACHE.STALE_WHILE_REVALIDATE}`);
  }

  // Set cache headers for static assets
  static setStaticCacheHeaders(res: Response): void {
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
  }

  // Set cache headers for images
  static setImageCacheHeaders(res: Response): void {
    res.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800'); // 1 day + 1 week stale
  }

  // Set cache headers for API responses
  static setApiCacheHeaders(res: Response, ttl: number = 300): void {
    res.headers.set('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=3600`);
  }
} 