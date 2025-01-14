import axios from 'axios';
import { config } from '../config';

const API_URL = config.nhost.backendUrl;

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },
  register: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  },
  resetPassword: async (email) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
    return response.data;
  },
  verifyMFA: async (code) => {
    const response = await axios.post(`${API_URL}/auth/verify-mfa`, { code });
    return response.data;
  },
};
