'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setRefreshToken, type AuthPayload } from '@/services/authService';
import { userService } from '@/services/userService';
import { getAuthToken, removeAuthToken } from '@/lib/api';

export interface AuthUser {
  id: string | number;
  email: string;
  roles: string[];
  fullName: string;
}

type ProfilePayload = {
  userId?: string | number;
  firstName?: string;
  lastName?: string;
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  userRole: string; // primary role
  loading: boolean;
  token: string | null;
  login: (credentials: unknown) => Promise<void>;
  applyAuthPayload: (payload: AuthPayload | undefined) => Promise<void>;
  reloadSession: () => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_META_KEY = 'authMeta';

type AuthMeta = {
  userId?: string | number;
  email?: string;
  roles?: string[];
};

const saveAuthMeta = (payload: AuthPayload) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    AUTH_META_KEY,
    JSON.stringify({
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles ?? [],
    } satisfies AuthMeta),
  );
};

const getAuthMeta = (): AuthMeta => {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(AUTH_META_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as AuthMeta;
  } catch {
    return {};
  }
};

const clearAuthStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_META_KEY);
    localStorage.removeItem('user');
  }
  removeAuthToken();
  setRefreshToken(null);
};

const normalizeFullName = (profile?: ProfilePayload): string => {
  const firstName = profile?.firstName?.trim() ?? '';
  const lastName = profile?.lastName?.trim() ?? '';
  return [lastName, firstName].filter(Boolean).join(' ').trim();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const hydrateCurrentUser = async () => {
    const savedToken = getAuthToken();
    if (!savedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    const profile = (await userService.getMe()) as ProfilePayload;
    const meta = getAuthMeta();
    const resolvedId = profile.userId ?? meta.userId ?? '';
    setUser({
      id: resolvedId,
      email: meta.email ?? '',
      roles: meta.roles ?? [],
      fullName: normalizeFullName(profile),
    });
    setToken(savedToken);
  };

  const reloadSession = async () => {
    setLoading(true);
    try {
      await hydrateCurrentUser();
    } catch {
      clearAuthStorage();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reloadSession();
  }, []);

  const login = async (credentials: unknown) => {
    const data = await authService.login(credentials);
    await applyAuthPayload(data);
  };

  const applyAuthPayload = async (payload: AuthPayload | undefined) => {
    if (!payload) {
      return;
    }
    saveAuthMeta(payload);
    await reloadSession();
  };

  const logout = () => {
    void authService.logout();
    setUser(null);
    setToken(null);
    clearAuthStorage();
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
      applyAuthPayload,
      reloadSession,
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
