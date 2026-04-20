import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { adminService } from '@/services/adminService';
import { ADMIN_PREVIEW_DATA_ENABLED, getAdminMockData } from '@/data/adminMockData';

const EMPTY_ADMIN_DATA: {
  users: User[];
  mentorRequests: User[];
} = {
  users: [],
  mentorRequests: [],
};

export type AdminDataBannerVariant = 'preview' | 'offline' | null;

export const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerVariant, setBannerVariant] = useState<AdminDataBannerVariant>(
    ADMIN_PREVIEW_DATA_ENABLED ? 'preview' : null,
  );
  const [data, setData] = useState(EMPTY_ADMIN_DATA);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (ADMIN_PREVIEW_DATA_ENABLED) {
      setData(getAdminMockData());
      setBannerVariant('preview');
      setLoading(false);
      return;
    }
    setBannerVariant(null);
    try {
      const mentorRequests = await adminService.getMentorRequests();

      setData({
        users: [],
        mentorRequests: mentorRequests as User[],
      });
    } catch (_err: unknown) {
      setData(getAdminMockData());
      setBannerVariant('offline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const approveMentor = async (id: string) => {
    if (ADMIN_PREVIEW_DATA_ENABLED) {
      setData((prev) => ({
        ...prev,
        mentorRequests: prev.mentorRequests.filter((u) => u.id !== id),
      }));
      return;
    }
    try {
      await adminService.approveMentor(id);
      await fetchData();
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Lỗi khi duyệt mentor';
      throw new Error(m);
    }
  };

  return {
    data,
    loading,
    error,
    bannerVariant,
    usingFallbackData: bannerVariant != null,
    refresh: fetchData,
    approveMentor,
  };
};
