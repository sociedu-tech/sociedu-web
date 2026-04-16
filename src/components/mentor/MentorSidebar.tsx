'use client';

import React from 'react';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  ShoppingBag, 
  LogOut,
  User,
  Zap,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MentorSidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  user: any;
}

export const MentorSidebar = ({ activeTab, onTabChange, user }: MentorSidebarProps) => {
  const menuItems = [
    { id: 'packages', label: 'Dịch vụ', icon: LayoutDashboard },
    { id: 'schedule', label: 'Lịch dạy', icon: Calendar },
    { id: 'mentees', label: 'Học viên', icon: Users },
    { id: 'revenue', label: 'Doanh thu', icon: Wallet },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
    { id: 'reports', label: 'Chấm báo cáo', icon: FileText },
  ];

  return (
    <aside className="w-[15.5rem] bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50 transition-all">
      {/* Logo Area */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
            <Zap size={16} />
          </div>
          <span className="font-semibold text-base text-dark tracking-tight">Mentoree</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        <div className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          Quản lý
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors group text-sm",
              activeTab === item.id 
                ? "bg-primary/10 text-primary font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-dark font-medium"
            )}
          >
            <item.icon size={17} className={cn(
              activeTab === item.id ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
            )} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
             {user?.avatar ? (
                <Image src={user.avatar} alt="Avatar" className="w-full h-full object-cover" width={40} height={40} unoptimized />
             ) : (
                <User size={20} className="text-gray-500" />
             )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark truncate">{user?.name || 'Mentor'}</p>
            <p className="text-xs text-green-600 font-medium">Sẵn sàng</p>
          </div>
          <LogOut size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>
  );
};
