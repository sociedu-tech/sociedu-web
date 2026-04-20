'use client';

import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MentorOrderRow } from '@/data/mentorOrdersMock';

type Props = { order: MentorOrderRow };

export function MentorOrderCard({ order }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all">
      {order.status === 'Chờ xác nhận' ? (
        <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-xl border',
              order.status === 'Chờ xác nhận'
                ? 'border-red-100 bg-red-50 text-red-600'
                : order.status === 'Đã xác nhận'
                  ? 'border-blue-100 bg-blue-50 text-blue-600'
                  : order.status === 'Hoàn thành'
                    ? 'border-green-100 bg-green-50 text-green-600'
                    : 'border-slate-100 bg-slate-50 text-slate-500',
            )}
          >
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-slate-500">{order.id}</span>
              {order.urgency === 'Cao' ? (
                <span className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                  <AlertCircle size={10} /> Khẩn cấp
                </span>
              ) : null}
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
            <p className="text-sm font-bold text-primary">{order.amount.toLocaleString()}đ</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Trạng thái</p>
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium',
                order.status === 'Chờ xác nhận'
                  ? 'bg-red-50 text-red-700'
                  : order.status === 'Đã xác nhận'
                    ? 'bg-blue-50 text-blue-700'
                    : order.status === 'Hoàn thành'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-slate-100 text-slate-700',
              )}
            >
              {order.status === 'Hoàn thành' ? (
                <CheckCircle2 size={12} />
              ) : order.status === 'Chờ xác nhận' ? (
                <Clock size={12} />
              ) : order.status === 'Đã hủy' ? (
                <XCircle size={12} />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {order.status}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 lg:mt-0">
          {order.status === 'Chờ xác nhận' ? (
            <>
              <button
                type="button"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Chấp nhận
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Từ chối
              </button>
            </>
          ) : (
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50"
              title="Xem chi tiết"
            >
              <Eye size={18} />
            </button>
          )}
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50"
            title="Nhắn tin"
          >
            <MessageSquare size={18} />
          </button>
          <button type="button" className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
