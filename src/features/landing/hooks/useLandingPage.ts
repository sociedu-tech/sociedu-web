import { useEffect, useState } from 'react';

export function useLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const scrollToHash = () => {
      const raw = window.location.hash;
      if (!raw || raw === '#') return;
      const id = decodeURIComponent(raw.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    scrollToHash();
    const t = window.setTimeout(scrollToHash, 100);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return { openFaq, setOpenFaq };
}
