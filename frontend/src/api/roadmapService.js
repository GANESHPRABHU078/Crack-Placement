import apiClient from './apiClient';

export const roadmapService = {
  async getRoadmaps() {
    const response = await apiClient.get('/roadmaps');
    return response.data;
  },

  async getProgress() {
    const response = await apiClient.get('/roadmap-progress');
    return response.data;
  },

  async updateProgress(payload) {
    const response = await apiClient.put('/roadmap-progress', payload);
    return response.data;
  }
};
