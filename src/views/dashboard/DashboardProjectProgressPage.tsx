'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { cn } from '@/lib/utils';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPrimitives';

type Status = 'doing' | 'done' | 'paused';

type ProgressRow = {
  id: string;
  project: string;
  counterparty: string;
  progress: number;
  status: Status;
  updatedAt: string;
};

const MOCK_MENTEE: ProgressRow[] = [
  {
    id: '1',
    project: 'Đồ án web React + API',
    counterparty: 'Nguyễn Minh · Mentor',
    progress: 72,
    status: 'doing',
    updatedAt: '17/04/2026',
  },
  {
    id: '2',
    project: 'Báo cáo tốt nghiệp',
    counterparty: 'Trần Lan · Mentor',
    progress: 100,
    status: 'done',
    updatedAt: '12/04/2026',
  },
  {
    id: '3',
    project: 'Ứng dụng Flutter MVP',
    counterparty: 'Lê Hải · Mentor',
    progress: 28,
    status: 'doing',
    updatedAt: '18/04/2026',
  },
];

const MOCK_MENTOR: ProgressRow[] = [
  {
    id: 'm1',
    project: 'Đồ án web React + API',
    counterparty: 'Học viên: Đỗ Quang Hợp',
    progress: 72,
    status: 'doing',
    updatedAt: '17/04/2026',
  },
  {
    id: 'm2',
    project: 'Data pipeline Python',
    counterparty: 'Học viên: Phạm An',
    progress: 45,
    status: 'doing',
    updatedAt: '16/04/2026',
  },
  {
    id: 'm3',
    project: 'Kiến trúc microservices',
    counterparty: 'Học viên: Vũ Khánh',
    progress: 100,
    status: 'done',
    updatedAt: '10/04/2026',
  },
  {
    id: 'm4',
    project: 'Mobile UI/UX',
    counterparty: 'Học viên: Mai Chi',
    progress: 15,
    status: 'paused',
    updatedAt: '08/04/2026',
  },
];

const filters: { id: 'all' | Status; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'doing', label: 'Đang làm' },
  { id: 'done', label: 'Hoàn thành' },
  { id: 'paused', label: 'Tạm dừng' },
];

function statusLabel(s: Status) {
  if (s === 'doing') return 'Đang làm';
  if (s === 'done') return 'Hoàn thành';
  return 'Tạm dừng';
}

function statusClass(s: Status) {
  if (s === 'doing') return 'bg-primary/[0.1] text-primary';
  if (s === 'done') return 'bg-emerald-50 text-emerald-800';
  return 'bg-slate-100 text-slate-600';
}

export function DashboardProjectProgressPage() {
  const { userRole } = useAuth();
  const isMentor = normalizeRole(userRole) === ROLES.MENTOR;
  const base = isMentor ? MOCK_MENTOR : MOCK_MENTEE;
  const [filter, setFilter] = useState<'all' | Status>('all');

  const rows = useMemo(() => {
    if (filter === 'all') return base;
    return base.filter((r) => r.status === filter);
  }, [base, filter]);

  const cpHeader = isMentor ? 'Học viên / đối tác' : 'Mentor phụ trách';

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Tiến độ dự án"
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

      <div className="dashboard-stat-tile overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    <span className={cn('inline-flex rounded-md px-2 py-0.5 text-xs font-medium', statusClass(row.status))}>
                      {statusLabel(row.status)}
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
          <p className="px-4 py-8 text-center text-sm text-slate-500">Không có dự án phù hợp bộ lọc.</p>
        ) : null}
      </div>
    </div>
  );
}
