'use client';

import { Loader2, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ServiceOrderDto, UserOrderRow } from '@/features/dashboard/types/serviceOrder';
import { orderStatusBadgeClass, shortOrderId } from '@/features/dashboard/lib/orderLabels';

type Props = {
  order: UserOrderRow;
  detail: ServiceOrderDto | null;
  paying: boolean;
  onRepay: () => void;
};

export function UserOrderDetailView({ order, detail, paying, onRepay }: Props) {
  const status = detail?.status ?? order.status;

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col bg-white">
      <div className="flex shrink-0 items-start gap-4 border-b border-slate-200/90 px-6 py-6 sm:px-8 lg:px-10">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <ShoppingBag className="size-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Chi tiết đơn hàng</p>
          <h1 className="mt-1 font-mono text-2xl font-semibold text-slate-900">{shortOrderId(order.id)}</h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 lg:px-10">
        <dl className="grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-slate-500">Gói dịch vụ</dt>
            <dd className="mt-1 font-medium text-slate-900">{order.packageLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Số tiền</dt>
            <dd className="mt-1 text-lg font-semibold text-primary">{order.amount.toLocaleString('vi-VN')}đ</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Ngày tạo</dt>
            <dd className="mt-1 text-slate-800">{order.createdAt}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Thanh toán</dt>
            <dd className="mt-1 text-slate-800">{order.paidAt ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Trạng thái</dt>
            <dd className="mt-1">
              <span
                className={cn(
                  'inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                  orderStatusBadgeClass(status),
                )}
              >
                {order.statusLabel}
              </span>
            </dd>
          </div>
        </dl>

        {detail?.paymentExpiresAt ? (
          <p className="mt-6 max-w-xl rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Hết hạn thanh toán: {new Date(detail.paymentExpiresAt).toLocaleString('vi-VN')}
          </p>
        ) : null}
      </div>

      {order.canPay ? (
        <div className="flex shrink-0 justify-end border-t border-slate-200/90 px-6 py-4 sm:px-8 lg:px-10">
          <button
            type="button"
            disabled={paying}
            onClick={onRepay}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paying ? <Loader2 className="size-4 animate-spin" /> : null}
            {order.status === 'pending_payment' ? 'Thanh toán' : 'Thanh toán lại'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
