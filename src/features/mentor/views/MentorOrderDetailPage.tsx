'use client';

import { useParams } from 'next/navigation';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useMentorOrderDetailPage } from '@/features/dashboard/hooks/useMentorOrderDetailPage';
import { MentorOrderDetailView } from '@/features/dashboard/views/orders/MentorOrderDetailView';
import { useMentorOrderActions } from '@/features/dashboard/hooks/useMentorOrderActions';

export function MentorOrderDetailPage() {
  const params = useParams();
  const orderId = String(params?.orderId ?? '');
  const { order, detail, loading, error, refresh } = useMentorOrderDetailPage(orderId);
  const { messagingId, openChat } = useMentorOrderActions();

  if (!orderId) {
    return <ErrorMessage message="Không xác định được đơn hàng." />;
  }

  if (loading) {
    return <PageLoadingState label="Đang tải chi tiết đơn hàng…" />;
  }

  if (error && !order) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!order) {
    return <ErrorMessage message="Không tìm thấy đơn hàng." onRetry={refresh} />;
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <MentorOrderDetailView
        order={order}
        detail={detail}
        messaging={messagingId === order.id}
        onMessage={() => void openChat(order)}
      />
    </div>
  );
}
