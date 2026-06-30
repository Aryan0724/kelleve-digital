import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 120000, // 2 minutes to accommodate Render free tier cold starts
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request Interceptor: Attach token from Zustand store for client-side requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return new Promise(() => {}); // Prevent unhandled rejection overlay while redirecting
      }
    }
    return Promise.reject(error);
  }
);

export default api;
