import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

// Hooks
import { useMentorData } from '../hooks/useMentorData';

// Sub-components
import { MentorStats } from '../components/mentor/MentorStats';
import { MentorPackages } from '../components/mentor/MentorPackages';

export const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'packages'>('packages');
  // Mocking mentor ID as '1' for demo
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size={48} label="Đang tải dữ liệu mentor..." />
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <ErrorMessage message={error} onRetry={refresh} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-airbnb-dark tracking-tighter">Quản lý Mentor</h1>
            <p className="text-airbnb-gray font-medium">Quản lý các gói dịch vụ của bạn.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('packages')}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all",
                activeTab === 'packages' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-airbnb-gray border border-gray-200"
              )}
            >
              Gói dịch vụ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <MentorPackages 
              packages={data.packages || []} 
              onAdd={addPackage}
              onRemove={removePackage}
              onUpdate={updatePackage}
              onSave={savePackages}
            />
          </div>
          <div className="lg:col-span-4">
            <MentorStats stats={data.stats} />
          </div>
        </div>
      </div>
    </div>
  );
};
