'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, CheckCircle, Clock, X, MessageSquare } from 'lucide-react';
import { reportService, ProgressReport, ReviewReportRequest } from '../../services/reportService';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const MentorReportsPage = () => {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'REVIEWED' | 'REJECTED'>('REVIEWED');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getAssignedReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedReport || !feedbackText.trim()) return;
    setReviewing(true);
    try {
      const payload: ReviewReportRequest = {
        status: reviewStatus,
        mentorFeedback: feedbackText
      };
      await reportService.reviewReport(selectedReport.id, payload);
      await fetchReports(); // refresh
      setSelectedReport(null);
      setFeedbackText('');
    } catch (err) {
      console.error("Lỗi khi chấm bài", err);
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><LoadingSpinner size={32} /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Chấm báo cáo & Bài tập</h1>
          <p className="text-gray-500 mt-1">Danh sách báo cáo tiến độ từ các Mentee của bạn</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Hiện chưa có báo cáo nào từ Mentee.</p>
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
                    {new Date(report.createdAt).toLocaleDateString('vi-VN')}
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
      </div>

      {/* Review Modal */}
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
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
                              checked={reviewStatus === 'REVIEWED'} 
                              onChange={() => setReviewStatus('REVIEWED')}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="font-medium text-dark">Duyệt & Đạt</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="status" 
                              checked={reviewStatus === 'REJECTED'} 
                              onChange={() => setReviewStatus('REJECTED')}
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
                      disabled={reviewing || !feedbackText.trim()}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {reviewing && <LoadingSpinner size={16} />} Gửi nhận xét
                    </button>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
