import api from './api';

export const projectService = {
  getProjects: async (domain = null, difficulty = null) => {
    const params = {};
    if (domain && domain !== 'All') params.domain = domain;
    if (difficulty && difficulty !== 'All') params.difficulty = difficulty;
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  getRecommendedProjects: async () => {
    const response = await api.get('/projects/recommended');
    return response.data;
  },

  getUserProjectStatus: async () => {
    const response = await api.get('/projects/status');
    return response.data;
  },

  updateProjectStatus: async (projectId, status) => {
    const response = await api.post(`/projects/${projectId}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};
