'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { servicePackageService } from '@/services/servicePackageService';
import type { MentorServicePackageDetail } from '@/features/mentor/types/servicePackage';

export function useMentorPackageDetail(packageId: string) {
  const router = useRouter();
  const [pkg, setPkg] = useState<MentorServicePackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    if (!packageId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await servicePackageService.getMyPackage(packageId);
      setPkg(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết gói dịch vụ.');
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleActive = useCallback(async () => {
    if (!packageId) return;
    setActionLoading(true);
    try {
      const updated = await servicePackageService.togglePackage(packageId);
      setPkg(updated);
      return updated;
    } catch (err: unknown) {
      throw err instanceof Error ? err : new Error('Không thể cập nhật trạng thái gói dịch vụ.');
    } finally {
      setActionLoading(false);
    }
  }, [packageId]);

  const remove = useCallback(async () => {
    if (!packageId) return;
    setActionLoading(true);
    try {
      await servicePackageService.deletePackage(packageId);
      router.push('/dashboard/packages');
    } catch (err: unknown) {
      throw err instanceof Error ? err : new Error('Không thể xóa gói dịch vụ.');
    } finally {
      setActionLoading(false);
    }
  }, [packageId, router]);

  return {
    pkg,
    loading,
    error,
    actionLoading,
    refresh: load,
    toggleActive,
    remove,
  };
}
