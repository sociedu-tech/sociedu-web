import { useCallback, useEffect, useState } from 'react';
import { reportService, type ProgressReport } from '@/services/reportService';

export function useUserReportsPage() {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mentorId, setMentorId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportService.getMyReports();
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

  const resetForm = useCallback(() => {
    setMentorId('');
    setTitle('');
    setContent('');
    setAttachmentUrl('');
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorId || !title || !content) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await reportService.submitReport({
        mentorId: parseInt(mentorId, 10),
        title,
        content,
        attachmentUrl,
      });
      setIsModalOpen(false);
      resetForm();
      await fetchReports();
    } catch (err: unknown) {
      const m = err as { message?: string };
      setError(m?.message || 'Có lỗi xảy ra khi nộp báo cáo');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reports,
    loading,
    isModalOpen,
    setIsModalOpen,
    submitting,
    mentorId,
    setMentorId,
    title,
    setTitle,
    content,
    setContent,
    attachmentUrl,
    setAttachmentUrl,
    error,
    handleSubmit,
    resetForm,
  };
}
