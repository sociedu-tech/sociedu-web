'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardPage, DashboardSurface, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { useDashboardProjectProgressPage } from '@/features/dashboard/hooks';
import type { ProjectProgressStatus } from '@/features/dashboard/hooks/useDashboardProjectProgressPage';

function statusClass(s: ProjectProgressStatus) {
  if (s === 'reviewed') return 'bg-emerald-50 text-emerald-800';
  if (s === 'rejected') return 'bg-red-50 text-red-700';
  return 'bg-primary/[0.1] text-primary';
}

export function DashboardProjectProgressPage() {
  const { filter, setFilter, rows, cpHeader, filters, loading, error, refresh } =
    useDashboardProjectProgressPage();

  if (loading && rows.length === 0) {
    return <PageLoadingState label="Đang tải tiến độ…" variant="table" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <DashboardPage>
      <DashboardViewHeader
        title="Tiến độ dự án"
        description="Theo dõi báo cáo tiến độ và phản hồi từ mentor."
        layout="compact"
        action={
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Danh sách dự án
            <ChevronRight className="size-4" />
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              filter === f.id
                ? 'border-primary bg-primary/[0.08] text-primary'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DashboardSurface className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold tracking-wide text-slate-500">
                <th className="px-4 py-3">Dự án</th>
                <th className="px-4 py-3">{cpHeader}</th>
                <th className="px-4 py-3 w-[200px]">Tiến độ</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 whitespace-nowrap">Cập nhật</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.project}</td>
                  <td className="px-4 py-3 text-slate-600">{row.counterparty}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-xs font-medium text-slate-600">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
                        statusClass(row.status),
                      )}
                    >
                      {row.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{row.updatedAt}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/projects/${row.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">Không có báo cáo phù hợp bộ lọc.</p>
        ) : null}
      </DashboardSurface>
    </DashboardPage>
  );
}
