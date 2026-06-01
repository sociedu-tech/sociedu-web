import type { ChatAttachment, ChatMessage, Conversation } from './types';

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function avatarUrlForUser(userId?: string | null, avatarFileId?: string | null): string | undefined {
  const seed = avatarFileId?.trim() || userId?.trim();
  if (!seed) return undefined;
  return `https://i.pravatar.cc/300?u=${encodeURIComponent(seed)}`;
}

export function sortConversationsByRecent(items: Conversation[]): Conversation[] {
  return [...items].sort((a, b) => {
    const ta = a.sortAt ? new Date(a.sortAt).getTime() : 0;
    const tb = b.sortAt ? new Date(b.sortAt).getTime() : 0;
    return tb - ta;
  });
}

/** Một hội thoại / peer — ưu tiên general, rồi tin nhắn mới nhất. */
export function dedupeConversationsByPeer(items: Conversation[]): Conversation[] {
  const byPeer = new Map<string, Conversation>();
  const order: string[] = [];

  for (const item of items) {
    const key = item.peerUserId?.trim() || item.id;
    if (!byPeer.has(key)) {
      order.push(key);
      byPeer.set(key, item);
      continue;
    }
    byPeer.set(key, pickPreferredConversation(byPeer.get(key)!, item));
  }

  return sortConversationsByRecent(order.map((key) => byPeer.get(key)!));
}

function pickPreferredConversation(a: Conversation, b: Conversation): Conversation {
  if (a.type === 'general' && b.type !== 'general') return a;
  if (b.type === 'general' && a.type !== 'general') return b;

  const ta = a.sortAt ? new Date(a.sortAt).getTime() : 0;
  const tb = b.sortAt ? new Date(b.sortAt).getTime() : 0;
  return tb > ta ? b : a;
}

export function collectAttachments(messages: ChatMessage[]): { images: ChatAttachment[]; files: ChatAttachment[] } {
  const images: ChatAttachment[] = [];
  const files: ChatAttachment[] = [];
  for (const m of messages) {
    for (const a of m.attachments ?? []) {
      if (a.kind === 'image') images.push(a);
      else files.push(a);
    }
  }
  return { images, files };
}
