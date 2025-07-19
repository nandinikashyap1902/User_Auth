import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: 'Registration failed'
      };
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: 'Login failed'
      };
    }
  },

  // Get user profile
  getProfile: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: 'Failed to fetch profile'
      };
    }
  },

  // Update user profile
  updateProfile: async (data: any): Promise<AuthResponse> => {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: 'Failed to update profile'
      };
    }
  },

  // Logout user
  logout: async (): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  },

  // Verify token
  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: 'Token verification failed'
      };
    }
  }
};

export default api;
