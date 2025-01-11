import { eventBus } from './eventBusUtils';
import { StorageUtils } from './storageUtils';

export enum PerformanceMetricType {
  RENDER = 'RENDER',
  NETWORK = 'NETWORK',
  INTERACTION = 'INTERACTION',
  CUSTOM = 'CUSTOM'
}

export interface PerformanceEntry {
  id: string;
  type: PerformanceMetricType;
  name: string;
  startTime: number;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class PerformanceUtils {
  // Performance tracking storage
  private static performanceEntries: PerformanceEntry[] = [];
  
  // Configuration
  private static config = {
    enabled: true,
    maxEntries: 100,
    reportInterval: 30000, // 30 seconds
    performanceLoggingThreshold: {
      render: 100, // ms
      network: 500, // ms
      interaction: 200 // ms
    }
  };

  // Configure performance monitoring
  static configure(options: Partial<typeof PerformanceUtils.config>) {
    this.config = { ...this.config, ...options };
    
    // Start periodic reporting
    if (this.config.enabled) {
      this.startPeriodicReporting();
    }
  }

  // Start performance measurement
  static start(
    name: string, 
    type: PerformanceMetricType = PerformanceMetricType.CUSTOM,
    metadata?: Record<string, any>
  ): string {
    if (!this.config.enabled) return '';

    const entryId = `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    performance.mark(`${entryId}-start`);

    return entryId;
  }

  // End performance measurement
  static end(
    entryId: string, 
    additionalMetadata?: Record<string, any>
  ): PerformanceEntry | null {
    if (!this.config.enabled || !entryId) return null;

    performance.mark(`${entryId}-end`);
    
    try {
      performance.measure(
        entryId, 
        `${entryId}-start`, 
        `${entryId}-end`
      );

      const measure = performance.getEntriesByName(entryId)[0];
      
      const entry: PerformanceEntry = {
        id: entryId,
        type: PerformanceMetricType.CUSTOM,
        name: measure.name,
        startTime: measure.startTime,
        duration: measure.duration,
        timestamp: Date.now(),
        metadata: additionalMetadata
      };

      // Check against performance thresholds
      this.checkPerformanceThreshold(entry);

      // Store performance entry
      this.storePerformanceEntry(entry);

      // Clean up marks and measures
      performance.clearMarks(`${entryId}-start`);
      performance.clearMarks(`${entryId}-end`);
      performance.clearMeasures(entryId);

      return entry;
    } catch (error) {
      console.warn('Performance measurement failed', error);
      return null;
    }
  }

  // Check performance threshold
  private static checkPerformanceThreshold(entry: PerformanceEntry): void {
    const thresholds = this.config.performanceLoggingThreshold;
    
    let shouldLog = false;
    let logLevel: 'warn' | 'error' = 'warn';

    switch (entry.type) {
      case PerformanceMetricType.RENDER:
        shouldLog = entry.duration > thresholds.render;
        break;
      case PerformanceMetricType.NETWORK:
        shouldLog = entry.duration > thresholds.network;
        logLevel = 'error';
        break;
      case PerformanceMetricType.INTERACTION:
        shouldLog = entry.duration > thresholds.interaction;
        break;
    }

    if (shouldLog) {
      eventBus.publish('performance:threshold_exceeded', {
        entry,
        level: logLevel
      });
    }
  }

  // Store performance entry
  private static storePerformanceEntry(entry: PerformanceEntry): void {
    // Maintain max entries
    if (this.performanceEntries.length >= this.config.maxEntries) {
      this.performanceEntries.shift();
    }

    this.performanceEntries.push(entry);
  }

  // Periodic performance reporting
  private static startPeriodicReporting(): void {
    setInterval(() => {
      if (this.performanceEntries.length > 0) {
        this.reportPerformanceMetrics();
      }
    }, this.config.reportInterval);
  }

  // Report performance metrics
  private static reportPerformanceMetrics(): void {
    try {
      // Send performance entries to server or analytics service
      const entries = [...this.performanceEntries];
      
      // Reset entries after reporting
      this.performanceEntries = [];

      // You could integrate with your analytics service here
      eventBus.publish('performance:metrics_report', entries);

      // Optionally store in local storage for later analysis
      StorageUtils.setItem('performance_metrics', entries, {
        encrypted: false,
        expires: 24 * 60 * 60 * 1000 // 24 hours
      });
    } catch (error) {
      console.error('Performance reporting failed', error);
    }
  }

  // Get performance statistics
  static getPerformanceStats(): {
    totalEntries: number;
    averageDuration: number;
    entries: PerformanceEntry[];
  } {
    const entries = [...this.performanceEntries];
    
    return {
      totalEntries: entries.length,
      averageDuration: entries.reduce((sum, entry) => sum + entry.duration, 0) / entries.length || 0,
      entries
    };
  }

  // Measure browser performance
  static measureBrowserPerformance(): Record<string, any> {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint')[0];

    return {
      loadTime: navigation.loadEventEnd - navigation.startTime,
      firstContentfulPaint: paint?.startTime || 0,
      domInteractive: navigation.domInteractive - navigation.startTime,
      timeToFirstByte: navigation.responseStart - navigation.startTime
    };
  }
}

// Configure performance utils on startup
PerformanceUtils.configure({
  enabled: process.env.NODE_ENV === 'production',
  maxEntries: 200,
  performanceLoggingThreshold: {
    render: 150,
    network: 600,
    interaction: 250
  }
});

// Export utility
export const performance = PerformanceUtils;

// Example usage
function expensiveOperation() {
  const perfId = performance.start(
    'expensive_operation', 
    PerformanceMetricType.CUSTOM
  );

  // Simulate some work
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
  }

  performance.end(perfId, { 
    context: 'calculation', 
    iterations: 1000000 
  });
}

// Measure render performance
function renderComponent() {
  const perfId = performance.start(
    'component_render', 
    PerformanceMetricType.RENDER
  );

  // Render logic here

  performance.end(perfId);
}