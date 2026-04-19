'use client';

import React from 'react';
import { MentorPackages } from '@/components/dashboard/mentor/MentorPackages';
import { useMentorData } from '@/hooks/useMentorData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardSection } from '@/components/dashboard/DashboardPrimitives';

export const MentorPackagesPage = () => {
  const { data, loading, error, refresh, addPackage, removePackage, updatePackage, savePackages } = useMentorData('1');

  if (loading) return <LoadingSpinner label="Đang tải…" />;
  if (error) return <ErrorMessage message={error} onRetry={refresh} />;

  return (
    <DashboardSection title="Gói dịch vụ của bạn">
      <MentorPackages
        packages={data.packages || []}
        onAdd={addPackage}
        onRemove={removePackage}
        onUpdate={updatePackage}
        onSave={savePackages}
      />
    </DashboardSection>
  );
};
