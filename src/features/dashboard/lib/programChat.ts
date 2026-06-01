import type { BookingProgramItem } from '@/features/dashboard/types/booking';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';
import { buildChatThreadUrl, resolveDirectUserConversation } from '@/features/dashboard/lib/directUserChat';

/** ID người nhận tin nhắn (mentor hoặc học viên tùy góc nhìn). */
export function getProgramChatPeerId(item: BookingProgramItem): string | null {
  if (item.chatPeerId?.trim()) return item.chatPeerId.trim();
  if (item.sessionPerspective === 'buyer') return item.mentorId?.trim() || null;
  return item.buyerId?.trim() || null;
}

const PAID_LIKE_STATUSES = new Set(['paid', 'completed', 'in_progress', 'active']);

export function canOpenProgramChat(
  item: BookingProgramItem,
  order: ServiceOrderDto | null,
): boolean {
  if (!getProgramChatPeerId(item)) return false;
  if (item.sessionPerspective !== 'buyer') return true;
  if (!order?.status) return true;
  return PAID_LIKE_STATUSES.has(String(order.status).toLowerCase());
}

export async function openProgramChat(
  item: BookingProgramItem,
  order: ServiceOrderDto | null,
): Promise<string> {
  const peerId = getProgramChatPeerId(item);
  if (!peerId) {
    throw new Error('Chưa có đủ thông tin để mở hội thoại.');
  }
  if (item.sessionPerspective === 'buyer' && order && !PAID_LIKE_STATUSES.has(String(order.status).toLowerCase())) {
    throw new Error('Chỉ có thể nhắn tin sau khi thanh toán thành công.');
  }
  return resolveDirectUserConversation(peerId, {
    contextType: 'booking',
    contextId: item.bookingId,
  });
}

export { buildChatThreadUrl };
