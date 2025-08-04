// Retry configuration interface
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: any) => boolean;
}

// Default retry configuration
const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryCondition: (error: any) => {
    // Retry on network errors, 5xx server errors, and rate limiting
    return (
      error.name === 'NetworkError' ||
      error.code === 'NETWORK_ERROR' ||
      (error.status >= 500 && error.status < 600) ||
      error.status === 429 ||
      error.message?.includes('network') ||
      error.message?.includes('timeout')
    );
  },
};

// Exponential backoff delay calculation
function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

// Retry function with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: any;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if we should retry
      if (attempt === finalConfig.maxAttempts || !finalConfig.retryCondition!(error)) {
        throw error;
      }

      // Calculate delay for next attempt
      const delay = calculateDelay(attempt, finalConfig);
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Retry with custom error handling
export async function retryWithHandler<T>(
  fn: () => Promise<T>,
  onRetry?: (attempt: number, error: any, delay: number) => void,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: any;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === finalConfig.maxAttempts || !finalConfig.retryCondition!(error)) {
        throw error;
      }

      const delay = calculateDelay(attempt, finalConfig);
      
      // Call custom retry handler
      onRetry?.(attempt, error, delay);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Retry for specific HTTP methods
export const retryGet = <T>(url: string, options?: RequestInit, config?: Partial<RetryConfig>) =>
  retry(() => fetch(url, { ...options, method: 'GET' }), config);

export const retryPost = <T>(url: string, data: any, options?: RequestInit, config?: Partial<RetryConfig>) =>
  retry(() => fetch(url, { 
    ...options, 
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(data)
  }), config);

export const retryPut = <T>(url: string, data: any, options?: RequestInit, config?: Partial<RetryConfig>) =>
  retry(() => fetch(url, { 
    ...options, 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(data)
  }), config);

export const retryDelete = <T>(url: string, options?: RequestInit, config?: Partial<RetryConfig>) =>
  retry(() => fetch(url, { ...options, method: 'DELETE' }), config);

// Retry configuration presets
export const retryConfigs = {
  // Quick retry for user interactions
  quick: {
    maxAttempts: 2,
    baseDelay: 500,
    maxDelay: 2000,
    backoffMultiplier: 1.5,
  },
  
  // Standard retry for most operations
  standard: defaultRetryConfig,
  
  // Aggressive retry for critical operations
  aggressive: {
    maxAttempts: 5,
    baseDelay: 2000,
    maxDelay: 30000,
    backoffMultiplier: 2,
  },
  
  // Conservative retry for non-critical operations
  conservative: {
    maxAttempts: 2,
    baseDelay: 2000,
    maxDelay: 5000,
    backoffMultiplier: 1.5,
  },
} as const;

// Retry with toast notifications
export async function retryWithToast<T>(
  fn: () => Promise<T>,
  toast: any, // Sonner toast instance
  config: Partial<RetryConfig> = {}
): Promise<T> {
  return retryWithHandler(
    fn,
    (attempt, error, delay) => {
      toast.warning(`Retrying... (${attempt}/${config.maxAttempts || 3})`);
    },
    config
  );
}

// Retry with progress callback
export async function retryWithProgress<T>(
  fn: () => Promise<T>,
  onProgress?: (attempt: number, totalAttempts: number) => void,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: any;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      onProgress?.(attempt, finalConfig.maxAttempts);
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === finalConfig.maxAttempts || !finalConfig.retryCondition!(error)) {
        throw error;
      }

      const delay = calculateDelay(attempt, finalConfig);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Utility to check if an error is retryable
export function isRetryableError(error: any): boolean {
  return (
    error.name === 'NetworkError' ||
    error.code === 'NETWORK_ERROR' ||
    (error.status >= 500 && error.status < 600) ||
    error.status === 429 ||
    error.message?.includes('network') ||
    error.message?.includes('timeout') ||
    error.message?.includes('ECONNRESET') ||
    error.message?.includes('ENOTFOUND')
  );
}

// Utility to get retry delay for display
export function getRetryDelay(attempt: number, config: Partial<RetryConfig> = {}): number {
  const finalConfig = { ...defaultRetryConfig, ...config };
  return calculateDelay(attempt, finalConfig);
}