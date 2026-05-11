import { api } from '@/lib/api';
import {
  ServicePackage,
  ServicePackageVersion,
  CurriculumItem,
  CreateServicePackageRequest,
  UpdateServicePackageRequest,
  CreateVersionRequest,
  UpdateVersionRequest,
  CreateCurriculumRequest,
  ReorderCurriculumRequest,
  PackageQueryParams,
  PageResponse,
} from '@/types';

const BASE_URL = '/api/v1/service-packages';

/** Build query string from params object */
const buildQuery = (params?: Record<string, any>) => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const servicePackageService = {
  // === PACKAGES ===

  /** Get active packages for the public marketplace */
  getActivePackages: async (params?: PackageQueryParams): Promise<PageResponse<ServicePackage>> => {
    const res = await api.get<PageResponse<ServicePackage>>(`${BASE_URL}${buildQuery(params)}`);
    return res.data!;
  },

  /** Get active package details */
  getActivePackage: async (id: string): Promise<ServicePackage> => {
    const res = await api.get<ServicePackage>(`${BASE_URL}/${id}`);
    return res.data!;
  },

  /** Get packages owned by the current mentor */
  getMyPackages: async (params?: PackageQueryParams): Promise<PageResponse<ServicePackage>> => {
    const res = await api.get<PageResponse<ServicePackage>>(`/api/v1/mentors/me/packages${buildQuery(params)}`);
    return res.data!;
  },

  /** Get a specific package owned by the mentor */
  getMyPackage: async (pkgId: string): Promise<ServicePackage> => {
    const res = await api.get<ServicePackage>(`/api/v1/mentors/me/packages/${pkgId}`);
    return res.data!;
  },

  /** Create a new package */
  createPackage: async (data: CreateServicePackageRequest): Promise<ServicePackage> => {
    const res = await api.post<ServicePackage>(BASE_URL, data);
    return res.data!;
  },

  /** Update an existing package */
  updatePackage: async (id: string, data: UpdateServicePackageRequest): Promise<ServicePackage> => {
    const res = await api.put<ServicePackage>(`${BASE_URL}/${id}`, data);
    return res.data!;
  },

  /** Toggle package active/inactive state */
  togglePackage: async (id: string): Promise<ServicePackage> => {
    const res = await api.patch<ServicePackage>(`${BASE_URL}/${id}/toggle`, {});
    return res.data!;
  },

  /** Soft delete (archive) a package */
  deletePackage: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // === VERSIONS ===

  /** Get versions of a package */
  getPackageVersions: async (pkgId: string, params?: { page?: number; size?: number }): Promise<PageResponse<ServicePackageVersion>> => {
    const res = await api.get<PageResponse<ServicePackageVersion>>(`${BASE_URL}/${pkgId}/versions${buildQuery(params)}`);
    return res.data!;
  },

  /** Get a specific version */
  getPackageVersion: async (pkgId: string, versionId: string): Promise<ServicePackageVersion> => {
    const res = await api.get<ServicePackageVersion>(`${BASE_URL}/${pkgId}/versions/${versionId}`);
    return res.data!;
  },

  /** Create a new version */
  createPackageVersion: async (pkgId: string, data: CreateVersionRequest): Promise<ServicePackageVersion> => {
    const res = await api.post<ServicePackageVersion>(`${BASE_URL}/${pkgId}/versions`, data);
    return res.data!;
  },

  // Note: DTO for updating version does not have its own endpoint in the backend controller currently.
  // It might be combined with updating the package or we might need to add it if the backend supports it.

  // === CURRICULUMS ===

  /** Get curriculums for a version */
  getCurriculums: async (pkgId: string, versionId: string, params?: { page?: number; size?: number }): Promise<PageResponse<CurriculumItem>> => {
    const res = await api.get<PageResponse<CurriculumItem>>(`${BASE_URL}/${pkgId}/versions/${versionId}/curriculums${buildQuery(params)}`);
    return res.data!;
  },

  /** Add a curriculum item */
  addCurriculum: async (pkgId: string, versionId: string, data: CreateCurriculumRequest): Promise<CurriculumItem> => {
    const res = await api.post<CurriculumItem>(`${BASE_URL}/${pkgId}/versions/${versionId}/curriculums`, data);
    return res.data!;
  },

  /** Update a curriculum item */
  updateCurriculum: async (pkgId: string, versionId: string, curriculumId: string, data: CreateCurriculumRequest): Promise<CurriculumItem> => {
    const res = await api.put<CurriculumItem>(`${BASE_URL}/${pkgId}/versions/${versionId}/curriculums/${curriculumId}`, data);
    return res.data!;
  },

  /** Delete a curriculum item */
  deleteCurriculum: async (pkgId: string, versionId: string, curriculumId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${pkgId}/versions/${versionId}/curriculums/${curriculumId}`);
  },

  /** Bulk reorder curriculums */
  reorderCurriculums: async (versionId: string, data: ReorderCurriculumRequest): Promise<void> => {
    // Note: Assuming backend has this endpoint `PATCH /api/v1/curriculums/reorder` or similar
    await api.patch(`/api/v1/curriculums/${versionId}/reorder`, data);
  },
};
