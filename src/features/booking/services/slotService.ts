import type { ServicePackage, ServicePackageVersion } from '@/types';
import type { AvailableSlot } from '../types';

export function getDisplayVersion(pkg: ServicePackage): ServicePackageVersion | null {
  if (!pkg.versions?.length) return null;
  return (
    pkg.versions.find((version) => version.isDefault && version.isActive) ??
    pkg.versions.find((version) => version.isActive) ??
    null
  );
}

export function getSelectedPackageSummary(
  packages: ServicePackage[] | undefined,
  packageId: string | undefined,
  versionId: string | undefined,
) {
  const selectedPackage = packages?.find((pkg) => pkg.id === packageId);
  const selectedVersion =
    selectedPackage?.versions?.find((version) => version.id === versionId) ??
    (selectedPackage ? getDisplayVersion(selectedPackage) : null);

  return { selectedPackage, selectedVersion };
}

export function groupSlotsByPartOfDay(slots: AvailableSlot[]) {
  return {
    morning: slots.filter((slot) => new Date(slot.startTime).getHours() < 12),
    afternoon: slots.filter((slot) => {
      const hour = new Date(slot.startTime).getHours();
      return hour >= 12 && hour < 18;
    }),
    evening: slots.filter((slot) => new Date(slot.startTime).getHours() >= 18),
  };
}
