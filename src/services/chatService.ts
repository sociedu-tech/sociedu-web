import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

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
  listConversations: async (page = 0, size = 20): Promise<PagePayload<ChatConversationDto>> => {
    const res = await api.get(`${BASE}/conversations${buildPageQuery({ page, size })}`);
    return normalizePagePayload<ChatConversationDto>(res.data, size);
  },

  listMessages: async (conversationId: string, page = 0, size = 50): Promise<PagePayload<ChatMessageDto>> => {
    const res = await api.get(
      `${BASE}/conversations/${conversationId}/messages${buildPageQuery({ page, size })}`,
    );
    return normalizePagePayload<ChatMessageDto>(res.data, size);
  },
  sendMessage: async (conversationId: string, body: SendChatMessageBody) => {
    const res = await api.post(`${BASE}/conversations/${conversationId}/messages`, body);
    return (res.data ?? null) as ChatMessageDto | null;
  },
};
