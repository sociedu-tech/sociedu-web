'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ReportModal } from '@/components/ReportModal';
import { useUserProfilePage } from '@/features/user/hooks';
import { ProfileHeader } from '@/features/user/ui/profile/ProfileHeader';
import { ProfileAboutTab } from '@/features/user/ui/profile/ProfileAboutTab';
import { ProfileExperienceTab } from '@/features/user/ui/profile/ProfileExperienceTab';
import { ProfileServicesSection } from '@/features/user/ui/profile/ProfileServicesSection';
import { ProfileReviewsSection } from '@/features/user/ui/profile/ProfileReviewsSection';
import { ProfileSidebar } from '@/features/user/ui/profile/ProfileSidebar';
import { ProfileVerificationBanner } from '@/features/user/ui/profile/ProfileVerificationBanner';
import { isMentorVerified } from '@/features/user/ui/profile/profileVerification';

export function UserProfilePage() {
  const {
    id,
    user,
    isMentor,
    packages,
    reviews,
    ratingSummary,
    loading,
    error,
    refetch,
    isReportModalOpen,
    setIsReportModalOpen,
    activeTab,
    setActiveTab,
    isOwnProfile,
    handleConnect,
    handleMessage,
  } = useUserProfilePage();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <LoadingSpinner size={48} label="Đang tải hồ sơ..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <ErrorMessage message={error || 'Người dùng không tồn tại'} onRetry={refetch} />
        <div className="mt-8 text-center">
          <Link href="/mentors" className="text-sm font-semibold text-indigo-600 hover:underline">
            Quay lại danh sách mentor
          </Link>
        </div>
      </div>
    );
  }

  const mentorVerified = isMentor && isMentorVerified(user);
  const showFullMentorContent = !isMentor || isOwnProfile || mentorVerified;

  const tabs = [
    { id: 'about' as const, label: 'Giới thiệu' },
    { id: 'experience' as const, label: 'Kinh nghiệm' },
    ...(isMentor && showFullMentorContent
      ? [{ id: 'reviews' as const, label: 'Đánh giá' }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          isMentor={isMentor}
          ratingSummary={ratingSummary}
          onConnect={handleConnect}
          onMessage={handleMessage}
        />

        {isMentor ? (
          <ProfileVerificationBanner
            user={user}
            isMentor={isMentor}
            isOwnProfile={isOwnProfile}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {isMentor && showFullMentorContent ? (
              <ProfileServicesSection
                mentorId={id}
                packages={packages}
                isOwnProfile={isOwnProfile}
                mentorVerified={mentorVerified}
              />
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
              <div className="flex border-b border-slate-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-5 py-3.5 text-sm font-semibold transition border-b-2 -mb-px',
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-5 sm:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && <ProfileAboutTab user={user} />}
                  {activeTab === 'experience' && <ProfileExperienceTab user={user} />}
                  {activeTab === 'reviews' && isMentor && showFullMentorContent ? (
                    <ProfileReviewsSection
                      reviews={reviews}
                      ratingAvg={ratingSummary.ratingAvg}
                      ratingCount={ratingSummary.ratingCount}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <ProfileSidebar
              user={user}
              isMentor={isMentor}
              isOwnProfile={isOwnProfile}
              mentorId={id}
              ratingSummary={ratingSummary}
              onConnect={handleConnect}
              onReport={() => setIsReportModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="mentor"
        targetName={user.name}
      />
    </div>
  );
}
