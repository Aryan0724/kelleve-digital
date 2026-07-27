import axios from 'axios';
import { getStorageItem } from '../utils/storage';
import { API_BASE_URL, APP_PLATFORM_HEADER } from '../constants/config';

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'X-Platform': APP_PLATFORM_HEADER,
    'X-Tenant-ID': '2',
  },
  timeout: 60000, // 60 seconds timeout (to accommodate Render cold boot)
});

// Request Interceptor to Inject Auth Token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStorageItem('user_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading auth token from SecureStore:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return standard error response structure
    const errorData = error.response?.data || {
      success: false,
      message: error.message || 'An unexpected error occurred',
      errors: [],
    };
    return Promise.reject(errorData);
  }
);

export default api;
