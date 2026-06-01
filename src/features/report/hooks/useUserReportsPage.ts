import { useCallback, useState, useEffect } from 'react';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { trustService } from '@/services/trustService';
import { useProgramBookings } from '@/features/dashboard/hooks/useProgramBookings';

export function useUserReportsPage() {
  const { items: bookings, loading: loadingBookings } = useProgramBookings('buyer');

  const paginated = usePaginatedList<any>({
    fetchPage: useCallback(async (page, size) => {
      try {
        const data = await trustService.myReports(page, size);
        return {
          items: data.items.map((r: any) => ({
            id: r.id,
            title: `Báo cáo ${r.type === 'booking' ? 'Lộ trình' : r.type === 'session' ? 'Buổi học' : 'Người dùng'}`,
            status: r.status === 'open' ? 'PENDING' : r.status === 'in_review' ? 'PENDING' : r.status === 'resolved' ? 'REVIEWED' : 'REJECTED',
            mentorName: r.reportedUserId ? `Người dùng #${r.reportedUserId.substring(0, 8)}` : 'Admin',
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setSelectedBookingId('');
    setTitle('');
    setContent('');
    setAttachmentUrl('');
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !title || !content) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const booking = bookings.find((b) => b.bookingId === selectedBookingId);
    if (!booking) {
      setError('Lộ trình đã chọn không hợp lệ');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await trustService.createReport({
        type: 'booking',
        entityId: booking.bookingId,
        reportedUserId: booking.mentorId || undefined,
        reason: title.trim(),
        description: content.trim(),
      });
      setIsModalOpen(false);
      resetForm();
      paginated.refresh();
    } catch (err: unknown) {
      const m = err as { message?: string };
      setError(m?.message || 'Có lỗi xảy ra khi nộp báo cáo');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reports: paginated.items,
    loading: paginated.loading || loadingBookings,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    isModalOpen,
    setIsModalOpen,
    submitting,
    bookings,
    selectedBookingId,
    setSelectedBookingId,
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

