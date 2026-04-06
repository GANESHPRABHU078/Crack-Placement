import apiClient from './apiClient';

export const aiService = {
  chat: async (messages) => {
    const response = await apiClient.post('/ai/chat', { messages });
    return response.data;
  },

  analyzeInterview: async (question, answer) => {
    const response = await apiClient.post('/ai/analyze-interview', { question, answer });
    return response.data;
  }
};
