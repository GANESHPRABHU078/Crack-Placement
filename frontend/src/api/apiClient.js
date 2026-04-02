import axios from 'axios';

const fallbackBaseURL = import.meta.env.PROD
  ? 'https://crackplacement-backend.onrender.com/api'
  : 'http://localhost:8080/api';

const baseURL = (import.meta.env.VITE_API_BASE_URL || fallbackBaseURL).replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL,
});

const protectedPrefixes = [
  '/practice-progress',
  '/practice-insights',
  '/profile',
  '/roadmap-progress',
  '/ai',
  '/interviews'
];

const shouldAttachAuth = (url = '') =>
  protectedPrefixes.some((prefix) => url.startsWith(prefix));

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && shouldAttachAuth(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
