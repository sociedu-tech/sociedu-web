import { api } from '@/lib/api';
import { EMPTY_MENTORS, EMPTY_STATS } from '@/mocks/defaultData';
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
 * Backend có thể trả thẳng mảng, Spring Page (`content`), hoặc `{ items, data }`.
 */
const unwrapList = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];
  const content = pick(data, 'content', 'items', 'records', 'results');
  if (Array.isArray(content)) return content;
  const inner = pick(data, 'data');
  if (Array.isArray(inner)) return inner;
  return [];
};

/**
 * Chuẩn hoá 1 mentor từ DTO backend (camel/snake, phẳng hoặc lồng `mentorInfo`) → `User` cho UI.
 */
export const normalizeMentorUser = (raw: unknown): User | null => {
  if (!isRecord(raw)) return null;

  const id =
    asStr(pick(raw, 'id', 'userId', 'user_id')).trim() ||
    asStr(pick(raw, 'mentorId', 'mentor_id')).trim();
  if (!id) return null;

  const first = asStr(pick(raw, 'firstName', 'first_name')).trim();
  const last = asStr(pick(raw, 'lastName', 'last_name')).trim();
  const combinedName = [first, last].filter(Boolean).join(' ').trim();
  const name =
    asStr(pick(raw, 'name', 'displayName', 'display_name', 'fullName', 'full_name')).trim() ||
    combinedName ||
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
  const mentorBlock = isRecord(mi) ? mi : {};

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

  const user: User = {
    id,
    name,
    email: asStr(pick(raw, 'email')).trim(),
    avatar,
    role,
    joinedDate: joined,
    rating: rating || undefined,
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

export type MentorListParams = {
  /** Tìm theo tên / headline / chuyên môn — cùng endpoint GET /mentors */
  q?: string;
};

const buildQuery = (params?: MentorListParams): string => {
  const sp = new URLSearchParams();
  const q = params?.q?.trim();
  if (q) sp.set('q', q);
  const s = sp.toString();
  return s ? `?${s}` : '';
};

const fetchPublicMentors = async (params?: MentorListParams): Promise<User[]> => {
  try {
    const res = await api.get(`${BASE_URL}${buildQuery(params)}`);
    const rows = unwrapList(res.data).map(normalizeMentorUser).filter((u): u is User => u !== null);
    return rows.length ? rows : EMPTY_MENTORS;
  } catch (error) {
    console.error('Failed to fetch mentors, using fallback:', error);
    return EMPTY_MENTORS;
  }
};

export const mentorService = {
  /**
   * Danh sách mentor công khai — dùng chung cho “tải hết” và tìm kiếm (`q`).
   * GET /api/v1/mentors
   * GET /api/v1/mentors?q=...
   */
  getMentors: fetchPublicMentors,

  /** Giữ alias cho code cũ — tương đương `getMentors()` */
  getAll: (): Promise<User[]> => fetchPublicMentors(),

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
    try {
      const res = await api.get(`${BASE_URL}/me/stats`);
      return res.data || EMPTY_STATS;
    } catch (error) {
      console.error('Failed to fetch stats, using fallback:', error);
      return EMPTY_STATS;
    }
  },
  getWithdrawals: async () => {
    try {
      const res = await api.get(`${BASE_URL}/me/withdrawals`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch withdrawals, using fallback:', error);
      return [];
    }
  },
  savePackagesForMentor: async (id: string, packages: any[]) => {
    const res = await api.put(`${BASE_URL}/me/packages`, { packages });
    return res.data;
  },
};
