'use client';

import React, { useState } from 'react';
import { Video, CheckCircle, Upload } from 'lucide-react';
import { DashboardTableCard, dashboardTableHeadClass } from '@/components/dashboard/DashboardTable';
import { useMentorBookings, useUpdateSessionMentor, useAddSessionEvidence } from '@/hooks/useBooking';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { toast } from 'sonner';
import { BookingSessionResponse, BookingResponse } from '@/types';
import { permissions } from '@/lib/permissions';

export function SessionsListMentor() {
  const { data, isLoading, error, refetch } = useMentorBookings();
  const updateSessionMut = useUpdateSessionMentor();
  const addEvidenceMut = useAddSessionEvidence();

  const [selectedSession, setSelectedSession] = useState<{bookingId: string, session: BookingSessionResponse} | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  if (isLoading) return <LoadingSpinner label="Đang tải lịch học..." />;
  if (error) return <ErrorMessage message="Lỗi tải lịch học" onRetry={refetch} />;

  // Flatten sessions from bookings for display
  const bookings: BookingResponse[] = data || [];
  const allSessions = bookings.flatMap(b => b.sessions.map(s => ({ ...s, bookingId: b.id })));

  const handleComplete = async () => {
    if (!selectedSession) return;
    
    // File Validation
    if (evidenceFile) {
      if (evidenceFile.size > 20 * 1024 * 1024) {
        toast.error('File minh chứng vượt quá dung lượng 20MB');
        return;
      }
      const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!allowedTypes.includes(evidenceFile.type)) {
        toast.error('Định dạng file không được hỗ trợ (chỉ nhận PNG, JPG, PDF)');
        return;
      }
    }

    try {
      // 1. Cập nhật Session thành COMPLETED (kèm Optimistic Version)
      await updateSessionMut.mutateAsync({
        bookingId: selectedSession.bookingId,
        sessionId: selectedSession.session.id,
        data: {
          version: selectedSession.session.version,
          status: 'COMPLETED'
        }
      });

      // 2. Upload Evidence nếu có (ở đây giả lập gửi pre-signed URL hoặc fileUrl, tùy backend)
      if (evidenceFile) {
        await addEvidenceMut.mutateAsync({
          bookingId: selectedSession.bookingId,
          sessionId: selectedSession.session.id,
          data: {
            fileUrl: `https://storage.sociedu.com/mock/${evidenceFile.name}`, // Mock url sau khi upload S3
            description: 'Minh chứng hoàn thành buổi học'
          }
        });
      }

      setSelectedSession(null);
      setEvidenceFile(null);
    } catch (e) {
      // 409 conflict đã được handle ngầm trong hook
    }
  };

  // Mock currentUser role
  const currentUser = { id: 'mentor-1', role: 'mentor' as const };

  const isMutating = updateSessionMut.isPending || addEvidenceMut.isPending;

  return (
    <div className="space-y-4">
      <DashboardTableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className="px-4 py-3">Buổi học</th>
              <th className="hidden px-4 py-3 sm:table-cell">Thời gian</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {allSessions.map((session) => (
              <tr key={session.id} className="bg-white hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium">{session.title}</td>
                <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{session.scheduledAt || 'Chưa xếp lịch'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                    session.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                    session.status === 'CANCELED' ? 'bg-red-100 text-red-700' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {permissions.canCompleteSession(currentUser as any, session as any) && (
                    <button 
                      onClick={() => setSelectedSession({ bookingId: session.bookingId, session })}
                      className="text-primary hover:text-primary-hover font-medium flex items-center gap-1 text-xs"
                    >
                      <CheckCircle size={14} /> Báo cáo hoàn thành
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardTableCard>
      
      {allSessions.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <Video className="size-10 text-slate-300" strokeWidth={1.5} />
          <p>Chưa có buổi học nào.</p>
        </div>
      )}

      {/* Modal báo cáo hoàn thành */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Xác nhận hoàn thành</h3>
            <p className="text-sm text-slate-600 mb-4">
              Bạn đang đánh dấu hoàn thành buổi học <strong>{selectedSession.session.title}</strong>. 
              Vui lòng tải lên minh chứng giảng dạy (Tùy chọn).
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tải lên minh chứng</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                <input 
                  type="file" 
                  id="evidence" 
                  className="hidden" 
                  onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                  accept=".png,.jpeg,.jpg,.pdf"
                />
                <label htmlFor="evidence" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="text-slate-400" size={24} />
                  <span className="text-sm text-primary font-medium">{evidenceFile ? evidenceFile.name : 'Chọn file (Max 20MB)'}</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setSelectedSession(null); setEvidenceFile(null); }}
                disabled={isMutating}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button 
                onClick={handleComplete}
                disabled={isMutating}
                className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary-hover rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isMutating ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
