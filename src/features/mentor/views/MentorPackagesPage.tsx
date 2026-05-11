'use client';

import React, { useState } from 'react';
import { MentorPackages } from '@/components/dashboard/mentor/MentorPackages';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardSurface, DashboardViewHeader } from '@/components/dashboard/DashboardPrimitives';
import { useMyPackages, useCreatePackage, useTogglePackage, useDeletePackage } from '@/hooks/useServicePackages';
import { toast } from 'sonner';

export const MentorPackagesPage = () => {
  const [showArchived, setShowArchived] = useState(false);
  
  const { data, isLoading, error, refetch } = useMyPackages({ 
    includeArchived: showArchived,
    size: 50 // fetch a decent amount for now, can add pagination later
  });
  
  const createMutation = useCreatePackage();
  const toggleMutation = useTogglePackage();
  const deleteMutation = useDeletePackage();

  const handleAddPackage = async () => {
    try {
      await createMutation.mutateAsync({
        name: 'Gói dịch vụ mới',
        description: 'Mô tả chi tiết về gói dịch vụ...',
        category: 'general'
      });
      toast.success('Đã tạo gói dịch vụ mới!');
    } catch (err: any) {
      toast.error('Lỗi khi tạo gói: ' + err.message);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast.success('Đã thay đổi trạng thái gói!');
    } catch (err: any) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn lưu trữ gói dịch vụ này?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Đã lưu trữ gói dịch vụ!');
    } catch (err: any) {
      toast.error('Lỗi khi lưu trữ');
    }
  };

  if (isLoading) return <LoadingSpinner label="Đang tải gói dịch vụ…" />;
  if (error) return <ErrorMessage message={(error as any)?.message || 'Lỗi tải dữ liệu'} onRetry={refetch} />;

  const packages = data?.content || [];
  
  // Filter out archived visually if backend returns them anyway (fallback)
  const displayPackages = packages.filter(p => p.isArchived === showArchived);

  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Gói dịch vụ"
        description="Tạo, chỉnh sửa các gói mentor hiển thị cho học viên."
        layout="compact"
      />
      
      <div className="flex items-center gap-4 px-1">
        <button
          onClick={() => setShowArchived(false)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${!showArchived ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Gói đang hoạt động
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${showArchived ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Đã lưu trữ
        </button>
      </div>

      <DashboardSurface className="p-4 sm:p-6">
        <MentorPackages
          packages={displayPackages}
          isArchivedView={showArchived}
          onAdd={handleAddPackage}
          onToggleActive={handleToggleActive}
          onArchive={handleArchive}
          isMutating={createMutation.isPending || toggleMutation.isPending || deleteMutation.isPending}
        />
      </DashboardSurface>
    </div>
  );
};
