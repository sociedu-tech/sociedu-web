'use client';

import { useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { formatViDateTime } from '@/lib/apiUtils';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { orderStatusLabel } from '@/features/dashboard/lib/orderLabels';
import type { ServiceOrderDto, UserOrderRow } from '@/features/dashboard/types/serviceOrder';

function mapOrder(raw: unknown): UserOrderRow {
  const row = raw as ServiceOrderDto;
  const serviceId = row.serviceId ? String(row.serviceId) : '';
  const packageName = row.packageName ? String(row.packageName) : '';
  return {
    id: String(row.id ?? ''),
    packageLabel: packageName || (serviceId ? `Gói dịch vụ · ${serviceId.slice(0, 8)}…` : 'Gói dịch vụ'),
    amount: Number(row.totalAmount ?? 0),
    createdAt: formatViDateTime(row.createdAt ?? undefined),
    paidAt: row.paidAt ? formatViDateTime(row.paidAt) : null,
    paymentExpiresAt: row.paymentExpiresAt ? formatViDateTime(row.paymentExpiresAt) : null,
    status: String(row.status ?? ''),
    statusLabel: orderStatusLabel(row.status),
    canPay: Boolean(row.canPay),
  };
}

export function useUserOrders() {
  const paginated = usePaginatedList<UserOrderRow>({
    fetchPage: useCallback(async (page, size) => {
      const p = await orderService.getMyOrders(page, size);
      return {
        ...p,
        items: p.items.map(mapOrder),
      };
    }, []),
  });

  const repay = useCallback(async (orderId: string) => {
    const result = await orderService.repayOrder(orderId);
    return result;
  }, []);

  return {
    orders: paginated.items,
    loading: paginated.loading,
    error: paginated.error,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    refresh: paginated.refresh,
    repay,
  };
}
