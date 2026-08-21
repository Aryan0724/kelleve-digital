import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';
import { toast } from 'react-toastify';

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

// Response Interceptor: Handle 401s, 500s, and automatic retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Automatic Retry Logic for Network Errors or 5xx server errors (only for GET requests)
    if (!config || !config.retryCount) {
      if (config) config.retryCount = 0;
    }
    
    const shouldRetry = config && config.method?.toLowerCase() === 'get' && config.retryCount < 2 && (!error.response || error.response.status >= 500);
    
    if (shouldRetry) {
      config.retryCount += 1;
      const delay = Math.min(1000 * (2 ** config.retryCount), 5000); // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }
    // Handle 500+ Internal Server Errors and Network Errors gracefully
    if (!error.response) {
      if (typeof window !== 'undefined') {
        toast.error('Unable to connect to the server. Please check your internet connection.', { toastId: 'network-error' });
      }
    } else if (error.response.status >= 500) {
      if (typeof window !== 'undefined') {
        toast.error('Our servers are experiencing high traffic. Please try again in a moment.', { toastId: 'server-error' });
      }
    }

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
    } else if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        toast.error('You do not have permission to perform this action.', { toastId: 'forbidden-error' });
      }
    } else if (error.response?.status === 404) {
      if (typeof window !== 'undefined') {
        toast.error('The requested resource could not be found.', { toastId: 'not-found-error' });
      }
    } else if (error.response?.status === 409) {
      if (typeof window !== 'undefined') {
        toast.error(error.response?.data?.message || 'There is a conflict with the current state of the resource.', { toastId: 'conflict-error' });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
