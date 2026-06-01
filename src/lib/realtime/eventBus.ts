export const REALTIME_CHANNELS = {
  NOTIFICATION: 'notification',
  CHAT_MESSAGE: 'chat:message',
} as const;

export type RealtimeChannel = (typeof REALTIME_CHANNELS)[keyof typeof REALTIME_CHANNELS];

type Handler = (payload: unknown) => void;

class RealtimeEventBus {
  private listeners = new Map<string, Set<Handler>>();

  emit(channel: RealtimeChannel, payload: unknown): void {
    const handlers = this.listeners.get(channel);
    if (!handlers?.size) return;
    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch {
        /* isolate handler failures */
      }
    });
  }

  subscribe(channel: RealtimeChannel, handler: Handler): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    const set = this.listeners.get(channel)!;
    set.add(handler);
    return () => {
      set.delete(handler);
      if (!set.size) {
        this.listeners.delete(channel);
      }
    };
  }
}

export const realtimeEventBus = new RealtimeEventBus();
