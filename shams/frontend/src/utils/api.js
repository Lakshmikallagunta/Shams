import axios from 'axios';

// Use environment variable for API URL, with fallback to Render URL, then localhost
const API_BASE = import.meta.env.VITE_API_URL || 
                 (import.meta.env.PROD ? 'https://shams-2.onrender.com/api' : '/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;