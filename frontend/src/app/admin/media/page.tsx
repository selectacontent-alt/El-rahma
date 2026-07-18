'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { AdminUploadResult, useAdminAuth, adminFetch, driveUrl, driveViewUrl } from '../lib/auth';
import { AdminModal, AdminPagination, AdminTable, DriveUpload, SectionHeader, Toggle } from '../components/AdminUI';
import { useAdminFeedback } from '../components/AdminFeedback';

interface MediaSliderItem {
  id: number;
  type: 'image' | 'video';
  fileId: string;
  url?: string;
  thumbnailUrl?: string;
  originalName?: string;
  driveName?: string;
  mimeType?: string;
  folder?: string;
  titleAr?: string;
  titleEn?: string;
  description?: string;
  order: number;
  isVisible: boolean;
}

interface MediaAsset {
  id: number;
  fileId?: string;
  url?: string;
  thumbnailUrl?: string;
  fileName: string;
  originalName?: string;
  driveName?: string;
  mimeType?: string;
  folder?: string;
  kind?: string;
  createdAt?: string;
}

const blankItem: Partial<MediaSliderItem> = { type: 'video', fileId: '', order: 0, isVisible: true };

function sliderFolder() {
  return 'media/reels';
}

function sliderScope(type?: string) {
  return type === 'video' ? 'MEDIA-REEL' : 'MEDIA-REEL-COVER';
}

