'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mentorService } from '@/services/mentorService';
import type { MentorPackage } from '@/types';

export function useAdminServicePackages() {
  const [packages, setPackages] = useState<(MentorPackage & { mentorId: string; isActive?: boolean })[]>([]);
  const [mentorMap, setMentorMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    mentorService
      .getMentors({ page: 0, size: 500 })
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
    if (!hasLoadedRef.current) setLoading(true);
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
      hasLoadedRef.current = true;
      setLoading(false);
    }
  }, [page, size, debouncedSearch]);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  return {
    packages,
    mentorMap,
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
    refresh: loadPackages,
  };
}
