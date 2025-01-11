import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class BaseApiService {
  private axiosInstance: AxiosInstance;

  constructor(config: ApiConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add authentication token if exists
        const token = this.getAuthToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      this.handleErrorResponse
    );
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private handleErrorResponse = (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      switch (error.response.status) {
        case 400:
          this.handleBadRequest(error.response);
          break;
        case 401:
          this.handleUnauthorized();
          break;
        case 403:
          this.handleForbidden();
          break;
        case 404:
          this.handleNotFound();
          break;
        case 500:
          this.handleServerError();
          break;
        default:
          this.handleGenericError(error.response);
      }
    } else if (error.request) {
      // The request was made but no response was received
      this.handleNetworkError();
    } else {
      // Something happened in setting up the request
      console.error('Error', error.message);
    }

    return Promise.reject(error);
  }

  private handleBadRequest(response: AxiosResponse) {
    console.error('Bad Request:', response.data);
    // Implement specific bad request handling
  }

  private handleUnauthorized() {
    // Clear authentication token
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  }

  private handleForbidden() {
    console.error('Forbidden: Insufficient permissions');
    // Implement forbidden error handling
  }

  private handleNotFound() {
    console.error('Not Found: The requested resource does not exist');
    // Implement not found error handling
  }

  private handleServerError() {
    console.error('Server Error: Internal server problem');
    // Implement server error handling
  }

  private handleNetworkError() {
    console.error('Network Error: Unable to connect to the server');
    // Implement network error handling
  }

  private handleGenericError(response: AxiosResponse) {
    console.error('Unexpected Error:', response.data);
    // Implement generic error handling
  }

  // Generic GET request method
  async get<T>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic POST request method
  async post<T, R>(
    url: string, 
    data: T, 
    config?: AxiosRequestConfig
  ): Promise<R> {
    try {
      const response = await this.axiosInstance.post<R>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic PUT request method
  async put<T, R>(
    url: string, 
    data: T, 
    config?: AxiosRequestConfig
  ): Promise<R> {
    try {
      const response = await this.axiosInstance.put<R>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic DELETE request method
  async delete<R>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<R> {
    try {
      const response = await this.axiosInstance.delete<R>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Method to create an instance with custom configuration
  createInstance(config: ApiConfig): BaseApiService {
    return new BaseApiService(config);
  }
}

// Export a singleton instance
export const apiService = new BaseApiService({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
});

export default BaseApiService;