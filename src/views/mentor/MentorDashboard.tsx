'use client';

import React from 'react';
import { MentorSidebar } from '@/components/mentor/MentorSidebar';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export function MentorDashboard({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const currentPath = pathname.split('/').pop() || 'packages';
  const activeTab = ['packages', 'schedule', 'mentees', 'revenue', 'orders', 'reports'].includes(currentPath)
    ? currentPath
    : 'packages';

  const onTabChange = (tab: string) => {
    router.push(`/mentor/${tab}`);
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'packages':
        return 'Gói dịch vụ';
      case 'schedule':
        return 'Lịch dạy';
      case 'mentees':
        return 'Học viên';
      case 'revenue':
        return 'Doanh thu';
      case 'orders':
        return 'Đơn hàng';
      case 'reports':
        return 'Chấm báo cáo';
      default:
        return 'Tổng quan';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <MentorSidebar activeTab={activeTab} onTabChange={onTabChange} user={authUser} />

      <div className="flex-1 ml-[15.5rem] min-h-screen flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 md:px-6 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-dark">
            {getPageTitle(activeTab)}
          </h1>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-8 pr-3 py-1.5 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-52 md:w-60"
              />
            </div>

            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
