export type ChatRole = 'me' | 'them';

export type ChatAttachment = {
  id: string;
  kind: 'image' | 'file';
  name: string;
  /** Ảnh: URL hiển thị; file: có thể dùng icon */
  url?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
  attachments?: ChatAttachment[];
};

export type Conversation = {
  id: string;
  name: string;
  roleLabel: string;
  lastMessage: string;
  time: string;
  unread?: number;
  messages: ChatMessage[];
};
