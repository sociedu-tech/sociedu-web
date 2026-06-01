'use client';

import { useCallback, useEffect, useState } from 'react';
import { orderService } from '@/services/orderService';
import { formatViDateTime } from '@/lib/apiUtils';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';
import type { MentorOrderRow } from '@/features/dashboard/hooks/useMentorOrders';
import { orderStatusLabel } from '@/features/dashboard/lib/orderLabels';

function mapOrderDetail(raw: ServiceOrderDto): MentorOrderRow {
  const buyerLabel =
    raw.buyerLabel ||
    (raw.buyerId ? `Học viên #${String(raw.buyerId).slice(0, 8)}` : '—');
  const packageName =
    raw.packageName ||
    (raw.serviceId ? `Gói #${String(raw.serviceId).slice(0, 8)}` : 'Gói dịch vụ');
  const rawStatus = String(raw.status ?? '');

  return {
    id: String(raw.id ?? ''),
    buyerId: raw.buyerId ? String(raw.buyerId) : null,
    mentee: buyerLabel,
    package: packageName,
    amount: Number(raw.totalAmount ?? 0),
    date: formatViDateTime(raw.createdAt ?? undefined),
    sortAt: String(raw.createdAt ?? raw.paidAt ?? ''),
    paidAt: raw.paidAt ? formatViDateTime(raw.paidAt) : null,
    rawStatus,
    status: orderStatusLabel(rawStatus),
    type: 'credit',
  };
}

export function useMentorOrderDetailPage(orderId: string) {
  const [order, setOrder] = useState<MentorOrderRow | null>(null);
  const [detail, setDetail] = useState<ServiceOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!orderId) {
      setError('Không xác định được đơn hàng.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderById(orderId);
      setDetail(data);
      setOrder(mapOrderDetail(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết đơn hàng.');
      setOrder(null);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { order, detail, loading, error, refresh };
}
