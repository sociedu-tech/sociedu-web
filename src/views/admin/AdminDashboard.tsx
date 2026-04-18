'use client';

import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Package, 
  UserCheck,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Hooks
import { useAdminData } from '@/hooks/useAdminData';

// Sub-components
import { AdminStats } from '@/components/dashboard/admin/AdminStats';
import { AdminMentorRequests } from '@/components/dashboard/admin/AdminMentorRequests';
import { AdminProductRequests } from '@/components/dashboard/admin/AdminProductRequests';
import { AdminUpdateRequests } from '@/components/dashboard/admin/AdminUpdateRequests';

type Tab = 'stats' | 'users' | 'mentor-requests' | 'product-requests' | 'update-requests';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const { 
    data, 
    loading, 
    error, 
    refresh, 
    approveMentor, 
    approveProduct, 
    approveUpdate 
  } = useAdminData();

  if (loading) return (
    <div className="flex min-h-[40vh] items-center justify-center py-16">
      <LoadingSpinner size={48} label="Đang tải dữ liệu quản trị..." />
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <ErrorMessage 
        message={error} 
        onRetry={refresh} 
      />
    </div>
  );

  return (
    <div className="pb-8">
      <div className="mx-auto max-w-7xl px-0 py-2 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-airbnb-dark tracking-tighter">Quản trị hệ thống</h1>
            <p className="text-airbnb-gray font-medium">Phê duyệt yêu cầu và quản lý người dùng.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-airbnb-gray hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Search size={16} /> Tìm kiếm
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-airbnb-gray hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={16} /> Lọc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <button 
                onClick={() => setActiveTab('stats')}
                className={cn(
                  "shrink-0 lg:w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                  activeTab === 'stats' ? "bg-blue-600 text-white" : "text-airbnb-gray hover:bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} /> Thống kê hệ thống
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('mentor-requests')}
                className={cn(
                  "shrink-0 lg:w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                  activeTab === 'mentor-requests' ? "bg-blue-600 text-white" : "text-airbnb-gray hover:bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <UserCheck size={18} /> Yêu cầu Mentor
                </div>
                {data.mentorRequests.length > 0 && (
                  <span className={cn("ml-2 text-[10px] px-2 py-0.5 rounded-full", activeTab === 'mentor-requests' ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600")}>
                    {data.mentorRequests.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('product-requests')}
                className={cn(
                  "shrink-0 lg:w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                  activeTab === 'product-requests' ? "bg-blue-600 text-white" : "text-airbnb-gray hover:bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Package size={18} /> Yêu cầu đăng tài liệu
                </div>
                {data.productRequests.length > 0 && (
                  <span className={cn("ml-2 text-[10px] px-2 py-0.5 rounded-full", activeTab === 'product-requests' ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600")}>
                    {data.productRequests.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('update-requests')}
                className={cn(
                  "shrink-0 lg:w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                  activeTab === 'update-requests' ? "bg-blue-600 text-white" : "text-airbnb-gray hover:bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <RefreshCw size={18} /> Yêu cầu cập nhật
                </div>
                {data.updateRequests.length > 0 && (
                  <span className={cn("ml-2 text-[10px] px-2 py-0.5 rounded-full", activeTab === 'update-requests' ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600")}>
                    {data.updateRequests.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={cn(
                  "shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                  activeTab === 'users' ? "bg-blue-600 text-white" : "text-airbnb-gray hover:bg-white"
                )}
              >
                <Users size={18} /> Quản lý người dùng
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-black text-airbnb-dark tracking-tight">
                  {activeTab === 'stats' && "Thống kê tổng quan"}
                  {activeTab === 'mentor-requests' && "Danh sách yêu cầu Mentor"}
                  {activeTab === 'product-requests' && "Danh sách yêu cầu đăng tài liệu"}
                  {activeTab === 'update-requests' && "Danh sách yêu cầu cập nhật tài liệu"}
                  {activeTab === 'users' && "Tất cả người dùng"}
                </h2>
              </div>

              <div className="overflow-x-auto">
                {activeTab === 'stats' && <AdminStats />}
                {activeTab === 'mentor-requests' && (
                  <AdminMentorRequests 
                    requests={data.mentorRequests} 
                    onApprove={approveMentor} 
                  />
                )}
                {activeTab === 'product-requests' && (
                  <AdminProductRequests 
                    requests={data.productRequests} 
                    onApprove={approveProduct} 
                  />
                )}
                {activeTab === 'update-requests' && (
                  <AdminUpdateRequests 
                    requests={data.updateRequests} 
                    onApprove={approveUpdate} 
                  />
                )}
                {activeTab === 'users' && (
                  <div className="px-6 py-12 text-center text-airbnb-gray italic">Đang phát triển...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
