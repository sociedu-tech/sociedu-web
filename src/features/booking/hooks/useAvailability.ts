import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  AVAILABILITY_REFRESH_MS,
  AVAILABILITY_STALE_MS,
} from '../constants/bookingConfig';
import { bookingFlowApi } from '../api/bookingFlowApi';

export function useAvailability(
  mentorId: string | undefined,
  date: string | undefined,
  timezone: string,
) {
  return useQuery({
    queryKey:
      mentorId && date
        ? QUERY_KEYS.bookingAvailability(mentorId, date)
        : ['availability', '', ''],
    queryFn: () => bookingFlowApi.getAvailability(mentorId!, date!, timezone),
    enabled: !!mentorId && !!date,
    staleTime: AVAILABILITY_STALE_MS,
    refetchInterval: AVAILABILITY_REFRESH_MS,
  });
}
