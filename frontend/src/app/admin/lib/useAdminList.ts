'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetch, useAdminAuth } from './auth';

export type AdminPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ListEnvelope<T> = {
  items: T[];
  pagination: AdminPagination;
};

export function useAdminList<T>(endpoint: string, parameters: Record<string, string | number | undefined> = {}) {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState<AdminPagination>({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = useMemo(() => JSON.stringify(parameters), [parameters]);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const parsed = JSON.parse(query) as Record<string, string | number | undefined>;
      const search = new URLSearchParams();
      Object.entries(parsed).forEach(([key, value]) => { if (value !== undefined && value !== '') search.set(key, String(value)); });
      const data = await adminFetch(`${endpoint}${search.size ? `?${search.toString()}` : ''}`, token, { signal }) as ListEnvelope<T>;
      if (signal?.aborted) return;
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, limit: 25, total: data.items?.length || 0, totalPages: 1 });
    } catch (requestError: any) {
      if (requestError?.name !== 'AbortError') setError(requestError?.message || 'تعذر تحميل البيانات');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [endpoint, query, token]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { items, setItems, pagination, loading, error, refresh: load };
}
