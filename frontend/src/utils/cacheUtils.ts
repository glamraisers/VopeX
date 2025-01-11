import { StorageUtils } from './storageUtils';

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export class CacheUtils {
  // In-memory cache storage
  private static memoryCache = new Map<string, CacheEntry<any>>();

  // Default cache configuration
  private static defaultConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxEntries: 100,
    persistentStorage: true
  };

  // Configure cache behavior
  static configure(config: Partial<typeof CacheUtils.defaultConfig>) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  // Set item in cache
  static set<T>(
    key: string, 
    value: T, 
    options?: {
      ttl?: number;
      namespace?: string;
    }
  ): void {
    const fullKey = this.formatKey(key, options?.namespace);
    const ttl = options?.ttl || this.defaultConfig.defaultTTL;
    
    const cacheEntry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl
    };

    // Store in memory cache
    this.memoryCache.set(fullKey, cacheEntry);

    // Manage cache size
    this.manageCacheSize();

    // Optionally persist to storage
    if (this.defaultConfig.persistentStorage) {
      StorageUtils.setItem(fullKey, cacheEntry, {
        encrypted: true,
        expires: ttl
      });
    }
  }

  // Get item from cache
  static get<T>(
    key: string, 
    options?: {
      namespace?: string;
      fallback?: () => T;
    }
  ): T | null {
    const fullKey = this.formatKey(key, options?.namespace);
    
    // Check memory cache
    const memoryEntry = this.memoryCache.get(fullKey);
    if (memoryEntry) {
      // Check expiration
      if (Date.now() - memoryEntry.timestamp < memoryEntry.ttl) {
        return memoryEntry.value;
      }
      
      // Remove expired entry
      this.memoryCache.delete(fullKey);
    }

    // Check persistent storage
    if (this.defaultConfig.persistentStorage) {
      const storageEntry = StorageUtils.getItem<CacheEntry<T>>(fullKey);
      if (storageEntry && Date.now() - storageEntry.timestamp < storageEntry.ttl) {
        // Restore to memory cache
        this.memoryCache.set(fullKey, storageEntry);
        return storageEntry.value;
      }
    }

    // Return fallback if provided
    return options?.fallback ? options.fallback() : null;
  }

  // Delete item from cache
  static delete(
    key: string, 
    options?: {
      namespace?: string;
    }
  ): void {
    const fullKey = this.formatKey(key, options?.namespace);
    
    // Remove from memory cache
    this.memoryCache.delete(fullKey);

    // Remove from storage
    if (this.defaultConfig.persistentStorage) {
      StorageUtils.removeItem(fullKey);
    }
  }

  // Clear cache
  static clear(namespace?: string): void {
    if (namespace) {
      // Clear specific namespace
      const namespacePrefix = namespace ? `${namespace}:` : '';
      
      // Remove from memory cache
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(namespacePrefix)) {
          this.memoryCache.delete(key);
        }
      }

      // Remove from storage
      if (this.defaultConfig.persistentStorage) {
        StorageUtils.clear(namespace);
      }
    } else {
      // Clear entire cache
      this.memoryCache.clear();
      
      if (this.defaultConfig.persistentStorage) {
        StorageUtils.clear();
      }
    }
  }

  // Manage cache size
  private static manageCacheSize(): void {
    // Remove oldest entries if cache exceeds max size
    if (this.memoryCache.size > this.defaultConfig.maxEntries) {
      const oldestEntries = [...this.memoryCache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, this.memoryCache.size - this.defaultConfig.maxEntries);

      oldestEntries.forEach(([key]) => {
        this.memoryCache.delete(key);
      });
    }
  }

  // Memoize function results
  static memoize<F extends (...args: any[]) => any>(
    fn: F, 
    options?: {
      ttl?: number;
      resolver?: (...args: Parameters<F>) => string;
    }
  ): F {
    return ((...args: Parameters<F>): ReturnType<F> => {
      // Custom key resolver
      const resolver = options?.resolver || 
        ((...args: any[]) => JSON.stringify(args));
      
      const cacheKey = resolver(...args);

      // Check cache
      const cachedResult = this.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute and cache function
      const result = fn(...args);
      this.set(cacheKey, result, { 
        ttl: options?.ttl 
      });

      return result;
    }) as F;
  }

  // Format cache key with optional namespace
  private static formatKey(
    key: string, 
    namespace?: string
  ): string {
    return namespace ? `${namespace}:${key}` : key;
  }

  // Get cache statistics
  static getStats(): {
    totalEntries: number;
    memoryUsage: number;
  } {
    return {
      totalEntries: this.memoryCache.size,
      memoryUsage: Array.from(this.memoryCache.values())
        .reduce((total, entry) => total + JSON.stringify(entry).length, 0)
    };
  }
}

// Configure cache on startup
CacheUtils.configure({
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  maxEntries: 200,
  persistentStorage: true
});

// Example usage
export const cache = CacheUtils;

// Basic caching
cache.set('user_profile', userProfile, {
  ttl: 30 * 60 * 1000, // 30 minutes
  namespace: 'users'
});

const cachedProfile = cache.get('user_profile', {
  namespace: 'users',
  fallback: () => fetchUserProfile()
});

// Memoize expensive function
const expensiveCalculation = cache.memoize(
  (a: number, b: number) => {
    // Complex calculation
    return a * b;
  },
  {
    ttl: 5 * 60 * 1000, // 5 minutes
    resolver: (a, b) => `calc:${a}:${b}`
  }
);