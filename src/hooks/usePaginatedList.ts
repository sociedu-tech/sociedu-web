'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PagePayload } from '@/lib/apiUtils';
import { DEFAULT_PAGE_SIZE } from '@/lib/apiUtils';

type Options<T> = {
  fetchPage: (page: number, size: number) => Promise<PagePayload<T>>;
  initialSize?: number;
  /** Khi đổi filter/search — reset về trang 0 */
  resetKey?: string | number;
  enabled?: boolean;
};

export function usePaginatedList<T>({
  fetchPage,
  initialSize = DEFAULT_PAGE_SIZE,
  resetKey = '',
  enabled = true,
}: Options<T>) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialSize);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPage(page, size);
      setItems(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      setItems([]);
      setTotal(0);
      setTotalPages(0);
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, [enabled, fetchPage, page, size]);

  useEffect(() => {
    setPage(0);
  }, [resetKey, size]);

  useEffect(() => {
    void load();
  }, [load]);

  const setPageSafe = (next: number) => {
    setPage(Math.max(0, next));
  };

  const setSizeSafe = (next: number) => {
    setSize(next);
    setPage(0);
  };

  const initialLoading = loading && items.length === 0;

  return {
    items,
    loading,
    initialLoading,
    error,
    page,
    size,
    total,
    totalPages,
    setPage: setPageSafe,
    setSize: setSizeSafe,
    refresh: load,
  };
}
