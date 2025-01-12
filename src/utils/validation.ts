// Utility function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to check if a string is empty
export const isEmpty = (value: string): boolean => {
  return !value.trim().length;
};

// Utility function to validate password strength
export const isValidPassword = (password: string): boolean => {
  // Example: Password must be at least 8 characters long and contain at least one number
  const passwordRegex = /^(?=.*[0-9]).{8,}$/;
  return passwordRegex.test(password);
};

// Utility function to validate required fields
export const validateRequired = (value: string): string | undefined => {
  return isEmpty(value) ? 'This field is required' : undefined;
};

// Utility function to validate email
export const validateEmail = (email: string): string | undefined => {
  return isValidEmail(email) ? undefined : 'Invalid email format';
};

// Utility function to validate password
export const validatePassword = (password: string): string | undefined => {
  return isValidPassword(password) ? undefined : 'Password must be at least 8 characters long and contain at least one number';
};