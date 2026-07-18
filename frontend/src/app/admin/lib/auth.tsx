'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const API = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:5005`
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005');

interface User {
  id: number;
  username: string;
  role: string;
  mustChangePassword?: boolean;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface AdminUploadResult {
  assetId?: number;
  fileId: string;
  fileName: string;
  originalName?: string;
  driveName?: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  folder?: string;
  folderPath?: string;
  scope?: string;
  sizeBytes?: number;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
const ADMIN_USER_CACHE_KEY = 'select-admin-user';

function readCachedUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = window.sessionStorage.getItem(ADMIN_USER_CACHE_KEY);
    return cached ? JSON.parse(cached) as User : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.sessionStorage.setItem(ADMIN_USER_CACHE_KEY, JSON.stringify(user));
    } else {
      window.sessionStorage.removeItem(ADMIN_USER_CACHE_KEY);
    }
  } catch {
    // Session cache is only a speed hint; ignore storage failures.
  }
}

async function refreshSession() {
  const response = await fetch(`${API}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  return response.ok;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const cachedUser = readCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
      setToken('cookie-session');
      setLoading(false);
    }

    const loadSession = async () => {
      try {
        let response = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
        if (response.status === 401 && await refreshSession()) {
          response = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
        }
        if (response.ok) {
          const data = await response.json();
          if (active) {
            setUser(data);
            setToken('cookie-session');
            writeCachedUser(data);
          }
        } else if (active) {
          setUser(null);
          setToken(null);
          writeCachedUser(null);
        }
      } catch {
        if (active) {
          setUser(null);
          setToken(null);
          writeCachedUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadSession();
    return () => { active = false; };
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'بيانات الدخول غير صحيحة' }));
      throw new Error(error.message || 'بيانات الدخول غير صحيحة');
    }
    const data = await response.json();
    setToken('cookie-session');
    setUser(data.user);
    writeCachedUser(data.user);
  };

  const logout = useCallback(() => {
    fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      setToken(null);
      setUser(null);
      writeCachedUser(null);
      window.location.href = '/admin/login';
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AuthContext);

export async function adminFetch(endpoint: string, token?: string | null, options: RequestInit = {}) {
  const request = () => fetch(`${API}/api/admin${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let response = await request();
  if (response.status === 401 && await refreshSession()) response = await request();
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export async function adminUpload(
  fileOrFiles: File | File[],
  token?: string | null,
  options: string | { section?: string; folderPath?: string; folder?: string; scope?: string } = {}
): Promise<AdminUploadResult | { files: AdminUploadResult[] }> {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  const uploadOptions = typeof options === 'string' ? { section: options, folderPath: options } : options;
  const body = new FormData();

  if (files.length === 1) {
    body.append('file', files[0]);
  } else {
    files.forEach(file => body.append('files', file));
    body.append('multiple', 'true');
  }
  if (uploadOptions.section) body.append('section', uploadOptions.section);
  if (uploadOptions.folderPath || uploadOptions.folder) body.append('folderPath', uploadOptions.folderPath || uploadOptions.folder || '');
  if (uploadOptions.scope) body.append('scope', uploadOptions.scope);

  let response = await fetch(`${API}/api/admin/upload/drive`, {
    method: 'POST',
    credentials: 'include',
    body,
  });
  if (response.status === 401 && await refreshSession()) {
    response = await fetch(`${API}/api/admin/upload/drive`, {
      method: 'POST',
      credentials: 'include',
      body,
    });
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'فشل رفع الملف على Google Drive' }));
    throw new Error(error.message || 'فشل رفع الملف على Google Drive');
  }
  return response.json();
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

export function driveUrl(fileId?: string | null, size = 'w1000') {
  const driveFileId = extractDriveFileId(fileId);
  if (driveFileId) return `${API}/api/site/drive-image/${encodeURIComponent(driveFileId)}?size=${encodeURIComponent(size)}`;
  if (!fileId) return '';
  if (fileId.startsWith('/uploads')) return `${API}${fileId}`;
  return fileId;
}

export function driveViewUrl(fileId?: string | null) {
  if (!fileId) return '';
  if (fileId.startsWith('http')) return fileId;
  if (fileId.startsWith('/uploads')) return `${API}${fileId}`;
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}
