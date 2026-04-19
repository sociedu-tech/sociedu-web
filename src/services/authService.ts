import { api, setAuthToken } from '@/lib/api';

const AUTH = '/api/v1/auth';

export type AuthPayload = {
  accessToken?: string;
  refreshToken?: string;
  userId?: string | number;
  email?: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
};

const REFRESH_TOKEN_KEY = 'refreshToken';

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (refreshToken: string | null) => {
  if (typeof window === 'undefined') return;
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    return;
  }
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const persistAuthTokens = (data?: AuthPayload) => {
  if (!data) return;
  if (data.accessToken) {
    setAuthToken(data.accessToken);
  }
  if (data.refreshToken) {
    setRefreshToken(data.refreshToken);
  }
};

/** Một request verify-email cho mỗi token (tránh Strict Mode / effect lặp gọi API hai lần). */
const verifyEmailInflight = new Map<string, Promise<AuthPayload | undefined>>();

export const authService = {
  login: async (credentials: unknown) => {
    const res = await api.post(`${AUTH}/login`, credentials);
    const data = res.data as AuthPayload;
    persistAuthTokens(data);
    return data;
  },
  register: async (userData: unknown) => {
    const res = await api.post(`${AUTH}/register`, userData);
    return res.data as AuthPayload;
  },
  verifyEmail: async (token: string) => {
    const key = token.trim();
    const existing = verifyEmailInflight.get(key);
    if (existing) return existing;

    const p = (async () => {
      const res = await api.post(`${AUTH}/verify-email`, { token: key });
      const data = res.data as AuthPayload | undefined;
      persistAuthTokens(data);
      return data;
    })();

    verifyEmailInflight.set(key, p);
    try {
      return await p;
    } finally {
      verifyEmailInflight.delete(key);
    }
  },
  resendVerification: async (email: string) => {
    const res = await api.post(`${AUTH}/resend-verification`, { email });
    return res.message;
  },
  refresh: async (refreshToken: string) => {
    const res = await api.post(`${AUTH}/refresh`, { refreshToken });
    const data = res.data as AuthPayload;
    persistAuthTokens(data);
    return data;
  },
  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.post(`${AUTH}/logout`, { refreshToken });
      } catch {
        /* still clear client session */
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};
