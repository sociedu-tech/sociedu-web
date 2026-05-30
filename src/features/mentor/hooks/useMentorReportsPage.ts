import { useCallback, useState } from 'react';
import { reportService, type ProgressReport, type ReviewReportRequest } from '@/services/reportService';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export function useMentorReportsPage() {
  const paginated = usePaginatedList<ProgressReport>({
    fetchPage: useCallback((page, size) => reportService.getAssignedReports(page, size), []),
  });

  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'REVIEWED' | 'REJECTED'>('REVIEWED');
  const [reviewing, setReviewing] = useState(false);

  const handleReview = async () => {
    if (!selectedReport || !feedbackText.trim()) return;
    setReviewing(true);
    try {
      const payload: ReviewReportRequest = {
        status: reviewStatus,
        mentorFeedback: feedbackText,
      };
      await reportService.reviewReport(selectedReport.id, payload);
      await paginated.refresh();
      setSelectedReport(null);
      setFeedbackText('');
    } catch (err) {
      console.error('Lỗi khi chấm bài', err);
    } finally {
      setReviewing(false);
    }
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
