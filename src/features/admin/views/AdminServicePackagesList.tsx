'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { BookOpen, Search, Clock, BadgeDollarSign, User } from 'lucide-react';
import { mentorService } from '@/services/mentorService';
import type { MentorPackage } from '@/types';
import { DataPagination } from '@/components/ui/DataPagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { adminSelect } from '@/features/admin/ui/adminClasses';
import { cn } from '@/lib/utils';

export function AdminServicePackagesList() {
  const [packages, setPackages] = useState<(MentorPackage & { mentorId: string; isActive?: boolean })[]>([]);
  const [mentorMap, setMentorMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Search States
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // Reset page on search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load mentors cache
  useEffect(() => {
    mentorService.getMentors({ page: 0, size: 500 })
      .then((mentors) => {
        const m: Record<string, string> = {};
        mentors.forEach((user) => {
          m[user.id] = user.name;
        });
        setMentorMap(m);
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách mentor:', err);
      });
  }, []);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mentorService.getAllPackages({
        q: debouncedSearch || undefined,
        page,
        size,
      });
      setPackages(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không tải được danh sách gói dịch vụ.');
    } finally {
      setLoading(false);
    }
  }, [page, size, debouncedSearch]);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  return (
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
          Hiển thị các gói mentoring đã tạo của tất cả mentor trên hệ thống.
        </p>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={loadPackages} />
      ) : loading && packages.length === 0 ? (
        <LoadingSpinner label="Đang tải danh sách gói dịch vụ…" />
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <BookOpen className="size-10 text-slate-300" strokeWidth={1.5} />
          <p className="font-medium text-slate-700">Chưa có gói dịch vụ nào</p>
          <p className="text-sm text-slate-500">Hệ thống chưa ghi nhận bất kỳ gói dịch vụ nào từ mentor.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {packages.map((pkg) => {
            const mentorName = mentorMap[pkg.mentorId] || 'Mentor';
            return (
              <div
                key={pkg.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    <span
                      className={cn(
                        'inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
                        pkg.isActive !== false
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-slate-100 text-slate-600 ring-slate-500/10'
                      )}
                    >
                      {pkg.isActive !== false ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {pkg.description || 'Chưa có mô tả chi tiết.'}
                  </p>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <User className="size-3.5 shrink-0 text-slate-400" />
                      <span className="truncate font-medium text-slate-700">{mentorName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 shrink-0 text-slate-400" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <BadgeDollarSign className="size-4" />
                    <span>{pkg.price.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {pkg.id.slice(0, 8)}</span>
                </div>
              </div>
            );
          })}
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
        />
      ) : null}
    </div>
  );
}
