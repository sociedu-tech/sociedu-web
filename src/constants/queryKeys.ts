import { PackageQueryParams } from '../types';

export const QUERY_KEYS = {
  // Service Packages
  packages: (params?: PackageQueryParams) => ['service-packages', params] as const,
  packageDetail: (id: string) => ['service-package', id] as const,
  packageVersions: (packageId: string) => ['service-package-versions', packageId] as const,
  curriculums: (versionId: string) => ['curriculums', versionId] as const,

  // Bookings
  bookingsBuyer: ['bookings', 'buyer'] as const,
  bookingsMentor: ['bookings', 'mentor'] as const,
  bookingDetail: (id: string) => ['booking', id] as const,
};
