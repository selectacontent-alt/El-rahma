'use client';

import React, { useState, useEffect } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { useAdminAuth, adminFetch, driveUrl } from '../lib/auth';
import { AdminTable, AdminModal, AdminPagination, DriveUpload, SectionHeader } from '../components/AdminUI';

interface TeamMember {
  id: number;
  ring: number;
  order: number;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  bioAr: string;
  bioEn: string;
  departmentAr: string;
  departmentEn: string;
  imagePng: string;
  accent: string;
  projectTags: string; // JSON
}

const RINGS = [
  { value: 0, label: 'المدير التنفيذي (CEO - Ring 0)' },
  { value: 1, label: 'الإدارة العليا (Ring 1)' },
  { value: 2, label: 'مدراء الأقسام (Ring 2)' },
  { value: 3, label: 'أعضاء الفريق (Ring 3)' },
];

export default function AdminTeamPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<TeamMember> | null>(null);

  const loadItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminFetch(`/team?page=${page}&limit=25`, token);
      setItems(data.items || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadItems(); }, [token, page]);

  const handleSave = async () => {
    if (!token || !editItem?.nameAr || !editItem?.titleAr) {
      alert('الرجاء إدخال الاسم والمسمى الوظيفي على الأقل');
      return;
    }
    setSaving(true);
    try {
      if (editItem.id) {
        await adminFetch(`/team/${editItem.id}`, token, {
          method: 'PUT',
          body: JSON.stringify({ ...editItem, ring: Number(editItem.ring), order: Number(editItem.order) }),
        });
      } else {
        await adminFetch('/team', token, {
          method: 'POST',
          body: JSON.stringify({ ...editItem, ring: Number(editItem.ring) || 3, order: Number(editItem.order) || 0 }),
        });
      }
      setModalOpen(false);
      loadItems();
    } catch (e: any) {
      alert(e.message || 'فشل الحفظ');
    }
    setSaving(false);
  };

  const handleDelete = async (row: TeamMember) => {
    if (!token) return;
    try {
      await adminFetch(`/team/${row.id}`, token, { method: 'DELETE' });
      loadItems();
    } catch (e: any) {
      alert(e.message || 'فشل الحذف');
    }
  };

  const openAdd = () => {
    setEditItem({ ring: 3, order: 0, accent: '#6d3355' });
    setModalOpen(true);
  };

  const columns = [
    { 
      key: 'imagePng', 
      label: 'الصورة',
      render: (r: TeamMember) => (
        <img 
          src={r.imagePng ? driveUrl(r.imagePng) : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.nameAr)}&background=${r.accent.replace('#','')}&color=fff`} 
          alt={r.nameAr} 
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', border: `2px solid ${r.accent}` }} 
        />
      )
    },
    { key: 'nameAr', label: 'الاسم (عربي)' },
    { key: 'titleAr', label: 'المسمى الوظيفي' },
    { key: 'departmentAr', label: 'القسم' },
    { 
      key: 'ring', 
      label: 'المستوى (Ring)',
      render: (r: TeamMember) => RINGS.find(c => c.value === r.ring)?.label || `Ring ${r.ring}`
    },
    { key: 'order', label: 'الترتيب' },
  ];

  return (
    <AdminPageWrapper title="إدارة الفريق">
      <div className="admin-card">
        <SectionHeader
          title="أعضاء فريق العمل (Team Network)"
          description="إدارة الأشخاص اللي بيظهروا في خريطة الفريق بالصفحة الرئيسية"
          action={
            <button className="admin-btn admin-btn--primary" onClick={openAdd}>
              + إضافة عضو جديد
            </button>
          }
        />
        
        <AdminTable columns={columns} data={items} loading={loading} onEdit={r => { setEditItem(r); setModalOpen(true); }} onDelete={handleDelete} />
        <AdminPagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>

      <AdminModal
        title={editItem?.id ? 'تعديل عضو' : 'إضافة عضو جديد'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      >
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">الاسم (عربي) *</label>
              <input type="text" className="admin-input" value={editItem?.nameAr || ''} onChange={e => setEditItem({...editItem, nameAr: e.target.value})} />
            </div>
            <div className="admin-field">
              <label className="admin-label">الاسم (إنجليزي)</label>
              <input type="text" className="admin-input" value={editItem?.nameEn || ''} onChange={e => setEditItem({...editItem, nameEn: e.target.value})} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">المسمى الوظيفي (عربي) *</label>
              <input type="text" className="admin-input" value={editItem?.titleAr || ''} onChange={e => setEditItem({...editItem, titleAr: e.target.value})} />
            </div>
            <div className="admin-field">
              <label className="admin-label">المسمى الوظيفي (إنجليزي)</label>
              <input type="text" className="admin-input" value={editItem?.titleEn || ''} onChange={e => setEditItem({...editItem, titleEn: e.target.value})} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">القسم (عربي)</label>
              <input type="text" className="admin-input" value={editItem?.departmentAr || ''} onChange={e => setEditItem({...editItem, departmentAr: e.target.value})} />
            </div>
            <div className="admin-field">
              <label className="admin-label">القسم (إنجليزي)</label>
              <input type="text" className="admin-input" value={editItem?.departmentEn || ''} onChange={e => setEditItem({...editItem, departmentEn: e.target.value})} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">المستوى الوظيفي (Ring) *</label>
              <select className="admin-select" value={editItem?.ring ?? 3} onChange={e => setEditItem({...editItem, ring: Number(e.target.value)})}>
                {RINGS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">الترتيب للظهور</label>
              <input type="number" className="admin-input" value={editItem?.order || 0} onChange={e => setEditItem({...editItem, order: Number(e.target.value)})} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">اللون المميز (Accent Color)</label>
              <input type="color" className="admin-input" style={{height: 42, padding: 4}} value={editItem?.accent || '#6d3355'} onChange={e => setEditItem({...editItem, accent: e.target.value})} />
            </div>
            <div className="admin-field">
              <label className="admin-label">التاجات / التخصصات (مفصولة بفاصلة)</label>
              <input type="text" className="admin-input" placeholder="مثال: Brand systems, UX architecture" value={editItem?.projectTags ? JSON.parse(editItem.projectTags).join(', ') : ''} onChange={e => setEditItem({...editItem, projectTags: JSON.stringify(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))})} />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">صورة العضو (Google Drive) *</label>
            <DriveUpload
              label="رفع صورة العضو"
              section="team"
              currentFileId={editItem?.imagePng?.startsWith('http') || editItem?.imagePng?.startsWith('/uploads') ? undefined : editItem?.imagePng}
              onUploaded={(res) => setEditItem({...editItem, imagePng: res.fileId})}
            />
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">نبذة عن العضو (عربي)</label>
              <textarea className="admin-textarea" value={editItem?.bioAr || ''} onChange={e => setEditItem({...editItem, bioAr: e.target.value})} />
            </div>
            <div className="admin-field">
              <label className="admin-label">نبذة عن العضو (إنجليزي)</label>
              <textarea className="admin-textarea" value={editItem?.bioEn || ''} onChange={e => setEditItem({...editItem, bioEn: e.target.value})} />
            </div>
          </div>
        </div>
      </AdminModal>
    </AdminPageWrapper>
  );
}
