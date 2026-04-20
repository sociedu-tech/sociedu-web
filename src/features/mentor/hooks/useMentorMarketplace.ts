import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@/types';
import { mentorService } from '@/services/mentorService';
import { useDebouncedValue } from '@/features/_shared/hooks';
import type { SortKey } from '@/features/mentor/marketplace/mentorMarketplace.constants';
import type { MentorMarketplaceViewModel } from '@/features/mentor/marketplace/mentorMarketplace.types';

export function useMentorMarketplace(): MentorMarketplaceViewModel {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedQuery = useDebouncedValue(searchTerm.trim(), searchTerm.trim() ? 400 : 0);

  const fetchMentors = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mentorService.getMentors(q ? { q } : undefined);
      setMentors(data);
    } catch {
      setError('Không thể tải danh sách mentor. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMentors(debouncedQuery);
  }, [debouncedQuery, fetchMentors]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach((m) => m.mentorInfo?.expertise?.forEach((e) => set.add(e)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [mentors]);

  const priceBounds = useMemo(() => {
    const prices = mentors.map((m) => m.mentorInfo?.price ?? 0).filter((p) => p > 0);
    if (prices.length === 0) return { min: 0, max: 1000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [mentors]);

  useEffect(() => {
    setMaxPrice(priceBounds.max || 1000);
  }, [priceBounds.max]);

  const filtered = useMemo(() => {
    const list = mentors.filter((m) => {
      const info = m.mentorInfo;
      if (!info) return false;
      if (verifiedOnly && info.verificationStatus !== 'verified') return false;
      if (selectedCategories.length > 0) {
        const hit = info.expertise?.some((e) => selectedCategories.includes(e));
        if (!hit) return false;
      }
      if (typeof info.price === 'number' && info.price > maxPrice) return false;
      return true;
    });

    list.sort((a, b) => {
      const ai = a.mentorInfo!;
      const bi = b.mentorInfo!;
      switch (sortBy) {
        case 'price-asc':
          return (ai.price ?? 0) - (bi.price ?? 0);
        case 'price-desc':
          return (bi.price ?? 0) - (ai.price ?? 0);
        case 'rating':
          return (bi.rating ?? 0) - (ai.rating ?? 0);
        case 'popular':
        default:
          return (bi.sessionsCompleted ?? 0) - (ai.sessionsCompleted ?? 0);
      }
    });
    return list;
  }, [mentors, selectedCategories, verifiedOnly, maxPrice, sortBy]);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setVerifiedOnly(false);
    setMaxPrice(priceBounds.max || 1000);
    setSearchTerm('');
  }, [priceBounds.max]);

  const activeFilterCount =
    selectedCategories.length + (verifiedOnly ? 1 : 0) + (maxPrice < (priceBounds.max || 1000) ? 1 : 0);

  const retry = useCallback(() => {
    void fetchMentors(debouncedQuery);
  }, [fetchMentors, debouncedQuery]);

  return {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    verifiedOnly,
    setVerifiedOnly,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    showMobileFilters,
    setShowMobileFilters,
    allCategories,
    priceBounds,
    filtered,
    toggleCategory,
    clearFilters,
    activeFilterCount,
    retry,
  };
}
