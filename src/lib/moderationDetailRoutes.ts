import type { AdminModerationReport } from '@/types';

export const MODERATION_LIST_SLUGS = ['all', 'people', 'reviews', 'sessions'] as const;
export type ModerationListSlug = (typeof MODERATION_LIST_SLUGS)[number];

const BASE = '/dashboard/moderation';

export function listSlugForReport(r: AdminModerationReport): ModerationListSlug {
  if (r.targetType === 'session') return 'sessions';
  if (r.targetType === 'review') return 'reviews';
  if (r.targetType === 'user' || r.targetType === 'mentor') return 'people';
  return 'all';
}

export function moderationDetailPath(slug: ModerationListSlug, reportId: string): string {
  return `${BASE}/${slug}/${reportId}`;
}

export function isModerationListSlug(s: string): s is ModerationListSlug {
  return (MODERATION_LIST_SLUGS as readonly string[]).includes(s);
}
