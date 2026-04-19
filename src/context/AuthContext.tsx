'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService, setRefreshToken, type AuthPayload } from '@/services/authService';
import { userService } from '@/services/userService';
import { getAuthToken, removeAuthToken } from '@/lib/api';
import type { User } from '@/types';
import { ROLES, normalizeRole } from '@/constants/roles';

export interface AuthUser {
  id: string | number;
  email: string;
  roles: string[];
  fullName: string;
  /** Optional; set when profile API returns an avatar URL */
  avatarUrl?: string;
}

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const hydrateCurrentUser = useCallback(async () => {
    const savedToken = getAuthToken();
    if (!savedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    const me = (await userService.getMe()) as User | null;
    const meta = getAuthMeta();
    const resolvedId = me?.id ?? meta.userId ?? '';
    setUser({
      id: resolvedId,
      email: meta.email ?? '',
      roles: meta.roles ?? [],
      fullName: me?.name?.trim() ?? '',
      avatarUrl: me?.avatar,
    });
    setToken(savedToken);
  }, []);

  const reloadSession = useCallback(async () => {
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
  }, [hydrateCurrentUser]);

  useEffect(() => {
    void reloadSession();
  }, [reloadSession]);

  const applyAuthPayload = useCallback(
    async (payload: AuthPayload | undefined) => {
      if (!payload) {
        return;
      }
      saveAuthMeta(payload);
      await reloadSession();
    },
    [reloadSession],
  );

  const login = useCallback(
    async (credentials: unknown) => {
      const data = await authService.login(credentials);
      await applyAuthPayload(data);
    },
    [applyAuthPayload],
  );

  const logout = useCallback(() => {
    void authService.logout();
    setUser(null);
    setToken(null);
    clearAuthStorage();
  }, []);

  const userRole = user?.roles?.[0] ? normalizeRole(user.roles[0]) : ROLES.GUEST;

  const value = useMemo(
    () => ({
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
    }),
    [user, userRole, loading, token, login, applyAuthPayload, reloadSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
