import axios from 'axios';
import { Alert } from 'react-native';
import { API_BASE_URL, API_TIMEOUT } from '../config';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// List of public endpoints that don't need the token and shouldn't trigger global logout on 401
const publicEndpoints = [
    '/api/auth/user/send-otp',
    '/api/auth/user/verify-otp',
    '/api/auth/user/login/check-type'
];

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    
    // Check if the current request URL matches any public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

    console.log(`[API Request] URL: ${config.url}, isPublic: ${isPublicEndpoint}, Token Exists: ${!!token}`);

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] Attached Token: Bearer ${token.substring(0, 10)}...`);
    } else {
      console.log(`[API Request] No Token Attached`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global Error Handling
    if (error.response) {
       const isPublicEndpoint = publicEndpoints.some(endpoint => error.config.url?.includes(endpoint));

       if (error.response.status === 401 && !isPublicEndpoint) {
           useAuthStore.getState().logout();
           Alert.alert("Session Expired", "Please login again.");
       } else {
           // Try to get a meaningful error message from the server response
           const message = error.response.data?.message || 
                           error.response.data?.error || 
                           "An unexpected error occurred.";
           Alert.alert("Error", message);
       }
    } else if (error.request) {
        // Network errors (no response received)
        Alert.alert("Network Error", "Please check your internet connection.");
    } else {
        Alert.alert("Error", error.message || "An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default api;
