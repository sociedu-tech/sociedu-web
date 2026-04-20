export type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'price-asc', label: 'Giá: thấp → cao' },
  { value: 'price-desc', label: 'Giá: cao → thấp' },
];

export function formatMentorPrice(value?: number) {
  if (value === undefined || value === null) return 'Liên hệ';
  return `$${value}`;
}
