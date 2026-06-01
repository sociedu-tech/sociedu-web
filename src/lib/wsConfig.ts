import { API_BASE_URL } from '@/lib/api';

/**
 * SockJS STOMP endpoint — scheme must be http/https (SockJS upgrades internally).
 */
export function buildSockJsChatUrl(token: string): string {
  const base = API_BASE_URL.replace(/\/+$/, '');
  return `${base}/ws/chat?token=${encodeURIComponent(token)}`;
}

export function notificationTopicForUser(userId: string): string {
  return `/topic/users/${userId}/notifications`;
}
