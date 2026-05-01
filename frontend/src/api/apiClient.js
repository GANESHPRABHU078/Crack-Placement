import axios from 'axios';

const deprecatedProductionHosts = [
  'https://crackplacement-backend.onrender.com/api',
];

const fallbackBaseURL = 'https://crack-placement.onrender.com/api';

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

const shouldAttachAuth = (url = '') => true; // Attach to all API requests if token exists

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

// Response interceptor to handle 401 Unauthorized (stale sessions)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, the token is likely invalid or the user was deleted/re-seeded
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login only if we're not already there (to avoid loops)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
