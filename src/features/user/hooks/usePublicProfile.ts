import { useCallback, useEffect, useState } from 'react';
import { profileService, type PublicProfileData } from '@/services/profileService';

export function usePublicProfile(userId?: string) {
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await profileService.getPublicProfile(userId);
      setData(result);
    } catch (err: unknown) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Không tải được hồ sơ');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return {
    data,
    user: data?.user ?? null,
    isMentor: data?.isMentor ?? false,
    packages: data?.packages ?? [],
    reviews: data?.reviews ?? [],
    ratingSummary: data?.ratingSummary ?? { ratingAvg: 0, ratingCount: 0 },
    loading,
    error,
    refetch: fetchProfile,
  };
}
