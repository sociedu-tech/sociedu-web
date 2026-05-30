import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { adminService } from '@/services/adminService';
import { mentorRequestService, type MentorRequest } from '@/services/mentorRequestService';

const EMPTY_ADMIN_DATA: {
  users: User[];
  mentorRequests: User[];
} = {
  users: [],
  mentorRequests: [],
};

export type AdminDataBannerVariant = 'offline' | null;

const mentorRequestToUser = (req: MentorRequest): User => {
  const name =
    req.applicant?.fullName?.trim() ||
    [req.applicant?.lastName, req.applicant?.firstName].filter(Boolean).join(' ').trim() ||
    req.applicant?.email ||
    'Ứng viên';
  return {
    id: req.userId || req.id,
    name,
    email: req.applicant?.email ?? '',
    avatar: `https://i.pravatar.cc/300?u=${encodeURIComponent(req.userId || req.id)}`,
    role: 'mentor',
    joinedDate: req.createdAt
      ? new Date(req.createdAt).toLocaleDateString('vi-VN')
      : '—',
    mentorInfo: {
      headline: req.headline,
      expertise: req.expertise ?? [],
      price: req.hourlyRate ?? 0,
      rating: 0,
      sessionsCompleted: 0,
      verificationStatus: 'pending',
    },
  };
};

export const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerVariant, setBannerVariant] = useState<AdminDataBannerVariant>(null);
  const [data, setData] = useState(EMPTY_ADMIN_DATA);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBannerVariant(null);
    try {
      const [users, mentorPage] = await Promise.all([
        adminService.getUsers(),
        mentorRequestService.adminList({ size: 100 }).catch(() => ({
          items: [] as MentorRequest[],
          page: 0,
          size: 100,
          total: 0,
          totalPages: 0,
        })),
      ]);

      setData({
        users,
        mentorRequests: mentorPage.items
          .filter((r) => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW')
          .map(mentorRequestToUser),
      });
    } catch (err: unknown) {
      setData(EMPTY_ADMIN_DATA);
      setBannerVariant('offline');
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const approveMentor = async (id: string) => {
    try {
      await mentorRequestService.adminApprove(id);
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
