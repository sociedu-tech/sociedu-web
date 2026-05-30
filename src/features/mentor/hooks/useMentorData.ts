import { useState, useEffect, useCallback } from 'react';
import { mentorService } from '@/services/mentorService';
import type { MentorPackage } from '@/types';

export const useMentorData = (_mentorId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    stats: Record<string, unknown> | null;
    withdrawals: unknown[];
    packages: MentorPackage[];
  }>({
    stats: null,
    withdrawals: [],
    packages: [],
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, withdrawals, packages] = await Promise.all([
        mentorService.getStats(),
        mentorService.getWithdrawals(),
        mentorService.getMyPackages(),
      ]);
      setData({
        stats: (stats as Record<string, unknown>) ?? null,
        withdrawals: Array.isArray(withdrawals) ? withdrawals : [],
        packages,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu mentor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const addPackage = () => {
    const newPkg: MentorPackage = {
      id: `local-${Date.now()}`,
      title: 'Gói dịch vụ mới',
      description: 'Mô tả chi tiết về gói dịch vụ...',
      price: 100000,
      duration: '60 phút',
    };
    setData((prev) => ({
      ...prev,
      packages: [...prev.packages, newPkg],
    }));
  };

  const removePackage = (id: string | number) => {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== id),
    }));
  };

  const updatePackage = (id: string | number, field: keyof MentorPackage, value: MentorPackage[keyof MentorPackage]) => {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const savePackages = async () => {
    try {
      await mentorService.savePackagesForMentor(_mentorId, data.packages);
      await fetchData();
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Lỗi khi lưu gói dịch vụ');
    }
  };

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    addPackage,
    removePackage,
    updatePackage,
    savePackages,
  };
};
