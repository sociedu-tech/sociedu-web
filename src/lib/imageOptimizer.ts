const IMAGE_TYPES_TO_COMPRESS = new Set(['image/jpeg', 'image/png', 'image/webp']);
const DEFAULT_MAX_DIMENSION = 1920;
const DEFAULT_WEBP_QUALITY = 0.82;

const optimizedImageCache = new Map<string, Promise<File>>();

const buildCacheKey = (file: File): string =>
  [file.name, file.type, file.size, file.lastModified].join(':');

const webpFileNameFor = (fileName: string): string => {
  const withoutExtension = fileName.replace(/\.[^.]+$/, '');
  return `${withoutExtension || 'image'}.webp`;
};

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });

const compressImageToWebp = async (file: File): Promise<File> => {
  if (typeof window === 'undefined' || !IMAGE_TYPES_TO_COMPRESS.has(file.type)) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, DEFAULT_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * ratio));
  const height = Math.max(1, Math.round(bitmap.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await canvasToBlob(canvas, DEFAULT_WEBP_QUALITY);
  if (!blob) return file;

  return new File([blob], webpFileNameFor(file.name), {
    type: 'image/webp',
    lastModified: file.lastModified,
  });
};

export const optimizeImageForUpload = (file: File): Promise<File> => {
  const cacheKey = buildCacheKey(file);
  const cached = optimizedImageCache.get(cacheKey);
  if (cached) return cached;

  const promise = compressImageToWebp(file).catch(() => file);
  optimizedImageCache.set(cacheKey, promise);
  return promise;
};
