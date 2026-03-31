import apiClient from './apiClient';

export const jobService = {
  getAll: async (type) => {
    const params = {};
    if (type) params.type = type;
    const response = await apiClient.get('/jobs', { params });
    return response.data;
  },
  getNew: async () => {
    const response = await apiClient.get('/jobs/new');
    return response.data;
  }
};
