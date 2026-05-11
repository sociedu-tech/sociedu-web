export interface CurriculumItem {
  id: string;
  versionId: string;
  title: string;
  description?: string;
  orderIndex: number;
  createdAt: string;
}

export interface ServicePackageVersion {
  id: string;
  servicePackageId: string;
  title?: string;
  price: number;
  durationInMinutes: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  curriculums?: CurriculumItem[];
}

export interface ServicePackage {
  id: string;
  mentorId: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  versions?: ServicePackageVersion[];
}

// -- Request DTOs --

export interface PackageQueryParams {
  page?: number;
  size?: number;
  q?: string;
  category?: string;
  isActive?: boolean;
  includeArchived?: boolean;
}

export interface CreateServicePackageRequest {
  name: string;
  description: string;
  category: string;
}

export interface UpdateServicePackageRequest {
  name?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export interface CreateVersionRequest {
  title?: string;
  price: number;
  durationInMinutes: number;
  isDefault?: boolean;
}

export interface UpdateVersionRequest {
  title?: string;
  price?: number;
  durationInMinutes?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface CreateCurriculumRequest {
  title: string;
  description?: string;
  orderIndex: number;
}

export interface ReorderCurriculumRequest {
  items: { id: string; orderIndex: number }[];
}
