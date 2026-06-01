'use client';

import { useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { formatViDateTime } from '@/lib/apiUtils';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export type MentorOrderRow = {
  id: string;
  mentee: string;
  package: string;
  amount: number;
  date: string;
  status: string;
  type: 'credit' | 'withdrawal';
  bank?: string;
};

const orderStatusLabel = (status?: string | null): string => {
  const s = String(status ?? '').toUpperCase();
  if (s === 'PAID' || s === 'COMPLETED') return 'Hoàn thành';
  if (s === 'PENDING' || s === 'PROCESSING') return 'Đang xử lý';
  if (s === 'CANCELLED' || s === 'CANCELED') return 'Đã hủy';
  return status?.trim() || '—';
};

export function useMentorOrders() {
  const paginated = usePaginatedList<MentorOrderRow>({
    fetchPage: useCallback(async (page, size) => {
      const p = await orderService.getIncomingOrders(page, size);
      return {
        ...p,
        items: p.items.map((raw) => {
          const row = raw as Record<string, unknown>;
          const buyerLabel = (row.buyerLabel as string) || (row.buyerId ? `Học viên #${String(row.buyerId).slice(0, 8)}` : '—');
          const packageName = (row.packageName as string) || (row.serviceId ? `Gói #${String(row.serviceId).slice(0, 8)}` : 'Gói dịch vụ');
          return {
            id: String(row.id ?? ''),
            mentee: buyerLabel,
            package: packageName,
            amount: Number(row.totalAmount ?? 0),
            date: formatViDateTime(row.createdAt as string | undefined),
            status: orderStatusLabel(row.status as string | undefined),
            type: 'credit' as const,
          };
        }),
      };
    }, []),
  });

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
  };
}
