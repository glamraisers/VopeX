import api from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  getPushNotifications: async () => {
    const response = await api.get('/notifications/push');
    return response.data;
  },
};
