import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string | number;
  email: string;
  roles: string[];
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: string; // primary role
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);
    const userData = {
      id: data.userId,
      email: data.email,
      roles: data.roles,
      fullName: data.fullName
    };
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const userRole = user?.roles?.[0]?.toLowerCase() || 'guest';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      userRole, 
      loading, 
      login, 
      logout 
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
