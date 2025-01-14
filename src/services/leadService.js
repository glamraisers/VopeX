import api from './api';

export const leadService = {
  getLeads: async () => {
    const response = await api.get('/leads');
    return response.data;
  },
  getLead: async (leadId) => {
    const response = await api.get(`/leads/${leadId}`);
    return response.data;
  },
  enrichLead: async (leadId, additionalInfo) => {
    const response = await api.post(`/leads/${leadId}/enrich`, { additionalInfo });
    return response.data;
  },
  getLeadScore: async (leadId) => {
    const response = await api.get(`/leads/${leadId}/score`);
    return response.data;
  },
  getLeadPrediction: async (leadId) => {
    const response = await api.get(`/leads/${leadId}/prediction`);
    return response.data;
  },
};
