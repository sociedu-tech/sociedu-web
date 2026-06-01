'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, CheckCircle, Clock, X, MessageSquare, AlertCircle, Flag, ExternalLink } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DataPagination } from '@/components/ui/DataPagination';
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
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Báo cáo học tập &amp; vi phạm</h1>
            <p className="text-gray-500 mt-2 font-medium">Theo dõi tiến độ, gửi báo cáo cho Mentor hoặc báo cáo vi phạm lên Admin.</p>
          </div>
          {activeTab === 'moderation' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all hover:-translate-y-0.5"
            >
              <Plus size={20} /> Nộp khiếu nại vi phạm
            </button>
          )}
        </div>

        <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('academic')}
            className={cn(
              "py-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === 'academic'
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <FileText className="size-4" />
            Báo cáo học tập
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={cn(
              "py-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
              activeTab === 'moderation'
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <Flag className="size-4" />
            Khiếu nại vi phạm
          </button>
        </div>

        {currentLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <LoadingSpinner size={32} label="Đang tải dữ liệu…" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {activeTab === 'academic' ? (
              <>
                {academicReports.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600">Không có yêu cầu báo cáo nào.</p>
                    <p className="text-sm mt-1">Yêu cầu từ Mentor sẽ xuất hiện ở đây.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
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
                        <div key={req.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center flex-wrap gap-2.5">
                                <h3 className="text-xl font-bold text-dark">{req.title}</h3>
                                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border", statusColors[req.status])}>
                                  {statusTexts[req.status]}
                                </span>
                              </div>
                              {req.description && (
                                <p className="text-sm text-gray-655">{req.description}</p>
                              )}
                              <p className="text-xs font-medium text-gray-400">
                                Gửi cho Mentor: <span className="font-bold text-dark">Mentor #{req.mentorId.substring(0, 8)}</span>
                                {req.dueDate && ` • Hạn nộp: ${new Date(req.dueDate).toLocaleString('vi-VN')}`}
                                {` • Yêu cầu lúc: ${new Date(req.createdAt).toLocaleString('vi-VN')}`}
                              </p>

                              {req.menteeContent && (
                                <div className="mt-3 text-sm text-gray-700 bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                                  <div>
                                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block mb-1">Nội dung đã nộp:</span>
                                    <span className="whitespace-pre-wrap">{req.menteeContent}</span>
                                  </div>
                                  {req.menteeAttachmentUrl && (
                                    <div className="pt-1.5">
                                      <a href={req.menteeAttachmentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline bg-primary/5 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1">
                                        <ExternalLink size={12} /> Link tài liệu đính kèm (Drive)
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
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
                  className="border-t border-gray-100 p-4"
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
                  <div className="p-16 text-center text-gray-500">
                    <Flag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600">Bạn chưa nộp khiếu nại nào.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-dark">{report.title}</h3>
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
                            <p className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                               Gửi cho Mentor: <span className="font-bold text-dark">{report.mentorName}</span> • Nộp lúc:{' '}
                               {report.createdAt ? new Date(report.createdAt).toLocaleDateString('vi-VN') : '—'}
                            </p>
                            <div className="text-gray-700 whitespace-pre-wrap text-sm border-l-2 border-gray-200 pl-4 py-1">
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
                  className="border-t border-gray-100 p-4"
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
          </div>
        )}
      </div>

      {/* Moderation Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden flex flex-col"
            >
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <Flag className="text-primary" /> Nộp báo cáo vi phạm
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">ID Mentor (*)</label>
                   <input 
                     type="number" 
                     value={mentorId}
                     onChange={(e) => setMentorId(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white" 
                     placeholder="Ví dụ: 1"
                   />
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">Tiêu đề báo cáo (*)</label>
                   <input 
                     type="text" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white text-sm" 
                     placeholder="Ví dụ: Lỗi không thể liên hệ với Mentor"
                   />
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">Nội dung chi tiết (*)</label>
                   <textarea 
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white text-sm resize-none" 
                     rows={5}
                     placeholder="Mô tả cụ thể sự việc cần báo cáo cho Admin hỗ trợ..."
                   />
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">Link đính kèm minh chứng (Tùy chọn)</label>
                   <input 
                     type="text" 
                     value={attachmentUrl}
                     onChange={(e) => setAttachmentUrl(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white text-sm" 
                     placeholder="Ví dụ: Link ảnh chụp màn hình minh chứng..."
                   />
                 </div>

                 {error && (
                    <div className="p-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl flex items-center gap-2">
                       <AlertCircle size={16} /> {error}
                    </div>
                 )}

                 <button 
                   type="submit"
                   disabled={submitting}
                   className="w-full py-4 text-white font-bold bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
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
              className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
              onClick={() => setSubmitReportOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden flex flex-col"
            >
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <FileText className="text-primary" /> Nộp báo cáo học tập
                  </h2>
                  <button onClick={() => setSubmitReportOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
               </div>

               <form onSubmit={handleSubmitAcademicReport} className="p-6 space-y-4">
                 
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">Nội dung báo cáo (*)</label>
                   <textarea 
                     required
                     value={reportContent}
                     onChange={(e) => setReportContent(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white text-sm resize-none" 
                     rows={5}
                     placeholder="Nhập nội dung tóm tắt buổi học, kết quả đạt được, khó khăn..."
                   />
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500">Link đính kèm tài liệu (Google Drive, Github, v.v.)</label>
                   <input 
                     type="url" 
                     value={reportAttachment}
                     onChange={(e) => setReportAttachment(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white text-sm" 
                     placeholder="https://drive.google.com/..."
                   />
                 </div>

                 <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 bg-white">
                    <button 
                      type="button"
                      onClick={() => setSubmitReportOpen(false)}
                      className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit"
                      disabled={submittingReport}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {submittingReport && <LoadingSpinner size={16} />} Gửi báo cáo
                    </button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
