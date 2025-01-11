import { 
  PerformanceObserver, 
  performance, 
  PerformanceEntry 
} from 'perf_hooks';

export interface PerformanceMetric {
  name: string;
  duration: number;
  startTime: number;
  timestamp: number;
}

export interface ResourceLoadMetric {
  name: string;
  type: string;
  duration: number;
  transferSize: number;
}

export class PerformanceUtils {
  // Measure function execution time
  static measureExecutionTime<T>(
    fn: (...args: any[]) => T, 
    ...args: any[]
  ): {
    result: T;
    executionTime: number;
  } {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    return {
      result,
      executionTime: end - start
    };
  }

  // Create performance marker
  static mark(name: string): void {
    performance.mark(`${name}-start`);
  }

  // Measure performance between marks
  static measure(
    name: string, 
    startMark?: string, 
    endMark?: string
  ): PerformanceMetric {
    try {
      performance.measure(name, startMark, endMark);
      
      const entries = performance.getEntriesByName(name);
      const lastEntry = entries[entries.length - 1];

      return {
        name,
        duration: lastEntry.duration,
        startTime: lastEntry.startTime,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Performance measurement failed', error);
      return {
        name,
        duration: 0,
        startTime: 0,
        timestamp: Date.now()
      };
    }
  }

  // Track resource loading performance
  static trackResourceLoading(): Promise<ResourceLoadMetric[]> {
    return new Promise((resolve) => {
      const resourceMetrics: ResourceLoadMetric[] = [];

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            resourceMetrics.push({
              name: entry.name,
              type: entry.initiatorType,
              duration: entry.duration,
              transferSize: (entry as PerformanceResourceTiming).transferSize
            });
          }
        });

        resolve(resourceMetrics);
      });

      observer.observe({ 
        type: 'resource', 
        buffered: true 
      });
    });
  }

  // Debounce function
  static debounce<F extends (...args: any[]) => any>(
    func: F, 
    delay: number
  ): (...args: Parameters<F>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<F>) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func(...args);
        timeoutId = null;
      }, delay);
    };
  }

  // Throttle function
  static throttle<F extends (...args: any[]) => any>(
    func: F, 
    limit: number
  ): (...args: Parameters<F>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<F>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // Memory usage tracking
  static getMemoryUsage(): {
    total: number;
    used: number;
    free: number;
  } {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memoryUsage = process.memoryUsage();
      return {
        total: memoryUsage.heapTotal,
        used: memoryUsage.heapUsed,
        free: memoryUsage.heapTotal - memoryUsage.heapUsed
      };
    }

    return {
      total: 0,
      used: 0,
      free: 0
    };
  }

  // Advanced performance profiling
  static profile<T>(
    fn: (...args: any[]) => T, 
    options?: {
      warmup?: number;
      iterations?: number;
    }
  ): {
    result: T;
    averageTime: number;
    iterations: number;
  } {
    const defaultOptions = {
      warmup: 5,
      iterations: 10
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const times: number[] = [];

    // Warmup iterations
    for (let i = 0; i < mergedOptions.warmup; i++) {
      fn();
    }

    // Measured iterations
    let result: T;
    for (let i = 0; i < mergedOptions.iterations; i++) {
      const start = performance.now();
      result = fn();
      const end = performance.now();
      times.push(end - start);
    }

    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;

    return {
      result,
      averageTime,
      iterations: mergedOptions.iterations
    };
  }

  // Network latency measurement
  static measureNetworkLatency(
    url: string, 
    options?: {
      timeout?: number;
      method?: 'GET' | 'HEAD';
    }
  ): Promise<number> {
    const defaultOptions = {
      timeout: 5000,
      method: 'HEAD'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      const start = performance.now();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('Network request timed out'));
      }, mergedOptions.timeout);

      fetch(url, {
        method: mergedOptions.method,
        signal: controller.signal
      })
        .then(() => {
          clearTimeout(timeoutId);
          const end = performance.now();
          resolve(end - start);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }
}

// Example usage
const executionResult = PerformanceUtils.measureExecutionTime(
  (a: number, b: number) => a + b, 
  5, 
  3
);

const debouncedFunction = PerformanceUtils.debounce(() => {
  console.log('Debounced function called');
}, 300);

const profiledResult = PerformanceUtils.profile(() => {
  // Some complex function to profile
}, {
  iterations: 20
});