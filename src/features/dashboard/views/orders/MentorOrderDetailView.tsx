'use client';

import { Loader2, MessageSquare, ShoppingBag } from 'lucide-react';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { cn } from '@/lib/utils';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';
import type { MentorOrderRow } from '@/features/dashboard/hooks/useMentorOrders';
import { orderStatusBadgeClass, shortOrderId } from '@/features/dashboard/lib/orderLabels';

type Props = {
  order: MentorOrderRow;
  detail: ServiceOrderDto | null;
  messaging: boolean;
  onMessage: () => void;
};

export function MentorOrderDetailView({ order, detail, messaging, onMessage }: Props) {
  const status = detail?.status ?? order.rawStatus;
  const canMessage = ['paid', 'completed'].includes(order.rawStatus.toLowerCase());

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col bg-white">
      <div className="flex shrink-0 items-start gap-4 border-b border-slate-200/90 px-6 py-6 sm:px-8 lg:px-10">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <ShoppingBag className="size-6" />
        </div>
        <div>
          <h1 className="font-mono text-2xl font-semibold text-slate-900">{shortOrderId(order.id)}</h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 lg:px-10">
        <dl className="grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-slate-500">Học viên</dt>
            <dd className="mt-1 font-medium text-slate-900">{order.mentee}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Gói dịch vụ</dt>
            <dd className="mt-1 font-medium text-slate-900">{order.package}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Số tiền</dt>
            <dd className="mt-1 text-lg font-semibold text-primary">{order.amount.toLocaleString('vi-VN')}đ</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Ngày đặt</dt>
            <dd className="mt-1 text-slate-800">{order.date}</dd>
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
                {order.status}
              </span>
            </dd>
          </div>
        </dl>

        {detail?.paymentExpiresAt ? (
          <p className="mt-6 max-w-xl rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Hết hạn thanh toán: {formatDisplayDate(detail.paymentExpiresAt)}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 justify-end border-t border-slate-200/90 px-6 py-4 sm:px-8 lg:px-10">
        <button
          type="button"
          disabled={!canMessage || messaging}
          title={
            canMessage
              ? 'Nhắn tin với học viên'
              : 'Nhắn tin khả dụng sau khi học viên thanh toán thành công'
          }
          onClick={onMessage}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {messaging ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
          Nhắn tin học viên
        </button>
      </div>
    </div>
  );
}
