'use client';

import React, { useEffect, useState } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { useAdminAuth, adminFetch } from '../lib/auth';
import { AdminModal, AdminPagination, AdminTable, SectionHeader, Toggle } from '../components/AdminUI';

interface AdminUser {
  id: number;
  username: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<AdminUser> & { password?: string }>({ role: 'editor', isActive: true, mustChangePassword: true });
  const [newPassword, setNewPassword] = useState('');

  const loadItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminFetch(`/users?page=${page}&limit=25`, token);
      setItems(data.items || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadItems().catch(console.error);
  }, [token, page]);

  const saveUser = async () => {
    setSaving(true);
    try {
      if (editItem.id) {
        await adminFetch(`/users/${editItem.id}`, token, { method: 'PUT', body: JSON.stringify(editItem) });
      } else {
        await adminFetch('/users', token, { method: 'POST', body: JSON.stringify(editItem) });
      }
      setModalOpen(false);
      await loadItems();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async () => {
    if (!editItem.id || newPassword.length < 10) {
      alert('Password must be at least 10 characters');
      return;
    }
    setSaving(true);
    try {
      await adminFetch(`/users/${editItem.id}/reset-password`, token, {
        method: 'POST',
        body: JSON.stringify({ password: newPassword, mustChangePassword: true }),
      });
      setResetOpen(false);
      setNewPassword('');
      await loadItems();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageWrapper title="المستخدمون والصلاحيات">
      <div className="admin-card">
        <SectionHeader title="المستخدمون والصلاحيات" description="إدارة وصول فريق العمل وفرض تغيير كلمة المرور عند الحاجة." action={<button className="admin-btn admin-btn--primary" onClick={() => { setEditItem({ username: '', password: '', role: 'editor', isActive: true, mustChangePassword: true }); setModalOpen(true); }}>+ مستخدم</button>} />
        <AdminTable
          columns={[
            { key: 'username', label: 'المستخدم' },
            { key: 'role', label: 'الصلاحية', render: (user: AdminUser) => user.role === 'admin' ? 'مدير' : 'محرر' },
            { key: 'isActive', label: 'الحالة', render: (user: AdminUser) => user.isActive ? 'نشط' : 'موقوف' },
            { key: 'mustChangePassword', label: 'تغيير كلمة المرور', render: (user: AdminUser) => user.mustChangePassword ? 'مطلوب' : '—' },
            { key: 'lastLoginAt', label: 'آخر دخول', render: (user: AdminUser) => user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('ar-EG') : '—' },
          ]}
          data={items}
          loading={loading}
          onEdit={(user) => { setEditItem(user); setModalOpen(true); }}
        />
        <AdminPagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>

      <AdminModal title={editItem.id ? 'Edit user' : 'New user'} open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveUser} saving={saving}>
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">Username</label><input className="admin-input" value={editItem.username || ''} disabled={!!editItem.id} onChange={event => setEditItem({ ...editItem, username: event.target.value })} /></div>
            {!editItem.id && <div className="admin-field"><label className="admin-label">Password</label><input type="password" className="admin-input" value={editItem.password || ''} onChange={event => setEditItem({ ...editItem, password: event.target.value })} /></div>}
          </div>
          <div className="admin-grid-3">
            <div className="admin-field">
              <label className="admin-label">Role</label>
              <select className="admin-select" value={editItem.role || 'editor'} onChange={event => setEditItem({ ...editItem, role: event.target.value as AdminUser['role'] })}>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
              </select>
            </div>
            <Toggle checked={!!editItem.isActive} onChange={value => setEditItem({ ...editItem, isActive: value })} label="Active" />
            <Toggle checked={!!editItem.mustChangePassword} onChange={value => setEditItem({ ...editItem, mustChangePassword: value })} label="Must change password" />
          </div>
          {editItem.id && <button className="admin-btn admin-btn--ghost" onClick={() => setResetOpen(true)}>Reset password</button>}
        </div>
      </AdminModal>

      <AdminModal title="Reset password" open={resetOpen} onClose={() => setResetOpen(false)} onSave={resetPassword} saving={saving}>
        <div className="admin-field">
          <label className="admin-label">New password</label>
          <input type="password" className="admin-input" value={newPassword} onChange={event => setNewPassword(event.target.value)} />
        </div>
      </AdminModal>
    </AdminPageWrapper>
  );
}
