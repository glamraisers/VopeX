import * as Yup from 'yup';
import { ValidationUtils } from './validationUtils';

// Custom validation messages
const customErrorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password does not meet complexity requirements',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  min: 'Value is too short',
  max: 'Value is too long'
};

// Validation Schemas
export const ValidationSchemas = {
  // User Registration Schema
  userRegistration: Yup.object().shape({
    firstName: Yup.string()
      .required(customErrorMessages.required)
      .min(2, customErrorMessages.min)
      .max(50, customErrorMessages.max),
    
    lastName: Yup.string()
      .required(customErrorMessages.required)
      .min(2, customErrorMessages.min)
      .max(50, customErrorMessages.max),
    
    email: Yup.string()
      .required(customErrorMessages.required)
      .email(customErrorMessages.email)
      .test(
        'is-valid-email', 
        customErrorMessages.email, 
        value => ValidationUtils.validateEmail(value)
      ),
    
    password: Yup.string()
      .required(customErrorMessages.required)
      .test(
        'is-strong-password',
        customErrorMessages.password,
        value => {
          const passwordCheck = ValidationUtils.validatePassword(value);
          return passwordCheck.isValid;
        }
      ),
    
    confirmPassword: Yup.string()
      .required(customErrorMessages.required)
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
  }),

  // Login Schema
  login: Yup.object().shape({
    email: Yup.string()
      .required(customErrorMessages.required)
      .email(customErrorMessages.email),
    
    password: Yup.string()
      .required(customErrorMessages.required)
  }),

  // Lead Creation Schema
  leadCreation: Yup.object().shape({
    firstName: Yup.string()
      .required(customErrorMessages.required)
      .min(2, customErrorMessages.min),
    
    lastName: Yup.string()
      .required(customErrorMessages.required)
      .min(2, customErrorMessages.min),
    
    email: Yup.string()
      .required(customErrorMessages.required)
      .email(customErrorMessages.email),
    
    phone: Yup.string()
      .test(
        'is-valid-phone', 
        customErrorMessages.phone, 
        value => ValidationUtils.validatePhoneNumber(value)
      ),
    
    company: Yup.string()
      .optional(),
    
    source: Yup.string()
      .required(customErrorMessages.required)
  }),

  // Opportunity Creation Schema
  opportunityCreation: Yup.object().shape({
    name: Yup.string()
      .required(customErrorMessages.required)
      .min(3, customErrorMessages.min),
    
    customer: Yup.string()
      .required(customErrorMessages.required),
    
    expectedRevenue: Yup.number()
      .required(customErrorMessages.required)
      .positive('Revenue must be a positive number')
      .min(0, 'Revenue cannot be negative'),
    
    probability: Yup.number()
      .optional()
      .min(0, 'Probability must be between 0 and 100')
      .max(100, 'Probability must be between 0 and 100'),
    
    stage: Yup.string()
      .required(customErrorMessages.required)
      .oneOf([
        'prospecting', 
        'qualification', 
        'proposal', 
        'negotiation', 
        'closed-won', 
        'closed-lost'
      ], 'Invalid opportunity stage')
  }),

  // Contact Information Schema
  contactInformation: Yup.object().shape({
    firstName: Yup.string()
      .required(customErrorMessages.required),
    
    lastName: Yup.string()
      .required(customErrorMessages.required),
    
    email: Yup.string()
      .required(customErrorMessages.required)
      .email(customErrorMessages.email),
    
    phone: Yup.string()
      .test(
        'is-valid-phone', 
        customErrorMessages.phone, 
        value => ValidationUtils.validatePhoneNumber(value)
      ),
    
    website: Yup.string()
      .optional()
      .test(
        'is-valid-url', 
        customErrorMessages.url, 
        value => !value || ValidationUtils.validateURL(value)
      )
  }),

  // Payment Information Schema
  paymentInformation: Yup.object().shape({
    cardNumber: Yup.string()
      .required(customErrorMessages.required)
      .test(
        'is-valid-card', 
        'Invalid credit card number', 
        value => ValidationUtils.validateCreditCard(value)
      ),
    
    cardHolder: Yup.string()
      .required(customErrorMessages.required),
    
    expirationDate: Yup.string()
      .required(customErrorMessages.required)
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/, 
        'Expiration date must be in MM/YY format'
      )
      .test(
        'is-not-expired', 
        'Card has expired', 
        value => {
          const [month, year] = value.split('/');
          const expiration = new Date(`20${year}`, month - 1);
          return expiration > new Date();
        }
      ),
    
    cvv: Yup.string()
      .required(customErrorMessages.required)
      .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
  })
};

// Dynamic Schema Generation
export function createCustomSchema(
  baseSchema: Yup.ObjectSchema, 
  additionalFields?: Record<string, Yup.AnySchema>
) {
  if (additionalFields) {
    return baseSchema.shape({
      ...additionalFields
    });
  }
  return baseSchema;
}

// Example of extending a schema
const extendedLeadSchema = createCustomSchema(
  ValidationSchemas.leadCreation, 
  {
    customField: Yup.string().required('Custom field is required')
  }
);