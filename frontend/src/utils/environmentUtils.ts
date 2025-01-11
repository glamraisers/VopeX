import { StorageUtils } from './storageUtils';
import { eventBus } from './eventBusUtils';

export enum EnvironmentType {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing'
}

export interface EnvironmentConfig {
  apiBaseUrl: string;
  debugMode: boolean;
  featureFlags: Record<string, boolean>;
  performanceMonitoring: boolean;
}

export class EnvironmentUtils {
  // Current environment configuration
  private static currentEnvironment: EnvironmentType = this.detectEnvironment();

  // Environment configurations
  private static environmentConfigs: Record<EnvironmentType, EnvironmentConfig> = {
    [EnvironmentType.DEVELOPMENT]: {
      apiBaseUrl: 'http://localhost:3000/api',
      debugMode: true,
      featureFlags: {
        enableNewDashboard: true,
        enableAdvancedReporting: true
      },
      performanceMonitoring: false
    },
    [EnvironmentType.STAGING]: {
      apiBaseUrl: 'https://staging-api.example.com/api',
      debugMode: false,
      featureFlags: {
        enableNewDashboard: true,
        enableAdvancedReporting: false
      },
      performanceMonitoring: true
    },
    [EnvironmentType.PRODUCTION]: {
      apiBaseUrl: 'https://api.example.com/api',
      debugMode: false,
      featureFlags: {
        enableNewDashboard: false,
        enableAdvancedReporting: false
      },
      performanceMonitoring: true
    },
    [EnvironmentType.TESTING]: {
      apiBaseUrl: 'http://test-api.example.com/api',
      debugMode: true,
      featureFlags: {
        enableNewDashboard: true,
        enableAdvancedReporting: true
      },
      performanceMonitoring: false
    }
  };

  // Detect current environment
  private static detectEnvironment(): EnvironmentType {
    // Check environment variables
    if (process.env.NODE_ENV) {
      return process.env.NODE_ENV as EnvironmentType;
    }

    // Fallback detection
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return EnvironmentType.DEVELOPMENT;
    }
    if (hostname.includes('staging')) {
      return EnvironmentType.STAGING;
    }
    if (hostname.includes('test')) {
      return EnvironmentType.TESTING;
    }

    return EnvironmentType.PRODUCTION;
  }

  // Get current environment
  static getCurrentEnvironment(): EnvironmentType {
    return this.currentEnvironment;
  }

  // Get environment configuration
  static getConfig(
    environment?: EnvironmentType
  ): EnvironmentConfig {
    const env = environment || this.currentEnvironment;
    return this.environmentConfigs[env];
  }

  // Check if in specific environment
  static isEnvironment(
    environment: EnvironmentType | EnvironmentType[]
  ): boolean {
    if (Array.isArray(environment)) {
      return environment.includes(this.currentEnvironment);
    }
    return this.currentEnvironment === environment;
  }

  // Override environment configuration
  static overrideConfig(
    environment: EnvironmentType, 
    config: Partial<EnvironmentConfig>
  ): void {
    this.environmentConfigs[environment] = {
      ...this.environmentConfigs[environment],
      ...config
    };

    // Emit configuration change event
    eventBus.publish('environment:config_updated', {
      environment,
      config
    });
  }

  // Get feature flag
  static getFeatureFlag(
    flagName: string, 
    environment?: EnvironmentType
  ): boolean {
    const config = this.getConfig(environment);
    return config.featureFlags[flagName] || false;
  }

  // Dynamic configuration loading
  static async loadRemoteConfig(): Promise<void> {
    try {
      const remoteConfig = await fetch('/config/environment.json').then(r => r.json());
      
      // Update configurations
      Object.entries(remoteConfig).forEach(([env, config]) => {
        this.overrideConfig(
          env as EnvironmentType, 
          config as Partial<EnvironmentConfig>
        );
      });

      // Persist to storage
      StorageUtils.setItem('remote-env-config', remoteConfig, {
        encrypted: true
      });
    } catch (error) {
      console.warn('Failed to load remote configuration', error);
      
      // Fallback to stored configuration
      const storedConfig = StorageUtils.getItem('remote-env-config');
      if (storedConfig) {
        Object.entries(storedConfig).forEach(([env, config]) => {
          this.overrideConfig(
            env as EnvironmentType, 
            config as Partial<EnvironmentConfig>
          );
        });
      }
    }
  }

  // Generate environment report
  static getEnvironmentReport(): {
    environment: EnvironmentType;
    apiBaseUrl: string;
    userAgent: string;
    timestamp: number;
  } {
    return {
      environment: this.currentEnvironment,
      apiBaseUrl: this.getConfig().apiBaseUrl,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };
  }

  // Listen to environment configuration changes
  static onConfigChange(
    callback: (config: { 
      environment: EnvironmentType; 
      config: Partial<EnvironmentConfig> 
    }) => void
  ): () => void {
    return eventBus.subscribe('environment:config_updated', callback);
  }
}

// Initialize remote configuration on startup
async function initializeEnvironment() {
  await EnvironmentUtils.loadRemoteConfig();
}

// Export utility
export const environmentUtils = EnvironmentUtils;

// Example usage
const currentEnv = environmentUtils.getCurrentEnvironment();
const apiBaseUrl = environmentUtils.getConfig().apiBaseUrl;

// Check feature flag
const isNewDashboardEnabled = environmentUtils.getFeatureFlag('enableNewDashboard');

// Environment-specific logic
if (environmentUtils.isEnvironment(EnvironmentType.DEVELOPMENT)) {
  // Development-specific setup
}