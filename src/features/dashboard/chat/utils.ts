import type { ChatAttachment, ChatMessage } from './types';

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
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
