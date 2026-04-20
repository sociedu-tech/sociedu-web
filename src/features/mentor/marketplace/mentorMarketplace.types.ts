import type { Dispatch, SetStateAction } from 'react';
import type { User } from '@/types';
import type { SortKey } from '@/features/mentor/marketplace/mentorMarketplace.constants';

export type MentorMarketplaceViewModel = {
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  verifiedOnly: boolean;
  setVerifiedOnly: Dispatch<SetStateAction<boolean>>;
  maxPrice: number;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  sortBy: SortKey;
  setSortBy: Dispatch<SetStateAction<SortKey>>;
  showMobileFilters: boolean;
  setShowMobileFilters: Dispatch<SetStateAction<boolean>>;
  allCategories: string[];
  priceBounds: { min: number; max: number };
  filtered: User[];
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  retry: () => void;
};