export default function AdminMediaPage() {
  const { token } = useAdminAuth();
  const { notify } = useAdminFeedback();
  const [items, setItems] = useState<MediaSliderItem[]>([]);
  const [cameraShots, setCameraShots] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetPage, setAssetPage] = useState(1);
  const [assetTotal, setAssetTotal] = useState(0);
  const [assetTotalPages, setAssetTotalPages] = useState(1);
  const [assetQuery, setAssetQuery] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<MediaSliderItem>>(blankItem);

  const loadItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setItems(await adminFetch('/media-slider', token));
    } finally {
      setLoading(false);
    }
  };

  const loadCameraShots = async () => {
    if (!token) return;
    setAssetsLoading(true);
    try {
      const params = new URLSearchParams({ folder: 'media/camera-shots', page: String(assetPage), limit: '25' });
      if (assetSearch) params.set('q', assetSearch);
      const data = await adminFetch(`/media-assets?${params.toString()}`, token);
      setCameraShots(data.items || []);
      setAssetTotal(data.pagination?.total || 0);
      setAssetTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setAssetsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadItems().catch(console.error);
    loadCameraShots().catch(console.error);
  }, [token, assetPage, assetSearch]);

  useEffect(() => {
    const timeout = window.setTimeout(() => { setAssetPage(1); setAssetSearch(assetQuery.trim()); }, 280);
    return () => window.clearTimeout(timeout);
  }, [assetQuery]);

  const applyUploadToSlider = (result: AdminUploadResult) => {
    setEditItem(current => ({
      ...current,
      fileId: result.fileId,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      originalName: result.originalName,
      driveName: result.driveName,
      mimeType: result.mimeType,
      folder: result.folderPath || result.folder,
      type: result.mimeType?.startsWith('video/') ? 'video' : current.type || 'image',
    }));
  };

  const saveItem = async () => {
    if (!editItem.fileId) {
      alert('ملف الريل أو الصورة مطلوب');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...editItem, order: Number(editItem.order || 0) };
      if (editItem.id) {
        await adminFetch(`/media-slider/${editItem.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/media-slider', token, { method: 'POST', body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      await loadItems();
      notify('تم حفظ عنصر الميديا', 'success');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: MediaSliderItem) => {
    await adminFetch(`/media-slider/${item.id}`, token, { method: 'DELETE' });
    await loadItems();
    notify('تم حذف عنصر الميديا', 'success');
  };

  const deleteCameraShot = async (item: MediaAsset) => {
    if (item.fileId) {
      await adminFetch(`/upload/drive/${item.fileId}`, token, { method: 'DELETE' });
    } else {
      await adminFetch(`/media-assets/${item.id}`, token, { method: 'DELETE' });
    }
    await loadCameraShots();
    notify('تم حذف الأصل من الميديا', 'success');
  };

  const columns = [
    {
      key: 'fileId',
      label: 'المعاينة',
      render: (item: MediaSliderItem) => item.type === 'video'
        ? <video src={item.url || driveViewUrl(item.fileId)} muted controls style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6, background: '#111827' }} />
        : <img src={driveUrl(item.fileId || item.thumbnailUrl || item.url)} alt={item.titleAr || ''} style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6 }} />,
    },
    { key: 'type', label: 'النوع', render: (item: MediaSliderItem) => item.type === 'video' ? 'ريل / فيديو' : 'صورة' },
    { key: 'driveName', label: 'اسم Drive', render: (item: MediaSliderItem) => item.driveName || '-' },
    { key: 'titleAr', label: 'العنوان' },
    { key: 'order', label: 'الترتيب' },
    { key: 'isVisible', label: 'الحالة', render: (item: MediaSliderItem) => item.isVisible ? 'ظاهر' : 'مخفي' },
  ];

  const cameraColumns = [
    {
      key: 'fileId',
      label: 'اللقطة',
      render: (item: MediaAsset) => <img src={driveUrl(item.fileId || item.thumbnailUrl || item.url)} alt={item.originalName || item.fileName} style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6 }} />,
    },
    { key: 'driveName', label: 'اسم Drive', render: (item: MediaAsset) => item.driveName || item.fileName },
    { key: 'originalName', label: 'الاسم الأصلي', render: (item: MediaAsset) => item.originalName || '-' },
    { key: 'kind', label: 'النوع' },
    { key: 'folder', label: 'الفولدر' },
  ];

  return (
    <AdminPageWrapper title="الميديا والريلز">
      <div className="admin-card">
        <SectionHeader
          title="شريط الريلز في أول الصفحة"
          description="إدارة الريلز التي تظهر في بداية صفحة الميديا داخل فولدر media/reels."
          action={<button className="admin-btn admin-btn--primary" onClick={() => { setEditItem(blankItem); setModalOpen(true); }}>+ إضافة ريل</button>}
        />
        <AdminTable columns={columns} data={items} loading={loading} onEdit={(item) => { setEditItem(item); setModalOpen(true); }} onDelete={deleteItem} />
      </div>

      <div className="admin-card admin-card--table-page" style={{ marginTop: 16 }}>
        <SectionHeader
          title="لقطات الكاميرا"
          description="ارفع أكثر من صورة للقطات الكاميرا داخل media/camera-shots بأسماء Drive متسلسلة."
          action={
            <DriveUpload
              label="رفع لقطات متعددة"
              accept="image/*"
              multiple
              folderPath="media/camera-shots"
              scope="MEDIA-CAMERA-SHOT"
              onUploaded={() => loadCameraShots().catch(console.error)}
              onUploadedMany={() => loadCameraShots().catch(console.error)}
            />
          }
        />
        <div className="admin-data-toolbar"><label className="admin-search"><Search size={17} /><input className="admin-search-input" value={assetQuery} onChange={event => setAssetQuery(event.target.value)} placeholder="ابحث باسم الملف" /></label><span className="admin-record-count">{assetTotal.toLocaleString('ar-EG')} أصل</span></div>
        <AdminTable columns={cameraColumns} data={cameraShots} loading={assetsLoading} onDelete={deleteCameraShot} />
        <AdminPagination page={assetPage} totalPages={assetTotalPages} total={assetTotal} onChange={setAssetPage} />
      </div>

      <AdminModal title={editItem.id ? 'تعديل عنصر ميديا' : 'إضافة عنصر ميديا'} open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveItem} saving={saving}>
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">نوع الملف</label>
              <select className="admin-select" value={editItem.type || 'video'} onChange={event => setEditItem({ ...editItem, type: event.target.value as MediaSliderItem['type'] })}>
                <option value="video">ريل / فيديو</option>
                <option value="image">صورة</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">ترتيب الظهور</label>
              <input type="number" className="admin-input" value={editItem.order || 0} onChange={event => setEditItem({ ...editItem, order: Number(event.target.value) })} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">ملف Drive</label>
            <DriveUpload
              currentFileId={editItem.fileId}
              currentUrl={editItem.url}
              accept={editItem.type === 'video' ? 'video/*' : 'image/*'}
              folderPath={sliderFolder()}
              scope={sliderScope(editItem.type)}
              onUploaded={applyUploadToSlider}
            />
          </div>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">العنوان عربي</label><input className="admin-input" value={editItem.titleAr || ''} onChange={event => setEditItem({ ...editItem, titleAr: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">العنوان إنجليزي</label><input className="admin-input" value={editItem.titleEn || ''} onChange={event => setEditItem({ ...editItem, titleEn: event.target.value })} /></div>
          </div>
          <div className="admin-field"><label className="admin-label">الوصف</label><textarea className="admin-textarea" value={editItem.description || ''} onChange={event => setEditItem({ ...editItem, description: event.target.value })} /></div>
          <Toggle checked={!!editItem.isVisible} onChange={value => setEditItem({ ...editItem, isVisible: value })} label="ظاهر في الموقع" />
        </div>
      </AdminModal>
    </AdminPageWrapper>
  );
}
