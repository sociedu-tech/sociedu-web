'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { servicePackageService } from '@/services/servicePackageService';
import type { MentorServicePackage } from '@/features/mentor/types/servicePackage';

export function useMentorPackagesList() {
  const [packages, setPackages] = useState<MentorServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
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

  const load = useCallback(async () => {
    if (!hasLoadedRef.current) setLoading(true);
    setError(null);
    try {
      const result = await servicePackageService.listMyPackages({
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
  }, [debouncedSearch, page, size]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
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
    refresh: load,
  };
}
