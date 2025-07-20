import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in API service
      api.setAuthToken(token);
      // Fetch current user details
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      console.log('Fetching current user...');
      const userData = await api.getCurrentUser();
      console.log('Current user data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching current user:', error);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      api.setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      console.log('Logging in with:', userData);
      const response = await api.login(userData);
      console.log('Login response:', response);
      
      if (response.token) {
        // Store token
        localStorage.setItem('token', response.token);
        api.setAuthToken(response.token);
        
        // Set user data
        console.log('Setting user data:', response.user);
        setUser(response.user);
        
        return response;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    api.setAuthToken(null);
    window.location.href = '/login-screen';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    fetchCurrentUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 