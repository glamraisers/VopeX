// API configuration file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com'; // Default to example URL

const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 5000, // Set a timeout for API requests (in milliseconds)
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;