'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  ShoppingBag, 
  Settings, 
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
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50 transition-all">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
            <Zap size={18} />
          </div>
          <span className="font-bold text-lg text-dark tracking-tight">Mentoree</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Quản lý
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
              activeTab === item.id 
                ? "bg-primary/10 text-primary font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-dark font-medium"
            )}
          >
            <item.icon size={18} className={cn(
              activeTab === item.id ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
            )} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
        
        <div className="pt-6">
          <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Hệ thống
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-dark hover:bg-gray-50 transition-colors font-medium">
            <Settings size={18} className="text-gray-400" />
            <span className="text-sm">Cài đặt</span>
          </button>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
             {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
