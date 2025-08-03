import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    
    // Configure image domains (add your image CDN domains here)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Minimum cache TTL (Time To Live) in seconds
    minimumCacheTTL: 60,
    
    // Disable static image imports for dynamic images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compression settings
  compress: true,
  
  // Output settings
  output: 'standalone',
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
