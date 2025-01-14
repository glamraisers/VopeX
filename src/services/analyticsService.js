import api from './api';

export const analyticsService = {
  getRealTimeAnalytics: async () => {
    const response = await api.get('/analytics/real-time');
    return response.data;
  },
};
