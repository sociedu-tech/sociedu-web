import { api, setAuthToken } from '../lib/api';

export const authService = {
  login: async (credentials: any) => {
    const res = await api.post('/api/v1/auth/login', credentials);
    const data = res.data;
    if (data && data.accessToken) {
      setAuthToken(data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        email: data.email,
        roles: data.roles,
        fullName: data.fullName
      }));
    }
    return data;
  },
  register: async (userData: any) => {
    const res = await api.post('/api/v1/auth/register', userData);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
