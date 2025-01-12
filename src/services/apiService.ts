import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your API base URL

// Set up axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle GET requests
export const get = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after handling it
  }
};

// Function to handle POST requests
export const post = async <T, U>(url: string, data: T): Promise<U> => {
  try {
    const response: AxiosResponse<U> = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after handling it
  }
};

// Function to handle errors
const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // Handle Axios error
    console.error('API Error:', error.response?.data || error.message);
  } else {
    // Handle other types of errors
    console.error('Unexpected Error:', error);
  }
};

export default {
  get,
  post,
};