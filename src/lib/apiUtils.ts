/** Helpers for Spring `ApiResponse` + `Page` payloads from sociedu-api. */

export type PagePayload<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  sort?: string | null;
};

export const DEFAULT_PAGE_SIZE = 20;

export const normalizePagePayload = <T>(payload: unknown, fallbackSize = DEFAULT_PAGE_SIZE): PagePayload<T> => {
  if (Array.isArray(payload)) {
    return {
      items: payload as T[],
      page: 0,
      size: fallbackSize,
      total: payload.length,
      totalPages: payload.length > 0 ? 1 : 0,
    };
  }
  if (!isRecord(payload)) {
    return { items: [], page: 0, size: fallbackSize, total: 0, totalPages: 0 };
  }
  const items = unwrapList<T>(payload);
  const page = typeof payload.page === 'number' ? payload.page : typeof payload.number === 'number' ? payload.number : 0;
  const size = typeof payload.size === 'number' ? payload.size : fallbackSize;
  const total =
    typeof payload.total === 'number'
      ? payload.total
      : typeof payload.totalElements === 'number'
        ? payload.totalElements
        : items.length;
  const totalPages =
    typeof payload.totalPages === 'number'
      ? payload.totalPages
      : size > 0
        ? Math.max(1, Math.ceil(total / size))
        : 0;
  return { items, page, size, total, totalPages };
};

export const buildPageQuery = (params?: {
  page?: number;
  size?: number;
  sort?: string;
  extra?: Record<string, string | number | undefined | null>;
}): string => {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.size != null) sp.set('size', String(params.size));
  if (params?.sort) sp.set('sort', params.sort);
  if (params?.extra) {
    for (const [k, v] of Object.entries(params.extra)) {
      if (v === undefined || v === null || v === '') continue;
      sp.set(k, String(v));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export type SpringPage<T> = {
  content?: T[];
  items?: T[];
  totalElements?: number;
  total?: number;
  totalPages?: number;
  number?: number;
  page?: number;
  size?: number;
};

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const unwrapList = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (!isRecord(payload)) return [];

  const content = payload.content ?? payload.items ?? payload.records ?? payload.results;
  if (Array.isArray(content)) return content as T[];

  const inner = payload.data;
  if (Array.isArray(inner)) return inner as T[];
  if (isRecord(inner)) {
    const nested = inner.content ?? inner.items ?? inner.records ?? inner.results;
    if (Array.isArray(nested)) return nested as T[];
  }

  return [];
};

export const unwrapPage = <T>(payload: unknown): { items: T[]; total: number } => {
  const items = unwrapList<T>(payload);
  if (!isRecord(payload)) return { items, total: items.length };

  const total =
    typeof payload.totalElements === 'number'
      ? payload.totalElements
      : typeof payload.total === 'number'
        ? payload.total
        : items.length;

  return { items, total };
};

export const formatViDateTime = (raw?: string | null): string => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const shortId = (id?: string | null, len = 8): string => {
  if (!id) return '—';
  const s = String(id);
  return s.length <= len ? s : s.slice(0, len);
};
