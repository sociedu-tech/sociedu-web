import type { MentorOrderRow } from '@/features/dashboard/hooks/useMentorOrders';
import { resolveDirectUserConversation } from '@/features/dashboard/lib/directUserChat';

/** Mở chat 1-1 với người đặt đơn — dùng hội thoại general, gắn context order khi gửi tin. */
export async function resolveOrderConversation(order: MentorOrderRow): Promise<string> {
  if (!order.buyerId) {
    throw new Error('Không xác định được học viên của đơn này.');
  }

  const paidLike = ['paid', 'completed'].includes(order.rawStatus.toLowerCase());
  if (!paidLike) {
    throw new Error('Chỉ có thể nhắn tin sau khi học viên thanh toán thành công.');
  }

  return resolveDirectUserConversation(order.buyerId, {
    contextType: 'order',
    contextId: order.id,
  });
}
