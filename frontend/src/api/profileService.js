import apiClient from './apiClient';

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  dailyCheckIn: async () => {
    const response = await apiClient.post('/profile/check-in');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/profile', userData);
    return response.data;
  }
};
