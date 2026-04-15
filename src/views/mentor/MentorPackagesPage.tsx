'use client';

import React from 'react';
import { MentorPackages } from '../../components/mentor/MentorPackages';
import { MentorStats } from '../../components/mentor/MentorStats';
import { useMentorData } from '../../hooks/useMentorData';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

export const MentorPackagesPage = () => {
  const { 
    data, 
    loading, 
    error, 
    refresh,
    addPackage,
    removePackage,
    updatePackage,
    savePackages
  } = useMentorData('1');

  if (loading) return <LoadingSpinner label="Đang tải gói dịch vụ..." />;
  if (error) return <ErrorMessage message={error} onRetry={refresh} />;

  return (
    <div className="space-y-8">
      <MentorStats stats={data.stats} />
      <MentorPackages 
        packages={data.packages || []} 
        onAdd={addPackage}
        onRemove={removePackage}
        onUpdate={updatePackage}
        onSave={savePackages}
      />
    </div>
  );
};
