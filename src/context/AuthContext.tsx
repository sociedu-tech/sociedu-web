'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  authService,
  setRefreshToken,
  type AuthPayload,
  type MePayload,
} from '@/services/authService';
import { getAuthToken, removeAuthToken } from '@/lib/api';
import { ROLES, normalizeRole } from '@/constants/roles';

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  headline?: string;
  avatarUrl?: string;
  roles: string[];
  capabilities: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  userRole: string;
  capabilities: string[];
  hasCapability: (cap: string) => boolean;
  loading: boolean;
  token: string | null;
  login: (credentials: unknown) => Promise<void>;
  applyAuthPayload: (payload: AuthPayload | undefined) => Promise<void>;
  reloadSession: () => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearAuthStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authMeta');
    localStorage.removeItem('user');
  }
  removeAuthToken();
  setRefreshToken(null);
};

const buildDisplayName = (me: MePayload): string => {
  if (me.fullName && me.fullName.trim()) return me.fullName.trim();
  const first = (me.firstName ?? '').trim();
  const last = (me.lastName ?? '').trim();
  const joined = [last, first].filter(Boolean).join(' ').trim();
  return joined || me.email || 'Người dùng';
};

const toAuthUser = (me: MePayload): AuthUser => ({
  id: String(me.userId),
  email: me.email,
  emailVerified: !!me.emailVerified,
  status: me.status,
  firstName: me.firstName ?? undefined,
  lastName: me.lastName ?? undefined,
  fullName: buildDisplayName(me),
  headline: me.headline ?? undefined,
  avatarUrl: me.avatarUrl ?? undefined,
  roles: Array.isArray(me.roles) ? me.roles : [],
  capabilities: Array.isArray(me.capabilities) ? me.capabilities : [],
});

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

    const me = await authService.getMe();
    if (!me) {
      setUser(null);
      setToken(null);
      return;
    }

    setUser(toAuthUser(me));
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
      if (!payload) return;
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
  const capabilities = user?.capabilities ?? [];
  const hasCapability = useCallback(
    (cap: string) => capabilities.includes(cap),
    [capabilities],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && !!token,
      userRole,
      capabilities,
      hasCapability,
      loading,
      token,
      login,
      applyAuthPayload,
      reloadSession,
      logout,
      setUser,
    }),
    [user, userRole, capabilities, hasCapability, loading, token, login, applyAuthPayload, reloadSession, logout],
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
