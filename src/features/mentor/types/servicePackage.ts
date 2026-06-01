export type PackageCurriculum = {
  id: string;
  packageVersionId: string;
  title: string;
  description: string;
  orderIndex: number;
  duration: number;
};

export type PackageVersion = {
  id: string;
  price: number;
  duration: number;
  deliveryType?: string;
  isDefault: boolean;
  curriculums: PackageCurriculum[];
};

export type MentorServicePackage = {
  id: string;
  mentorId?: string;
  name: string;
  description: string;
  isActive: boolean;
  isArchived: boolean;
  price: number;
  durationMinutes: number;
  durationLabel: string;
  curriculumCount: number;
  defaultVersionId?: string;
};

export type MentorServicePackageDetail = MentorServicePackage & {
  versions: PackageVersion[];
};

export type CreatePackageCurriculumInput = {
  title: string;
  description?: string;
  orderIndex: number;
  duration: number;
};

export type CreatePackageInput = {
  name: string;
  description?: string;
  price: number;
  duration: number;
  deliveryType?: string;
  curriculums: CreatePackageCurriculumInput[];
};
