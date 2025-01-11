import { apiService } from '../services/api/baseApiService';
import { StorageUtils } from './storageUtils';

export enum FeatureFlagStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  PARTIAL = 'PARTIAL'
}

export interface FeatureFlag {
  key: string;
  status: FeatureFlagStatus;
  rolloutPercentage?: number;
  enabledForRoles?: string[];
  conditions?: Record<string, any>;
}

export class FeatureFlagUtils {
  // Local cache for feature flags
  private static featureFlags: Map<string, FeatureFlag> = new Map();

  // User context for feature flag evaluation
  private static userContext: {
    id?: string;
    roles?: string[];
    email?: string;
  } = {};

  // Set user context for feature flag evaluation
  static setUserContext(context: {
    id?: string;
    roles?: string[];
    email?: string;
  }): void {
    this.userContext = context;
  }

  // Fetch feature flags from server
  static async syncFeatureFlags(): Promise<void> {
    try {
      const flags = await apiService.get('/feature-flags');
      
      flags.forEach((flag: FeatureFlag) => {
        this.featureFlags.set(flag.key, flag);
      });

      // Cache feature flags
      StorageUtils.setItem('feature-flags', Object.fromEntries(this.featureFlags), {
        encrypted: true
      });
    } catch (error) {
      console.warn('Feature flag sync failed', error);
      
      // Fallback to cached flags
      const cachedFlags = StorageUtils.getItem('feature-flags');
      if (cachedFlags) {
        this.featureFlags = new Map(Object.entries(cachedFlags));
      }
    }
  }

  // Evaluate feature flag
  static isFeatureEnabled(
    flagKey: string, 
    overrideContext?: {
      id?: string;
      roles?: string[];
      email?: string;
    }
  ): boolean {
    const flag = this.featureFlags.get(flagKey);
    
    if (!flag) {
      console.warn(`Feature flag ${flagKey} not found`);
      return false;
    }

    // Use override context or default context
    const context = overrideContext || this.userContext;

    // Check flag status
    if (flag.status === FeatureFlagStatus.DISABLED) {
      return false;
    }

    // Full rollout
    if (flag.status === FeatureFlagStatus.ENABLED) {
      return true;
    }

    // Partial rollout
    if (flag.status === FeatureFlagStatus.PARTIAL) {
      // Check rollout percentage
      if (flag.rolloutPercentage) {
        const randomValue = this.generateHashedPercentage(context.id);
        if (randomValue > flag.rolloutPercentage) {
          return false;
        }
      }

      // Check role-based access
      if (flag.enabledForRoles && context.roles) {
        const hasEnabledRole = flag.enabledForRoles.some(role => 
          context.roles.includes(role)
        );
        if (!hasEnabledRole) {
          return false;
        }
      }

      // Advanced conditional evaluation
      if (flag.conditions) {
        return this.evaluateConditions(flag.conditions, context);
      }
    }

    return true;
  }

  // Generate consistent hash-based percentage
  private static generateHashedPercentage(seed?: string): number {
    if (!seed) return 0;

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to percentage
    return Math.abs(hash % 100);
  }

  // Evaluate complex conditions
  private static evaluateConditions(
    conditions: Record<string, any>, 
    context: {
      id?: string;
      roles?: string[];
      email?: string;
    }
  ): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      switch (key) {
        case 'email_domain':
          if (context.email) {
            const domain = context.email.split('@')[1];
            if (!value.includes(domain)) {
              return false;
            }
          }
          break;
        case 'user_ids':
          if (context.id && !value.includes(context.id)) {
            return false;
          }
          break;
        case 'environment':
          if (value !== process.env.NODE_ENV) {
            return false;
          }
          break;
        default:
          // Custom condition handling
          console.warn(`Unsupported condition: ${key}`);
      }
    }

    return true;
  }

  // Get feature flag details
  static getFeatureFlagDetails(flagKey: string): FeatureFlag | undefined {
    return this.featureFlags.get(flagKey);
  }

  // Register a new feature flag
  static registerFeatureFlag(flag: FeatureFlag): void {
    this.featureFlags.set(flag.key, flag);
  }

  // Experimental feature with fallback
  static experimentalFeature<T>(
    flagKey: string, 
    experimentalImpl: () => T, 
    fallbackImpl: () => T
  ): T {
    return this.isFeatureEnabled(flagKey) 
      ? experimentalImpl() 
      : fallbackImpl();
  }

  // Feature flag change listener
  static onFeatureFlagChange(
    flagKey: string, 
    callback: (enabled: boolean) => void
  ): () => void {
    let lastState = this.isFeatureEnabled(flagKey);
    
    const interval = setInterval(() => {
      const currentState = this.isFeatureEnabled(flagKey);
      
      if (currentState !== lastState) {
        callback(currentState);
        lastState = currentState;
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}

// Initialize feature flags on app startup
async function initializeFeatureFlags() {
  // Set initial user context
  FeatureFlagUtils.setUserContext({
    id: localStorage.getItem('userId'),
    roles: JSON.parse(localStorage.getItem('userRoles') || '[]'),
    email: localStorage.getItem('userEmail')
  });

  // Sync feature flags
  await FeatureFlagUtils.syncFeatureFlags();
}

// Example usage
export const featureFlags = FeatureFlagUtils;

// Usage in application
if (featureFlags.isFeatureEnabled('new_dashboard')) {
  // Render new dashboard
} else {
  // Render old dashboard
}

// Experimental feature with fallback
const analyticsData = featureFlags.experimentalFeature(
  'advanced_analytics',
  () => performAdvancedAnalytics(),
  () => performBasicAnalytics()
);