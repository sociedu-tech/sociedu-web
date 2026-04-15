import { api, postMultipart } from '@/lib/api';

const BASE = '/api/v1/files';

export type FileUploadOptions = {
  folder?: string;
  visibility?: string;
  entityType?: string;
  entityId?: number;
};

export const fileService = {
  upload: async (file: File, options: FileUploadOptions = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    const params = new URLSearchParams();
    if (options.folder != null) params.set('folder', options.folder);
    if (options.visibility != null) params.set('visibility', options.visibility);
    if (options.entityType != null) params.set('entityType', options.entityType);
    if (options.entityId != null) params.set('entityId', String(options.entityId));
    const q = params.toString();
    const res = await postMultipart(q ? `${BASE}?${q}` : BASE, formData);
    return res.data;
  },
  getById: async (id: number | string) => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data;
  },
  delete: async (id: number | string) => {
    const res = await api.delete(`${BASE}/${id}`);
    return res.data;
  },
};
