import { api } from '@/lib/api';
import type { User } from '@/types';

const BASE_URL = '/api/v1/users/me';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const pick = (o: Record<string, unknown>, ...keys: string[]): unknown => {
  for (const k of keys) {
    if (k in o && o[k] !== undefined && o[k] !== null) return o[k];
  }
  return undefined;
};

const asStr = (v: unknown): string => (v === undefined || v === null ? '' : String(v));

const displayName = (profile: Record<string, unknown>): string => {
  const first = asStr(pick(profile, 'firstName', 'first_name')).trim();
  const last = asStr(pick(profile, 'lastName', 'last_name')).trim();
  const combined = [first, last].filter(Boolean).join(' ').trim();
  return combined || 'Người dùng';
};

const formatJoined = (iso: unknown): string => {
  if (!iso || typeof iso !== 'string') return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN');
  } catch {
    return iso;
  }
};

const avatarUrlFor = (userId: string, avatarFileId: unknown): string => {
  if (avatarFileId && typeof avatarFileId === 'string') {
    return `https://i.pravatar.cc/300?u=${encodeURIComponent(avatarFileId)}`;
  }
  return `https://i.pravatar.cc/300?u=${encodeURIComponent(userId || 'guest')}`;
};

const formatExpDuration = (row: Record<string, unknown>): string => {
  const start = asStr(pick(row, 'startDate', 'start_date'));
  const end = asStr(pick(row, 'endDate', 'end_date'));
  const isCurrent = Boolean(pick(row, 'isCurrent', 'is_current'));
  if (isCurrent && start) return `${start} — Hiện tại`;
  if (start && end) return `${start} — ${end}`;
  return start || end || '';
};

type ExperienceRow = NonNullable<User['experience']>[number];

const mapExperienceRow = (row: unknown): ExperienceRow | null => {
  if (!isRecord(row)) return null;
  const company = asStr(pick(row, 'company', 'organization'));
  const role = asStr(pick(row, 'position', 'role', 'title'));
  const description = asStr(pick(row, 'description'));
  return {
    company,
    role,
    duration: formatExpDuration(row),
    description,
  };
};

const firstEducationFields = (
  educations: unknown[],
): Pick<User, 'university' | 'major' | 'year' | 'gpa'> => {
  const row = educations[0];
  if (!isRecord(row)) return {};
  const uniObj = pick(row, 'university');
  const uni =
    asStr(pick(row, 'universityName', 'university_name')) ||
    (isRecord(uniObj) ? asStr(pick(uniObj, 'name')) : '');
  const majorObj = pick(row, 'fieldOfStudy', 'major');
  const major =
    asStr(pick(row, 'majorName', 'major_name', 'degree')) ||
    (isRecord(majorObj) ? asStr(pick(majorObj, 'name')) : '');
  const end = pick(row, 'endDate', 'end_date');
  const yearNum =
    typeof end === 'string' && /^\d{4}/.test(end) ? Number(end.slice(0, 4)) : undefined;
  return {
    university: uni || undefined,
    major: major || undefined,
    year: Number.isFinite(yearNum) ? yearNum : undefined,
  };
};

const mapLanguagesToSkills = (languages: unknown[]): string[] =>
  languages
    .map((raw) => {
      if (!isRecord(raw)) return '';
      const lang = asStr(pick(raw, 'language', 'name')).trim();
      const level = asStr(pick(raw, 'level')).trim();
      if (!lang) return '';
      return level ? `${lang} (${level})` : lang;
    })
    .filter(Boolean);

const mapCertificatesToAchievements = (certs: unknown[]): string[] =>
  certs
    .map((raw) => {
      if (!isRecord(raw)) return '';
      return asStr(pick(raw, 'name', 'title')).trim();
    })
    .filter(Boolean);

/** Backend có thể trả phẳng (`data` = profile) hoặc bundle public (`data.profile` + mảng). */
const parseProfileBundle = (
  data: unknown,
): {
  profile: Record<string, unknown>;
  experiences: unknown[];
  educations: unknown[];
  languages: unknown[];
  certificates: unknown[];
} | null => {
  if (!isRecord(data)) return null;

  if (isRecord(data.profile)) {
    return {
      profile: data.profile,
      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      educations: Array.isArray(data.educations) ? data.educations : [],
      languages: Array.isArray(data.languages) ? data.languages : [],
      certificates: Array.isArray(data.certificates) ? data.certificates : [],
    };
  }

  if ('userId' in data || 'user_id' in data || 'firstName' in data || 'first_name' in data) {
    return {
      profile: data,
      experiences: Array.isArray(data.experiences) ? (data.experiences as unknown[]) : [],
      educations: Array.isArray(data.educations) ? (data.educations as unknown[]) : [],
      languages: Array.isArray(data.languages) ? (data.languages as unknown[]) : [],
      certificates: Array.isArray(data.certificates) ? (data.certificates as unknown[]) : [],
    };
  }

  return null;
};

