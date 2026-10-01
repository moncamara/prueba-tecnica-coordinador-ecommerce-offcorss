import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { updateUserApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: { name?: string; lastName?: string; email?: string; userType?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('offcorss_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('offcorss_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!token && !!user;

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('offcorss_token', newToken);
    localStorage.setItem('offcorss_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('offcorss_token');
    localStorage.removeItem('offcorss_user');
  };

  const updateUser = async (updates: { name?: string; lastName?: string; email?: string; userType?: string }) => {
    if (!user) return;
    const updatedUser = await updateUserApi(user.id, updates, token);
    setUser(updatedUser);
    localStorage.setItem('offcorss_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
