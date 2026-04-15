import { api, setAuthToken } from '@/lib/api';

const AUTH = '/api/v1/auth';

export const authService = {
  login: async (credentials: unknown) => {
    const res = await api.post(`${AUTH}/login`, credentials);
    const data = res.data as {
      accessToken?: string;
      userId?: string | number;
      email?: string;
      roles?: string[];
      fullName?: string;
    };
    if (data?.accessToken) {
      setAuthToken(data.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: data.userId,
            email: data.email,
            roles: data.roles,
            fullName: data.fullName,
          }),
        );
      }
    }
    return data;
  },
  register: async (userData: unknown) => {
    const res = await api.post(`${AUTH}/register`, userData);
    return res.data;
  },
  refresh: async (refreshToken: string) => {
    const res = await api.post(`${AUTH}/refresh`, { refreshToken });
    const data = res.data as { accessToken?: string };
    if (data?.accessToken) {
      setAuthToken(data.accessToken);
    }
    return res.data;
  },
  logout: async (refreshToken?: string) => {
    if (refreshToken) {
      try {
        await api.post(`${AUTH}/logout`, { refreshToken });
      } catch {
        /* still clear client session */
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};
