import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appendDemoOffer } from '@/data/projectOfferDemoStorage';
import {
  MOCK_REQUESTS,
  MOCK_SUGGESTED,
  findOpportunity,
} from '@/data/mentorOpportunitiesMock';

export type MentorOffer = {
  projectId: string;
  roadmap: string;
  priceVnd: number;
  durationWeeks: number;
  status: 'sent';
  sentAt?: string;
};

export type MentorOpportunityDraft = { roadmap: string; price: string; weeks: string };

export type MentorOpportunityTabId = 'suggested' | 'requests' | 'sent';

export function formatVnd(n: number) {
  return `${n.toLocaleString('vi-VN')}đ`;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

export function useMentorProjectOpportunitiesPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Record<string, MentorOffer>>({});
  const [openFormId, setOpenFormId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, MentorOpportunityDraft>>({});
  const [tab, setTab] = useState<MentorOpportunityTabId>('suggested');

  const pendingSuggested = useMemo(
    () => MOCK_SUGGESTED.filter((p) => offers[p.id]?.status !== 'sent'),
    [offers],
  );
  const pendingRequests = useMemo(
    () => MOCK_REQUESTS.filter((p) => offers[p.id]?.status !== 'sent'),
    [offers],
  );
  const sentItems = useMemo(
    () => [...MOCK_SUGGESTED, ...MOCK_REQUESTS].filter((p) => offers[p.id]?.status === 'sent'),
    [offers],
  );

  const onTabChange = useCallback((t: MentorOpportunityTabId) => {
    setTab(t);
    setOpenFormId(null);
  }, []);

  const updateDraft = useCallback((projectId: string, field: keyof MentorOpportunityDraft, value: string) => {
    setDrafts((d) => ({
      ...d,
      [projectId]: { ...(d[projectId] ?? { roadmap: '', price: '', weeks: '4' }), [field]: value },
    }));
  }, []);

  const sendOffer = useCallback(
    (projectId: string) => {
      const meta = findOpportunity(projectId);
      const d = drafts[projectId] ?? { roadmap: '', price: '', weeks: '4' };
      const priceNum = Number(String(d.price).replace(/\D/g, '')) || 0;
      const weeks = Math.max(1, parseInt(d.weeks, 10) || 4);
      if (!d.roadmap.trim() || priceNum <= 0 || !meta) return;

      setOffers((o) => ({
        ...o,
        [projectId]: {
          projectId,
          roadmap: d.roadmap.trim(),
          priceVnd: priceNum,
          durationWeeks: weeks,
          status: 'sent',
          sentAt: new Date().toISOString(),
        },
      }));
      appendDemoOffer({
        id: `offer-${projectId}-${Date.now()}`,
        projectTitle: meta.title,
        mentorName: user?.fullName?.trim() || 'Mentor',
        roadmap: d.roadmap.trim(),
        priceVnd: priceNum,
        weeks,
        status: 'pending',
      });
      setOpenFormId(null);
      setTab('sent');
    },
    [drafts, user?.fullName],
  );

  const getDraft = useCallback(
    (projectId: string): MentorOpportunityDraft =>
      drafts[projectId] ?? { roadmap: '', price: '', weeks: '4' },
    [drafts],
  );

  return {
    offers,
    openFormId,
    setOpenFormId,
    drafts,
    tab,
    onTabChange,
    updateDraft,
    sendOffer,
    getDraft,
    pendingSuggested,
    pendingRequests,
    sentItems,
  };
}
