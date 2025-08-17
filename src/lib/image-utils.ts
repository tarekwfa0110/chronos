// Utility functions for image optimization

// Generate a simple blur data URL for placeholders
export function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // Create a simple gradient pattern
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

// Get optimal image sizes for different use cases
export const imageSizes = {
  thumbnail: {
    width: 80,
    height: 80,
    quality: 75,
  },
  product: {
    width: 400,
    height: 400,
    quality: 90,
  },
  hero: {
    width: 1200,
    height: 600,
    quality: 95,
  },
  avatar: {
    width: 40,
    height: 40,
    quality: 80,
  },
} as const;

// Generate responsive image sizes
export function getResponsiveSizes(breakpoints: number[] = [640, 768, 1024, 1280]): string {
  return breakpoints
    .map((breakpoint) => {
      const size = Math.round((breakpoint / breakpoints.length) * 100);
      return `(min-width: ${breakpoint}px) ${size}vw`;
    })
    .join(', ');
}

// Optimize image URL with parameters
export function optimizeImageUrl(
  url: string,
  width: number,
  height: number,
  quality: number = 85,
  format: 'webp' | 'avif' | 'jpeg' = 'webp'
): string {
  if (!url || url.startsWith('data:')) {
    return url;
  }
  
  // For external images, you might want to use a CDN service
  // This is a basic example - replace with your CDN logic
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    fm: format,
  });
  
  return `${url}?${params.toString()}`;
}

// Check if image is loaded
export function isImageLoaded(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// Preload image
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Lazy load images with Intersection Observer
export function createLazyLoadObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
  }
): IntersectionObserver {
  return new IntersectionObserver(callback, options);
}

// Generate image placeholder with text
export function generateTextPlaceholder(
  text: string,
  width: number = 400,
  height: number = 300,
  backgroundColor: string = '#f3f4f6',
  textColor: string = '#6b7280'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = textColor;
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL('image/jpeg', 0.8);
}

// Calculate aspect ratio
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

// Get optimal image dimensions based on aspect ratio
export function getOptimalDimensions(
  aspectRatio: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (aspectRatio > 1) {
    // Landscape
    const width = Math.min(maxWidth, maxHeight * aspectRatio);
    const height = width / aspectRatio;
    return { width: Math.round(width), height: Math.round(height) };
  } else {
    // Portrait
    const height = Math.min(maxHeight, maxWidth / aspectRatio);
    const width = height * aspectRatio;
    return { width: Math.round(width), height: Math.round(height) };
  }
} 