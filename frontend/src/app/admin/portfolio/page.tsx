'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { AdminUploadResult, useAdminAuth, adminFetch, driveUrl } from '../lib/auth';
import { AdminTable, AdminModal, AdminPagination, DriveUpload, Toggle, SectionHeader } from '../components/AdminUI';

interface PortfolioItem {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr?: string;
  descEn?: string;
  category: string;
  image: string;
  images?: string | AdminUploadResult[];
  clientName?: string;
  link?: string;
  featured: boolean;
  isActive: boolean;
  date?: string;
  serviceIds?: number[];
  services?: ServiceOption[];
}

interface ServiceOption {
  id: number;
  titleAr: string;
  titleEn: string;
  slug?: string;
  isActive?: boolean;
}

const CATEGORIES = [
  { value: 'web', label: 'تطوير المواقع' },
  { value: 'mobile', label: 'تطبيقات الموبايل' },
  { value: 'branding', label: 'هويات بصرية' },
  { value: 'marketing', label: 'تسويق رقمي' },
  { value: 'social', label: 'سوشيال ميديا' },
];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';
}

function parseImages(value?: string | AdminUploadResult[] | null): AdminUploadResult[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function folderFor(item: Partial<PortfolioItem>, projectSlug: string) {
  return item.category === 'branding'
    ? `portfolio/visual-identities/${projectSlug}`
    : `portfolio/projects/${projectSlug}`;
}

function scopeFor(item: Partial<PortfolioItem>, suffix = 'MAIN') {
  return item.category === 'branding'
    ? `VISUAL-IDENTITY-${suffix}`
    : `PORTFOLIO-PROJECT-${suffix}`;
}

function selectedServiceIds(item?: Partial<PortfolioItem> | null): number[] {
  if (!item) return [];
  if (Array.isArray(item.serviceIds)) return [...new Set(item.serviceIds.map(Number).filter(Number.isFinite))];
  if (Array.isArray(item.services)) return [...new Set(item.services.map(service => Number(service.id)).filter(Number.isFinite))];
  return [];
}

export default function AdminPortfolioPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<PortfolioItem> | null>(null);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);

  const projectSlug = useMemo(() => slugify(editItem?.titleEn || editItem?.titleAr || editItem?.clientName || ''), [editItem?.titleAr, editItem?.titleEn, editItem?.clientName]);
  const galleryImages = parseImages(editItem?.images);
  const uploadFolder = folderFor(editItem || {}, projectSlug);

  const loadItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminFetch(`/portfolio?page=${page}&limit=25`, token);
      setItems(data.items || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  const loadServiceOptions = async () => {
    if (!token) return;
    const response = await adminFetch('/services', token);
    const data = Array.isArray(response) ? response : response?.data || response?.services || [];
    setServiceOptions(data);
  };

  useEffect(() => {
    if (!token) return;
    Promise.all([loadItems(), loadServiceOptions()]).catch(console.error);
  }, [token, page]);

  const handleSave = async () => {
    if (!token || !editItem?.titleAr || !editItem?.titleEn || !editItem?.image) {
      alert('العنوان العربي والإنجليزي والصورة الأساسية مطلوبة');
      return;
    }
    setSaving(true);
    try {
      const { id: _id, services: _services, ...itemPayload } = editItem;
      const payload = {
        ...itemPayload,
        category: editItem.category || 'web',
        images: JSON.stringify(parseImages(editItem.images)),
        serviceIds: selectedServiceIds(editItem),
      };
      if (editItem.id) {
        await adminFetch(`/portfolio/${editItem.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/portfolio', token, { method: 'POST', body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      await loadItems();
    } catch (error: any) {
      alert(error.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: PortfolioItem) => {
    await adminFetch(`/portfolio/${row.id}`, token, { method: 'DELETE' });
    await loadItems();
  };

  const openAdd = () => {
    setEditItem({ featured: false, isActive: true, category: 'web', images: [], serviceIds: [] });
    setModalOpen(true);
  };

  const appendGallery = (results: AdminUploadResult[]) => {
    setEditItem(current => ({
      ...current,
      images: [...parseImages(current?.images), ...results],
    }));
  };

  const removeGalleryImage = (index: number) => {
    setEditItem(current => ({
      ...current,
      images: parseImages(current?.images).filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const columns = [
    {
      key: 'image',
      label: 'الصورة',
      render: (row: PortfolioItem) => (
        <img src={driveUrl(row.image)} alt={row.titleAr} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
      ),
    },
    { key: 'titleAr', label: 'المشروع' },
    { key: 'category', label: 'القسم', render: (row: PortfolioItem) => CATEGORIES.find(category => category.value === row.category)?.label || row.category },
    { key: 'clientName', label: 'العميل' },
    {
      key: 'services',
      label: 'الخدمات المرتبطة',
      render: (row: PortfolioItem) => {
        const linked = row.services || serviceOptions.filter(service => selectedServiceIds(row).includes(service.id));
        return linked.length
          ? <span className="portfolio-service-count">{linked.length} خدمة</span>
          : <span className="portfolio-service-empty">بدون ربط</span>;
      },
    },
    { key: 'featured', label: 'مميز', render: (row: PortfolioItem) => row.featured ? <span style={{ color: '#ffbc01' }}>مميز</span> : '-' },
    {
      key: 'isActive',
      label: 'الحالة',
      render: (row: PortfolioItem) => <span className={`admin-badge ${row.isActive ? 'admin-badge--green' : 'admin-badge--gray'}`}>{row.isActive ? 'نشط' : 'مخفي'}</span>,
    },
  ];

  return (
    <AdminPageWrapper title="المعرض والهويات البصرية">
      <div className="admin-card">
        <SectionHeader
          title="معرض الأعمال والهويات البصرية"
          description="ارفع صور المشاريع والهويات البصرية داخل فولدرات Drive منظمة حسب اسم المشروع."
          action={<button className="admin-btn admin-btn--primary" onClick={openAdd}>+ إضافة مشروع</button>}
        />
        <AdminTable columns={columns} data={items} loading={loading} onEdit={row => { setEditItem({ ...row, images: parseImages(row.images), serviceIds: selectedServiceIds(row) }); setModalOpen(true); }} onDelete={handleDelete} />
        <AdminPagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>

      <AdminModal
        title={editItem?.id ? 'تعديل مشروع' : 'إضافة مشروع جديد'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      >
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">عنوان المشروع AR *</label>
              <input className="admin-input" value={editItem?.titleAr || ''} onChange={event => setEditItem({ ...editItem, titleAr: event.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Project title EN *</label>
              <input className="admin-input" value={editItem?.titleEn || ''} onChange={event => setEditItem({ ...editItem, titleEn: event.target.value })} />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">القسم *</label>
              <select className="admin-select" value={editItem?.category || 'web'} onChange={event => setEditItem({ ...editItem, category: event.target.value })}>
                {CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">اسم العميل</label>
              <input className="admin-input" value={editItem?.clientName || ''} onChange={event => setEditItem({ ...editItem, clientName: event.target.value })} />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">الخدمات المرتبطة بالمشروع</label>
            <p className="portfolio-service-help">اختر كل الخدمات التي ساهمت في هذا المشروع. سيظهر العمل تحت كل خدمة مرتبطة في الموقع.</p>
            <div className="portfolio-service-selector" aria-label="الخدمات المرتبطة بالمشروع">
              {serviceOptions.length ? serviceOptions.map(service => {
                const selected = selectedServiceIds(editItem).includes(service.id);
                return (
                  <label className={`portfolio-service-option ${selected ? 'portfolio-service-option--selected' : ''}`} key={service.id}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        const currentIds = selectedServiceIds(editItem);
                        setEditItem({
                          ...editItem,
                          serviceIds: selected ? currentIds.filter(id => id !== service.id) : [...currentIds, service.id],
                        });
                      }}
                    />
                    <span>
                      <strong>{service.titleAr}</strong>
                      <small>{service.titleEn}{service.isActive === false ? ' · مخفية' : ''}</small>
                    </span>
                  </label>
                );
              }) : (
                <span className="portfolio-service-empty">أضف خدمات من «خدمات النمو» أولًا لتظهر هنا.</span>
              )}
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">رابط المشروع</label>
            <input type="url" className="admin-input" placeholder="https://" value={editItem?.link || ''} onChange={event => setEditItem({ ...editItem, link: event.target.value })} />
          </div>

          <div className="admin-field">
            <label className="admin-label">الصورة الأساسية *</label>
            <DriveUpload
              label="رفع الصورة الأساسية"
              currentFileId={editItem?.image?.startsWith('http') ? undefined : editItem?.image}
              currentUrl={editItem?.image?.startsWith('http') ? editItem.image : undefined}
              folderPath={uploadFolder}
              scope={scopeFor(editItem || {}, 'MAIN')}
              disabled={!editItem?.titleAr && !editItem?.titleEn}
              disabledReason="اكتب عنوان المشروع أولا ليتم إنشاء فولدر Drive الصحيح"
              onUploaded={(result) => setEditItem({ ...editItem, image: result.fileId })}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">صور إضافية</label>
            <DriveUpload
              label="رفع صور متعددة للمعرض"
              multiple
              accept="image/*"
              folderPath={uploadFolder}
              scope={scopeFor(editItem || {}, 'GALLERY')}
              disabled={!editItem?.titleAr && !editItem?.titleEn}
              disabledReason="اكتب عنوان المشروع أولا ليتم إنشاء فولدر Drive الصحيح"
              onUploaded={() => undefined}
              onUploadedMany={appendGallery}
            />
          </div>

          {galleryImages.length > 0 && (
            <div className="admin-tag-list">
              {galleryImages.map((image, index) => (
                <span className="admin-tag" key={`${image.fileId}-${index}`}>
                  <img src={driveUrl(image.fileId || image.thumbnailUrl || image.url)} alt="" style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} />
                  {image.driveName || image.fileName || `image ${index + 1}`}
                  <button type="button" className="admin-tag-remove" onClick={() => removeGalleryImage(index)}>×</button>
                </span>
              ))}
            </div>
          )}

          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">وصف عربي</label>
              <textarea className="admin-textarea" value={editItem?.descAr || ''} onChange={event => setEditItem({ ...editItem, descAr: event.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Description EN</label>
              <textarea className="admin-textarea" value={editItem?.descEn || ''} onChange={event => setEditItem({ ...editItem, descEn: event.target.value })} />
            </div>
          </div>

          <div className="admin-grid-2" style={{ marginTop: 10, padding: 16, background: 'var(--ap-card2)', borderRadius: 8 }}>
            <Toggle label="مشروع مميز" checked={!!editItem?.featured} onChange={checked => setEditItem({ ...editItem, featured: checked })} />
            <Toggle label="نشط ومفعل" checked={editItem?.isActive !== false} onChange={checked => setEditItem({ ...editItem, isActive: checked })} />
          </div>
        </div>
      </AdminModal>
    </AdminPageWrapper>
  );
}
