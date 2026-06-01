'use client';

import Link from 'next/link';
import { BookOpen, Plus, Search } from 'lucide-react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DataPagination } from '@/components/ui/DataPagination';
import {
  DashboardPage,
  DashboardSurface,
  DashboardViewHeader,
} from '@/features/dashboard/ui/DashboardPrimitives';
import { useMentorPackagesList } from '@/features/mentor/hooks/useMentorPackagesList';
import { MentorPackageCard } from '@/features/mentor/ui/packages/MentorPackageCard';

export function MentorPackagesListPage() {
  const {
    packages,
    loading,
    error,
    page,
    size,
    total,
    totalPages,
    setPage,
    setSize,
    searchQuery,
    setSearchQuery,
    refresh,
  } = useMentorPackagesList();

  if (loading && packages.length === 0) {
    return <PageLoadingState label="Đang tải gói dịch vụ…" variant="cards" cardCount={4} />;
  }

  return (
    <DashboardPage>
      <DashboardViewHeader
        action={
          <Link
            href="/dashboard/packages/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            <Plus className="size-4" />
            Tạo gói mới
          </Link>
        }
      />

      <DashboardSurface className="p-4 sm:p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
                aria-hidden
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm gói dịch vụ..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <p className="text-xs text-slate-500">
              {total > 0 ? `${total} gói dịch vụ` : 'Chưa có gói nào'}
            </p>
          </div>

          {error ? (
            <ErrorMessage message={error} onRetry={refresh} />
          ) : packages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
              <BookOpen className="size-10 text-slate-300" strokeWidth={1.5} />
              <p className="font-medium text-slate-700">Chưa có gói dịch vụ nào</p>
              <p className="text-sm text-slate-500">Tạo gói đầu tiên để học viên có thể đặt lịch với bạn.</p>
              <Link
                href="/dashboard/packages/new"
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              >
                <Plus className="size-4" />
                Tạo gói mới
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {packages.map((pkg) => (
                <MentorPackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <DataPagination
              page={page}
              size={size}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
              onSizeChange={setSize}
              disabled={loading}
            />
          ) : null}
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
