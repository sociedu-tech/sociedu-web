import { api } from '@/lib/api';

const BASE = '/api/v1/chat';

export const chatService = {
  createConversation: async (body: unknown) => {
    const res = await api.post(`${BASE}/conversations`, body);
    return res.data;
  },
  listConversations: async () => {
    const res = await api.get(`${BASE}/conversations`);
    return res.data;
  },
  listMessages: async (conversationId: number | string) => {
    const res = await api.get(`${BASE}/conversations/${conversationId}/messages`);
    return res.data;
  },
  sendMessage: async (conversationId: number | string, body: unknown) => {
    const res = await api.post(`${BASE}/conversations/${conversationId}/messages`, body);
    return res.data;
  },
};
