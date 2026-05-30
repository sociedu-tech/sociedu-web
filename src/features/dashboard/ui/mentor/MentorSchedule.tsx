'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useDashboardBookings } from '@/features/dashboard/hooks/useDashboardBookings';

export const MentorSchedule = () => {
  const { rows, loading, error, refresh } = useDashboardBookings('mentor');

  if (loading) {
    return <LoadingSpinner label="Đang tải lịch…" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  const sessions = rows.map((row) => ({
    id: row.id,
    mentee: row.counterparty,
    time: row.when,
    date: row.when,
    type: 'Video Call',
    status: row.status,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap gap-3 sm:justify-end">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
            <button type="button" className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100">
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-sm font-medium text-slate-900">Lịch buổi học</span>
            <button type="button" className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100">
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            <Plus size={16} /> Khung giờ rảnh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-dark">
            <CalendarIcon className="text-gray-400" size={18} /> Buổi học từ booking
          </h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có buổi học nào.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{s.mentee}</p>
                    <p className="text-sm text-slate-600">{s.time}</p>
                  </div>
                  <span className="badge-primary text-xs">{s.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h4 className="mb-3 text-sm font-semibold text-dark">Sắp tới</h4>
            {sessions.slice(0, 4).map((session) => (
              <div key={session.id} className="mb-3 flex gap-3 border-b border-slate-50 pb-3 last:mb-0 last:border-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Video size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{session.mentee}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={12} /> {session.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
