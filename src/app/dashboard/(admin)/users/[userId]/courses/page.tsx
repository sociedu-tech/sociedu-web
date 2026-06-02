'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ArrowLeft, Package, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { userService } from '@/services/userService';
import { adminBookingService } from '@/services/adminBookingService';
import type { User, AdminBookingRow } from '@/types';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { cn } from '@/lib/utils';
import { adminBookingStatusBadgeClass, adminBookingStatusLabel } from '@/features/admin/lib/adminBookingLabels';

export default function UserCoursesPage() {
  const params = useParams();
  const userId = String(params?.userId || '');
  const router = useRouter();
  const searchParams = useSearchParams();
  /** Role chính xác từ admin list, không phụ thuộc vào profile API */
  const roleFromQuery = searchParams.get('role') || '';

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch user profile
        const userProfile = await userService.getUserProfile(userId);
        if (!userProfile) {
          setError('Không tìm thấy tài khoản người dùng.');
          setLoading(false);
          return;
        }
        setUser(userProfile);

        // 2. Fetch all bookings and filter on client side strictly by ID
        const bookingsRes = await adminBookingService.list({ size: 1000 });
        
        // 3. Filter bookings on client side based on role (from query param)
        const effectiveRole = roleFromQuery || userProfile.role;
        const filtered = bookingsRes.items.filter((b) => {
          if (effectiveRole === 'mentor') {
            return b.mentorId === userId;
          } else {
            return b.learnerId === userId;
          }
        });
        setBookings(filtered);
      } catch (err) {
        console.error('Failed to load user courses:', err);
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, roleFromQuery]);

  if (loading) {
    return <PageLoadingState label="Đang tải danh sách khóa học..." />;
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || 'Đã có lỗi xảy ra.'}
        </div>
      </div>
    );
  }

  const isMentor = (roleFromQuery || user.role) === 'mentor';

  // Group bookings by course (packageTitle) for Mentor
  const bookingsByPackage = bookings.reduce((acc, booking) => {
    const key = booking.packageTitle || 'Khóa học khác';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {} as Record<string, AdminBookingRow[]>);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-2 px-4 sm:px-6 pt-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </button>
      </div>

      <DashboardSurface>
        <div className="p-4 sm:p-6 space-y-6">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center text-slate-500">
              <BookOpen className="size-12 text-slate-300" strokeWidth={1.25} />
              <p className="text-sm font-medium text-slate-700">Chưa có khóa học nào.</p>
              <p className="text-xs text-slate-400">Không tìm thấy thông tin đăng ký hoặc vận hành nào của tài khoản này.</p>
            </div>
          ) : isMentor ? (
            // Mentor View: Grouped by course (packageTitle)
            <div className="space-y-6">
              {Object.entries(bookingsByPackage).map(([packageTitle, list]) => (
                <div key={packageTitle} className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                        <Package size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-[15px]">{packageTitle}</h3>
                        <p className="text-xs text-slate-500">Tổng số: {list.length} học viên đăng ký</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-semibold tracking-wider text-slate-500">
                          <th className="px-5 py-3">Học viên</th>
                          <th className="px-5 py-3">Mã Booking</th>
                          <th className="px-5 py-3">Ngày đăng ký</th>
                          <th className="px-5 py-3">Thời lượng</th>
                          <th className="px-5 py-3">Trạng thái</th>
                          <th className="px-5 py-3 text-right">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {list.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <UserIcon className="size-4 text-slate-400" />
                                <Link
                                  href={`/profile/${booking.learnerId}`}
                                  className="font-medium text-primary hover:underline"
                                >
                                  {booking.learnerName}
                                </Link>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                              {booking.code}
                            </td>
                            <td className="px-5 py-3.5 text-xs text-slate-500">
                              {booking.createdAt}
                            </td>
                            <td className="px-5 py-3.5 text-xs text-slate-600">
                              {booking.durationMin} phút
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={cn(
                                  'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                                  adminBookingStatusBadgeClass(booking.status),
                                )}
                              >
                                {adminBookingStatusLabel(booking.status)}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Link
                                href={`/dashboard/bookings/${booking.id}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                              >
                                Xem tiến trình
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Student View: Simple Flat List of registered bookings/courses
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="min-w-full text-left text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/90 text-[10px] font-semibold tracking-wider text-slate-500">
                    <th className="px-5 py-3">Khóa học đăng ký</th>
                    <th className="px-5 py-3">Mentor hướng dẫn</th>
                    <th className="px-5 py-3">Mã Booking</th>
                    <th className="px-5 py-3">Ngày đăng ký</th>
                    <th className="px-5 py-3">Trạng thái</th>
                    <th className="px-5 py-3 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                            <Package size={16} />
                          </div>
                          <span className="font-semibold text-slate-900 text-[14px]">
                            {booking.packageTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        <Link
                          href={`/profile/${booking.mentorId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {booking.mentorName}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                        {booking.code}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {booking.createdAt}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                            adminBookingStatusBadgeClass(booking.status),
                          )}
                        >
                          {adminBookingStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/dashboard/bookings/${booking.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Xem tiến trình
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardSurface>
    </div>
  );
}
