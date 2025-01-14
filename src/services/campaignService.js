import api from './api';

export const campaignService = {
  createCampaign: async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },
  getCampaigns: async () => {
    const response = await api.get('/campaigns');
    return response.data;
  },
  getCampaignReport: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/report`);
    return response.data;
  },
  getCampaignAnalytics: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/analytics`);
    return response.data;
  },
  saveAutomationRules: async (campaignId, rules) => {
    const response = await api.post(`/campaigns/${campaignId}/automation`, { rules });
    return response.data;
  },
};
