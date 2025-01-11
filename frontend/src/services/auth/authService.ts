import { apiService } from '../api/baseApiService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private tokenKey = 'vopex_auth_token';
  private userKey = 'vopex_user_data';

  // Singleton pattern
  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login method
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<LoginCredentials, AuthResponse>(
        '/auth/login', 
        credentials
      );

      this.setAuthData(response);
      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  // Register method
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<RegisterCredentials, AuthResponse>(
        '/auth/register', 
        credentials
      );

      this.setAuthData(response);
      return response;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  // Logout method
  logout(): void {
    this.clearAuthData();
    window.location.href = '/login';
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Get current user
  getCurrentUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Refresh token method
  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiService.post<{}, { token: string }>(
        '/auth/refresh-token', 
        {}
      );

      if (response.token) {
        this.setToken(response.token);
        return response.token;
      }
      return null;
    } catch (error) {
      this.handleAuthError(error);
      return null;
    }
  }

  // Password reset methods
  async requestPasswordReset(email: string): Promise<void> {
    await apiService.post('/auth/password-reset-request', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/password-reset', { token, newPassword });
  }

  // Private methods
  private setAuthData(authResponse: AuthResponse): void {
    this.setToken(authResponse.token);
    this.setUserData(authResponse.user);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUserData(userData: AuthResponse['user']): void {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Token expiration check
  private isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  // Decode JWT token
  private decodeToken(token: string): { exp: number } {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  // Error handling
  private handleAuthError(error: any): void {
    console.error('Authentication Error:', error);
    
    // Specific error handling
    if (error.response) {
      switch (error.response.status) {
        case 401:
          this.logout();
          break;
        case 403:
          // Handle forbidden access
          break;
        default:
          // Generic error handling
          break;
      }
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService;