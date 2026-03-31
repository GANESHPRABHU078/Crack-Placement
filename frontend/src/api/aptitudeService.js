import apiClient from './apiClient';

export const aptitudeService = {
  getQuiz: async (category) => {
    const params = {};
    if (category) params.category = category;
    const response = await apiClient.get('/aptitude', { params });
    return response.data;
  }
};
