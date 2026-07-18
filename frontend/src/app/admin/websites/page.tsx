'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, ImageIcon, Link2, Monitor, Plus } from 'lucide-react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { useAdminAuth, adminFetch, driveUrl } from '../lib/auth';
import { AdminModal, AdminPagination, AdminTable, DriveUpload, SectionHeader, Toggle } from '../components/AdminUI';

interface Website {
  id: number;
  nameAr: string;
  nameEn: string;
  descAr?: string;
  descEn?: string;
  url?: string;
  logoFileId?: string;
  screenshotId?: string;
  category?: string;
  order: number;
  isVisible: boolean;
}

const blankWebsite: Partial<Website> = {
  nameAr: '',
  nameEn: '',
  url: '',
  screenshotId: '',
  logoFileId: '',
  category: '',
  order: 0,
  isVisible: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'project';
}

function normalizeUrl(value?: string | null) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function hostLabel(value?: string | null) {
  try {
    const url = new URL(normalizeUrl(value));
    return url.hostname.replace(/^www\./, '');
  } catch {
    return value || 'بدون رابط';
  }
}

export default function AdminWebsitesPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Website>>(blankWebsite);
  const projectSlug = slugify(editItem.nameEn || editItem.nameAr || editItem.category || '');
  const previewUrl = normalizeUrl(editItem.url);

  const loadItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminFetch(`/websites?page=${page}&limit=25`, token);
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

  const openNew = () => {
    setEditItem(blankWebsite);
    setModalOpen(true);
  };

  const saveItem = async () => {
    if (!editItem.nameAr || !editItem.nameEn) {
      alert('اسم المشروع بالعربي والإنجليزي مطلوب');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...editItem,
        url: normalizeUrl(editItem.url),
        order: Number(editItem.order || 0),
      };
      if (editItem.id) {
        await adminFetch(`/websites/${editItem.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/websites', token, { method: 'POST', body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      await loadItems();
    } catch (error: any) {
      alert(error.message || 'تعذر حفظ مشروع الموقع');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: Website) => {
    await adminFetch(`/websites/${item.id}`, token, { method: 'DELETE' });
    await loadItems();
  };

  const columns = [
    {
      key: 'screenshotId',
      label: 'سكرين الموقع',
      render: (item: Website) => (
        item.screenshotId ? (
          <img className="admin-website-shot-thumb" src={driveUrl(item.screenshotId, 'w500')} alt={item.nameAr} />
        ) : (
          <span className="admin-website-shot-empty"><ImageIcon size={16} /></span>
        )
      ),
    },
    {
      key: 'logoFileId',
      label: 'اللوجو',
      render: (item: Website) => item.logoFileId ? <img className="admin-website-logo-thumb" src={driveUrl(item.logoFileId, 'w200')} alt={item.nameAr} /> : '-',
    },
    { key: 'nameAr', label: 'اسم المشروع' },
    { key: 'category', label: 'التصنيف' },
    {
      key: 'url',
      label: 'لينك الموقع',
      render: (item: Website) => item.url ? (
        <a className="admin-website-link" href={normalizeUrl(item.url)} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={14} />
          {hostLabel(item.url)}
        </a>
      ) : '-',
    },
    { key: 'order', label: 'الترتيب' },
    { key: 'isVisible', label: 'الحالة', render: (item: Website) => item.isVisible ? 'ظاهر' : 'مخفي' },
  ];

  return (
    <AdminPageWrapper title="مشاريع المواقع">
      <div className="admin-card">
        <SectionHeader
          title="مشاريع المواقع الحقيقية"
          description="أضف لينك الموقع وارفع سكرين واضحة منه؛ نفس البيانات تظهر في صفحة /websites العامة."
          action={<button className="admin-btn admin-btn--primary" type="button" onClick={openNew}><Plus size={16} /> إضافة موقع</button>}
        />
        <AdminTable columns={columns} data={items} loading={loading} onEdit={(item) => { setEditItem(item); setModalOpen(true); }} onDelete={deleteItem} />
        <AdminPagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>

      <AdminModal title={editItem.id ? 'تعديل مشروع موقع' : 'إضافة مشروع موقع'} open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveItem} saving={saving}>
        <div className="admin-form-grid admin-website-form">
          <div className="admin-website-preview">
            <div className="admin-website-preview-shot">
              {editItem.screenshotId ? (
                <img src={driveUrl(editItem.screenshotId, 'w900')} alt={editItem.nameAr || 'سكرين الموقع'} />
              ) : (
                <span><Monitor size={24} /> سكرين الموقع تظهر هنا</span>
              )}
            </div>
            <div className="admin-website-preview-copy">
              <span>{editItem.category || 'تصنيف المشروع'}</span>
              <strong>{editItem.nameAr || 'اسم مشروع الموقع'}</strong>
              <small>{hostLabel(editItem.url)}</small>
              {previewUrl && (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                  فتح الموقع
                </a>
              )}
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">اسم المشروع عربي</label>
              <input className="admin-input" value={editItem.nameAr || ''} onChange={event => setEditItem({ ...editItem, nameAr: event.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">اسم المشروع إنجليزي</label>
              <input className="admin-input" value={editItem.nameEn || ''} onChange={event => setEditItem({ ...editItem, nameEn: event.target.value })} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">لينك الموقع</label>
              <div className="admin-website-url-field">
                <Link2 size={16} />
                <input
                  type="url"
                  className="admin-input"
                  dir="ltr"
                  placeholder="https://example.com"
                  value={editItem.url || ''}
                  onBlur={event => setEditItem({ ...editItem, url: normalizeUrl(event.target.value) })}
                  onChange={event => setEditItem({ ...editItem, url: event.target.value })}
                />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">التصنيف</label>
              <input className="admin-input" value={editItem.category || ''} onChange={event => setEditItem({ ...editItem, category: event.target.value })} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">وصف عربي</label>
              <textarea className="admin-textarea" value={editItem.descAr || ''} onChange={event => setEditItem({ ...editItem, descAr: event.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">وصف إنجليزي</label>
              <textarea className="admin-textarea" value={editItem.descEn || ''} onChange={event => setEditItem({ ...editItem, descEn: event.target.value })} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">لوجو المشروع</label>
              <DriveUpload
                label="رفع لوجو الموقع"
                currentFileId={editItem.logoFileId}
                folderPath={`websites/${projectSlug}/logos`}
                scope="WEBSITE-LOGO"
                disabled={!editItem.nameAr && !editItem.nameEn}
                disabledReason="اكتب اسم المشروع أولا ليتم إنشاء فولدر Drive الصحيح"
                onUploaded={(result) => setEditItem({ ...editItem, logoFileId: result.fileId })}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">سكرين من الموقع</label>
              <DriveUpload
                label="رفع سكرين الموقع"
                currentFileId={editItem.screenshotId}
                folderPath={`websites/${projectSlug}/screenshots`}
                scope="WEBSITE-SCREENSHOT"
                disabled={!editItem.nameAr && !editItem.nameEn}
                disabledReason="اكتب اسم المشروع أولا ليتم إنشاء فولدر Drive الصحيح"
                onUploaded={(result) => setEditItem({ ...editItem, screenshotId: result.fileId })}
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">ترتيب الظهور</label>
              <input type="number" className="admin-input" value={editItem.order || 0} onChange={event => setEditItem({ ...editItem, order: Number(event.target.value) })} />
            </div>
            <Toggle checked={editItem.isVisible !== false} onChange={value => setEditItem({ ...editItem, isVisible: value })} label="ظاهر في الموقع" />
          </div>
        </div>
      </AdminModal>
    </AdminPageWrapper>
  );
}
