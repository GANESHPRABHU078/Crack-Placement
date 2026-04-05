import apiClient from './apiClient';

export const communicationService = {
  analyzeResponse: async (question, answer) => {
    const response = await apiClient.post('/communication/analyze', { question, answer });
    return response.data;
  }
};
