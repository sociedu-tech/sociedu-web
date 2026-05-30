'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { orderService } from '@/services/orderService';
import type { MentorPackageForBooking } from '@/services/profileService';
import type { User } from '@/types';
import { isMentorVerified } from '@/features/user/ui/profile/profileVerification';

export function useMentorBookingPage() {
  const params = useParams();
  const mentorId = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [mentorUser, setMentorUser] = useState<User | null>(null);
  const [mentorName, setMentorName] = useState('');
  const [packages, setPackages] = useState<MentorPackageForBooking[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await profileService.getPublicProfile(mentorId);
        if (cancelled) return;
        setMentorUser(profile.user);
        setMentorName(profile.user.name);

        if (!profile.isMentor) {
          setError('Người dùng này không phải mentor.');
          setPackages([]);
        } else if (!isMentorVerified(profile.user)) {
          setError('Mentor chưa được xác thực. Vui lòng quay lại khi trạng thái là Đã xác thực.');
          setPackages([]);
        } else if (profile.packages.length === 0) {
          setError('Mentor chưa có gói dịch vụ để đặt.');
          setPackages([]);
        } else {
          setPackages(profile.packages);
        }
        const preselect = searchParams.get('package');
        const match = preselect
          ? profile.packages.find((p) => p.packageId === preselect || p.id === preselect)
          : profile.packages[0];
        setSelectedVersionId(match?.versionId ?? profile.packages[0]?.versionId ?? null);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không tải được thông tin đặt lịch');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mentorId, searchParams]);

  const selectedPackage = packages.find((p) => p.versionId === selectedVersionId) ?? null;

  const handleCheckout = useCallback(async () => {
    if (!selectedVersionId) {
      setError('Vui lòng chọn gói dịch vụ');
      return;
    }
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(`/profile/${mentorId}/book`)}`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const order = (await orderService.checkout({
        servicePackageVersionId: selectedVersionId,
        orderInfo: selectedPackage
          ? `Đặt gói: ${selectedPackage.title} — ${mentorName}`
          : undefined,
      })) as {
        id?: string;
        paymentUrl?: string;
        mockPayment?: boolean;
      };

      const url = order?.paymentUrl;
      if (order?.mockPayment && order.id) {
        router.push(
          `/payment-result?status=success&orderId=${encodeURIComponent(order.id)}&code=00&mock=true`,
        );
        return;
      }
      if (url) {
        if (url.includes('/payment-result')) {
          const path = url.startsWith('http') ? new URL(url).pathname + new URL(url).search : url;
          router.push(path);
          return;
        }
        window.location.href = url;
        return;
      }
      setError('Không nhận được link thanh toán. Vui lòng thử lại.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Thanh toán thất bại');
    } finally {
      setSubmitting(false);
    }
  }, [selectedVersionId, selectedPackage, mentorName, isAuthenticated, mentorId, router]);

  const mentorVerified = mentorUser ? isMentorVerified(mentorUser) : false;

  return {
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
  };
}
