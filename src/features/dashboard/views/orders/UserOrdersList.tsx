'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DataPagination } from '@/components/ui/DataPagination';
import {
  DashboardTableCard,
  dashboardTableHeadClass,
  dashboardTableHeadCell,
  dashboardTableCell,
  dashboardTableCellTruncate,
  dashboardTableRowClass,
} from '@/features/dashboard/ui/DashboardTable';
import { useUserOrders } from '@/features/dashboard/hooks/useUserOrders';
import { orderStatusBadgeClass, shortOrderId, userOrderDetailPath } from '@/features/dashboard/lib/orderLabels';

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

  if (loading && orders.length === 0) {
    return <PageLoadingState label="Đang tải đơn hàng…" variant="cards" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Đơn chờ thanh toán hết hạn sau 15 phút nếu chưa hoàn tất. Đơn thất bại có thể bấm{' '}
        <span className="font-medium text-slate-800">Thanh toán lại</span>; đơn đã hết hạn cần đặt gói mới.
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
            <table className="w-full min-w-[720px] table-fixed text-left text-sm">
              <thead>
                <tr className={dashboardTableHeadClass}>
                  <th className={dashboardTableHeadCell}>Mã đơn</th>
                  <th className={cn(dashboardTableHeadCell, 'hidden sm:table-cell')}>Gói dịch vụ</th>
                  <th className={dashboardTableHeadCell}>Số tiền</th>
                  <th className={cn(dashboardTableHeadCell, 'hidden md:table-cell')}>Ngày tạo</th>
                  <th className={cn(dashboardTableHeadCell, 'hidden lg:table-cell')}>Hết hạn / TT</th>
                  <th className={dashboardTableHeadCell}>Trạng thái</th>
                  <th className={cn(dashboardTableHeadCell, 'text-right')}>Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {orders.map((order) => {
                  const isPaying = payingId === order.id;
                  return (
                    <tr key={order.id} className={dashboardTableRowClass}>
                      <td className={cn(dashboardTableCell, 'font-mono text-xs font-medium text-slate-700')}>
                        <Link href={userOrderDetailPath(order.id)} className="hover:text-primary">
                          {shortOrderId(order.id)}
                        </Link>
                      </td>
                      <td className={cn(dashboardTableCellTruncate, 'hidden sm:table-cell text-slate-600')} title={order.packageLabel}>
                        {order.packageLabel}
                      </td>
                      <td className={cn(dashboardTableCell, 'font-semibold text-slate-900')}>
                        {order.amount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className={cn(dashboardTableCell, 'hidden text-slate-600 md:table-cell')}>{order.createdAt}</td>
                      <td className={cn(dashboardTableCell, 'hidden text-slate-600 lg:table-cell')}>
                        {order.status === 'pending_payment' && order.paymentExpiresAt
                          ? order.paymentExpiresAt
                          : order.paidAt ?? '—'}
                      </td>
                      <td className={dashboardTableCell}>
                        <span
                          className={cn(
                            'inline-flex whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                            orderStatusBadgeClass(order.status),
                          )}
                        >
                          {order.statusLabel}
                        </span>
                      </td>
                      <td className={cn(dashboardTableCell, 'text-right')}>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            href={userOrderDetailPath(order.id)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Chi tiết
                          </Link>
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
                          ) : null}
                        </div>
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
