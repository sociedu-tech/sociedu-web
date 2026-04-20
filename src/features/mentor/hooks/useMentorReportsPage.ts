import { useCallback, useEffect, useState } from 'react';
import { reportService, type ProgressReport, type ReviewReportRequest } from '@/services/reportService';

export function useMentorReportsPage() {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'REVIEWED' | 'REJECTED'>('REVIEWED');
  const [reviewing, setReviewing] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportService.getAssignedReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const handleReview = async () => {
    if (!selectedReport || !feedbackText.trim()) return;
    setReviewing(true);
    try {
      const payload: ReviewReportRequest = {
        status: reviewStatus,
        mentorFeedback: feedbackText,
      };
      await reportService.reviewReport(selectedReport.id, payload);
      await fetchReports();
      setSelectedReport(null);
      setFeedbackText('');
    } catch (err) {
      console.error('Lỗi khi chấm bài', err);
    } finally {
      setReviewing(false);
    }
  };

  return {
    reports,
    loading,
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
