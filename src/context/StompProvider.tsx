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
import { getAuthToken } from '@/lib/api';
import { buildSockJsChatUrl, STOMP_HEARTBEAT_MS } from '@/lib/wsConfig';

type MessageHandler = (body: string) => void;
type Unsubscribe = () => void;

export type RealtimeConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

interface StompContextValue {
  connected: boolean;
  status: RealtimeConnectionStatus;
  subscribe: (topic: string, handler: MessageHandler) => Unsubscribe;
}

const StompContext = createContext<StompContextValue | null>(null);

const MAX_RECONNECT_DELAY_MS = 30_000;

function resolveAccessToken(fallback: string | null): string | null {
  return getAuthToken() ?? fallback;
}

export function StompProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<RealtimeConnectionStatus>('idle');
  const [tokenVersion, setTokenVersion] = useState(0);

  const clientRef = useRef<Client | null>(null);
  const tokenRef = useRef<string | null>(token);

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

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    const onTokenRefreshed = () => setTokenVersion((v) => v + 1);
    window.addEventListener('auth:token-refreshed', onTokenRefreshed);
    return () => window.removeEventListener('auth:token-refreshed', onTokenRefreshed);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setConnected(false);
      setStatus('idle');
      return undefined;
    }

    const accessToken = resolveAccessToken(tokenRef.current);
    if (!accessToken) {
      setConnected(false);
      setStatus('idle');
      return undefined;
    }

    setStatus('connecting');

    const client = new Client({
      reconnectDelay: 3000,
      connectionTimeout: 10_000,
      heartbeatIncoming: STOMP_HEARTBEAT_MS,
      heartbeatOutgoing: STOMP_HEARTBEAT_MS,
      maxReconnectDelay: MAX_RECONNECT_DELAY_MS,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      webSocketFactory: () => {
        const latest = resolveAccessToken(tokenRef.current);
        if (!latest) {
          throw new Error('Missing access token for WebSocket');
        }
        return new SockJS(buildSockJsChatUrl(latest));
      },
    });

    client.onConnect = () => {
      setConnected(true);
      setStatus('connected');

      registryRef.current.forEach((entry, topic) => {
        if (entry.handlers.size > 0 && !entry.stompSub) {
          entry.stompSub = client.subscribe(topic, (frame: IMessage) => {
            entry.handlers.forEach((h) => {
              try {
                h(frame.body);
              } catch {
                /* handler error */
              }
            });
          });
        }
      });
    };

    client.onDisconnect = () => {
      setConnected(false);
      setStatus('disconnected');
    };

    client.onWebSocketClose = () => {
      setConnected(false);
      setStatus('disconnected');
    };

    client.onStompError = () => {
      setConnected(false);
      setStatus('error');
    };

    client.activate();
    clientRef.current = client;

    return () => {
      registryRef.current.forEach((entry) => {
        entry.stompSub?.unsubscribe();
        entry.stompSub = null;
      });
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
      setStatus('idle');
    };
  }, [isAuthenticated, token, tokenVersion]);

  const subscribe = useCallback((topic: string, handler: MessageHandler): Unsubscribe => {
    let entry = registryRef.current.get(topic);
    if (!entry) {
      entry = { stompSub: null, handlers: new Map(), nextId: 0 };
      registryRef.current.set(topic, entry);
    }

    const handlerId = entry.nextId++;
    entry.handlers.set(handlerId, handler);

    const client = clientRef.current;
    if (entry.handlers.size === 1 && !entry.stompSub && client?.connected) {
      const currentEntry = entry;
      entry.stompSub = client.subscribe(topic, (frame: IMessage) => {
        currentEntry.handlers.forEach((h) => {
          try {
            h(frame.body);
          } catch {
            /* handler error */
          }
        });
      });
    }

    return () => {
      const e = registryRef.current.get(topic);
      if (!e) return;
      e.handlers.delete(handlerId);

      if (e.handlers.size === 0 && e.stompSub) {
        e.stompSub.unsubscribe();
        e.stompSub = null;
        registryRef.current.delete(topic);
      }
    };
  }, []);

  const value: StompContextValue = { connected, status, subscribe };

  return <StompContext.Provider value={value}>{children}</StompContext.Provider>;
}

export function useStomp(): StompContextValue {
  const ctx = useContext(StompContext);
  if (!ctx) {
    throw new Error('useStomp must be used inside <StompProvider>');
  }
  return ctx;
}

/** Alias for transport-layer hooks */
export const useRealtime = useStomp;
