import { api } from '@/lib/api';

const BASE = '/api/v1/chat';

export type ChatConversationDto = {
  id: string;
  type: string;
  bookingId?: string | null;
  createdAt?: string;
};

export type ChatMessageDto = {
  id: string;
  senderId: string;
  content: string;
  type: string;
  edited?: boolean;
  createdAt?: string;
  attachmentFileIds?: string[] | null;
};

export type SendChatMessageBody = {
  content: string;
  type?: string;
  attachmentFileIds?: string[];
};

export const chatService = {
  createConversation: async (body: unknown) => {
    const res = await api.post(`${BASE}/conversations`, body);
    return (res.data ?? null) as ChatConversationDto | null;
  },
  listConversations: async () => {
    const res = await api.get(`${BASE}/conversations`);
    return (res.data ?? []) as ChatConversationDto[];
  },
  listMessages: async (conversationId: string) => {
    const res = await api.get(`${BASE}/conversations/${conversationId}/messages`);
    return (res.data ?? []) as ChatMessageDto[];
  },
  sendMessage: async (conversationId: string, body: SendChatMessageBody) => {
    const res = await api.post(`${BASE}/conversations/${conversationId}/messages`, body);
    return (res.data ?? null) as ChatMessageDto | null;
  },
};
