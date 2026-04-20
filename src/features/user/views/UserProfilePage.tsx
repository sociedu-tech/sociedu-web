'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ReportModal } from '@/components/ReportModal';
import { AnimatePresence } from 'motion/react';

import { useUserProfilePage } from '@/features/user/hooks';

// Sub-components
import { ProfileHeader } from '@/features/user/ui/profile/ProfileHeader';
import { ProfileAboutTab } from '@/features/user/ui/profile/ProfileAboutTab';
import { ProfileExperienceTab } from '@/features/user/ui/profile/ProfileExperienceTab';
import { ProfileActivityTab } from '@/features/user/ui/profile/ProfileActivityTab';
import { ProfileRecommendations } from '@/features/user/ui/profile/ProfileRecommendations';
import { ProfileProjects } from '@/features/user/ui/profile/ProfileProjects';
import { ProfileStats } from '@/features/user/ui/profile/ProfileStats';
import { ProfileContactModal } from '@/features/user/ui/profile/ProfileContactModal';

export function UserProfilePage() {
  const {
    id,
    user,
    loading,
    error,
    refetch,
    isReportModalOpen,
    setIsReportModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    activeTab,
    setActiveTab,
    userProducts,
    isOwnProfile,
    handleContactClick,
  } = useUserProfilePage();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <LoadingSpinner size={48} label="Đang tải hồ sơ..." />
    </div>
  );

  if (error || !user) return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <ErrorMessage
        message={error || "Người dùng không tồn tại"}
        onRetry={refetch}
      />
      <div className="mt-8 text-center">
        <Link href="/" className="text-airbnb-red font-bold hover:underline">Quay lại trang chủ</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-page pb-12">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-0 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">

            <ProfileHeader
              user={user}
              isOwnProfile={isOwnProfile}
              onContactClick={handleContactClick}
            />

            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(['about', 'experience', 'activity'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-5 py-3 text-sm font-bold transition-all border-b-2",
                      activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-airbnb-gray hover:text-airbnb-dark"
                    )}
                  >
                    {tab === 'about' ? 'Giới thiệu' : tab === 'experience' ? 'Kinh nghiệm & Học vấn' : 'Hoạt động'}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && <ProfileAboutTab user={user} />}
                  {activeTab === 'experience' && <ProfileExperienceTab user={user} />}
                  {activeTab === 'activity' && <ProfileActivityTab />}
                </AnimatePresence>
              </div>
            </div>

            <ProfileRecommendations user={user} isOwnProfile={isOwnProfile} />
            <ProfileProjects user={user} />

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-6">
              <ProfileStats user={user} userProducts={userProducts} />

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-airbnb-gray hover:text-airbnb-dark transition-colors bg-white border border-gray-200 rounded-xl">
                  <Share2 size={16} /> Chia sẻ hồ sơ
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-airbnb-gray hover:text-airbnb-red transition-colors bg-white border border-gray-200 rounded-xl"
                >
                  <AlertTriangle size={16} /> Báo cáo vi phạm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        user={user}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="mentor"
        targetName={user.name}
      />
    </div>
  );
};
