import axios from 'axios';

// Use environment variable for API URL, with fallback to Render URL, then localhost
const API_BASE = import.meta.env.VITE_API_URL || 
                 (import.meta.env.PROD ? 'https://shams-2.onrender.com/api' : '/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server might be down');
      return Promise.reject(new Error('Connection timeout - please try again later'));
    }
    
    if (!error.response) {
      console.error('Network error - server might be unreachable');
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    return Promise.reject(error);
  }
);

export default api;