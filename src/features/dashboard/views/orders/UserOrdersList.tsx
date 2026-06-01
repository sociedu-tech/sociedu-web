'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DataPagination } from '@/components/ui/DataPagination';
import { DashboardTableCard, dashboardTableHeadClass } from '@/features/dashboard/ui/DashboardTable';
import { useUserOrders } from '@/features/dashboard/hooks/useUserOrders';
import { orderStatusBadgeClass, shortOrderId } from '@/features/dashboard/lib/orderLabels';

export function UserOrdersList() {
  const { orders, loading, error, refresh, page, size, total, totalPages, setPage, setSize, repay } =
    useUserOrders();
  const [payingId, setPayingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleRepay = useCallback(
    async (orderId: string) => {
      setPayingId(orderId);
      setActionError(null);
      try {
        const result = await repay(orderId);
        const url = result?.paymentUrl;
        if (url) {
          window.location.href = url;
          return;
        }
        setActionError('Không nhận được link thanh toán. Vui lòng thử lại.');
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : 'Không thể thanh toán lại');
      } finally {
        setPayingId(null);
      }
    },
    [repay],
  );

  if (loading) {
    return <LoadingSpinner label="Đang tải đơn hàng…" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Đơn chờ thanh toán hết hạn sau 15 phút nếu chưa hoàn tất. Đơn thất bại hoặc hết hạn có thể bấm{' '}
        <span className="font-medium text-slate-800">Thanh toán lại</span>.
      </p>

      {actionError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {actionError}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <ShoppingBag className="size-10 text-slate-300" strokeWidth={1.5} />
          <p>Chưa có đơn hàng nào.</p>
          <Link
            href="/dashboard/find-mentors"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Tìm mentor và đặt gói
          </Link>
        </div>
      ) : (
        <DashboardTableCard>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className={dashboardTableHeadClass}>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Gói dịch vụ</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="hidden px-4 py-3 md:table-cell">Ngày tạo</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Hết hạn / TT</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {orders.map((order) => {
                  const isPaying = payingId === order.id;
                  return (
                    <tr key={order.id} className="bg-white hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">
                        {shortOrderId(order.id)}
                      </td>
                      <td className="hidden max-w-[200px] truncate px-4 py-3 text-slate-600 sm:table-cell">
                        {order.packageLabel}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {order.amount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{order.createdAt}</td>
                      <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                        {order.status === 'pending_payment' && order.paymentExpiresAt
                          ? order.paymentExpiresAt
                          : order.paidAt ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                            orderStatusBadgeClass(order.status),
                          )}
                        >
                          {order.statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {order.canPay ? (
                          <button
                            type="button"
                            disabled={isPaying}
                            onClick={() => void handleRepay(order.id)}
                            className="inline-flex min-w-[7.5rem] items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isPaying ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                                Đang xử lý…
                              </>
                            ) : order.status === 'pending_payment' ? (
                              'Thanh toán'
                            ) : (
                              'Thanh toán lại'
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DashboardTableCard>
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
