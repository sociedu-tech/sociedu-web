import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'document' | 'mentor' | 'review';
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetType, targetName }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-airbnb-dark flex items-center gap-2">
            <AlertTriangle className="text-airbnb-red w-5 h-5" /> Báo cáo vi phạm
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <p className="text-sm text-airbnb-gray">
                  Bạn đang báo cáo <span className="font-bold text-airbnb-dark">{targetType === 'document' ? 'tài liệu' : 'người dùng'}</span>: <span className="font-bold text-airbnb-red">{targetName}</span>
                </p>

                <div>
                  <label className="block text-xs font-bold tracking-widest text-airbnb-gray mb-2">Lý do báo cáo</label>
                  <select 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-airbnb-red/20 outline-none transition-all"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="">Chọn lý do...</option>
                    <option value="spam">Nội dung rác / Spam</option>
                    <option value="copyright">Vi phạm bản quyền</option>
                    <option value="fake">Thông tin giả mạo</option>
                    <option value="toxic">Ngôn từ gây thù ghét / Quấy rối</option>
                    <option value="other">Lý do khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest text-airbnb-gray mb-2">Mô tả chi tiết</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Vui lòng cung cấp thêm thông tin để chúng tôi xử lý nhanh hơn..."
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-airbnb-red/20 outline-none transition-all resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-airbnb-red text-white rounded-2xl font-bold hover:bg-airbnb-red/90 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Gửi báo cáo
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold text-airbnb-dark mb-2">Đã gửi báo cáo</h4>
                <p className="text-airbnb-gray mb-8">Cảm ơn bạn đã giúp cộng đồng trở nên tốt đẹp hơn. Chúng tôi sẽ xem xét và xử lý trong vòng 24h.</p>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-airbnb-dark text-white rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Đóng
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
