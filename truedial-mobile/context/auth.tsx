import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { useRouter, useSegments } from 'expo-router';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  city?: string;
  role?: string;
  has_listing?: boolean;
  business_category?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, confirmPassword?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Redirect hook to manage access based on Authentication state
export function useProtectedRoute(user: User | null, loading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if user is not authenticated and not in auth screens
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to dashboard/home if authenticated and trying to access auth screens
      router.replace('/(tabs)');
    }
  }, [user, segments, loading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and check token
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await getStorageItem('user_token');
        if (storedToken) {
          setToken(storedToken);
          // Set authorization header explicitly for the check
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await api.get('/auth/me');
          const userData = response.data.data || response.data;
          setUser(userData);
        }
      } catch (error) {
        console.warn('Failed to load user state from storage', error);
        // Clear token if invalid
        await removeStorageItem('user_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // Use protected route hook
  useProtectedRoute(user, loading);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data.data || response.data;
      
      if (!data.token && !data.access_token) {
        throw new Error('No access token received from server');
      }

      const newToken = data.token || data.access_token;
      
      // Fetch user profile securely
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      const meResponse = await api.get('/auth/me');
      const fetchedUser = meResponse.data.data || meResponse.data;

      const userData: User = { 
        ...fetchedUser, 
        city: fetchedUser.city || 'Patna, Bihar' 
      };

      await setStorageItem('user_token', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      api.defaults.headers.common['Authorization'] = ''; // Clear token on fail
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, confirmPassword?: string, role: string = 'customer') => {
    setLoading(true);
    try {
      const payload = {
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword || password,
        role: role || 'customer'
      };

      const response = await api.post('/auth/register', payload);
      const data = response.data.data || response.data;
      
      const newToken = data.token || data.access_token;
      if (!newToken) {
        throw new Error('No access token received from server');
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      let userData: User;
      if (data.user) {
        userData = {
          ...data.user,
          city: data.user.city || 'Mumbai',
          role: data.user.role || role || 'customer'
        };
      } else {
        const meResponse = await api.get('/auth/me');
        const fetchedUser = meResponse.data.data || meResponse.data;
        userData = {
          ...fetchedUser,
          city: fetchedUser.city || 'Mumbai',
          role: fetchedUser.role || role || 'customer'
        };
      }

      await setStorageItem('user_token', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      api.defaults.headers.common['Authorization'] = '';
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout').catch(() => {});
    } finally {
      await removeStorageItem('user_token');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data || response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user details:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
