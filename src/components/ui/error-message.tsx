"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/font-utils';
import { AlertTriangle, X, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AppError, 
  NetworkError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ServerError 
} from '@/components/ui/error-boundary';

// Error message variants
type ErrorVariant = 'default' | 'destructive' | 'warning' | 'info';

// Error message props
interface ErrorMessageProps {
  error?: Error | string | null;
  variant?: ErrorVariant;
  title?: string;
  showIcon?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// Error message component
export function ErrorMessage({
  error,
  variant = 'default',
  title,
  showIcon = true,
  showRetry = false,
  onRetry,
  onDismiss,
  className,
  children,
}: ErrorMessageProps) {
  if (!error && !children) return null;

  const errorMessage = typeof error === 'string' ? error : error?.message;
  const errorTitle = title || getErrorTitle(error);
  const errorVariant = getErrorVariant(error, variant);

  const variantStyles = {
    default: {
      container: "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700",
      icon: "text-gray-500 dark:text-gray-400",
      title: "text-gray-900 dark:text-white",
      message: "text-gray-600 dark:text-gray-400",
    },
    destructive: {
      container: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      icon: "text-red-500 dark:text-red-400",
      title: "text-red-900 dark:text-red-100",
      message: "text-red-700 dark:text-red-300",
    },
    warning: {
      container: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      icon: "text-yellow-600 dark:text-yellow-400",
      title: "text-yellow-900 dark:text-yellow-100",
      message: "text-yellow-700 dark:text-yellow-300",
    },
    info: {
      container: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      icon: "text-blue-500 dark:text-blue-400",
      title: "text-blue-900 dark:text-blue-100",
      message: "text-blue-700 dark:text-blue-300",
    },
  };

  const styles = variantStyles[errorVariant];

  return (
    <div className={cn(
      "rounded-lg border p-4 relative",
      styles.container,
      className
    )}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
            {getErrorIcon(errorVariant)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {errorTitle && (
            <Typography.h4 className={cn("font-semibold mb-1", styles.title)}>
              {errorTitle}
            </Typography.h4>
          )}
          
          {(errorMessage || children) && (
            <Typography.p className={cn("text-sm", styles.message)}>
              {children || errorMessage}
            </Typography.p>
          )}
          
          {showRetry && onRetry && (
            <div className="mt-3">
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
              styles.icon
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Get error icon based on variant
function getErrorIcon(variant: ErrorVariant) {
  switch (variant) {
    case 'destructive':
      return <AlertTriangle className="w-5 h-5" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5" />;
    case 'info':
      return <Info className="w-5 h-5" />;
    default:
      return <AlertTriangle className="w-5 h-5" />;
  }
}

// Get error title based on error type
function getErrorTitle(error?: Error | string | null): string {
  if (!error) return 'Error';
  
  if (typeof error === 'string') return 'Error';
  
  if (error instanceof NetworkError) return 'Connection Error';
  if (error instanceof ValidationError) return 'Validation Error';
  if (error instanceof AuthenticationError) return 'Authentication Error';
  if (error instanceof AuthorizationError) return 'Access Denied';
  if (error instanceof NotFoundError) return 'Not Found';
  if (error instanceof ServerError) return 'Server Error';
  if (error instanceof AppError) return 'Application Error';
  
  return 'Error';
}

// Get error variant based on error type
function getErrorVariant(error?: Error | string | null, defaultVariant: ErrorVariant = 'default'): ErrorVariant {
  if (!error) return defaultVariant;
  
  if (typeof error === 'string') return defaultVariant;
  
  if (error instanceof NetworkError) return 'warning';
  if (error instanceof ValidationError) return 'destructive';
  if (error instanceof AuthenticationError) return 'destructive';
  if (error instanceof AuthorizationError) return 'destructive';
  if (error instanceof NotFoundError) return 'info';
  if (error instanceof ServerError) return 'destructive';
  if (error instanceof AppError) return error.isUserFriendly ? 'warning' : 'destructive';
  
  return defaultVariant;
}

// Inline error message for forms
export function InlineErrorMessage({ 
  error, 
  className 
}: { 
  error?: string | null;
  className?: string;
}) {
  if (!error) return null;

  return (
    <p className={cn(
      "text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1",
      className
    )}>
      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
      {error}
    </p>
  );
}

// Error summary for multiple errors
export function ErrorSummary({ 
  errors, 
  title = "Please fix the following errors:",
  className 
}: { 
  errors: string[];
  title?: string;
  className?: string;
}) {
  if (!errors.length) return null;

  return (
    <div className={cn(
      "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <Typography.h4 className="text-red-900 dark:text-red-100 font-semibold mb-2">
            {title}
          </Typography.h4>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700 dark:text-red-300">
                {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Loading error component
export function LoadingError({ 
  error, 
  onRetry, 
  className 
}: { 
  error?: Error | string | null;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("text-center py-8", className)}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      
      <Typography.h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Failed to Load
      </Typography.h3>
      
      <Typography.p className="text-gray-600 dark:text-gray-400 mb-4">
        {typeof error === 'string' ? error : error?.message || 'Something went wrong while loading the content.'}
      </Typography.p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

// Empty state with error
export function EmptyStateError({ 
  error, 
  onRetry, 
  className 
}: { 
  error?: Error | string | null;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      
      <Typography.h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No Results Found
      </Typography.h3>
      
      <Typography.p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {typeof error === 'string' ? error : error?.message || 'We couldn\'t find what you\'re looking for.'}
      </Typography.p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
} 