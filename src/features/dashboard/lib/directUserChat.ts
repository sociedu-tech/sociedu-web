import { chatService, type ChatContextRef } from '@/services/chatService';

/** Tìm hoặc tạo hội thoại 1-1 (general) giữa user hiện tại và {@code peerUserId}. */
export async function resolveDirectUserConversation(
  peerUserId: string,
  context?: ChatContextRef,
): Promise<string> {
  const peer = peerUserId.trim();
  if (!peer) {
    throw new Error('Không xác định được người nhận.');
  }

  const conversation = await chatService.findOrCreateDirectConversation(peer, context);
  if (!conversation?.id) {
    throw new Error('Không mở được hội thoại. Vui lòng thử lại.');
  }

  return conversation.id;
}

export function buildChatThreadUrl(
  conversationId: string,
  peerDisplayName?: string,
  context?: ChatContextRef,
): string {
  const params = new URLSearchParams({ conversation: conversationId });
  const label = peerDisplayName?.trim();
  if (label) {
    params.set('peerName', label);
  }
  if (context?.contextType) {
    params.set('contextType', context.contextType);
  }
  if (context?.contextId) {
    params.set('contextId', context.contextId);
  }
  return `/dashboard/chat?${params.toString()}`;
}

export type { ChatContextRef };
