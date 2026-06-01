import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

const BASE = '/api/v1/chat';

export type ChatContextType = 'order' | 'booking' | 'session' | 'general';

export type ChatContextRef = {
  contextType?: ChatContextType;
  contextId?: string;
};

export type ChatConversationDto = {
  id: string;
  type: string;
  bookingId?: string | null;
  createdAt?: string;
  peerUserId?: string | null;
  peerDisplayName?: string | null;
  peerAvatarFileId?: string | null;
  lastMessageContent?: string | null;
  lastMessageAt?: string | null;
};

export type ChatMessageDto = {
  id: string;
  senderId: string;
  content: string;
  type: string;
  edited?: boolean;
  createdAt?: string;
  attachmentFileIds?: string[] | null;
  contextType?: string | null;
  contextId?: string | null;
};

export type SendChatMessageBody = {
  content: string;
  type?: string;
  attachmentFileIds?: string[];
  contextType?: ChatContextType;
  contextId?: string;
};

export const chatService = {
  createConversation: async (body: unknown) => {
    const res = await api.post(`${BASE}/conversations`, body);
    return (res.data ?? null) as ChatConversationDto | null;
  },
  findOrCreateDirectConversation: async (peerUserId: string, context?: ChatContextRef) => {
    const res = await api.post(`${BASE}/conversations/direct`, {
      peerUserId,
      contextType: context?.contextType,
      contextId: context?.contextId,
    });
    const data = res.data;
    if (!data || typeof data !== 'object') return null;
    const row = data as Record<string, unknown>;
    const id = row.id ?? row.conversationId;
    if (!id) return null;
    return {
      id: String(id),
      type: String(row.type ?? 'general'),
      bookingId: row.bookingId != null ? String(row.bookingId) : null,
      createdAt: row.createdAt != null ? String(row.createdAt) : undefined,
    } satisfies ChatConversationDto;
  },
  listConversations: async (page = 0, size = 20): Promise<PagePayload<ChatConversationDto>> => {
    const res = await api.get(`${BASE}/conversations${buildPageQuery({ page, size })}`);
    return normalizePagePayload<ChatConversationDto>(res.data, size);
  },
  getConversation: async (conversationId: string) => {
    const res = await api.get(`${BASE}/conversations/${conversationId}`);
    return (res.data ?? null) as ChatConversationDto | null;
  },

  listMessages: async (conversationId: string, page = 0, size = 50): Promise<PagePayload<ChatMessageDto>> => {
    const res = await api.get(
      `/api/v1/conversations/${conversationId}/messages${buildPageQuery({ page, size })}`,
    );
    return normalizePagePayload<ChatMessageDto>(res.data, size);
  },
  sendMessage: async (conversationId: string, body: SendChatMessageBody) => {
    const res = await api.post(`${BASE}/conversations/${conversationId}/messages`, body);
    return (res.data ?? null) as ChatMessageDto | null;
  },
};

