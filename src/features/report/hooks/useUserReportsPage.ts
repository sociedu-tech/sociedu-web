import { useCallback, useState } from 'react';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export function useUserReportsPage() {
  const paginated = usePaginatedList<any>({
    fetchPage: useCallback(async (page, size) => {
      return { items: [], total: 0, totalPages: 0, page, size };
    }, []),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mentorId, setMentorId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      // Progress reports endpoint removed — just close modal and reset
      setIsModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      const m = err as { message?: string };
      setError(m?.message || 'Có lỗi xảy ra khi nộp báo cáo');
    } finally {
      setSubmitting(false);
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
