import apiClient from './apiClient';

export const developerService = {
  getProfile: async (userId) => {
    const response = await apiClient.get(`/developer/profile?userId=${userId}`);
    return response.data;
  },

  linkProfile: async (userId, github, leetcode) => {
    const response = await apiClient.post('/developer/link', { userId, github, leetcode });
    return response.data;
  },

  syncProfile: async (userId) => {
    const response = await apiClient.post(`/developer/sync?userId=${userId}`);
    return response.data;
  }
};
