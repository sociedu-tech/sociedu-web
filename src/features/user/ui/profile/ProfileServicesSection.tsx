import React from 'react';
import Link from 'next/link';
import { Clock, Layers, ArrowRight, Package } from 'lucide-react';
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
      <section className="rounded-2xl border border-dashed border-marketing-border-dashed bg-white p-8 text-center shadow-sm">
        <Layers className="mx-auto size-10 text-marketing-fg-subtle" aria-hidden />
        <p className="mt-3 text-sm font-medium text-marketing-fg-muted">
          {isOwnProfile ? 'Bạn chưa tạo gói dịch vụ nào.' : 'Mentor chưa đăng gói dịch vụ.'}
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
    <section className="rounded-2xl border border-marketing-card-border bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <Package className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold text-marketing-fg">Gói dịch vụ</h2>
            <p className="mt-1 text-sm text-marketing-fg-muted">
              Chọn gói phù hợp — thanh toán an toàn qua VNPay sau khi đặt.
            </p>
          </div>
        </div>
        {!isOwnProfile && !compact ? (
          <Link
            href={`/profile/${mentorId}/book`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Xem tất cả & đặt lịch
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <li
            key={pkg.versionId}
            className="group flex flex-col rounded-2xl border border-marketing-border bg-marketing-canvas/50 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-md"
          >
            <h3 className="font-bold text-marketing-fg group-hover:text-indigo-800">{pkg.title}</h3>
            {pkg.description ? (
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-marketing-body">
                {pkg.description}
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-marketing-border pt-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-marketing-fg-muted">
                <Clock className="size-3.5" aria-hidden />
                {pkg.duration}
              </span>
              <span className="text-base font-bold text-indigo-700">
                {pkg.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
            {!isOwnProfile && mentorVerified ? (
              <Link
                href={`/profile/${mentorId}/book?package=${encodeURIComponent(pkg.packageId)}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
