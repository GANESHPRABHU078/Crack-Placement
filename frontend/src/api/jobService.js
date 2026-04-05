import api from './api';

export const getJobs = async (type = null) => {
  const params = type ? { type } : {};
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const getNewJobs = async () => {
  const response = await api.get('/jobs/new');
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/jobs/recommendations');
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};
