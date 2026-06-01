type Listener = () => void;

const listeners = new Set<Listener>();
let byConversation: Record<string, number> = {};

function emit() {
  listeners.forEach((listener) => listener());
}

function computeTotal(): number {
  return Object.values(byConversation).reduce((sum, count) => sum + Math.max(0, count), 0);
}

export const chatUnreadStore = {
  getTotal: computeTotal,

  getForConversation(conversationId: string): number {
    if (!conversationId) return 0;
    return Math.max(0, byConversation[conversationId] ?? 0);
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  bump(conversationId: string) {
    if (!conversationId) return;
    byConversation[conversationId] = (byConversation[conversationId] ?? 0) + 1;
    emit();
  },

  setConversationCount(conversationId: string, count: number) {
    if (!conversationId) return;
    const normalized = Math.max(0, count);
    if (normalized === 0) {
      if (!byConversation[conversationId]) return;
      delete byConversation[conversationId];
    } else {
      byConversation[conversationId] = normalized;
    }
    emit();
  },

  /** Merge server counts; keep higher local count (realtime bumps while list is stale). */
  syncFromApi(counts: Record<string, number>) {
    let changed = false;
    for (const [conversationId, apiCount] of Object.entries(counts)) {
      const local = byConversation[conversationId] ?? 0;
      const next = Math.max(local, Math.max(0, apiCount));
      if (next === 0) {
        if (byConversation[conversationId]) {
          delete byConversation[conversationId];
          changed = true;
        }
        continue;
      }
      if (byConversation[conversationId] !== next) {
        byConversation[conversationId] = next;
        changed = true;
      }
    }
    if (changed) emit();
  },

  clearConversation(conversationId: string) {
    if (!conversationId || !byConversation[conversationId]) return;
    delete byConversation[conversationId];
    emit();
  },

  reset() {
    byConversation = {};
    emit();
  },
};
