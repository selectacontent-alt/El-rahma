'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { AdminPagination, AdminTable, SectionHeader } from '../components/AdminUI';
import { useAdminList } from '../lib/useAdminList';

interface AuditLog {
  id: number;
  action: string;
  method: string;
  path: string;
  entity?: string;
  statusCode?: number;
  createdAt: string;
  user?: { username: string; role?: string };
}

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);
  const { items, pagination, loading, error, refresh } = useAdminList<AuditLog>('/audit', { page, limit: 25 });
  return (
    <AdminPageWrapper title="سجل النشاط">
      <div className="admin-card admin-card--table-page">
        <SectionHeader title="سجل تغييرات لوحة التحكم" description="تتبع عمليات الحفظ والتعديل والحذف حسب المستخدم والتوقيت." action={<span className="admin-record-count"><Activity size={15} />{pagination.total.toLocaleString('ar-EG')} عملية</span>} />
        {error ? <div className="admin-inline-error"><div><strong>تعذر تحميل السجل</strong><span>{error}</span></div><button className="admin-btn admin-btn--ghost" type="button" onClick={() => void refresh()}>إعادة المحاولة</button></div> : <><AdminTable columns={[
          { key: 'createdAt', label: 'التوقيت', render: (log: AuditLog) => new Date(log.createdAt).toLocaleString('ar-EG') },
          { key: 'user', label: 'المستخدم', render: (log: AuditLog) => <span className="admin-cell-primary"><strong>{log.user?.username || 'النظام'}</strong><small>{log.user?.role || 'system'}</small></span> },
          { key: 'method', label: 'الإجراء' },
          { key: 'entity', label: 'النوع', render: (log: AuditLog) => log.entity || '—' },
          { key: 'path', label: 'المسار' },
          { key: 'statusCode', label: 'النتيجة', render: (log: AuditLog) => <span className={log.statusCode && log.statusCode >= 400 ? 'admin-status-code admin-status-code--error' : 'admin-status-code'}>{log.statusCode || '—'}</span> },
        ]} data={items} loading={loading} /><AdminPagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onChange={setPage} /></>}
      </div>
    </AdminPageWrapper>
  );
}
