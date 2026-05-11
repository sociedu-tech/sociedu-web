import { useQuery } from '@tanstack/react-query';
import { mentorService } from '@/services/mentorService';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function usePackagesForBooking(mentorId: string | undefined) {
  return useQuery({
    queryKey: mentorId ? QUERY_KEYS.bookingPackages(mentorId) : ['booking-packages', ''],
    queryFn: () => mentorService.getPackages(mentorId!),
    enabled: !!mentorId,
    select: (packages) => packages.filter((pkg) => pkg.isActive && !pkg.isArchived),
  });
}
