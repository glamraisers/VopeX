import { 
  encrypt, 
  decrypt 
} from '../services/crypto/cryptoService';

export interface StorageOptions {
  encrypted?: boolean;
  expires?: number;
  namespace?: string;
}

export class StorageUtils {
  // Encryption key for secure storage
  private static encryptionKey = this.generateEncryptionKey();

  // Generate a secure encryption key
  private static generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Set item in storage with advanced options
  static setItem(
    key: string, 
    value: any, 
    options: StorageOptions = {}
  ): void {
    try {
      const {
        encrypted = false,
        expires = 0,
        namespace = 'default'
      } = options;

      // Prepare storage object
      const storageItem = {
        value,
        timestamp: Date.now(),
        expires: expires > 0 ? Date.now() + expires : 0,
        namespace
      };

      // Optional encryption
      const processedValue = encrypted
        ? encrypt(
            JSON.stringify(storageItem), 
            this.encryptionKey
          )
        : JSON.stringify(storageItem);

      // Store in localStorage
      localStorage.setItem(
        this.formatKey(key, namespace), 
        processedValue
      );
    } catch (error) {
      console.error('Storage set error', error);
    }
  }

  // Get item from storage with decryption and expiration
  static getItem<T = any>(
    key: string, 
    namespace = 'default'
  ): T | null {
    try {
      const storedValue = localStorage.getItem(
        this.formatKey(key, namespace)
      );

      if (!storedValue) return null;

      // Attempt decryption first
      let parsedItem;
      try {
        const decryptedValue = decrypt(
          storedValue, 
          this.encryptionKey
        );
        parsedItem = JSON.parse(decryptedValue);
      } catch {
        // Fallback to non-encrypted parsing
        parsedItem = JSON.parse(storedValue);
      }

      // Check expiration
      if (parsedItem.expires > 0 && 
          Date.now() > parsedItem.expires) {
        this.removeItem(key, namespace);
        return null;
      }

      return parsedItem.value;
    } catch (error) {
      console.error('Storage get error', error);
      return null;
    }
  }

  // Remove item from storage
  static removeItem(
    key: string, 
    namespace = 'default'
  ): void {
    localStorage.removeItem(
      this.formatKey(key, namespace)
    );
  }

  // Clear storage with optional namespace
  static clear(namespace = 'default'): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(`${namespace}:`))
      .forEach(key => localStorage.removeItem(key));
  }

  // Format storage key with namespace
  private static formatKey(
    key: string, 
    namespace = 'default'
  ): string {
    return `${namespace}:${key}`;
  }

  // Session storage methods
  static setSessionItem(
    key: string, 
    value: any, 
    options: StorageOptions = {}
  ): void {
    try {
      const {
        encrypted = false,
        namespace = 'default'
      } = options;

      const processedValue = encrypted
        ? encrypt(JSON.stringify(value), this.encryptionKey)
        : JSON.stringify(value);

      sessionStorage.setItem(
        this.formatKey(key, namespace), 
        processedValue
      );
    } catch (error) {
      console.error('Session storage set error', error);
    }
  }

  static getSessionItem<T = any>(
    key: string, 
    namespace = 'default'
  ): T | null {
    try {
      const storedValue = sessionStorage.getItem(
        this.formatKey(key, namespace)
      );

      if (!storedValue) return null;

      // Attempt decryption
      try {
        const decryptedValue = decrypt(
          storedValue, 
          this.encryptionKey
        );
        return JSON.parse(decryptedValue);
      } catch {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error('Session storage get error', error);
      return null;
    }
  }

  // Browser storage quota management
  static getStorageQuota(): {
    used: number;
    total: number;
    remaining: number;
  } {
    try {
      const quota = (navigator as any).webkitTemporaryStorage?.queryUsageAndQuota;
      
      if (quota) {
        return new Promise((resolve, reject) => {
          quota.call(
            (navigator as any).webkitTemporaryStorage, 
            (used, total) => {
              resolve({
                used,
                total,
                remaining: total - used
              });
            },
            reject
          );
        });
      }

      return {
        used: 0,
        total: 0,
        remaining: 0
      };
    } catch (error) {
      console.warn('Storage quota check failed', error);
      return {
        used: 0,
        total: 0,
        remaining: 0
      };
    }
  }

  // Advanced storage observer
  static observeStorage(
    callback: (changes: {
      key: string;
      oldValue: any;
      newValue: any;
    }) => void
  ): () => void {
    const storageHandler = (event: StorageEvent) => {
      if (event.storageArea === localStorage) {
        callback({
          key: event.key,
          oldValue: event.oldValue 
            ? JSON.parse(event.oldValue) 
            : null,
          newValue: event.newValue 
            ? JSON.parse(event.newValue) 
            : null
        });
      }
    };

    window.addEventListener('storage', storageHandler);

    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', storageHandler);
    };
  }
}

// Example usage
StorageUtils.setItem('user', { 
  name: 'John Doe' 
}, {
  encrypted: true,
  expires: 24 * 60 * 60 * 1000, // 24 hours
  namespace: 'auth'
});

const user = StorageUtils.getItem('user', 'auth');

// Observe storage changes
const unsubscribe = StorageUtils.observeStorage((changes) => {
  console.log('Storage changed:', changes);
});

// Later, when no longer needed
unsubscribe();