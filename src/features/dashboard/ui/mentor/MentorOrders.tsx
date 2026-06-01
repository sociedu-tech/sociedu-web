'use client';

import { useMemo, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorOrderCard } from '@/features/dashboard/ui/mentor/orders/MentorOrderCard';
import { MentorOrderFilters } from '@/features/dashboard/ui/mentor/orders/MentorOrderFilters';
import { MentorOrdersSearchBar } from '@/features/dashboard/ui/mentor/orders/MentorOrdersSearchBar';
import {
  filterMentorOrders,
  useMentorOrders,
  type MentorOrderFilter,
} from '@/features/dashboard/hooks/useMentorOrders';
import { useMentorOrderActions } from '@/features/dashboard/hooks/useMentorOrderActions';
import { DataPagination } from '@/components/ui/DataPagination';

export function MentorOrders() {
  const { orders, loading, error, refresh, page, size, total, totalPages, setPage, setSize } =
    useMentorOrders();
  const [filter, setFilter] = useState<MentorOrderFilter>('all');
  const [query, setQuery] = useState('');
  const { messagingId, openChat } = useMentorOrderActions();

  const filteredOrders = useMemo(() => {
    const byStatus = filterMentorOrders(orders, filter);
    const q = query.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter(
      (order) =>
        order.mentee.toLowerCase().includes(q) ||
        order.package.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q),
    );
  }, [orders, filter, query]);

  if (loading && orders.length === 0) {
    return <LoadingSpinner label="Đang tải đơn hàng…" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <MentorOrderFilters value={filter} onChange={setFilter} />
        <MentorOrdersSearchBar value={query} onChange={setQuery} />
      </div>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-sm text-slate-500">
          Chưa có đơn hàng.
        </p>
      ) : filteredOrders.length === 0 ? (
        <p className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-sm text-slate-500">
          Không có đơn nào khớp bộ lọc hoặc từ khóa tìm kiếm.
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <MentorOrderCard
              key={order.id}
              order={order}
              messaging={messagingId === order.id}
              onMessage={openChat}
            />
          ))}
        </div>
      )}
      <DataPagination
        page={page}
        size={size}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onSizeChange={setSize}
        disabled={loading}
      />
    </div>
  );
}
