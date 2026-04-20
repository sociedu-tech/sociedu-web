import { useEffect, useState } from 'react';
import { loadInitialDemoOffers, saveDemoOffers, type DemoMentorOffer } from '@/data/projectOfferDemoStorage';

export function useMenteeIncomingOffers() {
  const [rows, setRows] = useState<DemoMentorOffer[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRows(loadInitialDemoOffers());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveDemoOffers(rows);
  }, [rows, mounted]);

  const pending = rows.filter((r) => r.status === 'pending');

  const setStatus = (id: string, status: 'accepted' | 'declined') => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return { mounted, pending, setStatus };
}
