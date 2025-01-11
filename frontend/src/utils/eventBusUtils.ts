type EventCallback = (...args: any[]) => void;

interface EventSubscription {
  unsubscribe: () => void;
}

export class EventBusUtils {
  // Singleton instance
  private static instance: EventBusUtils;
  
  // Event storage
  private events: Map<string, Set<EventCallback>> = new Map();
  
  // Private constructor for singleton
  private constructor() {}

  // Singleton instance getter
  public static getInstance(): EventBusUtils {
    if (!EventBusUtils.instance) {
      EventBusUtils.instance = new EventBusUtils();
    }
    return EventBusUtils.instance;
  }

  // Subscribe to an event
  public subscribe(
    eventName: string, 
    callback: EventCallback
  ): EventSubscription {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const eventSet = this.events.get(eventName);
    eventSet.add(callback);

    // Return unsubscribe method
    return {
      unsubscribe: () => {
        eventSet.delete(callback);
      }
    };
  }

  // Publish an event
  public publish(
    eventName: string, 
    ...args: any[]
  ): void {
    const eventSet = this.events.get(eventName);
    
    if (eventSet) {
      eventSet.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  // One-time event subscription
  public subscribeOnce(
    eventName: string, 
    callback: EventCallback
  ): EventSubscription {
    const wrappedCallback = (...args: any[]) => {
      callback(...args);
      this.unsubscribe(eventName, wrappedCallback);
    };

    return this.subscribe(eventName, wrappedCallback);
  }

  // Unsubscribe from an event
  public unsubscribe(
    eventName: string, 
    callback?: EventCallback
  ): void {
    const eventSet = this.events.get(eventName);
    
    if (eventSet) {
      if (callback) {
        eventSet.delete(callback);
      } else {
        // Remove all callbacks for the event
        eventSet.clear();
      }
    }
  }

  // Advanced event with timeout
  public publishWithTimeout(
    eventName: string, 
    timeout: number = 5000,
    ...args: any[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const eventSet = this.events.get(eventName);
      
      if (!eventSet || eventSet.size === 0) {
        reject(new Error(`No subscribers for event: ${eventName}`));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error(`Event ${eventName} timed out`));
      }, timeout);

      try {
        eventSet.forEach(callback => {
          callback(...args);
        });

        clearTimeout(timeoutId);
        resolve();
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  // Middleware support for events
  public createMiddleware(
    eventName: string,
    middlewareFn: (
      payload: any, 
      next: (modifiedPayload: any) => void
    ) => void
  ): EventSubscription {
    const originalSubscribers = this.events.get(eventName) || new Set();
    
    // Clear existing subscribers
    this.events.set(eventName, new Set());

    // Create middleware-wrapped subscription
    const wrappedSubscription = (payload: any) => {
      middlewareFn(payload, (modifiedPayload) => {
        originalSubscribers.forEach(subscriber => {
          subscriber(modifiedPayload);
        });
      });
    };

    return this.subscribe(eventName, wrappedSubscription);
  }

  // Throttle event publishing
  public throttle(
    eventName: string, 
    interval: number = 1000
  ): ((...args: any[]) => void) {
    let lastPublishTime = 0;

    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastPublishTime >= interval) {
        this.publish(eventName, ...args);
        lastPublishTime = now;
      }
    };
  }

  // Debugging and monitoring
  public getEventStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    this.events.forEach((subscribers, eventName) => {
      stats[eventName] = subscribers.size;
    });

    return stats;
  }
}

// Singleton instance
export const eventBus = EventBusUtils.getInstance();

// Example usage
const leadCreatedSubscription = eventBus.subscribe(
  'lead:created', 
  (leadData) => {
    console.log('New lead created:', leadData);
  }
);

// Publish an event
eventBus.publish('lead:created', {
  id: '123',
  name: 'John Doe'
});

// Unsubscribe
leadCreatedSubscription.unsubscribe();

// Middleware example
eventBus.createMiddleware(
  'user:login', 
  (payload, next) => {
    // Transform or validate payload
    const modifiedPayload = {
      ...payload,
      timestamp: Date.now()
    };
    next(modifiedPayload);
  }
);