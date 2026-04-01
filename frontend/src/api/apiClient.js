import axios from 'axios';

const fallbackBaseURL = import.meta.env.PROD
  ? 'https://crack-placement.onrender.com/api'
  : 'http://localhost:8080/api';

const baseURL = (import.meta.env.VITE_API_BASE_URL || fallbackBaseURL).replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
