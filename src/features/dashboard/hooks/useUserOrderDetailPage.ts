'use client';

import { useCallback, useEffect, useState } from 'react';
import { orderService } from '@/services/orderService';
import { formatViDateTime } from '@/lib/apiUtils';
import type { ServiceOrderDto, UserOrderRow } from '@/features/dashboard/types/serviceOrder';
import { orderCanPay, orderStatusLabel } from '@/features/dashboard/lib/orderLabels';

function mapOrderDetail(raw: ServiceOrderDto): UserOrderRow {
  const serviceId = raw.serviceId ? String(raw.serviceId) : '';
  const packageName = raw.packageName ? String(raw.packageName) : '';
  return {
    id: String(raw.id ?? ''),
    packageLabel: packageName || (serviceId ? `Gói dịch vụ · ${serviceId.slice(0, 8)}…` : 'Gói dịch vụ'),
    amount: Number(raw.totalAmount ?? 0),
    createdAt: formatViDateTime(raw.createdAt ?? undefined),
    paidAt: raw.paidAt ? formatViDateTime(raw.paidAt) : null,
    paymentExpiresAt: raw.paymentExpiresAt ? formatViDateTime(raw.paymentExpiresAt) : null,
    status: String(raw.status ?? ''),
    statusLabel: orderStatusLabel(raw.status),
    canPay: orderCanPay(raw.status, raw.paymentExpiresAt, raw.canPay),
  };
}

export function useUserOrderDetailPage(orderId: string) {
  const [order, setOrder] = useState<UserOrderRow | null>(null);
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
