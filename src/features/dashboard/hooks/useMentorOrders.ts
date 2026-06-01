'use client';

import { useCallback, useEffect, useState } from 'react';
import { orderService } from '@/services/orderService';
import { formatViDateTime } from '@/lib/apiUtils';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { orderStatusLabel } from '@/features/dashboard/lib/orderLabels';
import { pickDisplayName, resolveUserNames } from '@/lib/resolveUserNames';

export type MentorOrderRow = {
  id: string;
  buyerId: string | null;
  mentee: string;
  package: string;
  amount: number;
  date: string;
  paidAt: string | null;
  rawStatus: string;
  status: string;
  type: 'credit' | 'withdrawal';
  bank?: string;
};

export type MentorOrderFilter = 'all' | 'pending_payment' | 'paid' | 'failed' | 'expired';

export const MENTOR_ORDER_FILTERS: { id: MentorOrderFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending_payment', label: 'Chờ thanh toán' },
  { id: 'paid', label: 'Đã thanh toán' },
  { id: 'failed', label: 'Thất bại' },
  { id: 'expired', label: 'Hết hạn' },
];

function mapRawOrder(raw: Record<string, unknown>): MentorOrderRow {
  const buyerLabel =
    (raw.buyerLabel as string) ||
    (raw.buyerId ? `Học viên #${String(raw.buyerId).slice(0, 8)}` : '—');
  const packageName =
    (raw.packageName as string) ||
    (raw.serviceId ? `Gói #${String(raw.serviceId).slice(0, 8)}` : 'Gói dịch vụ');
  const rawStatus = String(raw.status ?? '');

  return {
    id: String(raw.id ?? ''),
    buyerId: raw.buyerId ? String(raw.buyerId) : null,
    mentee: buyerLabel,
    package: packageName,
    amount: Number(raw.totalAmount ?? 0),
    date: formatViDateTime(raw.createdAt as string | undefined),
    paidAt: raw.paidAt ? formatViDateTime(raw.paidAt as string) : null,
    rawStatus,
    status: orderStatusLabel(rawStatus),
    type: 'credit',
  };
}

export function filterMentorOrders(orders: MentorOrderRow[], filter: MentorOrderFilter): MentorOrderRow[] {
  if (filter === 'all') return orders;
  return orders.filter((order) => order.rawStatus.toLowerCase() === filter);
}

export function useMentorOrders() {
  const paginated = usePaginatedList<MentorOrderRow>({
    fetchPage: useCallback(async (page, size) => {
      const p = await orderService.getIncomingOrders(page, size);
      return {
        ...p,
        items: p.items.map((raw) => mapRawOrder(raw as Record<string, unknown>)),
      };
    }, []),
  });

  const [orders, setOrders] = useState<MentorOrderRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    const base = paginated.items;
    const buyerIds = base.map((o) => o.buyerId).filter(Boolean) as string[];

    const enrich = async () => {
      const names = buyerIds.length ? await resolveUserNames(buyerIds) : {};
      if (cancelled) return;
      setOrders(
        base.map((order) => ({
          ...order,
          mentee: pickDisplayName(order.buyerId, order.mentee, names),
        })),
      );
    };

    void enrich();
    return () => {
      cancelled = true;
    };
  }, [paginated.items]);

  return {
    orders,
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
