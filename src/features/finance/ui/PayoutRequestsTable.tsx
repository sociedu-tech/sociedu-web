'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { PayoutRequestDto } from '@/services/payoutService';
import { formatVnd, PayoutStatusBadge } from '@/features/finance/lib/payoutUi';
import { formatViDateTime } from '@/lib/apiUtils';
import { cn } from '@/lib/utils';

type Props = {
  items: PayoutRequestDto[];
  variant?: 'mentor' | 'admin';
  className?: string;
};

export function PayoutRequestsTable({ items, variant = 'mentor', className }: Props) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/95 text-xs font-semibold uppercase tracking-wide text-slate-500 backdrop-blur-sm">
          <tr>
            <th className="px-5 py-3.5 sm:px-6">Số tiền</th>
            {variant === 'admin' ? <th className="px-5 py-3.5 sm:px-6">Mentor</th> : null}
            <th className="px-5 py-3.5 sm:px-6">Ngân hàng</th>
            <th className="px-5 py-3.5 sm:px-6">Thời gian</th>
            <th className="px-5 py-3.5 sm:px-6">Trạng thái</th>
            <th className="px-5 py-3.5 sm:px-6" aria-hidden />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((p) => (
            <tr key={p.id} className="group transition hover:bg-slate-50/80">
              <td className="px-5 py-4 sm:px-6">
                <Link href={`/dashboard/payouts/${p.id}`} className="block">
                  <p className="font-semibold tabular-nums text-slate-900">{formatVnd(p.grossAmount)}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Thực nhận {formatVnd(p.netAmount)}</p>
                </Link>
              </td>
              {variant === 'admin' ? (
                <td className="px-5 py-4 font-mono text-xs text-slate-600 sm:px-6">
                  {p.mentorId ? `${p.mentorId.slice(0, 8)}…` : '—'}
                </td>
              ) : null}
              <td className="px-5 py-4 text-slate-700 sm:px-6">
                <p>{p.bankName ?? '—'}</p>
                <p className="mt-0.5 text-xs text-slate-500">{p.accountNumber ?? '—'}</p>
              </td>
              <td className="px-5 py-4 text-slate-600 sm:px-6">{formatViDateTime(p.createdAt)}</td>
              <td className="px-5 py-4 sm:px-6">
                <PayoutStatusBadge status={p.status} />
              </td>
              <td className="px-5 py-4 sm:px-6">
                <Link
                  href={`/dashboard/payouts/${p.id}`}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100"
                >
                  Chi tiết
                  <ChevronRight className="size-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
