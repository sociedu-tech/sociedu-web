'use client';

import React from 'react';
import { MentorPackages } from '@/components/dashboard/mentor/MentorPackages';
import { useMentorData } from '@/hooks/useMentorData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardSurface, DashboardViewHeader } from '@/components/dashboard/DashboardPrimitives';

export const MentorPackagesPage = () => {
  const { data, loading, error, refresh, addPackage, removePackage, updatePackage, savePackages } = useMentorData('1');

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
          onSave={savePackages}
        />
      </DashboardSurface>
    </div>
  );
};
