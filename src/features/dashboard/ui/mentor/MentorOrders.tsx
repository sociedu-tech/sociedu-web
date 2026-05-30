'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorOrderCard } from '@/features/dashboard/ui/mentor/orders/MentorOrderCard';
import { MentorOrdersSearchBar } from '@/features/dashboard/ui/mentor/orders/MentorOrdersSearchBar';
import { useMentorOrders } from '@/features/dashboard/hooks/useMentorOrders';
import { DataPagination } from '@/components/ui/DataPagination';

export function MentorOrders() {
  const { orders, loading, error, refresh, page, size, total, totalPages, setPage, setSize } =
    useMentorOrders();

  if (loading) {
    return <LoadingSpinner label="Đang tải đơn hàng…" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-6">
      <MentorOrdersSearchBar />
      {orders.length === 0 ? (
        <p className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-sm text-slate-500">
          Chưa có đơn hàng.
        </p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <MentorOrderCard key={order.id} order={order} />
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
