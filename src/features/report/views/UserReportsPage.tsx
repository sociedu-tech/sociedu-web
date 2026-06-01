'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, CheckCircle, Clock, X, MessageSquare, AlertCircle, Flag, ExternalLink } from 'lucide-react';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DataPagination } from '@/components/ui/DataPagination';
import {
  DashboardPage,
  DashboardSurface,
  DashboardViewHeader,
  DashboardTabs,
  DashboardEmptyState,
  DashboardLoadingBlock,
  dashboardBtnPrimary,
  dashboardBtnSecondary,
  dashboardInput,
  dashboardLabel,
} from '@/features/dashboard/ui/DashboardPrimitives';
import { useUserReportsPage } from '@/features/report/hooks';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { sessionReportService, type SessionReportRequest } from '@/services/sessionReportService';

export const UserReportsPage = () => {
  const toast = useToast();
  const {
    reports,
    loading,
    page,
    size,
    total,
    totalPages,
    setPage,
    setSize,
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
  } = useUserReportsPage();

  const [activeTab, setActiveTab] = React.useState<'academic' | 'moderation'>('academic');

  // Academic tab states
  const [academicReports, setAcademicReports] = React.useState<SessionReportRequest[]>([]);
  const [academicLoading, setAcademicLoading] = React.useState(false);
  const [academicPage, setAcademicPage] = React.useState(0);
  const [academicSize, setAcademicSize] = React.useState(20);
  const [academicTotal, setAcademicTotal] = React.useState(0);
  const [academicTotalPages, setAcademicTotalPages] = React.useState(0);

  // Submit Modal States (Academic)
  const [submitReportOpen, setSubmitReportOpen] = React.useState(false);
  const [activeReqId, setActiveReqId] = React.useState<string | null>(null);
  const [reportContent, setReportContent] = React.useState('');
  const [reportAttachment, setReportAttachment] = React.useState('');
  const [submittingReport, setSubmittingReport] = React.useState(false);

  const fetchAcademicReports = React.useCallback(async () => {
    setAcademicLoading(true);
    try {
      const res = await sessionReportService.listForMentee(academicPage, academicSize);
      setAcademicReports(res.items);
      setAcademicTotal(res.total);
      setAcademicTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setAcademicLoading(false);
    }
  }, [academicPage, academicSize]);

  React.useEffect(() => {
    if (activeTab === 'academic') {
      fetchAcademicReports();
    }
  }, [activeTab, fetchAcademicReports]);

  const handleSubmitAcademicReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReqId) return;
    if (!reportContent.trim()) {
      toast.error('Vui lòng nhập nội dung báo cáo.');
      return;
    }
    if (reportAttachment && !reportAttachment.startsWith('http://') && !reportAttachment.startsWith('https://')) {
      toast.error('Link đính kèm phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://).');
      return;
    }
    setSubmittingReport(true);
    try {
      await sessionReportService.submit(activeReqId, {
        content: reportContent.trim(),
        attachmentUrl: reportAttachment.trim() || undefined,
      });
      toast.success('Nộp báo cáo thành công.');
      setSubmitReportOpen(false);
      setActiveReqId(null);
      setReportContent('');
      setReportAttachment('');
      fetchAcademicReports();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không gửi được báo cáo.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const currentLoading = activeTab === 'moderation' ? loading : academicLoading;

  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Học viên"
        title="Báo cáo học tập & vi phạm"
        description="Theo dõi tiến độ, gửi báo cáo cho Mentor hoặc báo cáo vi phạm lên Admin."
        action={
          activeTab === 'moderation' ? (
            <button type="button" onClick={() => setIsModalOpen(true)} className={dashboardBtnPrimary}>
              <Plus size={18} aria-hidden />
              Nộp khiếu nại vi phạm
            </button>
          ) : undefined
        }
      />

      <DashboardTabs
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'academic' | 'moderation')}
        tabs={[
          { id: 'academic', label: 'Báo cáo học tập', icon: FileText },
          { id: 'moderation', label: 'Khiếu nại vi phạm', icon: Flag },
        ]}
      />

      {currentLoading ? (
        <DashboardLoadingBlock />
      ) : (
        <DashboardSurface className="overflow-hidden">
            {activeTab === 'academic' ? (
              <>
                {academicReports.length === 0 ? (
                  <DashboardEmptyState
                    icon={FileText}
                    title="Không có yêu cầu báo cáo nào"
                    description="Yêu cầu từ Mentor sẽ xuất hiện ở đây."
                  />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {academicReports.map((req) => {
                      const statusColors = {
                        PENDING_SUBMISSION: 'bg-amber-50 text-amber-600 border-amber-200/50',
                        SUBMITTED: 'bg-blue-50 text-blue-600 border-blue-200/50',
                        APPROVED: 'bg-green-50 text-green-600 border-green-200/50',
                        REJECTED: 'bg-red-50 text-red-600 border-red-200/50',
                      };

                      const statusTexts = {
                        PENDING_SUBMISSION: 'Chờ nộp báo cáo',
                        SUBMITTED: 'Đã nộp - Chờ duyệt',
                        APPROVED: 'Đồng ý (Thông qua)',
                        REJECTED: 'Bị từ chối (Cần sửa lại)',
                      };

                      return (
                        <div key={req.id} className="p-5 transition-colors hover:bg-slate-50/80 sm:p-6">
                          <div className="flex flex-col justify-between gap-4 md:flex-row">
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h3 className="text-lg font-semibold text-slate-900">{req.title}</h3>
                                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border", statusColors[req.status])}>
                                  {statusTexts[req.status]}
                                </span>
                              </div>
                              {req.description ? (
                                <p className="text-sm text-slate-600">{req.description}</p>
                              ) : null}
                              <p className="text-xs font-medium text-slate-400">
                                Gửi cho Mentor:{' '}
                                <span className="font-semibold text-slate-700">
                                  Mentor #{req.mentorId.substring(0, 8)}
                                </span>
                                {req.dueDate && ` • Hạn nộp: ${formatDisplayDate(req.dueDate)}`}
                                {` • Yêu cầu lúc: ${formatDisplayDate(req.createdAt)}`}
                              </p>

                              {req.menteeContent ? (
                                <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Nội dung đã nộp
                                  </span>
                                  <span className="whitespace-pre-wrap">{req.menteeContent}</span>
                                  {req.menteeAttachmentUrl && (
                                    <div className="pt-1.5">
                                      <a href={req.menteeAttachmentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline bg-primary/5 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1">
                                        <ExternalLink size={12} /> Link tài liệu đính kèm (Drive)
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ) : null}
                            </div>

                            <div className="flex flex-col gap-3 justify-center md:items-end">
                              {req.mentorFeedback && (
                                <div className="md:w-64 bg-indigo-50 border border-indigo-150 rounded-xl p-4 relative overflow-hidden">
                                  <div className="text-xs font-bold text-indigo-700 tracking-wider mb-1 flex items-center gap-1.5">
                                    <MessageSquare size={14} /> Nhận xét của Mentor
                                  </div>
                                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{req.mentorFeedback}</p>
                                </div>
                              )}
                              
                              {req.status === 'PENDING_SUBMISSION' && (
                                <button
                                  onClick={() => {
                                    setActiveReqId(req.id);
                                    setReportContent('');
                                    setReportAttachment('');
                                    setSubmitReportOpen(true);
                                  }}
                                  className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all self-start md:self-auto animate-pulse"
                                >
                                  Nộp báo cáo
                                </button>
                              )}

                              {req.status === 'REJECTED' && (
                                <button
                                  onClick={() => {
                                    setActiveReqId(req.id);
                                    setReportContent(req.menteeContent || '');
                                    setReportAttachment(req.menteeAttachmentUrl || '');
                                    setSubmitReportOpen(true);
                                  }}
                                  className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all self-start md:self-auto"
                                >
                                  Nộp lại báo cáo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <DataPagination
                  className="border-t border-slate-100 p-4"
                  page={academicPage}
                  size={academicSize}
                  total={academicTotal}
                  totalPages={academicTotalPages}
                  onPageChange={setAcademicPage}
                  onSizeChange={setAcademicSize}
                  disabled={academicLoading}
                />
              </>
            ) : (
              <>
                {reports.length === 0 ? (
                  <DashboardEmptyState icon={Flag} title="Bạn chưa nộp khiếu nại nào" />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {reports.map((report) => (
                      <div key={report.id} className="p-5 transition-colors hover:bg-slate-50/80 sm:p-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-3">
                              <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
                              {report.status === 'PENDING' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/50">
                                  <Clock size={14} /> Chờ duyệt
                                </span>
                              ) : report.status === 'REVIEWED' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200/50">
                                  <CheckCircle size={14} /> Đã chấm
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200/50">
                                  <X size={14} /> Làm lại
                                </span>
                              )}
                            </div>
                            <p className="mb-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                              Gửi cho Mentor:{' '}
                              <span className="font-semibold text-slate-800">{report.mentorName}</span> • Nộp lúc:{' '}
                              {formatDisplayDate(report.createdAt)}
                            </p>
                            <div className="border-l-2 border-slate-200 py-1 pl-4 text-sm text-slate-700 whitespace-pre-wrap">
                              {report.content}
                            </div>
                            
                            {report.attachmentUrl && (
                              <div className="mt-4">
                                <a href={report.attachmentUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg inline-block">
                                   🔗 Mở file đính kèm
                                </a>
                              </div>
                            )}
                          </div>

                          {report.status !== 'PENDING' && report.mentorFeedback && (
                            <div className="md:w-1/3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-4 md:mt-0 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                              <div className="text-xs font-bold text-blue-600 tracking-wider mb-2 flex items-center gap-1.5">
                                <MessageSquare size={14} /> Feedback
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.mentorFeedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <DataPagination
                  className="border-t border-slate-100 p-4"
                  page={page}
                  size={size}
                  total={total}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  onSizeChange={setSize}
                  disabled={loading}
                />
              </>
            )}
        </DashboardSurface>
      )}

      {/* Moderation Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden flex flex-col"
            >
               <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                    <Flag className="text-primary" aria-hidden /> Nộp báo cáo vi phạm
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full p-2 transition-colors hover:bg-slate-100">
                    <X size={20} className="text-slate-500" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4 p-6">
                 
                 <div className="space-y-1">
                    <label className={dashboardLabel}>Lộ trình học / Mentor (*)</label>
                    <select
                      value={selectedBookingId}
                      onChange={(e) => setSelectedBookingId(e.target.value)}
                      className={dashboardInput}
                    >
                      <option value="">-- Chọn lộ trình để báo cáo --</option>
                      {bookings?.map((b: any) => (
                        <option key={b.bookingId} value={b.bookingId}>
                          {b.packageLabel} - Mentor: {b.counterpartyLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                 <div className="space-y-1">
                   <label className={dashboardLabel}>Tiêu đề báo cáo (*)</label>
                   <input 
                     type="text" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className={dashboardInput}
                     placeholder="Ví dụ: Lỗi không thể liên hệ với Mentor"
                   />
                 </div>

                 <div className="space-y-1">
                   <label className={dashboardLabel}>Nội dung chi tiết (*)</label>
                   <textarea 
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     className={cn(dashboardInput, 'min-h-[120px] resize-none')}
                     rows={5}
                     placeholder="Mô tả cụ thể sự việc cần báo cáo cho Admin hỗ trợ..."
                   />
                 </div>

                 <div className="space-y-1">
                   <label className={dashboardLabel}>Link đính kèm minh chứng (Tùy chọn)</label>
                   <input 
                     type="text" 
                     value={attachmentUrl}
                     onChange={(e) => setAttachmentUrl(e.target.value)}
                     className={dashboardInput}
                     placeholder="Ví dụ: Link ảnh chụp màn hình minh chứng..."
                   />
                 </div>

                 {error ? (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
                       <AlertCircle size={16} aria-hidden /> {error}
                    </div>
                 ) : null}

                 <button 
                   type="submit"
                   disabled={submitting}
                   className={cn(dashboardBtnPrimary, 'mt-2 w-full py-3.5')}
                 >
                   {submitting && <LoadingSpinner size={16} />} Gửi báo cáo
                 </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Academic Submit Modal (User) */}
      <AnimatePresence>
        {submitReportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSubmitReportOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden flex flex-col"
            >
               <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                    <FileText className="text-primary" aria-hidden /> Nộp báo cáo học tập
                  </h2>
                  <button type="button" onClick={() => setSubmitReportOpen(false)} className="rounded-full p-2 transition-colors hover:bg-slate-100">
                    <X size={20} className="text-slate-500" />
                  </button>
               </div>

               <form onSubmit={handleSubmitAcademicReport} className="space-y-4 p-6">
                 
                 <div className="space-y-1">
                   <label className={dashboardLabel}>Nội dung báo cáo (*)</label>
                   <textarea 
                     required
                     value={reportContent}
                     onChange={(e) => setReportContent(e.target.value)}
                     className={cn(dashboardInput, 'min-h-[120px] resize-none')}
                     rows={5}
                     placeholder="Nhập nội dung tóm tắt buổi học, kết quả đạt được, khó khăn..."
                   />
                 </div>

                 <div className="space-y-1">
                   <label className={dashboardLabel}>Link đính kèm tài liệu (Google Drive, Github, v.v.)</label>
                   <input 
                     type="url" 
                     value={reportAttachment}
                     onChange={(e) => setReportAttachment(e.target.value)}
                     className={dashboardInput}
                     placeholder="https://drive.google.com/..."
                   />
                 </div>

                 <div className="flex justify-end gap-3 border-t border-slate-100 bg-white pt-4">
                    <button 
                      type="button"
                      onClick={() => setSubmitReportOpen(false)}
                      className={dashboardBtnSecondary}
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit"
                      disabled={submittingReport}
                      className={dashboardBtnPrimary}
                    >
                      {submittingReport && <LoadingSpinner size={16} />} Gửi báo cáo
                    </button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardPage>
  );
};
