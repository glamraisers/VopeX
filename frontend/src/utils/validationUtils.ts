// Comprehensive Validation Utility

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export class ValidationUtils {
  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password strength validation
  static validatePassword(password: string): {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    issues: string[];
  } {
    const issues: string[] = [];

    // Length check
    if (password.length < 8) {
      issues.push('Password must be at least 8 characters long');
    }

    // Complexity checks
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase) issues.push('Must contain at least one uppercase letter');
    if (!hasLowercase) issues.push('Must contain at least one lowercase letter');
    if (!hasNumber) issues.push('Must contain at least one number');
    if (!hasSpecialChar) issues.push('Must contain at least one special character');

    const strengthScore = [
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      password.length >= 12
    ].filter(Boolean).length;

    let strength: 'weak' | 'medium' | 'strong';
    if (strengthScore <= 2) strength = 'weak';
    else if (strengthScore <= 4) strength = 'medium';
    else strength = 'strong';

    return {
      isValid: issues.length === 0,
      strength,
      issues
    };
  }

  // Phone number validation
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  // URL validation
  static validateURL(url: string): boolean {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
  }

  // Credit card validation (Luhn algorithm)
  static validateCreditCard(cardNumber: string): boolean {
    // Remove non-digit characters
    const cleanedNumber = cardNumber.replace(/\D/g, '');
    
    // Luhn algorithm implementation
    let sum = 0;
    let isEvenIndex = false;

    for (let i = cleanedNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedNumber.charAt(i), 10);

      if (isEvenIndex) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEvenIndex = !isEvenIndex;
    }

    return sum % 10 === 0;
  }

  // Custom validation builder
  static createValidator(rules: ValidationRule[]): (value: any) => {
    isValid: boolean;
    errors: string[];
  } {
    return (value: any) => {
      const errors = rules
        .filter(rule => !rule.validate(value))
        .map(rule => rule.message);

      return {
        isValid: errors.length === 0,
        errors
      };
    };
  }

  // Form validation
  static validateForm(
    formData: Record<string, any>, 
    validationSchema: Record<string, ValidationRule[]>
  ): {
    isValid: boolean;
    errors: Record<string, string[]>;
  } {
    const errors: Record<string, string[]> = {};

    Object.keys(validationSchema).forEach(field => {
      const rules = validationSchema[field];
      const value = formData[field];

      const fieldValidation = this.createValidator(rules)(value);
      if (!fieldValidation.isValid) {
        errors[field] = fieldValidation.errors;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Sanitization methods
  static sanitizeInput(input: string, type: 'text' | 'html' | 'sql'): string {
    switch (type) {
      case 'text':
        // Remove potentially dangerous characters
        return input.replace(/[<>&'"]/g, '');
      case 'html':
        // Basic HTML sanitization
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      case 'sql':
        // Prevent SQL injection
        return input.replace(/['";\\]/g, '');
      default:
        return input;
    }
  }
}

// Example usage
const emailValidator = ValidationUtils.createValidator([
  {
    validate: (value) => ValidationUtils.validateEmail(value),
    message: 'Invalid email format'
  },
  {
    validate: (value) => value.length > 0,
    message: 'Email is required'
  }
]);

const formValidationSchema = {
  email: [
    {
      validate: (value) => ValidationUtils.validateEmail(value),
      message: 'Invalid email format'
    }
  ],
  password: [
    {
      validate: (value) => ValidationUtils.validatePassword(value).isValid,
      message: 'Password does not meet complexity requirements'
    }
  ]
};