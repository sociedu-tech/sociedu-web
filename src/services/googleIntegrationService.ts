import { api } from '@/lib/api';

const BASE = '/api/v1/integrations/google/oauth';

export const googleIntegrationService = {
  getStatus: async (): Promise<boolean> => {
    const res = await api.get(`${BASE}/status`);
    const payload = res.data as { connected?: boolean } | undefined;
    return Boolean(payload?.connected);
  },

  getAuthorizationUrl: async (returnUrl?: string): Promise<string> => {
    const query =
      returnUrl && returnUrl.trim()
        ? `?returnUrl=${encodeURIComponent(returnUrl.trim())}`
        : '';
    const res = await api.get(`${BASE}/authorize${query}`);
    const payload = res.data as { authorizationUrl?: string } | undefined;
    const url = payload?.authorizationUrl;
    if (typeof url !== 'string' || !url) {
      throw new Error('Không lấy được link kết nối Google.');
    }
    return url;
  },
};
