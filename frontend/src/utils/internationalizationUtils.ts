import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Language resources
const resources = {
  en: {
    translation: {
      common: {
        welcome: 'Welcome',
        hello: 'Hello, {{name}}',
        loading: 'Loading...',
        error: 'An error occurred'
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register'
      }
    }
  },
  es: {
    translation: {
      common: {
        welcome: 'Bienvenido',
        hello: 'Hola, {{name}}',
        loading: 'Cargando...',
        error: 'Ocurrió un error'
      },
      auth: {
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        register: 'Registrarse'
      }
    }
  },
  fr: {
    translation: {
      common: {
        welcome: 'Bienvenue',
        hello: 'Bonjour, {{name}}',
        loading: 'Chargement...',
        error: 'Une erreur est survenue'
      },
      auth: {
        login: 'Connexion',
        logout: 'Déconnexion',
        register: 'S\'inscrire'
      }
    }
  }
};

export class InternationalizationUtils {
  // Supported languages
  private static supportedLanguages = ['en', 'es', 'fr'];
  
  // Default language
  private static defaultLanguage = 'en';

  // Initialize internationalization
  static initialize() {
    i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: this.defaultLanguage,
        debug: process.env.NODE_ENV !== 'production',
        interpolation: {
          escapeValue: false // React already escapes values
        },
        detection: {
          order: [
            'querystring', 
            'cookie', 
            'localStorage', 
            'navigator', 
            'htmlTag'
          ],
          caches: ['localStorage', 'cookie']
        }
      });

    return i18n;
  }

  // Change language
  static changeLanguage(
    language: string, 
    options?: {
      persistLanguage?: boolean;
    }
  ): Promise<void> {
    // Validate language
    if (!this.supportedLanguages.includes(language)) {
      console.warn(`Unsupported language: ${language}. Falling back to default.`);
      language = this.defaultLanguage;
    }

    // Persist language preference
    if (options?.persistLanguage !== false) {
      localStorage.setItem('language', language);
    }

    return new Promise((resolve, reject) => {
      i18n.changeLanguage(language, (err) => {
        if (err) {
          console.error('Language change failed', err);
          reject(err);
        } else {
          // Dispatch language change event
          this.dispatchLanguageChangeEvent(language);
          resolve();
        }
      });
    });
  }

  // Get current language
  static getCurrentLanguage(): string {
    return i18n.language || this.defaultLanguage;
  }

  // Translate text
  static translate(
    key: string, 
    options?: {
      context?: string;
      defaultValue?: string;
      interpolation?: Record<string, any>;
    }
  ): string {
    return i18n.t(key, {
      defaultValue: options?.defaultValue,
      context: options?.context,
      ...options?.interpolation
    });
  }

  // Pluralization
  static translatePlural(
    key: string, 
    count: number, 
    options?: Record<string, any>
  ): string {
    return i18n.t(key, { 
      count, 
      ...options 
    });
  }

  // Format date based on locale
  static formatDate(
    date: Date | string, 
    options?: Intl.DateTimeFormatOptions
  ): string {
    const language = this.getCurrentLanguage();
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  }

  // Format currency based on locale
  static formatCurrency(
    amount: number, 
    currency: string = 'USD'
  ): string {
    const language = this.getCurrentLanguage();
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Dispatch language change event
  private static dispatchLanguageChangeEvent(language: string): void {
    const event = new CustomEvent('language:changed', {
      detail: { language }
    });
    window.dispatchEvent(event);
  }

  // Add listener for language changes
  static onLanguageChange(
    callback: (language: string) => void
  ): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail.language);
    };

    window.addEventListener('language:changed', handler as EventListener);

    return () => {
      window.removeEventListener('language:changed', handler as EventListener);
    };
  }

  // Get supported languages
  static getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  // Detect user's preferred language
  static detectUserLanguage(): string {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && this.supportedLanguages.includes(storedLanguage)) {
      return storedLanguage;
    }

    // Use browser language or default
    const browserLanguage = navigator.language.split('-')[0];
    return this.supportedLanguages.includes(browserLanguage) 
      ? browserLanguage 
      : this.defaultLanguage;
  }
}

// Initialize internationalization on app startup
InternationalizationUtils.initialize();

// Example usage
export const i18nUtils = InternationalizationUtils;

// In a React component
function WelcomeMessage() {
  const name = 'John';
  const translatedMessage = i18nUtils.translate('common.hello', {
    interpolation: { name }
  });

  return <div>{translatedMessage}</div>;
}

// Change language
i18nUtils.changeLanguage('es');

// Listen for language changes
const unsubscribe = i18nUtils.onLanguageChange((newLanguage) => {
  console.log('Language changed to:', newLanguage);
});