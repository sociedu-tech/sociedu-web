import { api, setAuthToken, removeAuthToken } from '@/lib/api';

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

export type MePayload = {
  userId: string;
  email: string;
  emailVerified: boolean;
  status: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  headline?: string | null;
  avatarUrl?: string | null;
  roles: string[];
  capabilities: string[];
  createdAt?: string | null;
};

export type SessionPayload = {
  id: string;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string | null;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  current?: boolean;
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

  forgotPassword: async (email: string) => {
    const res = await api.post(`${AUTH}/forgot-password`, { email });
    return res.message;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const res = await api.post(`${AUTH}/reset-password`, { token, newPassword });
    return res.message;
  },

  /** Refresh với rotation: mỗi lần gọi nhận refreshToken MỚI → phải persist thay token cũ. */
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
    removeAuthToken();
    setRefreshToken(null);
  },

  /** Nguồn sự thật cho phiên hiện tại: user + roles + capabilities. */
  getMe: async (): Promise<MePayload | null> => {
    const res = await api.get(`${AUTH}/me`);
    return (res.data as MePayload | undefined) ?? null;
  },

  /** Đổi mật khẩu. BE nhận X-Refresh-Token để giữ phiên hiện tại, revoke các phiên khác. */
  changePassword: async (currentPassword: string, newPassword: string) => {
    const refresh = getRefreshToken();
    const res = await api.postWithHeaders(
      `${AUTH}/change-password`,
      { currentPassword, newPassword },
      refresh ? { 'X-Refresh-Token': refresh } : undefined,
    );
    return res.message;
  },

  listSessions: async (): Promise<SessionPayload[]> => {
    const refresh = getRefreshToken();
    const res = await api.getWithHeaders(
      `${AUTH}/sessions`,
      refresh ? { 'X-Refresh-Token': refresh } : undefined,
    );
    return (res.data as SessionPayload[] | undefined) ?? [];
  },

  revokeSession: async (sessionId: string) => {
    const res = await api.delete(`${AUTH}/sessions/${sessionId}`);
    return res.message;
  },

  revokeAllSessions: async () => {
    const res = await api.post(`${AUTH}/sessions/revoke-all`, {});
    return res.message;
  },
};
