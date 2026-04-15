'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, CheckCircle, Clock, X, MessageSquare, AlertCircle } from 'lucide-react';
import { reportService, ProgressReport } from '../services/reportService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const UserReportsPage = () => {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [mentorId, setMentorId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getMyReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorId || !title || !content) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await reportService.submitReport({
        mentorId: parseInt(mentorId),
        title,
        content,
        attachmentUrl
      });
      setIsModalOpen(false);
      resetForm();
      fetchReports();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi nộp báo cáo');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setMentorId('');
    setTitle('');
    setContent('');
    setAttachmentUrl('');
    setError(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F3F2EF]"><LoadingSpinner size={48} /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF] py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Báo cáo Mentees</h1>
            <p className="text-gray-500 mt-2 font-medium">Báo cáo tiến độ và nộp bài tập cho Mentor của bạn.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={20} /> Nộp báo cáo mới
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {reports.length === 0 ? (
             <div className="p-16 text-center text-gray-500">
               <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
               <p className="text-lg font-medium text-gray-600">Bạn chưa nộp báo cáo nào.</p>
               <p className="text-sm mt-1">Hãy nộp báo cáo để cập nhật tiến độ cho Mentor nhé!</p>
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
                         Gửi cho Mentor: <span className="font-bold text-dark">{report.mentorName}</span> • Nộp lúc: {new Date(report.createdAt).toLocaleDateString()}
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
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
        </div>

      </div>

      {/* Create Modal */}
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
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <FileText className="text-primary" /> Nộp báo cáo mới
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">ID Mentor (*)</label>
                   <input 
                     type="number" 
                     value={mentorId}
                     onChange={(e) => setMentorId(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white" 
                     placeholder="Ví dụ: 1"
                   />
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">Tiêu đề báo cáo (*)</label>
                   <input 
                     type="text" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white" 
                     placeholder="Ví dụ: Nộp bài tập Tuần 1"
                   />
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">Nội dung / Tiến độ (*)</label>
                   <textarea 
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white resize-none" 
                     rows={5}
                     placeholder="Mô tả những kết quả bạn đã đạt được, hoặc những vướng mắc cần hỗ trợ..."
                   />
                 </div>

                 <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">Link đính kèm (Tùy chọn)</label>
                   <input 
                     type="text" 
                     value={attachmentUrl}
                     onChange={(e) => setAttachmentUrl(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white" 
                     placeholder="Ví dụ: https://docs.google.com/..."
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
    </div>
  );
};
