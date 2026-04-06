import apiClient from './apiClient';

export const mockInterviewService = {
  getMyInterviews: async () => {
    const response = await apiClient.get('/interviews/mock/my-interviews');
    return Array.isArray(response.data) ? response.data : [];
  },

  schedule: async (data) => {
    const response = await apiClient.post('/interviews/mock/schedule', data);
    return response.data;
  },

  // Extension for potential future update status if needed
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/interviews/mock/${id}/status`, null, { params: { status } });
    return response.data;
  },

  updateFeedback: async (id, feedbackData) => {
    const response = await apiClient.put(`/interviews/mock/${id}/feedback`, feedbackData);
    return response.data;
  }
};
