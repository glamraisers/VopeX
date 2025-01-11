import { format } from 'date-fns';

export class DataTransformUtils {
  // Flatten nested objects
  static flattenObject(
    obj: Record<string, any>, 
    prefix = ''
  ): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? prefix + '.' : '';
      
      if (
        typeof obj[key] === 'object' && 
        obj[key] !== null && 
        !Array.isArray(obj[key])
      ) {
        Object.assign(
          acc, 
          this.flattenObject(obj[key], pre + key)
        );
      } else {
        acc[pre + key] = obj[key];
      }
      
      return acc;
    }, {});
  }

  // Transform object keys
  static transformObjectKeys(
    obj: Record<string, any>, 
    transformFn: (key: string) => string
  ): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      const transformedKey = transformFn(key);
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        acc[transformedKey] = Array.isArray(obj[key])
          ? obj[key].map(item => 
              typeof item === 'object' 
                ? this.transformObjectKeys(item, transformFn)
                : item
            )
          : this.transformObjectKeys(obj[key], transformFn);
      } else {
        acc[transformedKey] = obj[key];
      }
      
      return acc;
    }, {});
  }

  // Convert to camelCase
  static toCamelCase(
    obj: Record<string, any>
  ): Record<string, any> {
    return this.transformObjectKeys(obj, key => 
      key.replace(/([-_]\w)/g, g => 
        g[1].toUpperCase()
      )
    );
  }

  // Convert to snake_case
  static toSnakeCase(
    obj: Record<string, any>
  ): Record<string, any> {
    return this.transformObjectKeys(obj, key => 
      key.replace(/[A-Z]/g, letter => 
        `_${letter.toLowerCase()}`
      )
    );
  }

  // Deep clone with type preservation
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as T;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T;
    }

    if (obj instanceof RegExp) {
      return new RegExp(obj) as T;
    }

    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = this.deepClone(obj[key]);
      }
    }

    return clonedObj;
  }

  // Merge objects deeply
  static mergeDeep(
    target: Record<string, any>, 
    ...sources: Record<string, any>[]
  ): Record<string, any> {
    if (!sources.length) return target;
    
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }

  // Check if value is an object
  private static isObject(item: any): boolean {
    return (
      item && 
      typeof item === 'object' && 
      !Array.isArray(item)
    );
  }

  // Transform data types
  static transformDataTypes(
    data: any, 
    transformRules: Record<string, (value: any) => any>
  ): any {
    if (Array.isArray(data)) {
      return data.map(item => 
        this.transformDataTypes(item, transformRules)
      );
    }

    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).reduce((acc, key) => {
        const value = data[key];
        
        // Apply type transformation if rule exists
        if (transformRules[key]) {
          acc[key] = transformRules[key](value);
        } else if (typeof value === 'object') {
          acc[key] = this.transformDataTypes(value, transformRules);
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, {});
    }

    return data;
  }

  // Format dates consistently
  static formatDate(
    date: Date | string | number, 
    formatString = 'yyyy-MM-dd HH:mm:ss'
  ): string {
    return format(new Date(date), formatString);
  }

  // Filter object properties
  static filterObject(
    obj: Record<string, any>, 
    predicate: (key: string, value: any) => boolean
  ): Record<string, any> {
    return Object.keys(obj)
      .filter(key => predicate(key, obj[key]))
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
  }

  // Generate unique identifier
  static generateUniqueId(
    prefix = '', 
    length = 8
  ): string {
    const randomPart = Math.random()
      .toString(36)
      .substring(2, length + 2);
    
    return prefix ? `${prefix}-${randomPart}` : randomPart;
  }
}

// Example usage
export const dataTransform = DataTransformUtils;

// Flatten nested object
const flattenedObj = dataTransform.flattenObject({
  user: {
    profile: {
      firstName: 'John',
      lastName: 'Doe'
    }
  }
});

// Transform object keys
const camelCaseObj = dataTransform.toCamelCase({
  first_name: 'John',
  last_name: 'Doe'
});

// Deep clone
const originalObj = { 
  name: 'Test', 
  details: { age: 30 } 
};
const clonedObj = dataTransform.deepClone(originalObj);

// Transform data types
const transformedData = dataTransform.transformDataTypes(
  { 
    id: '123', 
    createdAt: '2023-01-01' 
  },
  {
    id: Number,
    createdAt: (value) => new Date(value)
  }
);