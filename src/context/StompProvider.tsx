'use client';

import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { buildSockJsChatUrl } from '@/lib/wsConfig';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MessageHandler = (body: string) => void;
type Unsubscribe = () => void;

interface StompContextValue {
  /** Whether the STOMP connection is currently active */
  connected: boolean;
  /**
   * Subscribe to a STOMP topic. Returns an unsubscribe function.
   * Safe to call multiple times for the same topic — handlers are stacked.
   */
  subscribe: (topic: string, handler: MessageHandler) => Unsubscribe;
}

const StompContext = createContext<StompContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function StompProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  /**
   * Registry: topic → { stompSub, handlers: Map<id, handler> }
   *
   * Multiple consumers can subscribe to the same topic.  We keep ONE
   * STOMP subscription per topic and fan-out incoming frames to all
   * registered handlers.  This is entirely ref-based so it never
   * triggers React re-renders.
   */
  const registryRef = useRef<
    Map<
      string,
      {
        stompSub: StompSubscription | null;
        handlers: Map<number, MessageHandler>;
        nextId: number;
      }
    >
  >(new Map());

  /* ---------- connect / disconnect lifecycle ---------- */

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setConnected(false);
      return undefined;
    }

    const client = new Client({
      reconnectDelay: 3000,
      webSocketFactory: () => new SockJS(buildSockJsChatUrl(token)),
    });

    client.onConnect = () => {
      setConnected(true);

      // Re-subscribe to any topics that were registered while disconnected
      registryRef.current.forEach((entry, topic) => {
        if (entry.handlers.size > 0 && !entry.stompSub) {
          entry.stompSub = client.subscribe(topic, (frame: IMessage) => {
            entry.handlers.forEach((h) => {
              try {
                h(frame.body);
              } catch {
                /* handler error — swallow */
              }
            });
          });
        }
      });
    };

    client.onDisconnect = () => setConnected(false);
    client.onWebSocketClose = () => setConnected(false);

    client.activate();
    clientRef.current = client;

    return () => {
      // Cleanup: unsubscribe all STOMP subs, clear registry, deactivate
      registryRef.current.forEach((entry) => {
        entry.stompSub?.unsubscribe();
        entry.stompSub = null;
      });
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated, token]);

  /* ---------- subscribe function (stable via useCallback) ---------- */

  const subscribe = useCallback(
    (topic: string, handler: MessageHandler): Unsubscribe => {
      // 1. Ensure registry entry exists
      let entry = registryRef.current.get(topic);
      if (!entry) {
        entry = { stompSub: null, handlers: new Map(), nextId: 0 };
        registryRef.current.set(topic, entry);
      }

      // 2. Register the handler
      const handlerId = entry.nextId++;
      entry.handlers.set(handlerId, handler);

      // 3. If this is the first handler for this topic AND we're connected,
      //    create the STOMP subscription now
      const client = clientRef.current;
      if (entry.handlers.size === 1 && !entry.stompSub && client?.connected) {
        const currentEntry = entry; // capture for closure
        entry.stompSub = client.subscribe(topic, (frame: IMessage) => {
          currentEntry.handlers.forEach((h) => {
            try {
              h(frame.body);
            } catch {
              /* handler error — swallow */
            }
          });
        });
      }

      // 4. Return unsubscribe function
      return () => {
        const e = registryRef.current.get(topic);
        if (!e) return;
        e.handlers.delete(handlerId);

        // If no more handlers, unsubscribe from STOMP topic
        if (e.handlers.size === 0 && e.stompSub) {
          e.stompSub.unsubscribe();
          e.stompSub = null;
          registryRef.current.delete(topic);
        }
      };
    },
    [],
  );

  /* ---------- render ---------- */

  const value: StompContextValue = { connected, subscribe };

  return <StompContext.Provider value={value}>{children}</StompContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useStomp(): StompContextValue {
  const ctx = useContext(StompContext);
  if (!ctx) {
    throw new Error('useStomp must be used inside <StompProvider>');
  }
  return ctx;
}
