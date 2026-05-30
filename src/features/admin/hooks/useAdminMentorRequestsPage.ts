import { useCallback } from 'react';
import type { User } from '@/types';
import { mentorRequestService, type MentorRequest } from '@/services/mentorRequestService';
import { usePaginatedList } from '@/hooks/usePaginatedList';

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
    joinedDate: req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : '—',
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

export function useAdminMentorRequestsPage() {
  const paginated = usePaginatedList<MentorRequest>({
    fetchPage: useCallback(
      (page, size) =>
        mentorRequestService.adminList({ page, size }),
      [],
    ),
  });

  const requests = paginated.items
    .filter((r) => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW')
    .map(mentorRequestToUser);

  const approveMentor = async (id: string) => {
    await mentorRequestService.adminApprove(id);
    await paginated.refresh();
  };

  return {
    requests,
    loading: paginated.loading,
    error: paginated.error,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    refresh: paginated.refresh,
    approveMentor,
  };
}
