'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type EventHandler<T = unknown> = (payload: T) => void;

export type WsEvent<T = unknown> = {
  channel?: string;
  event?: string;
  type?: string;
  payload?: T;
  [key: string]: unknown;
};

interface WebSocketContextType {
  isConnected: boolean;
  status: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';
  send: (payload: unknown) => boolean;
  subscribe: <T = unknown>(channel: string, handler: EventHandler<T>) => () => void;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WS_BASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_BASE_URL) || 'ws://localhost:9999/ws';

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const subscriptionsRef = useRef(new Map<string, Set<EventHandler>>());
  const shouldReconnectRef = useRef(true);

  const [status, setStatus] = useState<WebSocketContextType['status']>('idle');

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const getReconnectDelay = (attempt: number) => Math.min(1000 * 2 ** attempt, 15000);

  const notifySubscribers = useCallback((raw: WsEvent) => {
    const channel = String(raw.channel || raw.event || raw.type || 'unknown');
    const listeners = subscriptionsRef.current.get(channel);

    if (!listeners?.size) {
      return;
    }

    listeners.forEach((handler) => {
      handler(raw.payload ?? raw);
    });
  }, []);

  const connect = useCallback(() => {
    if (!isAuthenticated || !token || typeof window === 'undefined') {
      return;
    }

    const activeState = socketRef.current?.readyState;
    if (activeState === WebSocket.CONNECTING || activeState === WebSocket.OPEN) {
      return;
    }

    clearReconnectTimer();
    setStatus(reconnectAttemptsRef.current > 0 ? 'reconnecting' : 'connecting');

    const url = new URL(WS_BASE_URL);
    url.searchParams.set('token', token);

    const ws = new WebSocket(url.toString());
    socketRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as WsEvent;
        notifySubscribers(parsed);
      } catch {
        // Ignore invalid events to keep ws channel alive.
      }
    };

    ws.onerror = () => {
      setStatus('error');
    };

    ws.onclose = () => {
      setStatus('disconnected');
      socketRef.current = null;

      if (!shouldReconnectRef.current || !isAuthenticated) {
        return;
      }

      reconnectAttemptsRef.current += 1;
      const delay = getReconnectDelay(reconnectAttemptsRef.current);
      reconnectTimerRef.current = setTimeout(connect, delay);
    };
  }, [isAuthenticated, notifySubscribers, token]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimer();
    reconnectAttemptsRef.current = 0;
    socketRef.current?.close();
    socketRef.current = null;
    setStatus('disconnected');
  }, []);

  const send = useCallback((payload: unknown) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(payload));
    return true;
  }, []);

  const subscribe = useCallback(<T,>(channel: string, handler: EventHandler<T>) => {
    if (!subscriptionsRef.current.has(channel)) {
      subscriptionsRef.current.set(channel, new Set());
    }

    const listeners = subscriptionsRef.current.get(channel);
    listeners?.add(handler as EventHandler);

    return () => {
      listeners?.delete(handler as EventHandler);
      if (!listeners?.size) {
        subscriptionsRef.current.delete(channel);
      }
    };
  }, []);

  useEffect(() => {
    shouldReconnectRef.current = true;
    if (isAuthenticated && token) {
      connect();
      return () => disconnect();
    }

    disconnect();
    return undefined;
  }, [connect, disconnect, isAuthenticated, token]);

  useEffect(
    () => () => {
      shouldReconnectRef.current = false;
      disconnect();
    },
    [disconnect],
  );

  const value = useMemo(
    () => ({
      isConnected: status === 'connected',
      status,
      send,
      subscribe,
      connect,
      disconnect,
    }),
    [connect, disconnect, send, status, subscribe],
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }

  return context;
};
