import { format, parseISO, formatDistance, isValid } from 'date-fns';
import { enUS, es, fr, de, ru } from 'date-fns/locale';

// Supported locales
const localeMap = {
  'en-US': enUS,
  'es-ES': es,
  'fr-FR': fr,
  'de-DE': de,
  'ru-RU': ru
};

export class DateUtils {
  // Default locale
  private static defaultLocale = 'en-US';

  // Set global locale
  static setDefaultLocale(locale: string) {
    if (localeMap[locale]) {
      this.defaultLocale = locale;
    }
  }

  // Parse date with fallback
  static parseDate(
    date: string | Date | number, 
    fallbackDate?: Date
  ): Date {
    if (date instanceof Date) return date;
    
    if (typeof date === 'string') {
      const parsed = parseISO(date);
      return isValid(parsed) ? parsed : (fallbackDate || new Date());
    }
    
    if (typeof date === 'number') {
      const parsed = new Date(date);
      return isValid(parsed) ? parsed : (fallbackDate || new Date());
    }

    return fallbackDate || new Date();
  }

  // Format date with multiple options
  static formatDate(
    date: string | Date | number, 
    formatString: string = 'PPP', 
    options?: {
      locale?: string;
      timeZone?: string;
    }
  ): string {
    const parsedDate = this.parseDate(date);
    const locale = localeMap[options?.locale || this.defaultLocale];

    try {
      return format(parsedDate, formatString, { 
        locale 
      });
    } catch (error) {
      console.warn('Date formatting failed', error);
      return parsedDate.toLocaleDateString();
    }
  }

  // Relative time formatting
  static formatRelativeTime(
    date: string | Date | number, 
    baseDate?: string | Date | number,
    options?: {
      locale?: string;
      includeSeconds?: boolean;
    }
  ): string {
    const targetDate = this.parseDate(date);
    const baseReference = baseDate 
      ? this.parseDate(baseDate) 
      : new Date();
    
    const locale = localeMap[options?.locale || this.defaultLocale];

    return formatDistance(targetDate, baseReference, {
      locale,
      includeSeconds: options?.includeSeconds || false,
      addSuffix: true
    });
  }

  // Advanced date range utilities
  static createDateRange(
    start: string | Date, 
    end: string | Date,
    interval: 'day' | 'week' | 'month' | 'year' = 'day'
  ): Date[] {
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);
    const range: Date[] = [];

    let current = new Date(startDate);
    while (current <= endDate) {
      range.push(new Date(current));
      
      switch (interval) {
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
        case 'year':
          current.setFullYear(current.getFullYear() + 1);
          break;
      }
    }

    return range;
  }

  // Time zone conversion
  static convertTimeZone(
    date: string | Date, 
    targetTimeZone: string
  ): Date {
    try {
      const parsedDate = this.parseDate(date);
      
      return new Date(
        parsedDate.toLocaleString('en-US', { timeZone: targetTimeZone })
      );
    } catch (error) {
      console.warn('Time zone conversion failed', error);
      return this.parseDate(date);
    }
  }

  // Calculate duration between dates
  static calculateDuration(
    start: string | Date, 
    end: string | Date
  ): {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
  } {
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      years: Math.floor(diffDays / 365),
      months: Math.floor((diffDays % 365) / 30),
      days: diffDays % 30,
      hours: Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    };
  }

  // Check if date is within a specific range
  static isDateInRange(
    date: string | Date, 
    start: string | Date, 
    end: string | Date
  ): boolean {
    const targetDate = this.parseDate(date);
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);

    return targetDate >= startDate && targetDate <= endDate;
  }

  // Generate calendar events
  static generateCalendarEvents(
    baseDate: string | Date,
    options?: {
      months?: number;
      includeWeekends?: boolean;
      excludeHolidays?: boolean;
    }
  ): Date[] {
    const startDate = this.parseDate(baseDate);
    const events: Date[] = [];
    const months = options?.months || 1;

    for (let i = 0; i < months; i++) {
      const currentMonth = new Date(startDate);
      currentMonth.setMonth(startDate.getMonth() + i);

      const daysInMonth = new Date(
        currentMonth.getFullYear(), 
        currentMonth.getMonth() + 1, 
        0
      ).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(
          currentMonth.getFullYear(), 
          currentMonth.getMonth(), 
          day
        );

        // Optional weekend filtering
        if (!options?.includeWeekends && 
            (currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
          continue;
        }

        events.push(currentDate);
      }
    }

    return events;
  }
}

// Example usage
const formattedDate = DateUtils.formatDate(
  new Date(), 
  'PPPP', 
  { locale: 'es-ES' }
);

const relativeTime = DateUtils.formatRelativeTime(
  new Date('2023-01-01'), 
  new Date()
);

const dateRange = DateUtils.createDateRange(
  new Date('2023-01-01'), 
  new Date('2023-12-31'), 
  'month'
);