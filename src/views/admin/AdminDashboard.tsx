'use client';

import React, { useState } from 'react';
import { Users, BarChart3, Package, UserCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAdminData } from '@/hooks/useAdminData';
import { AdminStats } from '@/components/dashboard/admin/AdminStats';
import { AdminMentorRequests } from '@/components/dashboard/admin/AdminMentorRequests';
import { AdminProductRequests } from '@/components/dashboard/admin/AdminProductRequests';
import { AdminUpdateRequests } from '@/components/dashboard/admin/AdminUpdateRequests';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPrimitives';

type Tab = 'stats' | 'users' | 'mentor-requests' | 'product-requests' | 'update-requests';

const tabLabel: Record<Tab, string> = {
  stats: 'Thống kê',
  'mentor-requests': 'Yêu cầu mentor',
  'product-requests': 'Đăng tài liệu',
  'update-requests': 'Cập nhật tài liệu',
  users: 'Người dùng',
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const { data, loading, error, refresh, approveMentor, approveProduct, approveUpdate } = useAdminData();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <LoadingSpinner size={48} label="Đang tải…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <ErrorMessage message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <DashboardPageHeader title="Quản trị hệ thống" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Mục quản trị">
            <TabBtn
              active={activeTab === 'stats'}
              onClick={() => setActiveTab('stats')}
              icon={<BarChart3 size={18} />}
              label="Thống kê"
            />
            <TabBtn
              active={activeTab === 'mentor-requests'}
              onClick={() => setActiveTab('mentor-requests')}
              icon={<UserCheck size={18} />}
              label="Yêu cầu mentor"
              badge={data.mentorRequests.length}
            />
            <TabBtn
              active={activeTab === 'product-requests'}
              onClick={() => setActiveTab('product-requests')}
              icon={<Package size={18} />}
              label="Đăng tài liệu"
              badge={data.productRequests.length}
            />
            <TabBtn
              active={activeTab === 'update-requests'}
              onClick={() => setActiveTab('update-requests')}
              icon={<RefreshCw size={18} />}
              label="Cập nhật tài liệu"
              badge={data.updateRequests.length}
            />
            <TabBtn
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              icon={<Users size={18} />}
              label="Người dùng"
            />
          </nav>
        </div>

        <div className="lg:col-span-9">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">{tabLabel[activeTab]}</h2>
            </div>

            <div className="overflow-x-auto">
              {activeTab === 'stats' && <AdminStats />}
              {activeTab === 'mentor-requests' && (
                <AdminMentorRequests requests={data.mentorRequests} onApprove={approveMentor} />
              )}
              {activeTab === 'product-requests' && (
                <AdminProductRequests requests={data.productRequests} onApprove={approveProduct} />
              )}
              {activeTab === 'update-requests' && (
                <AdminUpdateRequests requests={data.updateRequests} onApprove={approveUpdate} />
              )}
              {activeTab === 'users' && (
                <div className="px-6 py-16 text-center text-sm text-slate-500">Chưa có dữ liệu.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function TabBtn({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-w-[140px] shrink-0 items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors lg:min-w-0 lg:w-full',
        active ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
      )}
    >
      <span className="flex items-center gap-2.5">
        <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
        {label}
      </span>
      {badge != null && badge > 0 ? (
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
            active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700',
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
