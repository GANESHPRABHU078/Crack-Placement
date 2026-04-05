import apiClient from './apiClient';

export const practiceService = {
  getTopics: async () => {
    const response = await apiClient.get('/practice/topics');
    return response.data;
  },

  getProblems: async () => {
    const response = await apiClient.get('/practice/problems');
    return response.data;
  },

  getProgress: async () => {
    const response = await apiClient.get('/practice-progress');
    return response.data;
  },

  getInsights: async () => {
    const response = await apiClient.get('/practice-insights');
    return response.data;
  },

  getCompanyProfiles: async () => {
    const response = await apiClient.get('/company-prep');
    return response.data;
  },

  getCompanyPrep: async (company) => {
    const response = await apiClient.get(`/company-prep/${encodeURIComponent(company)}`);
    return response.data;
  },

  updateProgress: async (problemId, completed) => {
    const response = await apiClient.put(`/practice-progress/${problemId}`, { completed });
    return response.data;
  },

  getRevisions: async () => {
    const response = await apiClient.get('/practice/revisions');
    return response.data;
  },

  completeRevision: async (problemId) => {
    const response = await apiClient.post(`/practice/revisions/${problemId}/complete`);
    return response.data;
  },

  getHeatmapData: async () => {
    const response = await apiClient.get('/submissions/heatmap');
    return response.data;
  },
};
