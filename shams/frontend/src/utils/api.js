import axios from 'axios';

// Use Render backend URL in production, localhost in development
const API_BASE = import.meta.env.PROD 
  ? 'https://shams-2.onrender.com/api' 
  : '/api';

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