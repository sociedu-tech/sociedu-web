'use client';

import Link from 'next/link';
import {
  ShoppingBag,
  Eye,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MentorOrderRow } from '@/features/dashboard/hooks/useMentorOrders';
import { mentorOrderDetailPath, orderStatusBadgeClass, shortOrderId } from '@/features/dashboard/lib/orderLabels';

type Props = {
  order: MentorOrderRow;
  messaging?: boolean;
  onMessage: (order: MentorOrderRow) => void;
};

export function MentorOrderCard({ order, messaging, onMessage }: Props) {
  const canMessage = ['paid', 'completed'].includes(order.rawStatus.toLowerCase());

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Link
                href={mentorOrderDetailPath(order.id)}
                className="font-mono text-xs font-semibold tracking-wider text-slate-500 hover:text-primary"
              >
                {shortOrderId(order.id)}
              </Link>
            </div>
            <h3 className="text-base font-semibold text-slate-900">{order.package}</h3>
            <p className="text-sm text-slate-500">
              Người đặt: <span className="font-medium text-slate-800">{order.mentee}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4 lg:flex-nowrap lg:gap-12">
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Ngày đặt</p>
            <p className="text-sm font-semibold text-slate-900">{order.date}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Số tiền</p>
            <p className="text-sm font-bold text-primary">{order.amount.toLocaleString('vi-VN')}đ</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Trạng thái</p>
            <span
              className={cn(
                'inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                orderStatusBadgeClass(order.rawStatus),
              )}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 lg:mt-0">
          <Link
            href={mentorOrderDetailPath(order.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye size={16} />
            Chi tiết
          </Link>
          <button
            type="button"
            disabled={!canMessage || messaging}
            title={
              canMessage
                ? 'Nhắn tin với học viên'
                : 'Nhắn tin khả dụng sau khi học viên thanh toán thành công'
            }
            onClick={() => onMessage(order)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {messaging ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <MessageSquare size={16} />
            )}
            Nhắn tin
          </button>
        </div>
      </div>
    </div>
  );
}
