import { api } from '@/lib/api';
import { buildPageQuery, isRecord, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
import type {
  CreatePackageInput,
  MentorServicePackage,
  MentorServicePackageDetail,
  PackageCurriculum,
  PackageVersion,
} from '@/features/mentor/types/servicePackage';

const MENTOR_BASE = '/api/v1/mentors/me/packages';
const PACKAGE_BASE = '/api/v1/service-packages';

const asStr = (v: unknown): string => (v === undefined || v === null ? '' : String(v));

const asNum = (v: unknown): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const asBool = (v: unknown, fallback = false): boolean =>
  typeof v === 'boolean' ? v : fallback;

const mapCurriculum = (raw: Record<string, unknown>): PackageCurriculum => ({
  id: asStr(raw.id),
  packageVersionId: asStr(raw.packageVersionId),
  title: asStr(raw.title),
  description: asStr(raw.description),
  orderIndex: asNum(raw.orderIndex),
  duration: asNum(raw.duration),
});

const mapVersion = (raw: Record<string, unknown>): PackageVersion => {
  const curriculumsRaw = Array.isArray(raw.curriculums) ? raw.curriculums : [];
  return {
    id: asStr(raw.id),
    price: asNum(raw.price),
    duration: asNum(raw.duration),
    deliveryType: asStr(raw.deliveryType) || undefined,
    isDefault: asBool(raw.isDefault),
    curriculums: curriculumsRaw
      .filter(isRecord)
      .map(mapCurriculum)
      .sort((a, b) => a.orderIndex - b.orderIndex),
  };
};

const pickDefaultVersion = (versions: PackageVersion[]): PackageVersion | undefined =>
  versions.find((v) => v.isDefault) ?? versions[0];

const mapPackageSummary = (raw: Record<string, unknown>): MentorServicePackage => {
  const versionsRaw = Array.isArray(raw.versions) ? raw.versions : [];
  const versions = versionsRaw.filter(isRecord).map(mapVersion);
  const defaultVersion = pickDefaultVersion(versions);
  const durationMinutes = defaultVersion?.duration ?? 0;

  return {
    id: asStr(raw.id),
    mentorId: asStr(raw.mentorId) || undefined,
    name: asStr(raw.name) || 'Gói dịch vụ',
    description: asStr(raw.description),
    isActive: asBool(raw.isActive, true),
    isArchived: asBool(raw.isArchived),
    price: defaultVersion?.price ?? 0,
    durationMinutes,
    durationLabel: durationMinutes > 0 ? `${durationMinutes} phút` : '—',
    curriculumCount: defaultVersion?.curriculums.length ?? 0,
    defaultVersionId: defaultVersion?.id,
  };
};

const mapPackageDetail = (raw: Record<string, unknown>): MentorServicePackageDetail => {
  const summary = mapPackageSummary(raw);
  const versionsRaw = Array.isArray(raw.versions) ? raw.versions : [];
  const versions = versionsRaw.filter(isRecord).map(mapVersion);
  return { ...summary, versions };
};

const unwrapData = <T>(payload: unknown, mapper: (raw: Record<string, unknown>) => T): T => {
  if (!isRecord(payload)) throw new Error('Dữ liệu không hợp lệ');
  return mapper(payload);
};

export const servicePackageService = {
  listMyPackages: async (params?: {
    q?: string;
    page?: number;
    size?: number;
  }): Promise<PagePayload<MentorServicePackage>> => {
    const size = params?.size ?? 20;
    const query = buildPageQuery({
      page: params?.page ?? 0,
      size,
      extra: { q: params?.q },
    });
    const res = await api.get(`${MENTOR_BASE}${query}`);
    const page = normalizePagePayload<Record<string, unknown>>(res.data, size);
    return {
      ...page,
      items: page.items.map(mapPackageSummary),
    };
  },

  getMyPackage: async (packageId: string): Promise<MentorServicePackageDetail> => {
    const res = await api.get(`${MENTOR_BASE}/${packageId}`);
    return unwrapData(res.data, mapPackageDetail);
  },

  createPackage: async (input: CreatePackageInput): Promise<MentorServicePackageDetail> => {
    const res = await api.post(MENTOR_BASE, input);
    return unwrapData(res.data, mapPackageDetail);
  },

  updatePackage: async (
    packageId: string,
    input: { name: string; description?: string },
  ): Promise<MentorServicePackageDetail> => {
    const res = await api.put(`${PACKAGE_BASE}/${packageId}`, input);
    return unwrapData(res.data, mapPackageDetail);
  },

  togglePackage: async (packageId: string): Promise<MentorServicePackageDetail> => {
    const res = await api.patch(`${PACKAGE_BASE}/${packageId}/toggle`, {});
    return unwrapData(res.data, mapPackageDetail);
  },

  deletePackage: async (packageId: string): Promise<void> => {
    await api.delete(`${MENTOR_BASE}/${packageId}`);
  },
};
