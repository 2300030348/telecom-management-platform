import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8082/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to headers for authenticated requests
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('aeronet_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error('Failed to parse saved user token', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
