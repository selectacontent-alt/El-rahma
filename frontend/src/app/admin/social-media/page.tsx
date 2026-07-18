'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { AdminUploadResult, useAdminAuth, adminFetch, driveUrl } from '../lib/auth';
import { AdminModal, AdminTable, DriveUpload, SectionHeader, Toggle } from '../components/AdminUI';

interface SocialMediaCategory {
  id: number;
  nameAr: string;
  nameEn?: string;
  keyword: string;
  descriptionAr?: string;
  descriptionEn?: string;
  images?: string | AdminUploadResult[];
  order: number;
  isActive?: boolean;
}

const blankCategory: Partial<SocialMediaCategory> = { nameAr: '', nameEn: '', keyword: '', order: 0, isActive: true, images: [] };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'category';
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

export default function AdminSocialMediaPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<SocialMediaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<SocialMediaCategory>>(blankCategory);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const categorySlug = useMemo(() => slugify(editItem.keyword || editItem.nameEn || editItem.nameAr || ''), [editItem.keyword, editItem.nameAr, editItem.nameEn]);
  const editImages = parseImages(editItem.images);
  const selectedCategory = useMemo(
    () => items.find(item => item.id === selectedCategoryId) || items[0] || null,
    [items, selectedCategoryId]
  );
  const selectedCategoryImages = selectedCategory ? parseImages(selectedCategory.images) : [];

  const loadItems = async () => {
    setLoading(true);
    try {
      setItems(await adminFetch('/social-media-categories', token));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadItems().catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!items.length) {
      setSelectedCategoryId(null);
      return;
    }
    setSelectedCategoryId(current => (
      current && items.some(item => item.id === current) ? current : items[0].id
    ));
  }, [items]);

  const openNewCategory = () => {
    setEditItem(blankCategory);
    setModalOpen(true);
  };

  const openCategoryEditor = (item: SocialMediaCategory) => {
    setSelectedCategoryId(item.id);
    setEditItem({ ...item, images: parseImages(item.images) });
    setModalOpen(true);
  };

  const appendImages = (results: AdminUploadResult[]) => {
    setEditItem(current => ({
      ...current,
      images: [...parseImages(current.images), ...results],
    }));
  };

  const removeImage = (index: number) => {
    setEditItem(current => ({
      ...current,
      images: parseImages(current.images).filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const saveItem = async () => {
    if (!editItem.nameAr || !editItem.keyword) {
      alert('اسم التصنيف والكلمة المفتاحية مطلوبين');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editItem,
        keyword: slugify(editItem.keyword),
        order: Number(editItem.order || 0),
        images: parseImages(editItem.images),
      };
      let saved: SocialMediaCategory;
      if (editItem.id) {
        saved = await adminFetch(`/social-media-categories/${editItem.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        saved = await adminFetch('/social-media-categories', token, { method: 'POST', body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      setSelectedCategoryId(saved.id);
      await loadItems();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: SocialMediaCategory) => {
    await adminFetch(`/social-media-categories/${item.id}`, token, { method: 'DELETE' });
    await loadItems();
  };

  return (
    <AdminPageWrapper title="تصميمات السوشيال">
      <div className="admin-card">
        <SectionHeader
          title="تصنيفات السوشيال ميديا"
          description="كل تصنيف له فولدر صور مخصص على Drive حسب keyword."
          action={<button className="admin-btn admin-btn--primary" onClick={openNewCategory}>+ إضافة تصنيف</button>}
        />
        <div className="admin-social-sphere-panel">
          <div className="admin-social-sphere-head">
            <div>
              <span className="admin-badge admin-badge--purple">صور الكورة</span>
              <h4>القسم المختار: {selectedCategory?.nameAr || 'لا يوجد قسم'}</h4>
              <p>
                {selectedCategory
                  ? `${selectedCategoryImages.length} صورة مرتبطة بهذا القسم وتظهر عند اختياره في الصفحة العامة.`
                  : 'أضف أول تصنيف ثم ارفع الصور الخاصة به.'}
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={!selectedCategory}
              onClick={() => selectedCategory && openCategoryEditor(selectedCategory)}
            >
              تعديل صور الكورة
            </button>
          </div>
          <div className="admin-social-category-grid">
            {items.map(item => {
              const images = parseImages(item.images);
              const isSelected = item.id === selectedCategory?.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`admin-social-category-card${isSelected ? ' admin-social-category-card--active' : ''}`}
                  onClick={() => setSelectedCategoryId(item.id)}
                >
                  <span className="admin-social-category-thumb">
                    {images[0] ? (
                      <img src={driveUrl(images[0].fileId || images[0].thumbnailUrl || images[0].url)} alt={item.nameAr} />
                    ) : (
                      <span>{item.nameAr?.slice(0, 2) || 'SC'}</span>
                    )}
                  </span>
                  <span className="admin-social-category-info">
                    <strong>{item.nameAr}</strong>
                    <small>{item.keyword}</small>
                  </span>
                  <span className="admin-badge admin-badge--gray">{images.length} صور</span>
                </button>
              );
            })}
          </div>
        </div>
        <AdminTable
          columns={[
            { key: 'order', label: 'الترتيب' },
            {
              key: 'images',
              label: 'الصور',
              render: (item: SocialMediaCategory) => {
                const images = parseImages(item.images);
                return images.length ? (
                  <div className="admin-tag-list">
                    {images.slice(0, 4).map((image, index) => (
                      <img key={`${image.fileId}-${index}`} src={driveUrl(image.fileId || image.thumbnailUrl || image.url)} alt={image.originalName || item.nameAr} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                    ))}
                    {images.length > 4 && <span className="admin-badge admin-badge--purple">+{images.length - 4}</span>}
                  </div>
                ) : '-';
              },
            },
            { key: 'nameAr', label: 'اسم التصنيف' },
            { key: 'nameEn', label: 'الاسم الإنجليزي' },
            { key: 'keyword', label: 'Keyword' },
            { key: 'isActive', label: 'الحالة', render: (item: SocialMediaCategory) => item.isActive === false ? 'مخفي' : 'نشط' },
          ]}
          data={items}
          loading={loading}
          onEdit={openCategoryEditor}
          onDelete={deleteItem}
        />
      </div>
      <AdminModal title={editItem.id ? 'تعديل تصنيف' : 'إضافة تصنيف'} open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveItem} saving={saving}>
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">اسم التصنيف عربي</label><input className="admin-input" value={editItem.nameAr || ''} onChange={event => setEditItem({ ...editItem, nameAr: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">اسم التصنيف إنجليزي</label><input className="admin-input" value={editItem.nameEn || ''} onChange={event => setEditItem({ ...editItem, nameEn: event.target.value })} /></div>
          </div>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">Keyword / folder slug</label><input className="admin-input" value={editItem.keyword || ''} onChange={event => setEditItem({ ...editItem, keyword: slugify(event.target.value) })} /></div>
            <div className="admin-field"><label className="admin-label">ترتيب الظهور</label><input type="number" className="admin-input" value={editItem.order || 0} onChange={event => setEditItem({ ...editItem, order: Number(event.target.value) })} /></div>
          </div>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">وصف عربي</label><textarea className="admin-textarea" value={editItem.descriptionAr || ''} onChange={event => setEditItem({ ...editItem, descriptionAr: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">وصف إنجليزي</label><textarea className="admin-textarea" value={editItem.descriptionEn || ''} onChange={event => setEditItem({ ...editItem, descriptionEn: event.target.value })} /></div>
          </div>
          <div className="admin-field">
            <label className="admin-label">صور الكورة لهذا القسم</label>
            <p className="admin-field-hint">ارفع أكثر من صورة مرة واحدة. الصور ستتحفظ في فولدر Drive الخاص بـ {categorySlug} وتظهر داخل الكورة عند اختيار هذا القسم.</p>
            <DriveUpload
              label="رفع صور الكورة"
              accept="image/*"
              multiple
              folderPath={`social-media/categories/${categorySlug}`}
              scope={`SOCIAL-${categorySlug.toUpperCase()}`}
              disabled={!editItem.keyword}
              disabledReason="اكتب keyword أولا ليتم إنشاء فولدر التصنيف الصحيح"
              onUploaded={() => undefined}
              onUploadedMany={appendImages}
            />
          </div>
          {editImages.length > 0 && (
            <div className="admin-tag-list">
              {editImages.map((image, index) => (
                <span key={`${image.fileId}-${index}`} className="admin-tag">
                  <img src={driveUrl(image.fileId || image.thumbnailUrl || image.url)} alt="" style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} />
                  {image.driveName || image.fileName || `image ${index + 1}`}
                  <button type="button" className="admin-tag-remove" onClick={() => removeImage(index)}>×</button>
                </span>
              ))}
            </div>
          )}
          <Toggle checked={editItem.isActive !== false} onChange={value => setEditItem({ ...editItem, isActive: value })} label="نشط في الموقع" />
        </div>
      </AdminModal>
    </AdminPageWrapper>
  );
}
