import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
  resetPassword: async (email) => {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },
  verifyMFA: async (code) => {
    const response = await api.post('/auth/verify-mfa', { code });
    return response.data;
  },
};