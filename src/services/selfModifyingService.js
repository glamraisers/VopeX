import api from './api';

export const selfModifyingService = {
  modifyCode: async (modifications) => {
    const response = await api.post('/self-modify', modifications);
    return response.data;
  },
};
