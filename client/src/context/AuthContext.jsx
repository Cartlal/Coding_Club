import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    userId: null,
    userData: null,
    loading: true,
  });

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (token && role) {
      setAuth({
        isAuthenticated: true,
        role,
        userId,
        userData: null,
        loading: false,
      });
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = (token, role, userId, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    setAuth({
      isAuthenticated: true,
      role,
      userId,
      userData,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setAuth({
      isAuthenticated: false,
      role: null,
      userId: null,
      userData: null,
      loading: false,
    });
  };

  const setUserData = (userData) => {
    setAuth((prev) => ({ ...prev, userData }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
