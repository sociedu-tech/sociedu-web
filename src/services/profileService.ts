import { api } from '@/lib/api';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { buildPageQuery, normalizePagePayload } from '@/lib/apiUtils';
import { userService } from '@/services/userService';
import { mentorService } from '@/services/mentorService';
import type { User, MentorPackage } from '@/types';

export type ProfileReview = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
};

export type ProfileRatingSummary = {
  ratingAvg: number;
  ratingCount: number;
};

export type MentorPackageForBooking = MentorPackage & {
  versionId: string;
  packageId: string;
  deliveryType?: string;
};

export type PublicProfileData = {
  user: User;
  isMentor: boolean;
  packages: MentorPackageForBooking[];
  reviews: ProfileReview[];
  ratingSummary: ProfileRatingSummary;
};

const mapReview = (raw: unknown): ProfileReview | null => {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : '';
  if (!id) return null;
  const createdAt = r.createdAt ?? r.created_at;
  const date = typeof createdAt === 'string' ? formatDisplayDate(createdAt) : '—';
  return {
    id,
    reviewerName: String(r.reviewerName ?? r.reviewer_name ?? 'Học viên'),
    rating: Number(r.rating ?? 0),
    comment: String(r.comment ?? ''),
    date,
  };
};

const mapPackageForBooking = (raw: unknown): MentorPackageForBooking | null => {
  if (!raw || typeof raw !== 'object') return null;
  const pkg = raw as Record<string, unknown>;
  const versions = Array.isArray(pkg.versions) ? pkg.versions : [];
  const ver =
    (versions as Record<string, unknown>[]).find((v) => v.isDefault === true) ??
    (versions[0] as Record<string, unknown> | undefined);
  if (!ver?.id) return null;
  if (pkg.isActive === false || pkg.isArchived === true) return null;
  const priceRaw = ver.price;
  const price =
    typeof priceRaw === 'number'
      ? priceRaw
      : typeof priceRaw === 'string'
        ? Number(priceRaw) || 0
        : 0;
  const durationMin = ver.duration;
  return {
    id: String(pkg.id ?? ''),
    packageId: String(pkg.id ?? ''),
    versionId: String(ver.id),
    title: String(pkg.name ?? 'Gói dịch vụ'),
    description: String(pkg.description ?? ''),
    price,
    duration: durationMin ? `${durationMin} phút` : '—',
    deliveryType: ver.deliveryType != null ? String(ver.deliveryType) : undefined,
  };
};

export const profileService = {
  getPublicProfile: async (userId: string): Promise<PublicProfileData> => {
    const baseUser = await userService.getUserProfile(userId);
    if (!baseUser) {
      throw new Error('Không tìm thấy hồ sơ người dùng');
    }

    const [mentorUser, packagesRes, ratingRes, reviewsRes] = await Promise.all([
      mentorService.getProfile(userId).catch(() => null),
      api
        .get(`/api/v1/mentors/${userId}/packages${buildPageQuery({ page: 0, size: 50 })}`)
        .then((r) => normalizePagePayload(r.data, 50))
        .catch(() => ({ items: [], page: 0, size: 50, total: 0, totalPages: 0 })),
      api.get(`/api/v1/mentors/${userId}/rating-summary`).catch(() => null),
      api
        .get(`/api/v1/mentors/${userId}/reviews${buildPageQuery({ page: 0, size: 10 })}`)
        .then((r) => normalizePagePayload(r.data, 10))
        .catch(() => ({ items: [], page: 0, size: 10, total: 0, totalPages: 0 })),
    ]);

    const isMentor = Boolean(mentorUser?.mentorInfo);

    let user: User = { ...baseUser };
    if (mentorUser?.mentorInfo) {
      user = {
        ...baseUser,
        role: 'mentor',
        rating: mentorUser.rating ?? mentorUser.mentorInfo.rating,
        mentorInfo: {
          ...mentorUser.mentorInfo,
          headline: mentorUser.mentorInfo.headline || baseUser.mentorInfo?.headline || '',
          expertise:
            mentorUser.mentorInfo.expertise.length > 0
              ? mentorUser.mentorInfo.expertise
              : baseUser.mentorInfo?.expertise ?? [],
        },
      };
    }

    const ratingData = ratingRes?.data as Record<string, unknown> | undefined;
    const ratingSummary: ProfileRatingSummary = {
      ratingAvg: Number(ratingData?.ratingAvg ?? ratingData?.rating_avg ?? user.rating ?? 0),
      ratingCount: Number(ratingData?.ratingCount ?? ratingData?.rating_count ?? 0),
    };
    if (user.mentorInfo) {
      user.mentorInfo.rating = ratingSummary.ratingAvg;
    }
    user.rating = ratingSummary.ratingAvg;

    const packages = packagesRes.items
      .map(mapPackageForBooking)
      .filter((p): p is MentorPackageForBooking => p !== null);

    const reviews = reviewsRes.items.map(mapReview).filter((r): r is ProfileReview => r !== null);

    return {
      user,
      isMentor,
      packages: packages.filter((p) => p.versionId),
      reviews,
      ratingSummary,
    };
  },
};
