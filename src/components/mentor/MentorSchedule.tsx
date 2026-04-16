import React from 'react';
import Image from 'next/image';
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MentorSchedule = () => {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const sessions = [
    { id: 1, mentee: 'Nguyễn Văn A', time: '09:00 - 10:30', date: 'Hôm nay', type: 'Video Call', status: 'Sắp diễn ra' },
    { id: 2, mentee: 'Trần Thị B', time: '14:00 - 15:00', date: 'Hôm nay', type: 'Video Call', status: 'Sắp diễn ra' },
    { id: 3, mentee: 'Lê Văn C', time: '10:00 - 11:30', date: 'Ngày mai', type: 'Chat', status: 'Đã xác nhận' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-dark">Lịch trình & Lớp học</h2>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"><ChevronLeft size={16} /></button>
            <span className="font-medium text-sm text-dark px-2">Tháng 4, 2026</span>
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"><ChevronRight size={16} /></button>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Khung giờ rảnh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-dark flex items-center gap-2">
              <CalendarIcon size={18} className="text-gray-400" /> Lịch tháng
            </h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 tracking-wide pb-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const isToday = day === 15; // Set 15 as an arbitrary today for view
              const hasSession = [1, 2, 15, 18, 25].includes(day);

              return (
                <div key={i} className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-all cursor-pointer m-1",
                  isToday ? "bg-primary border-primary text-white shadow-md shadow-primary/20" : "bg-white border-gray-100 hover:border-primary/50 hover:bg-primary/5 text-dark",
                  hasSession && !isToday && "after:content-[''] after:absolute after:bottom-1.5 after:w-1.5 after:h-1.5 after:bg-orange-400 after:rounded-full"
                )}>
                  <span className="font-medium text-sm">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-dark text-base">Buổi học sắp tới</h3>
            <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-md text-xs font-bold">3 buổi</span>
          </div>

          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-primary/30 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
                      <Image src={`https://i.pravatar.cc/100?u=${session.mentee}`} alt={session.mentee} className="w-full h-full object-cover" width={40} height={40} unoptimized />
                    </div>
                    <div>
                      <h4 className="font-medium text-dark text-sm">{session.mentee}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{session.date}</p>
                    </div>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Video size={16} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    <Clock size={14} className="text-gray-400" />
                    {session.time}
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-medium",
                    session.status === 'Sắp diễn ra' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 bg-gray-50 text-gray-600 border border-dashed border-gray-300 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors mt-2">
            Xem tất cả lịch học
          </button>
        </div>
      </div>
    </div>
  );
};
