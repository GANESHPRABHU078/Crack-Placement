import axios from 'axios';

const deprecatedProductionHosts = [
  'https://crackplacement-backend.onrender.com/api',
];

const fallbackBaseURL = import.meta.env.PROD
  ? 'https://crack-placement.onrender.com/api'
  : 'http://localhost:8080/api';

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

const baseURL = deprecatedProductionHosts.includes(configuredBaseURL)
  ? fallbackBaseURL
  : (configuredBaseURL || fallbackBaseURL);

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
