'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
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
import { ProfileTabNav, type ProfileTabId } from '@/features/user/ui/profile/ProfileTabNav';
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
      <div className="flex min-h-[60vh] items-center justify-center bg-marketing-canvas">
        <LoadingSpinner size={48} label="Đang tải hồ sơ..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <ErrorMessage message={error || 'Người dùng không tồn tại'} onRetry={refetch} />
        <div className="mt-8 text-center">
          <Link
            href="/mentors"
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Quay lại danh sách mentor
          </Link>
        </div>
      </div>
    );
  }

  const mentorVerified = isMentor && isMentorVerified(user);
  const showFullMentorContent = !isMentor || isOwnProfile || mentorVerified;

  const tabs: { id: ProfileTabId; label: string }[] = [
    { id: 'about', label: 'Giới thiệu' },
    { id: 'experience', label: 'Kinh nghiệm' },
    ...(isMentor && showFullMentorContent ? [{ id: 'reviews' as const, label: 'Đánh giá' }] : []),
  ];

  return (
    <div className="min-h-screen bg-marketing-canvas pb-20">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        isMentor={isMentor}
        ratingSummary={ratingSummary}
        onConnect={handleConnect}
        onMessage={handleMessage}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:py-8 lg:px-8">
        {isMentor ? (
          <ProfileVerificationBanner
            user={user}
            isMentor={isMentor}
            isOwnProfile={isOwnProfile}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-8">
            {isMentor && showFullMentorContent ? (
              <ProfileServicesSection
                mentorId={id}
                packages={packages}
                isOwnProfile={isOwnProfile}
                mentorVerified={mentorVerified}
              />
            ) : null}

            <div className="space-y-4">
              <ProfileTabNav
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="lg:sticky lg:top-20 lg:z-10"
              />

              <div className="rounded-2xl border border-marketing-card-border bg-white p-5 shadow-sm sm:p-7">
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

          <div className="order-1 lg:order-2 lg:col-span-4">
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
