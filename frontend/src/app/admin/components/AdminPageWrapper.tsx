'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../lib/auth';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

export default function AdminPageWrapper({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login');
  }, [user, loading, router]);

  useEffect(() => {
    const cached = window.sessionStorage.getItem('select-admin-sidebar-collapsed');
    if (cached) setCollapsed(cached === 'true');
  }, []);

  const toggleSidebar = () => setCollapsed(value => {
    const next = !value;
    window.sessionStorage.setItem('select-admin-sidebar-collapsed', String(next));
    return next;
  });

  if (loading) {
    return (
      <div className="admin-root admin-boot-shell" aria-label="جاري تجهيز لوحة التحكم">
        <aside className="admin-boot-sidebar"><span /><span /><span /><span /><span /></aside>
        <main className="admin-boot-content">
          <div className="admin-boot-topbar"><span /><span /></div>
          <div className="admin-boot-heading"><span /><span /></div>
          <div className="admin-boot-grid"><span /><span /><span /></div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`admin-root admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>
      <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className="admin-shell">
        <AdminTopBar collapsed={collapsed} />
        <main className="admin-main">
          {title && (
            <div className="admin-page-heading">
              <h1 className="admin-page-title">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
