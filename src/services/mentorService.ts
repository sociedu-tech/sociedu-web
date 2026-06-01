import { api } from '@/lib/api';
import { normalizePagePayload, unwrapPage, DEFAULT_PAGE_SIZE, type PagePayload } from '@/lib/apiUtils';
import type { MentorPackage, User } from '@/types';

const BASE_URL = '/api/v1/mentors';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const pick = (o: Record<string, unknown>, ...keys: string[]): unknown => {
  for (const k of keys) {
    if (k in o && o[k] !== undefined && o[k] !== null) return o[k];
  }
  return undefined;
};

const asStr = (v: unknown): string => (v === undefined || v === null ? '' : String(v));

const asNum = (v: unknown): number | undefined => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

/** Chuỗi / mảng / CSV → mảng chuyên môn */
const parseExpertise = (raw: unknown): string[] => {
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const mapVerification = (raw: unknown): 'pending' | 'verified' | 'rejected' => {
  const s = asStr(raw).toLowerCase();
  if (s === 'verified' || s === 'approved' || s === 'active') return 'verified';
  if (s === 'rejected' || s === 'declined') return 'rejected';
  return 'pending';
};

/**
 * Backend: `ApiResponse` → `data` là Spring `Page` (`content`), hoặc mảng thẳng / `{ items }`.
 * Hỗ trợ cả khi vô tình truyền cả envelope (có `data` lồng `content`).
 */
const unwrapList = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  const fromRecord = (rec: Record<string, unknown>): unknown[] => {
    const content = pick(rec, 'content', 'items', 'records', 'results');
    if (Array.isArray(content)) return content;
    const inner = pick(rec, 'data');
    if (Array.isArray(inner)) return inner;
    if (isRecord(inner)) {
      const nested = pick(inner, 'content', 'items', 'records', 'results');
      if (Array.isArray(nested)) return nested;
    }
    return [];
  };

  const top = fromRecord(payload);
  if (top.length > 0) return top;
  return [];
};

/**
 * Chuẩn hoá 1 mentor từ DTO backend (camel/snake, phẳng hoặc lồng `mentorInfo`) → `User` cho UI.
 */
