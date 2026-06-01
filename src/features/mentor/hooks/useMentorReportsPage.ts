import { useCallback, useState } from 'react';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export function useMentorReportsPage() {
  const paginated = usePaginatedList<any>({
    fetchPage: useCallback(async (page, size) => {
      return { items: [], total: 0, totalPages: 0, page, size };
    }, []),
  });

  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'REVIEWED' | 'REJECTED'>('REVIEWED');
  const [reviewing, setReviewing] = useState(false);

  const handleReview = async () => {
    // Progress reports feature removed from API — no-op
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
