import api from './api';

export const agentService = {
  getAgentData: async () => {
    const response = await api.get('/agents/data');
    return response.data;
  },
  saveSettings: async (settings) => {
    const response = await api.post('/agents/settings', settings);
    return response.data;
  },
  getAgentPerformance: async (agentId) => {
    const response = await api.get(`/agents/${agentId}/performance`);
    return response.data;
  },
  sendMessage: async (agentId, message) => {
    const response = await api.post(`/agents/${agentId}/chat`, { message });
    return response.data;
  },
};
