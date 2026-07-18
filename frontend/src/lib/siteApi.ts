'use client';

export const PUBLIC_API = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:5005`
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005');

export interface PublicResponse<T> {
  status?: string;
  data: T;
}

export interface SiteFetchOptions {
  cache?: RequestCache;
  signal?: AbortSignal;
}

export async function siteFetch<T>(endpoint: string, options: SiteFetchOptions = {}): Promise<T | null> {
  try {
    const response = await fetch(`${PUBLIC_API}/api/site${endpoint}`, {
      cache: options.cache || 'no-store',
      signal: options.signal,
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return (payload?.data ?? payload) as T;
  } catch {
    return null;
  }
}

function extractDriveFileId(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('/uploads')) return null;
  if (!trimmed.startsWith('http')) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    if (host.includes('drive.google.com') || host.includes('drive.usercontent.google.com')) {
      const queryId = url.searchParams.get('id');
      if (queryId) return queryId;
      const filePathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
      if (filePathMatch?.[1]) return filePathMatch[1];
    }
    if (host.includes('googleusercontent.com')) {
      const contentMatch = url.pathname.match(/\/d\/([^/=]+)/);
      if (contentMatch?.[1]) return contentMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function publicDriveUrl(fileId?: string | null, fallback?: string | null, size = 'w1200') {
  const driveFileId = extractDriveFileId(fileId) || extractDriveFileId(fallback);
  if (driveFileId) {
    return `${PUBLIC_API}/api/site/drive-image/${encodeURIComponent(driveFileId)}?size=${encodeURIComponent(size)}`;
  }

  const source = fallback || fileId || '';
  if (source.startsWith('/uploads')) return `${PUBLIC_API}${source}`;
  return source;
}