const mapBundleToUser = (bundle: NonNullable<ReturnType<typeof parseProfileBundle>>): User | null => {
  const profile = bundle.profile;
  const userId = asStr(pick(profile, 'userId', 'user_id')).trim();
  if (!userId) return null;

  const headline = asStr(pick(profile, 'headline')).trim();
  const edu = firstEducationFields(bundle.educations);
  const experiences = bundle.experiences
    .map(mapExperienceRow)
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const user: User = {
    id: userId,
    name: displayName(profile),
    email: asStr(pick(profile, 'email')).trim(),
    avatar: avatarUrlFor(userId, pick(profile, 'avatarFileId', 'avatar_file_id')),
    role: 'user',
    bio: asStr(pick(profile, 'bio')).trim() || undefined,
    joinedDate: formatJoined(pick(profile, 'createdAt', 'created_at')),
    experience: experiences.length ? experiences : undefined,
    skills: mapLanguagesToSkills(bundle.languages).length
      ? mapLanguagesToSkills(bundle.languages)
      : undefined,
    achievements: mapCertificatesToAchievements(bundle.certificates).length
      ? mapCertificatesToAchievements(bundle.certificates)
      : undefined,
    ...edu,
  };

  if (headline) {
    user.mentorInfo = {
      headline,
      expertise: [],
      price: 0,
      rating: 0,
      sessionsCompleted: 0,
      verificationStatus: 'pending',
    };
  }

  return user;
};

export const userService = {
  // Profile
  getMe: async (): Promise<User | null> => {
    const res = await api.get(`${BASE_URL}/profile`);
    const bundle = parseProfileBundle(res.data);
    return bundle ? mapBundleToUser(bundle) : null;
  },
  getUserProfile: async (id: string): Promise<User | null> => {
    try {
      const res = await api.get(`/api/v1/users/${id}/profile`);
      const bundle = parseProfileBundle(res.data);
      if (!bundle) return null;
      return mapBundleToUser(bundle);
    } catch (error) {
      console.error(`Failed to fetch user profile ${id}, using null fallback:`, error);
      return null;
    }
  },
  updateProfile: async (id: string | number, profileData: any) => {
    const res = await api.put(`${BASE_URL}/profile`, profileData);
    const bundle = parseProfileBundle(res.data);
    return bundle ? mapBundleToUser(bundle) : (res.data as unknown);
  },

  // Education
  getEducations: async () => {
    try {
      const res = await api.get(`${BASE_URL}/educations`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch educations, using empty fallback:', error);
      return [];
    }
  },
  addEducation: async (data: any) => {
    const res = await api.post(`${BASE_URL}/educations`, data);
    return res.data;
  },
  updateEducation: async (id: number | string, data: any) => {
    const res = await api.put(`${BASE_URL}/educations/${id}`, data);
    return res.data;
  },
  deleteEducation: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/educations/${id}`);
    return res.data;
  },

  // Language
  getLanguages: async () => {
    try {
      const res = await api.get(`${BASE_URL}/languages`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch languages, using empty fallback:', error);
      return [];
    }
  },
  addLanguage: async (data: any) => {
    const res = await api.post(`${BASE_URL}/languages`, data);
    return res.data;
  },
  deleteLanguage: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/languages/${id}`);
    return res.data;
  },

  // Experience
  getExperiences: async () => {
    try {
      const res = await api.get(`${BASE_URL}/experiences`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch experiences, using empty fallback:', error);
      return [];
    }
  },
  addExperience: async (data: any) => {
    const res = await api.post(`${BASE_URL}/experiences`, data);
    return res.data;
  },
  updateExperience: async (id: number | string, data: any) => {
    const res = await api.put(`${BASE_URL}/experiences/${id}`, data);
    return res.data;
  },
  deleteExperience: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/experiences/${id}`);
    return res.data;
  },

  // Certificate
  getCertificates: async () => {
    try {
      const res = await api.get(`${BASE_URL}/certificates`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch certificates, using empty fallback:', error);
      return [];
    }
  },
  addCertificate: async (data: any) => {
    const res = await api.post(`${BASE_URL}/certificates`, data);
    return res.data;
  },
  deleteCertificate: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/certificates/${id}`);
    return res.data;
  },
};
