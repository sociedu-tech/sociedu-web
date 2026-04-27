import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@/types';
import { mentorService } from '@/services/mentorService';
import { useDebouncedValue } from '@/features/_shared/hooks';
import type { SortKey } from '@/features/mentor/marketplace/mentorMarketplace.constants';
import type { MentorMarketplaceViewModel } from '@/features/mentor/marketplace/mentorMarketplace.types';

const uniqSortedStrings = (values: (string | undefined)[]) => {
  const set = new Set<string>();
  values.forEach((v) => {
    const t = v?.trim();
    if (t) set.add(t);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
};

const uniqSortedYears = (values: (number | undefined)[]) => {
  const set = new Set<number>();
  values.forEach((y) => {
    if (y !== undefined && Number.isFinite(y)) set.add(y);
  });
  return Array.from(set).sort((a, b) => b - a);
};

export function useMentorMarketplace(): MentorMarketplaceViewModel {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minSessions, setMinSessions] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedQuery = useDebouncedValue(searchTerm.trim(), searchTerm.trim() ? 400 : 0);

  const fetchMentors = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      /** `q` + page/size mặc định trong mentorService — khớp GET /api/v1/mentors */
      const data = await mentorService.getMentors(q ? { q } : {});
      setMentors(data);
    } catch {
      setMentors([]);
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

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach((m) => m.skills?.forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [mentors]);

  const allUniversities = useMemo(
    () => uniqSortedStrings(mentors.map((m) => m.university)),
    [mentors],
  );

  const allMajors = useMemo(() => uniqSortedStrings(mentors.map((m) => m.major)), [mentors]);

  const allYears = useMemo(() => uniqSortedYears(mentors.map((m) => m.year)), [mentors]);

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
      if (minRating > 0 && (info.rating ?? 0) < minRating) return false;
      if (minSessions > 0 && (info.sessionsCompleted ?? 0) < minSessions) return false;
      if (selectedSkills.length > 0) {
        const hit = m.skills?.some((s) => selectedSkills.includes(s));
        if (!hit) return false;
      }
      if (selectedUniversities.length > 0) {
        const u = m.university?.trim();
        if (!u || !selectedUniversities.includes(u)) return false;
      }
      if (selectedMajors.length > 0) {
        const maj = m.major?.trim();
        if (!maj || !selectedMajors.includes(maj)) return false;
      }
      if (selectedYears.length > 0) {
        if (m.year === undefined || !selectedYears.includes(m.year)) return false;
      }
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
  }, [
    mentors,
    selectedCategories,
    selectedSkills,
    selectedUniversities,
    selectedMajors,
    selectedYears,
    verifiedOnly,
    minRating,
    minSessions,
    maxPrice,
    sortBy,
  ]);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }, []);

  const toggleUniversity = useCallback((u: string) => {
    setSelectedUniversities((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));
  }, []);

  const toggleMajor = useCallback((maj: string) => {
    setSelectedMajors((prev) => (prev.includes(maj) ? prev.filter((x) => x !== maj) : [...prev, maj]));
  }, []);

  const toggleYear = useCallback((y: number) => {
    setSelectedYears((prev) => (prev.includes(y) ? prev.filter((x) => x !== y) : [...prev, y]));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedSkills([]);
    setSelectedUniversities([]);
    setSelectedMajors([]);
    setSelectedYears([]);
    setVerifiedOnly(false);
    setMinRating(0);
    setMinSessions(0);
    setMaxPrice(priceBounds.max || 1000);
    setSearchTerm('');
  }, [priceBounds.max]);

  const activeFilterCount =
    selectedCategories.length +
    selectedSkills.length +
    selectedUniversities.length +
    selectedMajors.length +
    selectedYears.length +
    (verifiedOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minSessions > 0 ? 1 : 0) +
    (maxPrice < (priceBounds.max || 1000) ? 1 : 0);

  const retry = useCallback(() => {
    void fetchMentors(debouncedQuery);
  }, [fetchMentors, debouncedQuery]);

  return {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    selectedSkills,
    selectedUniversities,
    selectedMajors,
    selectedYears,
    verifiedOnly,
    setVerifiedOnly,
    minRating,
    setMinRating,
    minSessions,
    setMinSessions,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    showMobileFilters,
    setShowMobileFilters,
    allCategories,
    allSkills,
    allUniversities,
    allMajors,
    allYears,
    priceBounds,
    filtered,
    toggleCategory,
    toggleSkill,
    toggleUniversity,
    toggleMajor,
    toggleYear,
    clearFilters,
    activeFilterCount,
    retry,
  };
}
