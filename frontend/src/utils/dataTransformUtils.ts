import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export class DataTransformUtils {
  // Advanced object flattening with custom delimiter
  static flattenObject(
    obj: Record<string, any>, 
    options: {
      delimiter?: string;
      maxDepth?: number;
    } = {}
  ): Record<string, any> {
    const {
      delimiter = '.',
      maxDepth = Infinity
    } = options;

    const flatten = (
      item: any, 
      path: string[] = [], 
      depth = 0
    ): Record<string, any> => {
      if (
        depth >= maxDepth || 
        typeof item !== 'object' || 
        item === null
      ) {
        return { [path.join(delimiter)]: item };
      }

      return Object.keys(item).reduce((acc, key) => {
        const newPath = [...path, key];
        const value = item[key];
        
        const flattenedValue = flatten(
          value, 
          newPath, 
          depth + 1
        );

        return {
          ...acc,
          ...flattenedValue
        };
      }, {});
    };

    return flatten(obj);
  }

  // Advanced data masking
  static maskData(
    data: any, 
    maskRules: Record<string, (value: any) => any>
  ): any {
    if (Array.isArray(data)) {
      return data.map(item => this.maskData(item, maskRules));
    }

    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).reduce((acc, key) => {
        const value = data[key];
        
        // Apply masking if rule exists
        if (maskRules[key]) {
          acc[key] = maskRules[key](value);
        } else if (typeof value === 'object') {
          acc[key] = this.maskData(value, maskRules);
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, {});
    }

    return data;
  }

  // Advanced data normalization
  static normalizeData(
    data: any, 
    normalizationRules: {
      trimStrings?: boolean;
      lowercaseStrings?: boolean;
      removeEmptyFields?: boolean;
      convertNullToUndefined?: boolean;
    } = {}
  ): any {
    const {
      trimStrings = true,
      lowercaseStrings = false,
      removeEmptyFields = false,
      convertNullToUndefined = false
    } = normalizationRules;

    if (Array.isArray(data)) {
      return data.map(item => 
        this.normalizeData(item, normalizationRules)
      );
    }

    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).reduce((acc, key) => {
        let value = data[key];

        // Normalize string values
        if (typeof value === 'string') {
          if (trimStrings) value = value.trim();
          if (lowercaseStrings) value = value.toLowerCase();
        }

        // Handle null/empty values
        if (convertNullToUndefined && value === null) {
          value = undefined;
        }

        // Recursively normalize
        if (typeof value === 'object') {
          value = this.normalizeData(value, normalizationRules);
        }

        // Remove empty fields if specified
        if (
          removeEmptyFields && 
          (value === '' || value === null || value === undefined)
        ) {
          return acc;
        }

        acc[key] = value;
        return acc;
      }, {});
    }

    return data;
  }

  // Advanced date transformation
  static transformDate(
    date: Date | string | number, 
    options: {
      inputFormat?: string;
      outputFormat?: string;
      timezone?: string;
    } = {}
  ): string {
    const {
      inputFormat = 'iso',
      outputFormat = 'yyyy-MM-dd HH:mm:ss',
      timezone = 'UTC'
    } = options;

    // Parse input date
    let parsedDate: Date;
    if (typeof date === 'string') {
      parsedDate = inputFormat === 'iso' 
        ? parseISO(date)
        : new Date(date);
    } else {
      parsedDate = new Date(date);
    }

    // Format date with timezone consideration
    return format(parsedDate, outputFormat);
  }

  // Generate predictable unique identifiers
  static generateId(
    prefix = '', 
    options: {
      length?: number;
      includeTimestamp?: boolean;
    } = {}
  ): string {
    const {
      length = 8,
      includeTimestamp = false
    } = options;

    const baseId = uuidv4().replace(/-/g, '').substring(0, length);
    
    if (includeTimestamp) {
      const timestamp = Date.now().toString(36);
      return `${prefix}${timestamp}-${baseId}`;
    }

    return `${prefix}${baseId}`;
  }

  // Advanced object comparison
  static compareObjects(
    obj1: any, 
    obj2: any, 
    options: {
      deep?: boolean;
      ignoreKeys?: string[];
    } = {}
  ): boolean {
    const {
      deep = true,
      ignoreKeys = []
    } = options;

    // Handle primitive comparisons
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
    }

    // Get keys, excluding ignored keys
    const keys1 = Object.keys(obj1).filter(
      key => !ignoreKeys.includes(key)
    );
    const keys2 = Object.keys(obj2).filter(
      key => !ignoreKeys.includes(key)
    );

    // Quick comparison of key lengths
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Compare each key
    return keys1.every(key => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      // Deep comparison for nested objects
      if (
        deep && 
        typeof val1 === 'object' && 
        typeof val2 === 'object'
      ) {
        return this.compareObjects(val1, val2, { deep, ignoreKeys });
      }

      return val1 === val2;
    });
  }
}

// Example usage
export const dataTransform = DataTransformUtils;

// Flatten object
const flattened = dataTransform.flattenObject({
  user: {
    profile: {
      firstName: 'John',
      lastName: 'Doe'
    }
  }
}, { delimiter: '_' });

// Mask sensitive data
const maskedData = dataTransform.maskData(
  { 
    creditCard: '1234-5678-9012-3456',
    ssn: '123-45-6789' 
  },
  {
    creditCard: (value) => value.replace(/\d{12}/, '************'),
    ssn: (value) => value.replace(/\d{5}/, '*****')
  }
);

// Normalize data
const normalizedData = dataTransform.normalizeData(
  { 
    name: '  John Doe  ', 
    age: null, 
    active: '' 
  },
  {
    trimStrings: true,
    removeEmptyFields: true
  }
);

// Generate unique ID
const uniqueId = dataTransform.generateId('user', {
  includeTimestamp: true
});