'use client';

import { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useUserOrderDetailPage } from '@/features/dashboard/hooks/useUserOrderDetailPage';
import { UserOrderDetailView } from '@/features/dashboard/views/orders/UserOrderDetailView';
import { orderService } from '@/services/orderService';

export function UserOrderDetailPage() {
  const params = useParams();
  const orderId = String(params?.orderId ?? '');
  const { order, detail, loading, error, refresh } = useUserOrderDetailPage(orderId);
  const [paying, setPaying] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleRepay = useCallback(async () => {
    if (!orderId) return;
    setPaying(true);
    setActionError(null);
    try {
      const result = await orderService.repayOrder(orderId);
      const url = result?.paymentUrl;
      if (url) {
        window.location.href = url;
        return;
      }
      setActionError('Không nhận được link thanh toán. Vui lòng thử lại.');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Không thể thanh toán lại');
    } finally {
      setPaying(false);
    }
  }, [orderId]);

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
      {actionError ? (
        <p className="shrink-0 border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-800 sm:px-8">
          {actionError}
        </p>
      ) : null}
      <UserOrderDetailView
        order={order}
        detail={detail}
        paying={paying}
        onRepay={() => void handleRepay()}
      />
    </div>
  );
}
