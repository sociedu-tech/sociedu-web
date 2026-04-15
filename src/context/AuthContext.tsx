'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { getAuthToken, removeAuthToken } from '@/lib/api';

export interface AuthUser {
  id: string | number;
  email: string;
  roles: string[];
  fullName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  userRole: string; // primary role
  loading: boolean;
  token: string | null;
  login: (credentials: unknown) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = getAuthToken();

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser) as AuthUser);
        setToken(savedToken);
      } catch {
        localStorage.removeItem('user');
        removeAuthToken();
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials: unknown) => {
    const data = await authService.login(credentials);
    const userData: AuthUser = {
      id: data.userId ?? '',
      email: data.email || '',
      roles: data.roles || [],
      fullName: data.fullName || '',
    };

    setUser(userData);
    setToken(getAuthToken());
  };

  const logout = () => {
    void authService.logout();
    setUser(null);
    setToken(null);
  };

  const userRole = user?.roles?.[0]?.toLowerCase() || 'guest';

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user && !!token,
      userRole,
      loading,
      token,
      login,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
