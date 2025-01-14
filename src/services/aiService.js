import api from './api';

export const aiService = {
  queryBot: async (query) => {
    const response = await api.post('/ai/bot', { query });
    return response.data;
  },
  getPredictions: async () => {
    const response = await api.get('/ai/predictions');
    return response.data;
  },
  generateContent: async (prompt) => {
    const response = await api.post('/ai/generate-content', { prompt });
    return response.data;
  },
  startLearning: async () => {
    const response = await api.post('/ai/start-learning');
    return response.data;
  },
};
