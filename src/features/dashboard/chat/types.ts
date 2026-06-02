export type ChatRole = 'me' | 'them';

import type { ChatContextType } from '@/services/chatService';

export type ChatMessageContext = {
  contextType: ChatContextType;
  contextId: string;
};

export type ChatSendStatus = 'sending' | 'sent' | 'failed';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  senderId?: string;
  senderName?: string;
  text: string;
  time: string;
  /** Chỉ áp dụng cho tin của mình — optimistic UI khi gửi. */
  sendStatus?: ChatSendStatus;
  /** Ngữ cảnh gắn kèm tin (order / booking / session). */
  context?: ChatMessageContext;
};

export type Conversation = {
  id: string;
  type?: string;
  name: string;
  roleLabel: string;
  lastMessage: string;
  time: string;
  sortAt?: string;
  peerUserId?: string;
  avatarUrl?: string;
  unread?: number;
  messages: ChatMessage[];
};
