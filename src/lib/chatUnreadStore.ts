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

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  bump(conversationId: string) {
    if (!conversationId) return;
    byConversation[conversationId] = (byConversation[conversationId] ?? 0) + 1;
    emit();
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
