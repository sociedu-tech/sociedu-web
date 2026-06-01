'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useDashboardBookings } from '@/features/dashboard/hooks/useDashboardBookings';
import { SessionsTable } from '@/features/dashboard/views/sessions/SessionsTable';

export const MentorSchedule = () => {
  const { rows, loading, error, refresh, page, size, total, totalPages, setPage, setSize } =
    useDashboardBookings('mentor');

  if (loading) {
    return <LoadingSpinner label="Đang tải lịch…" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

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

      <SessionsTable
        counterpartyHeader="Học viên"
        rows={rows}
        loading={loading}
        error={error}
        refresh={refresh}
        page={page}
        size={size}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        setSize={setSize}
        role="mentor"
      />
    </div>
  );
};
