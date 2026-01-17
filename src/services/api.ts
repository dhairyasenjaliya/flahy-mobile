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

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
       if (error.response.status === 401) {
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
