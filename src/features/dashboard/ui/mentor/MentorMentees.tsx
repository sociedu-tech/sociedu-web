'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Search, Mail, MessageSquare, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useDashboardBookings } from '@/features/dashboard/hooks/useDashboardBookings';

export const MentorMentees = () => {
  const { rows, loading, error, refresh } = useDashboardBookings('mentor');

  const mentees = useMemo(() => {
    const map = new Map<string, { id: string; name: string; sessions: number; status: string }>();
    for (const row of rows) {
      const key = row.counterparty;
      const prev = map.get(key);
      if (prev) {
        prev.sessions += 1;
      } else {
        map.set(key, {
          id: key,
          name: key,
          sessions: 1,
          status: row.status === 'Hoàn thành' ? 'Hoàn thành' : 'Đang học',
        });
      }
    }
    return [...map.values()];
  }, [rows]);

  if (loading) {
    return <LoadingSpinner label="Đang tải học viên…" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm email, tên…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Học viên</th>
                <th className="px-6 py-4">Buổi học</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mentees.map((mentee) => (
                <tr key={mentee.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        <Image
                          src={`https://i.pravatar.cc/300?u=${encodeURIComponent(mentee.id)}`}
                          alt=""
                          width={40}
                          height={40}
                          className="size-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{mentee.name}</p>
                        <p className="text-xs text-slate-500">Từ booking</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{mentee.sessions} buổi</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
                        mentee.status === 'Hoàn thành' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700',
                      )}
                    >
                      {mentee.status === 'Hoàn thành' && <CheckCircle2 size={12} />}
                      {mentee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button type="button" className="rounded-lg p-2 transition-colors hover:bg-slate-100 hover:text-primary">
                        <Mail size={16} />
                      </button>
                      <button type="button" className="rounded-lg p-2 transition-colors hover:bg-slate-100 hover:text-primary">
                        <MessageSquare size={16} />
                      </button>
                      <button type="button" className="rounded-lg p-2 transition-colors hover:bg-slate-100 hover:text-slate-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mentees.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-slate-500">Chưa có học viên từ booking.</p>
        )}
      </div>
    </div>
  );
};
