// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Login response type definition
export interface LoginResponse {
  token: string;
  user: User;
}

// Register request type definition
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Login request type definition
export interface LoginRequest {
  email: string;
  password: string;
}