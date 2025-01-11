export class FormatUtils {
  // Number formatting
  static formatNumber(
    value: number, 
    options?: {
      locale?: string;
      style?: 'decimal' | 'currency' | 'percent';
      currency?: string;
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
    }
  ): string {
    const defaultOptions = {
      locale: 'en-US',
      style: 'decimal',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return new Intl.NumberFormat(mergedOptions.locale, {
        style: mergedOptions.style,
        currency: mergedOptions.currency,
        minimumFractionDigits: mergedOptions.minimumFractionDigits,
        maximumFractionDigits: mergedOptions.maximumFractionDigits
      }).format(value);
    } catch (error) {
      console.warn('Number formatting failed', error);
      return value.toString();
    }
  }

  // Currency formatting with advanced options
  static formatCurrency(
    value: number, 
    currency: string = 'USD',
    options?: {
      locale?: string;
      compact?: boolean;
      showSymbol?: boolean;
    }
  ): string {
    const defaultOptions = {
      locale: 'en-US',
      compact: false,
      showSymbol: true
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return new Intl.NumberFormat(mergedOptions.locale, {
        style: 'currency',
        currency: currency,
        notation: mergedOptions.compact ? 'compact' : 'standard',
        currencyDisplay: mergedOptions.showSymbol ? 'symbol' : 'code'
      }).format(value);
    } catch (error) {
      console.warn('Currency formatting failed', error);
      return `${currency} ${value.toFixed(2)}`;
    }
  }

  // Percentage formatting
  static formatPercentage(
    value: number, 
    options?: {
      locale?: string;
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
    }
  ): string {
    const defaultOptions = {
      locale: 'en-US',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return new Intl.NumberFormat(mergedOptions.locale, {
        style: 'percent',
        minimumFractionDigits: mergedOptions.minimumFractionDigits,
        maximumFractionDigits: mergedOptions.maximumFractionDigits
      }).format(value / 100);
    } catch (error) {
      console.warn('Percentage formatting failed', error);
      return `${value.toFixed(2)}%`;
    }
  }

  // String formatting utilities
  static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static truncate(
    str: string, 
    length: number, 
    options?: {
      ellipsis?: string;
      side?: 'end' | 'middle' | 'start';
    }
  ): string {
    const defaultOptions = {
      ellipsis: '...',
      side: 'end'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    if (str.length <= length) return str;

    switch (mergedOptions.side) {
      case 'end':
        return str.slice(0, length) + mergedOptions.ellipsis;
      case 'middle':
        const midPoint = Math.floor(length / 2);
        return str.slice(0, midPoint) + 
               mergedOptions.ellipsis + 
               str.slice(-midPoint);
      case 'start':
        return mergedOptions.ellipsis + 
               str.slice(str.length - length);
      default:
        return str.slice(0, length) + mergedOptions.ellipsis;
    }
  }

  // Advanced string formatting
  static formatPhoneNumber(
    phoneNumber: string, 
    format: 'international' | 'national' | 'E.164' = 'national'
  ): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    switch (format) {
      case 'international':
        return `+${cleaned}`;
      case 'E.164':
        return `+${cleaned}`;
      case 'national':
      default:
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phoneNumber;
    }
  }

  // Credit card formatting
  static formatCreditCard(cardNumber: string): string {
    // Remove non-digit characters
    const cleaned = cardNumber.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  // Data size formatting
  static formatDataSize(
    bytes: number, 
    options?: {
      precision?: number;
      unit?: 'auto' | 'B' | 'KB' | 'MB' | 'GB' | 'TB';
    }
  ): string {
    const defaultOptions = {
      precision: 2,
      unit: 'auto'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    let value = bytes;
    let unitIndex = 0;

    if (mergedOptions.unit === 'auto') {
      while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
      }
    } else {
      unitIndex = units.indexOf(mergedOptions.unit);
      value = bytes / Math.pow(1024, unitIndex);
    }

    return `${value.toFixed(mergedOptions.precision)} ${units[unitIndex]}`;
  }
}

// Example usage
const currencyFormatted = FormatUtils.formatCurrency(1234.56, 'USD', {
  compact: true
});

const truncatedString = FormatUtils.truncate('This is a very long string', 10, {
  side: 'middle'
});

const phoneFormatted = FormatUtils.formatPhoneNumber('1234567890', 'national');