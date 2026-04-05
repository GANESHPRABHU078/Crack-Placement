import api from './apiClient';

export const jobService = {
  getAll: async (type = null) => {
    const params = type ? { type } : {};
    const response = await api.get('/jobs', { params });
    return response.data;
  },
  
  getNewJobs: async () => {
    const response = await api.get('/jobs/new');
    return response.data;
  },
  
  getRecommendations: async () => {
    const response = await api.get('/jobs/recommendations');
    return response.data;
  },
  
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  }
};

// Keep individual exports if needed elsewhere
export const getJobs = jobService.getAll;
export const getNewJobs = jobService.getNewJobs;
export const getRecommendations = jobService.getRecommendations;
export const createJob = jobService.createJob;
