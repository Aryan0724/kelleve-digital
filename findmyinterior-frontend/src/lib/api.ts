import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';

const api = axios.create({
  baseURL: 'https://findmyinterior.com/api/v1',
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
