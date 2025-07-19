import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import _ from 'lodash';
import { User, LoginCredentials, RegisterData, AuthResponse, AuthContextType } from '../types/auth';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Verify token is still valid
          const response = await authAPI.verifyToken();
          if (!response.success) {
            // Token is invalid, clear auth state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);

      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setToken(userToken);
        setUser(userData);
        
        message.success('Login successful!');
      } else {
        message.error(response.message || 'Login failed');
      }

      return response;
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      message.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);

      if (response.success) {
        // Don't automatically log in after registration
        // User will be redirected to login page to sign in manually
        message.success('Registration successful!');
      } else {
        message.error(response.message || 'Registration failed');
      }

      return response;
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      message.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear auth state regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      message.success('Logged out successfully');
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<AuthResponse> => {
    try {
      setLoading(true);
      
      // Use lodash to filter out empty values
      const filteredData = _.omitBy(data, (value) => 
        value === '' || value === null || value === undefined
      );

      const response = await authAPI.updateProfile(filteredData);

      if (response.success && response.data) {
        const updatedUser = response.data.user;
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update state
        setUser(updatedUser);
        
        message.success('Profile updated successfully!');
      } else {
        message.error(response.message || 'Failed to update profile');
      }

      return response;
    } catch (error) {
      const errorMessage = 'Failed to update profile. Please try again.';
      message.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
