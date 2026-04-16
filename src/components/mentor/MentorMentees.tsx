import React from 'react';
import Image from 'next/image';
import { Search, UserPlus, Mail, MessageSquare, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MentorMentees = () => {
  const mentees = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@edu.vn', university: 'ĐH Bách Khoa', major: 'IT', status: 'Đang học', sessions: 8, lastActive: '2 giờ trước' },
    { id: 2, name: 'Trần Thị B', email: 'thib@edu.vn', university: 'ĐH Kinh Tế', major: 'Marketing', status: 'Đang học', sessions: 5, lastActive: '1 ngày trước' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@edu.vn', university: 'ĐH FPT', major: 'Design', status: 'Hoàn thành', sessions: 12, lastActive: '3 ngày trước' },
    { id: 4, name: 'Phạm Minh D', email: 'minhd@edu.vn', university: 'ĐH Sư Phạm', major: 'Math', status: 'Tạm dừng', sessions: 2, lastActive: '1 tuần trước' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-dark">Danh sách Học viên</h2>
        <div className="flex gap-3 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm email, tên..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
           </div>
           <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all flex items-center gap-2 text-sm font-medium shadow-sm">
              <UserPlus size={16} /> <span className="hidden sm:inline">Thêm mới</span>
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Học viên</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Học vấn</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Số buổi</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hoạt động</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mentees.map(mentee => (
                <tr key={mentee.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <Image src={`https://i.pravatar.cc/100?u=${mentee.id}`} alt={mentee.name} className="w-full h-full object-cover" width={40} height={40} unoptimized />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark">{mentee.name}</p>
                        <p className="text-xs text-gray-500">{mentee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-dark">{mentee.university}</p>
                    <p className="text-xs text-gray-500">{mentee.major}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5",
                      mentee.status === 'Đang học' ? "bg-blue-50 text-blue-700" :
                      mentee.status === 'Hoàn thành' ? "bg-green-50 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {mentee.status === 'Hoàn thành' && <CheckCircle2 size={12} />}
                      {mentee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-dark">{mentee.sessions}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500">{mentee.lastActive}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 text-gray-500 hover:text-primary rounded-lg transition-all shadow-sm" title="Gắn tin nhắn">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 text-gray-500 hover:text-primary rounded-lg transition-all shadow-sm" title="Gửi email">
                        <Mail size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 text-gray-500 hover:text-dark rounded-lg transition-all shadow-sm">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
