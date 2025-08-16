"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  aspectRatio?: string; // New prop for better aspect ratio control
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  style,
  aspectRatio,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Generate blur data URL if not provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // If image failed to load, show placeholder
  if (hasError) {
    return (
      <div
        className={cn(
          "bg-gray-200 dark:bg-gray-800 flex items-center justify-center",
          className
        )}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height,
          aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined)
        }}
      >
        <div className="text-gray-400 text-sm">Image unavailable</div>
      </div>
    );
  }

  // Container styles - key fix here
  const containerStyle = fill ? {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    aspectRatio: aspectRatio,
    // Ensure the container takes full space
    display: 'block',
    ...style
  } : {
    position: 'relative' as const,
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
    aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
    ...style
  };

  // Image styles - don't override Next.js Image positioning when using fill
  const imageStyle = fill ? {
    objectFit: style?.objectFit || 'cover',
    objectPosition: style?.objectPosition || 'center',
  } : {};

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        // Ensure container has proper display and sizing for fill images
        fill && "block w-full h-full",
        className
      )}
      style={containerStyle}
    >
      {/* Blur placeholder */}
      {isLoading && placeholder === 'blur' && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={{
            backgroundImage: `url(${blurDataURL || defaultBlurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            zIndex: 1,
          }}
        />
      )}

      {/* Main image */}
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          // Ensure image takes full space when using fill
          fill && "object-cover"
        )}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

// Product image component with specific optimizations for product cards
export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  aspectRatio = "1/1", // Default to square aspect ratio for product cards
  ...props
}: Omit<OptimizedImageProps, 'sizes' | 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("w-full h-full", className)}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={90}
      placeholder="blur"
      aspectRatio={aspectRatio}
      fill
      style={{ objectFit: 'cover' }}
      {...props}
    />
  );
}

// Hero image component for large images
export function HeroImage({
  src,
  alt,
  className,
  priority = true,
  aspectRatio = "16/9", // Default to widescreen for hero images
  ...props
}: Omit<OptimizedImageProps, 'sizes' | 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("w-full", className)}
      priority={priority}
      sizes="100vw"
      quality={95}
      placeholder="blur"
      aspectRatio={aspectRatio}
      fill
      style={{ objectFit: 'cover' }}
      {...props}
    />
  );
}

// Thumbnail image component for small images
export function ThumbnailImage({
  src,
  alt,
  className,
  priority = false,
  width = 120,
  height = 120,
  ...props
}: Omit<OptimizedImageProps, 'sizes' | 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 80px, 120px"
      quality={75}
      placeholder="blur"
      width={width}
      height={height}
      {...props}
    />
  );
}

// Avatar image component
export function AvatarImage({
  src,
  alt,
  className,
  priority = false,
  width = 40,
  height = 40,
  ...props
}: Omit<OptimizedImageProps, 'sizes' | 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn("rounded-full", className)}
      priority={priority}
      sizes="40px"
      quality={80}
      placeholder="blur"
      width={width}
      height={height}
      {...props}
    />
  );
}