'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, CheckCircle, Clock, X, MessageSquare, Flag, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DataPagination } from '@/components/ui/DataPagination';
import { DashboardSurface, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { useMentorReportsPage } from '@/features/mentor/hooks';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { sessionReportService, type SessionReportRequest } from '@/services/sessionReportService';

export const MentorReportsPage = () => {
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
    selectedReport,
    setSelectedReport,
    feedbackText,
    setFeedbackText,
    reviewStatus: modReviewStatus,
    setReviewStatus: setModReviewStatus,
    reviewing: modReviewing,
    handleReview,
  } = useMentorReportsPage();

  const [activeTab, setActiveTab] = React.useState<'academic' | 'moderation'>('academic');
  
  // Academic tab states
  const [academicReports, setAcademicReports] = React.useState<SessionReportRequest[]>([]);
  const [academicLoading, setAcademicLoading] = React.useState(false);
  const [academicPage, setAcademicPage] = React.useState(0);
  const [academicSize, setAcademicSize] = React.useState(20);
  const [academicTotal, setAcademicTotal] = React.useState(0);
  const [academicTotalPages, setAcademicTotalPages] = React.useState(0);

  // Review state
  const [reviewReq, setReviewReq] = React.useState<SessionReportRequest | null>(null);
  const [reviewStatus, setReviewStatus] = React.useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewFeedback, setReviewFeedback] = React.useState('');
  const [reviewing, setReviewing] = React.useState(false);
  const [reviewReportOpen, setReviewReportOpen] = React.useState(false);

  const fetchAcademicReports = React.useCallback(async () => {
    setAcademicLoading(true);
    try {
      const res = await sessionReportService.listForMentor(academicPage, academicSize);
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

  const handleReviewAcademic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewReq) return;
    setReviewing(true);
    try {
      await sessionReportService.review(reviewReq.id, {
        status: reviewStatus,
        feedback: reviewFeedback.trim() || undefined,
      });
      toast.success('Duyệt báo cáo thành công.');
      setReviewReq(null);
      setReviewFeedback('');
      setReviewReportOpen(false);
      fetchAcademicReports();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không phê duyệt được báo cáo.');
    } finally {
      setReviewing(false);
    }
  };

  const currentLoading = activeTab === 'moderation' ? loading : academicLoading;

  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Báo cáo học tập &amp; vi phạm"
        description="Quản lý và chấm báo cáo học tập của mentee, theo dõi khiếu nại."
        layout="compact"
      />

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
          Báo cáo vi phạm
        </button>
      </div>

      {currentLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <LoadingSpinner size={32} label="Đang tải dữ liệu…" />
        </div>
      ) : (
        <DashboardSurface className="overflow-hidden">
          {activeTab === 'academic' ? (
            <>
              {academicReports.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Hiện chưa có yêu cầu báo cáo học tập nào.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-500 tracking-wider">
                      <th className="px-6 py-4">Học viên</th>
                      <th className="px-6 py-4">Yêu cầu báo cáo</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Cập nhật lúc</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {academicReports.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-dark">
                          Học viên #{req.menteeId.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]" title={req.title}>
                          {req.title}
                        </td>
                        <td className="px-6 py-4">
                          {req.status === 'PENDING_SUBMISSION' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/50">
                              Chờ nộp
                            </span>
                          ) : req.status === 'SUBMITTED' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200/50 animate-pulse">
                              Chờ duyệt
                            </span>
                          ) : req.status === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                              Đồng ý
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/50">
                              Từ chối
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {req.updatedAt ? new Date(req.updatedAt).toLocaleString('vi-VN') : '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {req.status === 'SUBMITTED' ? (
                            <button
                              onClick={() => {
                                setReviewReq(req);
                                setReviewStatus('APPROVED');
                                setReviewFeedback(req.mentorFeedback || '');
                                setReviewReportOpen(true);
                              }}
                              className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200/50 rounded-lg transition-colors"
                            >
                              Chấm bài
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setReviewReq(req);
                                setReviewStatus(req.status === 'REJECTED' ? 'REJECTED' : 'APPROVED');
                                setReviewFeedback(req.mentorFeedback || '');
                                setReviewReportOpen(true);
                              }}
                              className="px-4 py-2 text-sm font-bold text-gray-650 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                            >
                              Xem lại
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <div className="p-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Hiện chưa có báo cáo vi phạm nào.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-500 tracking-wider">
                      <th className="px-6 py-4">Mentee</th>
                      <th className="px-6 py-4">Tiêu đề báo cáo</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Ngày nộp</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-dark">{report.menteeName || `ID: ${report.menteeId}`}</td>
                        <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{report.title}</td>
                        <td className="px-6 py-4">
                          {report.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/50">
                              <Clock size={14} /> Chờ duyệt
                            </span>
                          ) : report.status === 'REVIEWED' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200/50">
                              <CheckCircle size={14} /> Đã chấm
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200/50">
                              <X size={14} /> Làm lại
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleDateString('vi-VN')
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                          >
                            {report.status === 'PENDING' ? "Chấm bài" : "Xem lại"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        </DashboardSurface>
      )}

      {/* Moderation Review Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
              onClick={() => setSelectedReport(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <FileText className="text-primary" /> {selectedReport.title}
                  </h2>
                  <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
               </div>

               <div className="p-6 overflow-y-auto space-y-6">
                 <div>
                   <div className="text-sm font-bold text-gray-400 tracking-wider mb-2">Mentee báo cáo</div>
                   <div className="p-4 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-wrap border border-gray-100">
                     {selectedReport.content}
                   </div>
                 </div>

                 {selectedReport.attachmentUrl && (
                    <div>
                      <div className="text-sm font-bold text-gray-400 tracking-wider mb-2">File đính kèm</div>
                      <a href={selectedReport.attachmentUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium flex items-center gap-2">
                         🔗 {selectedReport.attachmentUrl}
                      </a>
                    </div>
                 )}

                 <hr className="border-gray-100" />

                 <div>
                   <div className="text-sm font-bold text-primary tracking-wider mb-2 flex items-center gap-2">
                     <MessageSquare size={16} /> Lời nhận xét
                   </div>
                   {selectedReport.status !== 'PENDING' ? (
                       <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-dark whitespace-pre-wrap">
                         {selectedReport.mentorFeedback}
                       </div>
                   ) : (
                     <div className="space-y-4">
                       <textarea 
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Nhập lời khuyên, nhận xét hoặc đánh giá của bạn cho Mentee..."
                          rows={4}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                       />
                       <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="status" 
                              checked={modReviewStatus === 'REVIEWED'} 
                              onChange={() => setModReviewStatus('REVIEWED')}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="font-medium text-dark">Duyệt &amp; Đạt</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="status" 
                              checked={modReviewStatus === 'REJECTED'} 
                              onChange={() => setModReviewStatus('REJECTED')}
                              className="w-4 h-4 text-red-500"
                            />
                            <span className="font-medium text-red-600">Yêu cầu làm lại</span>
                          </label>
                       </div>
                     </div>
                   )}
                 </div>
               </div>

               {selectedReport.status === 'PENDING' && (
                 <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button 
                      onClick={() => setSelectedReport(null)}
                      className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      onClick={handleReview}
                      disabled={modReviewing || !feedbackText.trim()}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {modReviewing && <LoadingSpinner size={16} />} Gửi nhận xét
                    </button>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Academic Review/View Modal */}
      {reviewReportOpen && reviewReq ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in" onClick={() => setReviewReportOpen(false)} />
          <form
            onSubmit={(e) => void handleReviewAcademic(e)}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-semibold text-slate-900">Xem &amp; Duyệt báo cáo học tập</h3>
              <button
                type="button"
                onClick={() => setReviewReportOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-150 space-y-3">
              <div>
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Yêu cầu</span>
                <span className="text-sm font-semibold text-slate-800">{reviewReq.title}</span>
              </div>
              <div>
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Nội dung học viên nộp</span>
                <p className="text-xs text-slate-700 whitespace-pre-wrap font-medium">{reviewReq.menteeContent || '— Chưa nộp —'}</p>
              </div>
              {reviewReq.menteeAttachmentUrl && (
                <div>
                  <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Tài liệu đính kèm</span>
                  <a
                    href={reviewReq.menteeAttachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-0.5"
                  >
                    <ExternalLink className="size-3.5" />
                    Mở link tài liệu đính kèm (Drive)
                  </a>
                </div>
              )}
            </div>

            {reviewReq.status === 'SUBMITTED' ? (
              <>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá / Phán quyết</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewStatus('APPROVED')}
                      className={cn(
                        'rounded-xl py-2.5 text-xs font-bold border transition flex items-center justify-center gap-1.5',
                        reviewStatus === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-850 ring-2 ring-emerald-100'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600',
                      )}
                    >
                      <CheckCircle2 className="size-4" />
                      Đồng ý (Thông qua)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewStatus('REJECTED')}
                      className={cn(
                        'rounded-xl py-2.5 text-xs font-bold border transition flex items-center justify-center gap-1.5',
                        reviewStatus === 'REJECTED'
                          ? 'bg-rose-50 border-rose-205 text-rose-850 ring-2 ring-rose-100'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600',
                      )}
                    >
                      <XCircle className="size-4" />
                      Từ chối (Cần chỉnh sửa)
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gợi ý / Nhận xét / Lý do từ chối</label>
                  <textarea
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Nhận xét của bạn về báo cáo này để học viên biết..."
                    className="w-full h-24 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                    onClick={() => setReviewReportOpen(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={reviewing}
                    className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 transition"
                  >
                    {reviewing ? 'Đang gửi…' : 'Lưu phán quyết'}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3 pt-2">
                {reviewReq.mentorFeedback && (
                  <div>
                    <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Phản hồi của bạn</span>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl">{reviewReq.mentorFeedback}</p>
                  </div>
                )}
                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    className="rounded-xl bg-slate-100 px-5 py-2 text-sm font-bold text-slate-750 hover:bg-slate-200 transition-colors"
                    onClick={() => setReviewReportOpen(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : null}
    </div>
  );
};