export const normalizeMentorUser = (raw: unknown): User | null => {
  if (!isRecord(raw)) return null;

  const id =
    asStr(pick(raw, 'userId', 'user_id', 'id')).trim() ||
    asStr(pick(raw, 'mentorId', 'mentor_id')).trim();
  if (!id) return null;

  const first = asStr(pick(raw, 'firstName', 'first_name')).trim();
  const last = asStr(pick(raw, 'lastName', 'last_name')).trim();
  const combinedName = [first, last].filter(Boolean).join(' ').trim();
  const name =
    asStr(pick(raw, 'displayName', 'display_name', 'name', 'fullName', 'full_name')).trim() ||
    combinedName ||
    asStr(pick(raw, 'headline')).trim() ||
    'Mentor';

  const avatar =
    asStr(pick(raw, 'avatar', 'avatarUrl', 'avatar_url')).trim() ||
    (pick(raw, 'avatarFileId', 'avatar_file_id')
      ? `https://i.pravatar.cc/300?u=${encodeURIComponent(asStr(pick(raw, 'avatarFileId', 'avatar_file_id')))}`
      : '');

  const roleRaw = asStr(pick(raw, 'role')).toLowerCase();
  const role: User['role'] =
    roleRaw === 'admin' ? 'admin' : (roleRaw === 'seller' || roleRaw === 'mentor') ? 'mentor' : 'mentor';

  const mi = pick(raw, 'mentorInfo', 'mentor_info');
  const mentorBlock = isRecord(mi) ? mi : raw;

  const headline =
    asStr(
      pick(
        mentorBlock,
        'headline',
        'title',
        'bio',
      ),
    ).trim() ||
    asStr(pick(raw, 'headline', 'title', 'bio')).trim() ||
    'Mentor Mentoree';

  const e1 = parseExpertise(pick(mentorBlock, 'expertise', 'expertiseAreas', 'expertise_areas'));
  const e2 = parseExpertise(pick(raw, 'expertise', 'skills', 'tags', 'specialties', 'fields'));
  const expertise = e1.length > 0 ? e1 : e2;

  const price =
    asNum(pick(mentorBlock, 'price', 'hourlyRate', 'hourly_rate', 'rate', 'basePrice', 'base_price')) ??
    asNum(pick(raw, 'price', 'hourlyRate', 'hourly_rate', 'rate', 'basePrice', 'base_price')) ??
    0;

  const rating =
    asNum(pick(mentorBlock, 'rating', 'averageRating', 'average_rating', 'ratingAvg', 'rating_avg')) ??
    asNum(pick(raw, 'rating', 'averageRating', 'average_rating', 'ratingAvg', 'rating_avg')) ??
    0;

  const sessionsCompleted =
    asNum(pick(mentorBlock, 'sessionsCompleted', 'sessions_completed', 'completedSessions')) ??
    asNum(pick(raw, 'sessionsCompleted', 'sessions_completed', 'completedSessions')) ??
    0;

  const verificationStatus = mapVerification(
    pick(mentorBlock, 'verificationStatus', 'verification_status') ??
      pick(raw, 'verificationStatus', 'verification_status', 'mentorStatus', 'mentor_status'),
  );

  const joined =
    asStr(pick(raw, 'joinedDate', 'joined_date', 'createdAt', 'created_at')).trim() ||
    new Date().toISOString();

  const university =
    asStr(
      pick(
        raw,
        'university',
        'school',
        'schoolName',
        'school_name',
        'institution',
        'truong',
        'tenTruong',
      ),
    ).trim() ||
    asStr(pick(mentorBlock, 'university', 'school', 'schoolName', 'school_name', 'institution')).trim();

  const major =
    asStr(
      pick(raw, 'major', 'fieldOfStudy', 'field_of_study', 'nganh', 'chuyenNganh', 'specialization'),
    ).trim() ||
    asStr(pick(mentorBlock, 'major', 'fieldOfStudy', 'field_of_study', 'nganh')).trim();

  const year =
    asNum(pick(raw, 'year', 'graduationYear', 'graduation_year', 'cohortYear', 'cohort_year', 'khoa')) ??
    asNum(pick(mentorBlock, 'year', 'graduationYear', 'graduation_year', 'cohortYear'));

  const skillsRaw = pick(raw, 'skills', 'skillSet', 'skill_set') ?? pick(mentorBlock, 'skills', 'skillSet');
  const skills: string[] = Array.isArray(skillsRaw)
    ? skillsRaw.map((x) => String(x).trim()).filter(Boolean)
    : typeof skillsRaw === 'string'
      ? parseExpertise(skillsRaw)
      : [];

  const user: User = {
    id,
    name,
    email: asStr(pick(raw, 'email')).trim(),
    avatar,
    role,
    joinedDate: joined,
    rating: rating || undefined,
    ...(university ? { university } : {}),
    ...(major ? { major } : {}),
    ...(year !== undefined ? { year } : {}),
    ...(skills.length > 0 ? { skills } : {}),
    mentorInfo: {
      headline,
      expertise,
      price,
      rating,
      sessionsCompleted,
      verificationStatus,
    },
  };

  return user;
};

/** Khớp GET /api/v1/mentors (Spring): q, minBasePrice, maxBasePrice, page, size */
export type MentorListParams = {
  /** Từ khóa — headline / expertise (backend LIKE) */
  q?: string;
  minBasePrice?: number;
  maxBasePrice?: number;
  page?: number;
  /** Mặc định lớn vì marketplace còn lọc phía client (tránh chỉ nhận 1 trang 20 bản ghi). */
  size?: number;
};

const DEFAULT_MENTOR_LIST_SIZE = 500;

type ServicePackageVersionDto = {
  price?: number | string;
  duration?: number;
  isDefault?: boolean;
};

type ServicePackageDto = {
  id?: string;
  name?: string;
  description?: string;
  versions?: ServicePackageVersionDto[];
};

