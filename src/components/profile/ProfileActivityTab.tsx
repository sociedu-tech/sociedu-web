import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export const ProfileActivityTab = () => {
  return (
    <motion.div 
      key="activity"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-airbnb-dark mb-4 flex items-center gap-2">
        <Activity size={24} className="text-blue-600" /> Hoạt động gần đây
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-airbnb-gray mb-2">Đã đăng một tài liệu mới • 2 ngày trước</p>
          <h4 className="font-bold text-airbnb-dark">"Giáo trình Giải tích 1 - Bách Khoa (Cập nhật 2024)"</h4>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-airbnb-gray mb-2">Đã hoàn thành buổi tư vấn • 5 ngày trước</p>
          <h4 className="font-bold text-airbnb-dark">"Review Code chuyên sâu cho sinh viên năm 3"</h4>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-airbnb-gray mb-2">Đã trả lời một đánh giá • 1 tuần trước</p>
          <p className="text-sm text-airbnb-dark italic">"Cảm ơn bạn đã ủng hộ tài liệu của mình!"</p>
        </div>
      </div>
    </motion.div>
  );
};
