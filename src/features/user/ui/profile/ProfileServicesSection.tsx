import React from 'react';
import Link from 'next/link';
import { Clock, Layers, ArrowRight } from 'lucide-react';
import type { MentorPackageForBooking } from '@/services/profileService';

type Props = {
  mentorId: string;
  packages: MentorPackageForBooking[];
  isOwnProfile: boolean;
  mentorVerified?: boolean;
  compact?: boolean;
};

export function ProfileServicesSection({
  mentorId,
  packages,
  isOwnProfile,
  mentorVerified = true,
  compact,
}: Props) {
  if (packages.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
        <Layers className="mx-auto size-10 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-600">
          {isOwnProfile
            ? 'Bạn chưa tạo gói dịch vụ nào.'
            : 'Mentor chưa đăng gói dịch vụ.'}
        </p>
        {isOwnProfile ? (
          <Link
            href="/dashboard/packages"
            className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Quản lý gói dịch vụ →
          </Link>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Gói dịch vụ</h2>
          <p className="mt-1 text-sm text-slate-500">
            Chọn gói phù hợp — thanh toán an toàn qua VNPay sau khi đặt.
          </p>
        </div>
        {!isOwnProfile && !compact ? (
          <Link
            href={`/profile/${mentorId}/book`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Xem tất cả & đặt lịch
            <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <li
            key={pkg.versionId}
            className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-sm"
          >
            <h3 className="font-semibold text-slate-900">{pkg.title}</h3>
            {pkg.description ? (
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                {pkg.description}
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock className="size-3.5" />
                {pkg.duration}
              </span>
              <span className="text-base font-bold text-indigo-700">
                {pkg.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
            {!isOwnProfile && mentorVerified ? (
              <Link
                href={`/profile/${mentorId}/book?package=${encodeURIComponent(pkg.packageId)}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Chọn gói này
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