const mapServicePackageToMentorPackage = (raw: Record<string, unknown>): MentorPackage => {
  const pkg = raw as ServicePackageDto;
  const ver =
    pkg.versions?.find((v) => v.isDefault) ?? pkg.versions?.[0];
  const price =
    typeof ver?.price === 'number'
      ? ver.price
      : typeof ver?.price === 'string'
        ? Number(ver.price) || 0
        : 0;
  return {
    id: String(pkg.id ?? ''),
    title: String(pkg.name ?? 'Gói dịch vụ'),
    description: String(pkg.description ?? ''),
    price,
    duration: ver?.duration ? `${ver.duration} phút` : '—',
  };
};

const buildQuery = (params?: MentorListParams): string => {
  const sp = new URLSearchParams();
  const q = params?.q?.trim();
  if (q) sp.set('q', q);
  const { minBasePrice, maxBasePrice } = params ?? {};
  if (minBasePrice != null && Number.isFinite(minBasePrice)) {
    sp.set('minBasePrice', String(minBasePrice));
  }
  if (maxBasePrice != null && Number.isFinite(maxBasePrice)) {
    sp.set('maxBasePrice', String(maxBasePrice));
  }
  sp.set('page', String(params?.page ?? 0));
  sp.set('size', String(params?.size ?? DEFAULT_MENTOR_LIST_SIZE));
  return `?${sp.toString()}`;
};

const fetchPublicMentorsPage = async (params?: MentorListParams): Promise<PagePayload<User>> => {
  const size = params?.size ?? DEFAULT_PAGE_SIZE;
  const res = await api.get(`${BASE_URL}${buildQuery({ ...params, size })}`);
  const page = normalizePagePayload<unknown>(res.data, size);
  const items = page.items.map(normalizeMentorUser).filter((u): u is User => u !== null);
  return { ...page, items };
};

const fetchPublicMentors = async (params?: MentorListParams): Promise<User[]> => {
  const page = await fetchPublicMentorsPage(params);
  return page.items;
};

export const mentorService = {
  /**
   * Danh sách mentor công khai — dùng chung cho “tải hết” và tìm kiếm (`q`).
   * GET /api/v1/mentors
   * GET /api/v1/mentors?q=...
   */
  getMentors: fetchPublicMentors,
  listPage: fetchPublicMentorsPage,

  /** Giữ alias cho code cũ — tương đương `getMentors()` */
  getAll: (): Promise<User[]> => fetchPublicMentors({ page: 0, size: 100 }),

  getProfile: async (id: number | string): Promise<User | null> => {
    try {
      const res = await api.get(`${BASE_URL}/${id}`);
      return normalizeMentorUser(res.data);
    } catch (error) {
      console.error(`Failed to fetch mentor profile ${id}, using fallback:`, error);
      return null;
    }
  },
  getPackages: async (id: number | string): Promise<MentorPackage[]> => {
    try {
      const res = await api.get(`${BASE_URL}/${id}/packages`);
      const data = res.data;
      const list = unwrapList(data);
      return (list.length ? list : Array.isArray(data) ? data : []) as MentorPackage[];
    } catch (error) {
      console.error(`Failed to fetch packages for mentor ${id}, using fallback:`, error);
      return [];
    }
  },

  // Mentor Management (Self)
  updateMyProfile: async (data: any) => {
    const res = await api.put(`${BASE_URL}/me`, data);
    return res.data;
  },
  addPackage: async (data: any) => {
    const res = await api.post(`${BASE_URL}/me/packages`, data);
    return res.data;
  },
  deletePackage: async (pkgId: number | string) => {
    const res = await api.delete(`${BASE_URL}/me/packages/${pkgId}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get(`${BASE_URL}/me/stats`);
    return res.data ?? {};
  },
  getWithdrawals: async () => {
    const res = await api.get(`${BASE_URL}/me/withdrawals`);
    const list = res.data;
    return Array.isArray(list) ? list : [];
  },
  getMyPackages: async (): Promise<MentorPackage[]> => {
    const res = await api.get(`${BASE_URL}/me/packages?size=100`);
    const { items } = unwrapPage<Record<string, unknown>>(res.data);
    return items.map(mapServicePackageToMentorPackage);
  },
  savePackagesForMentor: async (id: string, packages: any[]) => {
    const res = await api.put(`${BASE_URL}/me/packages`, { packages });
    return res.data;
  },
};
