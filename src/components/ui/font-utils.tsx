"use client";

import { cn } from "@/lib/utils";

// Font utility classes for consistent typography
export const fontClasses = {
  // Primary font (Geist)
  sans: "font-sans",
  mono: "font-mono",
  
  // Alternative premium font (Inter)
  inter: "font-[var(--font-inter)]",
  
  // Font weights
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  
  // Font sizes
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  
  // Line heights
  tight: "leading-tight",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
  
  // Letter spacing
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
} as const;

// Typography components for consistent text styling
export const Typography = {
  // Headings
  h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 
      className={cn(
        fontClasses.sans,
        fontClasses.bold,
        fontClasses["4xl"],
        fontClasses.tight,
        "text-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </h1>
  ),
  
  h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 
      className={cn(
        fontClasses.sans,
        fontClasses.bold,
        fontClasses["3xl"],
        fontClasses.tight,
        "text-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </h2>
  ),
  
  h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 
      className={cn(
        fontClasses.sans,
        fontClasses.semibold,
        fontClasses["2xl"],
        fontClasses.tight,
        "text-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  ),
  
  h4: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 
      className={cn(
        fontClasses.sans,
        fontClasses.semibold,
        fontClasses.xl,
        fontClasses.tight,
        "text-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </h4>
  ),
  
  // Body text
  p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p 
      className={cn(
        fontClasses.sans,
        fontClasses.normal,
        fontClasses.base,
        fontClasses.relaxed,
        "text-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  ),
  
  // Caption text
  caption: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p 
      className={cn(
        fontClasses.sans,
        fontClasses.normal,
        fontClasses.sm,
        fontClasses.relaxed,
        "text-muted-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  ),
  
  // Code text
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code 
      className={cn(
        fontClasses.mono,
        fontClasses.normal,
        fontClasses.sm,
        "bg-muted px-1.5 py-0.5 rounded text-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </code>
  ),
  
  // Label text
  label: ({ children, className, ...props }: React.HTMLAttributes<HTMLLabelElement>) => (
    <label 
      className={cn(
        fontClasses.sans,
        fontClasses.medium,
        fontClasses.sm,
        fontClasses.tight,
        "text-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </label>
  ),
} as const;

// Font loading optimization hook
export function useFontOptimization() {
  // This hook can be used to implement font loading strategies
  // like font-display: swap, preloading, etc.
  
  const preloadFont = (fontFamily: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  };
  
  return { preloadFont };
} 