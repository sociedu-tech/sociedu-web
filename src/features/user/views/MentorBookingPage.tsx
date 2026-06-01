'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Clock, CreditCard, Loader2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useMentorBookingPage } from '@/features/user/hooks/useMentorBookingPage';
import { ProfileVerificationBanner } from '@/features/user/ui/profile/ProfileVerificationBanner';

export function MentorBookingPage() {
  const {
    mentorId,
    mentorUser,
    mentorVerified,
    mentorName,
    packages,
    selectedVersionId,
    setSelectedVersionId,
    selectedPackage,
    loading,
    submitting,
    error,
    handleCheckout,
  } = useMentorBookingPage();

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <PageLoadingState label="Đang tải gói dịch vụ..." minHeight="min-h-[60vh]" />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-slate-50 pb-16">
      <div className="w-full px-4 py-8 sm:px-6">
        <Link
          href={`/profile/${mentorId}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Quay lại hồ sơ {mentorName}
        </Link>

        {mentorUser ? (
          <ProfileVerificationBanner
            user={mentorUser}
            isMentor
            isOwnProfile={false}
            className="mb-6"
          />
        ) : null}

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{mentorName}</h1>
          {mentorVerified ? (
            <p className="mt-2 text-sm text-slate-600">
              Chọn gói dịch vụ, xác nhận và thanh toán an toàn. Sau khi thanh toán thành công, buổi học
              sẽ được tạo trên hệ thống.
            </p>
          ) : null}
        </header>

        {error && (packages.length === 0 || !mentorVerified) ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {error ? (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            ) : null}

            <section className="space-y-3" aria-label="Chọn gói dịch vụ">
              <h2 className="text-sm font-bold text-slate-700">1. Chọn gói</h2>
              {packages.length === 0 ? (
                <p className="text-sm text-slate-500">Không có gói khả dụng.</p>
              ) : (
                <ul className="space-y-3">
                  {packages.map((pkg) => {
                    const selected = pkg.versionId === selectedVersionId;
                    return (
                      <li key={pkg.versionId}>
                        <button
                          type="button"
                          onClick={() => setSelectedVersionId(pkg.versionId)}
                          className={cn(
                            'w-full rounded-2xl border p-4 text-left transition',
                            selected
                              ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                              : 'border-slate-200 bg-white hover:border-indigo-200',
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{pkg.title}</p>
                              {pkg.description ? (
                                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                  {pkg.description}
                                </p>
                              ) : null}
                              <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="size-3.5" />
                                {pkg.duration}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-indigo-700">
                                {pkg.price.toLocaleString('vi-VN')}đ
                              </p>
                              {selected ? (
                                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                                  <Check className="size-3.5" />
                                  Đã chọn
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {selectedPackage ? (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-700">2. Xác nhận & thanh toán</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Gói</dt>
                    <dd className="font-medium text-slate-900">{selectedPackage.title}</dd>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <dt className="font-semibold text-slate-800">Tổng thanh toán</dt>
                    <dd className="text-lg font-bold text-indigo-700">
                      {selectedPackage.price.toLocaleString('vi-VN')}đ
                    </dd>
                  </div>
                </dl>
                <ul className="mt-4 space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2">
                    <Shield className="size-3.5 shrink-0 text-emerald-600" />
                    Thanh toán bảo mật qua cổng thanh toán
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCard className="size-3.5 shrink-0 text-slate-400" />
                    Bạn sẽ được chuyển tới cổng thanh toán sau khi bấm nút bên dưới
                  </li>
                </ul>
                <button
                  type="button"
                  disabled={submitting || !selectedVersionId}
                  onClick={() => void handleCheckout()}
                  aria-busy={submitting}
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-4 shrink-0" aria-hidden />
                      <span>Thanh toán</span>
                    </>
                  )}
                </button>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
