import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/v1`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 120000, // 2 minutes to accommodate cold starts
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request Interceptor: Attach token & dynamically enforce client origin for browser requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Direct browser requests to the current domain origin so API calls never fail with localhost/cors errors
    if (!config.baseURL || config.baseURL.includes('localhost')) {
      config.baseURL = `${window.location.origin}/api/v1`;
    }
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Prevent multiple simultaneous 401s from all triggering logout (race condition guard)
let isLoggingOut = false;

// Response Interceptor: Handle 401s — only logout if user actually has a token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const { token, logout } = useAuthStore.getState();
        // Only force-logout if the user is actually logged in and not already logging out
        if (token && !isLoggingOut) {
          isLoggingOut = true;
          logout();
          // Small delay so any in-flight state updates settle before redirect
          setTimeout(() => {
            window.location.href = '/login';
            isLoggingOut = false;
          }, 300);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
