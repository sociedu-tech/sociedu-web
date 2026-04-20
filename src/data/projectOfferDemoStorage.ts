/** Demo: đồng bộ đề xuất mentor → học viên qua sessionStorage (thay API sau). */
export const DEMO_OFFERS_STORAGE_KEY = 'unishare_demo_mentor_offers_v2';

export type DemoMentorOffer = {
  id: string;
  projectTitle: string;
  mentorName: string;
  roadmap: string;
  priceVnd: number;
  weeks: number;
  status: 'pending' | 'accepted' | 'declined';
};

export function loadDemoOffers(): DemoMentorOffer[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(DEMO_OFFERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DemoMentorOffer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDemoOffers(rows: DemoMentorOffer[]) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(DEMO_OFFERS_STORAGE_KEY, JSON.stringify(rows));
}

export function appendDemoOffer(offer: DemoMentorOffer) {
  const cur = loadDemoOffers();
  saveDemoOffers([offer, ...cur.filter((o) => o.id !== offer.id)]);
}

export const SEED_DEMO_OFFERS: DemoMentorOffer[] = [
  {
    id: 'offer-seed-1',
    projectTitle: 'Đồ án tốt nghiệp — Review',
    mentorName: 'Phạm Minh An',
    roadmap:
      'Tuần 1–2: khung chương và tài liệu; Tuần 3–5: draft và feedback; Tuần 6: chỉnh slide bảo vệ.',
    priceVnd: 3_200_000,
    weeks: 6,
    status: 'pending',
  },
];

export function loadInitialDemoOffers(): DemoMentorOffer[] {
  if (typeof window === 'undefined') return SEED_DEMO_OFFERS;
  const s = loadDemoOffers();
  if (s.length) return s;
  saveDemoOffers(SEED_DEMO_OFFERS);
  return SEED_DEMO_OFFERS;
}
