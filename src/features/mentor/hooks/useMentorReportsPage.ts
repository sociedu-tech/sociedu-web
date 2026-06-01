import { useCallback, useState } from 'react';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { trustService } from '@/services/trustService';

export function useMentorReportsPage() {
  const paginated = usePaginatedList<any>({
    fetchPage: useCallback(async (page, size) => {
      try {
        const data = await trustService.myReports(page, size);
        return {
          items: data.items.map((r: any) => ({
            id: r.id,
            title: `Báo cáo ${r.type === 'booking' ? 'Lộ trình' : r.type === 'session' ? 'Buổi học' : 'Người dùng'}`,
            status: r.status === 'open' ? 'PENDING' : r.status === 'in_review' ? 'PENDING' : r.status === 'resolved' ? 'REVIEWED' : 'REJECTED',
            menteeName: r.reportedUserId ? `Người dùng #${r.reportedUserId.substring(0, 8)}` : 'Admin',
            menteeId: r.reportedUserId || '',
            createdAt: r.createdAt,
            content: `Lý do: ${r.reason}\nChi tiết: ${r.description}`,
            attachmentUrl: null,
            mentorFeedback: r.resolutionNote || null,
          })),
          total: data.total,
          totalPages: data.totalPages,
          page,
          size,
        };
      } catch (err) {
        console.error(err);
        return { items: [], total: 0, totalPages: 0, page, size };
      }
    }, []),
  });

  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'REVIEWED' | 'REJECTED'>('REVIEWED');
  const [reviewing, setReviewing] = useState(false);

  const handleReview = async () => {
    // Detail display only since reports are resolved by Admin
    return;
  };

  return {
    reports: paginated.items,
    loading: paginated.loading,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    selectedReport,
    setSelectedReport,
    feedbackText,
    setFeedbackText,
    reviewStatus,
    setReviewStatus,
    reviewing,
    handleReview,
  };
}
