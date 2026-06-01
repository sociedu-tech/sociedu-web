'use client';

import React, { useState } from 'react';
import { MentorPackages } from '@/features/dashboard/ui/mentor/MentorPackages';
import { useMentorData } from '@/features/mentor/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardSurface, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { useToast } from '@/context/ToastContext';

export const MentorPackagesPage = () => {
  const { data, loading, error, refresh, addPackage, removePackage, updatePackage, savePackages } = useMentorData('1');
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePackages();
      toast.success('Đã lưu các gói dịch vụ thành công!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi lưu gói dịch vụ');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Đang tải…" />;
  if (error) return <ErrorMessage message={error} onRetry={refresh} />;

  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Gói dịch vụ"
        description="Tạo, chỉnh sửa và lưu các gói mentor hiển thị cho học viên."
        layout="compact"
      />
      <DashboardSurface className="p-4 sm:p-6">
        <MentorPackages
          packages={data.packages || []}
          onAdd={addPackage}
          onRemove={removePackage}
          onUpdate={updatePackage}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </DashboardSurface>
    </div>
  );
};
