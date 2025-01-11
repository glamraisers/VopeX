import { apiService } from '../services/api/baseApiService';
import { StorageUtils } from './storageUtils';
import { eventBus } from './eventBusUtils';

export enum AnalyticsEventType {
  PAGE_VIEW = 'PAGE_VIEW',
  USER_ACTION = 'USER_ACTION',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR',
  CONVERSION = 'CONVERSION'
}

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export class AnalyticsUtils {
  // Configuration for analytics
  private static config = {
    enabled: true,
    debugMode: false,
    batchSize: 10,
    batchInterval: 30000 // 30 seconds
  };

  // Event queue for batching
  private static eventQueue: AnalyticsEvent[] = [];

  // Session tracking
  private static sessionId: string = this.generateSessionId();

  // Configure analytics
  static configure(options: {
    enabled?: boolean;
    debugMode?: boolean;
    batchSize?: number;
    batchInterval?: number;
  }): void {
    this.config = { ...this.config, ...options };

    // Start batch processing
    if (this.config.enabled) {
      this.startBatchProcessing();
    }
  }

  // Generate unique session ID
  private static generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track page view
  static trackPageView(
    path: string, 
    metadata?: Record<string, any>
  ): void {
    this.trackEvent({
      type: AnalyticsEventType.PAGE_VIEW,
      category: 'Navigation',
      action: 'Page View',
      label: path,
      metadata: {
        ...metadata,
        path
      }
    });
  }

  // Track user action
  static trackUserAction(
    category: string, 
    action: string, 
    label?: string, 
    value?: number
  ): void {
    this.trackEvent({
      type: AnalyticsEventType.USER_ACTION,
      category,
      action,
      label,
      value
    });
  }

  // Track conversion event
  static trackConversion(
    category: string, 
    action: string, 
    value?: number
  ): void {
    this.trackEvent({
      type: AnalyticsEventType.CONVERSION,
      category,
      action,
      value
    });
  }

  // Track performance metrics
  static trackPerformance(
    metric: string, 
    duration: number, 
    metadata?: Record<string, any>
  ): void {
    this.trackEvent({
      type: AnalyticsEventType.PERFORMANCE,
      category: 'Performance',
      action: metric,
      value: duration,
      metadata
    });
  }

  // Track error events
  static trackError(
    error: Error, 
    metadata?: Record<string, any>
  ): void {
    this.trackEvent({
      type: AnalyticsEventType.ERROR,
      category: 'Error',
      action: error.name,
      label: error.message,
      metadata: {
        ...metadata,
        stack: error.stack
      }
    });
  }

  // Core event tracking method
  private static trackEvent(
    eventData: Omit<AnalyticsEvent, 'id' | 'timestamp'>
  ): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...eventData
    };

    // Debug logging
    if (this.config.debugMode) {
      console.log('Analytics Event:', event);
    }

    // Add to event queue
    this.eventQueue.push(event);

    // Trigger immediate send if batch size reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.sendBatchEvents();
    }
  }

  // Batch event processing
  private static startBatchProcessing(): void {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.sendBatchEvents();
      }
    }, this.config.batchInterval);
  }

  // Send batch events to server
  private static async sendBatchEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      // Send events with session context
      await apiService.post('/analytics/batch', {
        sessionId: this.sessionId,
        events: this.eventQueue
      });

      // Clear processed events
      this.eventQueue = [];
    } catch (error) {
      // Persist failed events to retry later
      StorageUtils.setItem('failed-analytics-events', this.eventQueue, {
        encrypted: true
      });
      
      console.warn('Failed to send analytics events', error);
    }
  }

  // Retry failed events
  static async retryFailedEvents(): Promise<void> {
    const failedEvents = StorageUtils.getItem('failed-analytics-events');
    
    if (failedEvents && failedEvents.length > 0) {
      try {
        await apiService.post('/analytics/batch', {
          sessionId: this.sessionId,
          events: failedEvents
        });

        // Clear failed events storage
        StorageUtils.removeItem('failed-analytics-events');
      } catch (error) {
        console.warn('Failed to retry analytics events', error);
      }
    }
  }

  // User identification
  static identifyUser(
    userId: string, 
    traits?: Record<string, any>
  ): void {
    this.trackEvent({
      type: AnalyticsEventType.USER_ACTION,
      category: 'User',
      action: 'Identify',
      metadata: {
        userId,
        traits
      }
    });
  }

  // Get current session analytics
  static getSessionAnalytics(): {
    sessionId: string;
    eventCount: number;
  } {
    return {
      sessionId: this.sessionId,
      eventCount: this.eventQueue.length
    };
  }
}

// Configure analytics on app startup
AnalyticsUtils.configure({
  enabled: process.env.NODE_ENV === 'production',
  debugMode: process.env.NODE_ENV !== 'production'
});

// Example usage
export const analytics = AnalyticsUtils;

// Track page view
analytics.trackPageView('/dashboard');

// Track user action
analytics.trackUserAction(
  'Button', 
  'Click', 
  'Create Lead'
);

// Track performance
analytics.trackPerformance(
  'component_render', 
  250 // milliseconds
);

// Track error
try {
  // Some risky operation
} catch (error) {
  analytics.trackError(error);
}