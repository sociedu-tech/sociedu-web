export interface ChatSocketMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: string;
  attachmentFileIds?: string[] | null;
  edited?: boolean;
  createdAt?: string;
  contextType?: string;
  contextId?: string;
  [key: string]: unknown;
}

export function parseConversationEvent(body: string, fallbackConversationId: string): ChatSocketMessage | null {
  try {
    const raw = JSON.parse(body) as Record<string, unknown>;
    const payload =
      raw.payload && typeof raw.payload === 'object' && !Array.isArray(raw.payload)
        ? (raw.payload as Record<string, unknown>)
        : raw;

    const id = payload.id ?? raw.id;
    const senderId = payload.senderId ?? raw.senderId;
    if (id == null || senderId == null) {
      return null;
    }

    const attachmentFileIds = payload.attachmentFileIds ?? raw.attachmentFileIds;

    return {
      id: String(id),
      conversationId: String(payload.conversationId ?? raw.conversationId ?? fallbackConversationId),
      senderId: String(senderId),
      content: String(payload.content ?? raw.content ?? ''),
      type: payload.type != null ? String(payload.type) : raw.type != null ? String(raw.type) : undefined,
      edited:
        typeof payload.edited === 'boolean'
          ? payload.edited
          : typeof raw.edited === 'boolean'
            ? raw.edited
            : undefined,
      createdAt:
        payload.createdAt != null
          ? String(payload.createdAt)
          : raw.createdAt != null
            ? String(raw.createdAt)
            : undefined,
      attachmentFileIds: Array.isArray(attachmentFileIds)
        ? attachmentFileIds.map((fileId) => String(fileId))
        : null,
      contextType:
        payload.contextType != null
          ? String(payload.contextType)
          : raw.contextType != null
            ? String(raw.contextType)
            : undefined,
      contextId:
        payload.contextId != null
          ? String(payload.contextId)
          : raw.contextId != null
            ? String(raw.contextId)
            : undefined,
    };
  } catch {
    return null;
  }
}

export type NotificationEnvelope = {
  eventType?: string;
  serverTimestamp?: string;
  payload?: Record<string, unknown>;
};

export function parseNotificationEvent(body: string): Record<string, unknown> | null {
  try {
    const envelope = JSON.parse(body) as NotificationEnvelope;
    if (envelope.eventType !== 'NEW_NOTIFICATION' || !envelope.payload) {
      return null;
    }
    return envelope.payload;
  } catch {
    return null;
  }
}
