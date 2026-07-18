'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Pencil, Save, Trash2, UploadCloud, X } from 'lucide-react';
import { AdminUploadResult, useAdminAuth, adminUpload, driveUrl, driveViewUrl } from '../lib/auth';
import { useAdminFeedback } from './AdminFeedback';

interface DriveUploadProps {
  label?: string;
  currentFileId?: string;
  currentUrl?: string;
  accept?: string;
  section?: string;
  folderPath?: string;
  folder?: string;
  scope?: string;
  multiple?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onUploaded: (result: AdminUploadResult) => void;
  onUploadedMany?: (results: AdminUploadResult[]) => void;
}

function assetPreviewUrl(asset: Partial<AdminUploadResult>) {
  return asset.fileId ? driveUrl(asset.fileId) : driveUrl(asset.thumbnailUrl || asset.url);
}

function assetViewUrl(asset: Partial<AdminUploadResult>) {
  return asset.url || (asset.fileId ? driveViewUrl(asset.fileId) : '');
}

function isVideoAsset(asset: Partial<AdminUploadResult>, accept?: string) {
  return asset.mimeType?.startsWith('video/') || (!!accept && accept.includes('video'));
}

export function DriveUpload({
  label = 'رفع ملف على Drive',
  currentFileId,
  currentUrl,
  accept = 'image/*',
  section,
  folderPath,
  folder,
  scope,
  multiple = false,
  disabled = false,
  disabledReason,
  onUploaded,
  onUploadedMany,
}: DriveUploadProps) {
  const { token } = useAdminAuth();
  const { notify } = useAdminFeedback();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<AdminUploadResult[]>([]);

  useEffect(() => {
    setUploadedFiles([]);
  }, [currentFileId, currentUrl]);

  const currentAsset = useMemo<Partial<AdminUploadResult> | null>(() => {
    if (!currentFileId && !currentUrl) return null;
    return {
      fileId: currentFileId || currentUrl || '',
      url: currentUrl,
      thumbnailUrl: currentFileId ? driveUrl(currentFileId) : currentUrl,
      mimeType: accept.includes('video') ? 'video/mp4' : 'image/jpeg',
    };
  }, [accept, currentFileId, currentUrl]);

  const previewItems = uploadedFiles.length ? uploadedFiles : (currentAsset ? [currentAsset as AdminUploadResult] : []);
  const targetFolder = folderPath || folder || section;

  const triggerPicker = () => {
    if (!disabled && !uploading) inputRef.current?.click();
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    if (!token || disabled) return;
    const files = Array.from(fileList).filter(Boolean);
    if (!files.length) return;

    const selectedFiles = multiple ? files : [files[0]];
    setUploading(true);
    setProgress(10);
    const interval = window.setInterval(() => setProgress(value => Math.min(value + 12, 88)), 280);

    try {
      const response = await adminUpload(
        selectedFiles.length === 1 ? selectedFiles[0] : selectedFiles,
        token,
        { section, folderPath, folder, scope }
      );
      const results = 'files' in response ? response.files : [response];

      window.clearInterval(interval);
      setProgress(100);
      setUploadedFiles(results);

      if (results[0]) onUploaded(results[0]);
      if (results.length > 1 || multiple) onUploadedMany?.(results);
      notify(results.length > 1 ? `تم رفع ${results.length} ملفات بنجاح` : 'تم رفع الملف بنجاح', 'success');

      if (inputRef.current) inputRef.current.value = '';
      window.setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 700);
    } catch (error: any) {
      window.clearInterval(interval);
      alert(`فشل رفع الملف على Google Drive: ${error.message || 'خطأ غير معروف'}`);
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="drive-upload">
      {previewItems.length > 0 && (
        <div className="drive-upload-preview-grid">
          {previewItems.map((asset, index) => {
            const previewUrl = assetPreviewUrl(asset);
            const viewUrl = assetViewUrl(asset);
            return (
              <div className="drive-upload-preview" key={`${asset.fileId || asset.url || index}-${index}`}>
                {isVideoAsset(asset, accept) ? (
                  <video src={viewUrl || previewUrl} className="drive-upload-media" controls muted playsInline />
                ) : (
                  <img src={previewUrl || viewUrl} alt={asset.originalName || 'Drive preview'} className="drive-upload-media" />
                )}
                {index === 0 && (
                  <button type="button" className="drive-upload-change" onClick={triggerPicker} disabled={disabled || uploading}>
                    تغيير
                  </button>
                )}
                {(asset.driveName || asset.originalName) && (
                  <div className="drive-upload-meta">
                    {asset.driveName && <strong>{asset.driveName}</strong>}
                    {asset.originalName && <span>الأصل: {asset.originalName}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div
        className={[
          'drive-upload-zone',
          dragOver ? 'drive-upload-zone--drag' : '',
          disabled ? 'drive-upload-zone--disabled' : '',
        ].filter(Boolean).join(' ')}
        onClick={triggerPicker}
        onDrop={handleDrop}
        onDragOver={event => {
          event.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="drive-upload-progress-wrap">
            <div className="drive-upload-progress-track">
              <div className="drive-upload-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <span className="drive-upload-progress-text">جاري الرفع على Drive... {progress}%</span>
          </div>
        ) : (
          <>
            <span className="drive-upload-icon"><UploadCloud size={28} /></span>
            <span className="drive-upload-label">{label}</span>
            <span className="drive-upload-hint">
              {disabled
                ? (disabledReason || 'أكمل البيانات المطلوبة قبل الرفع')
                : `اسحب الملفات أو اضغط للاختيار${multiple ? ' - يمكن رفع أكثر من ملف' : ''}`}
            </span>
            <span className="drive-upload-sub">
              {targetFolder ? `Drive folder: ${targetFolder}` : 'يرفع مباشرة إلى Google Drive بأسماء تسلسلية'}
            </span>
            {scope && <span className="drive-upload-scope">Scope: {scope}</span>}
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={event => {
          if (event.target.files) handleFiles(event.target.files);
        }}
      />
    </div>
  );
}

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
}

export function AdminTable<T extends { id: number }>({ columns, data, onEdit, onDelete, loading }: AdminTableProps<T>) {
  const { confirm } = useAdminFeedback();
  if (loading) return <div className="admin-table-loading admin-table-skeleton" aria-label="جاري تحميل البيانات"><span /><span /><span /><span /></div>;
  if (!data.length) return <div className="admin-empty"><strong>لا توجد بيانات بعد</strong><span>ستظهر العناصر هنا فور إضافتها.</span></div>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map(column => <th key={column.key}>{column.label}</th>)}
            {(onEdit || onDelete) && <th>إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {columns.map(column => (
                <td key={column.key} data-label={column.label}>
                  {column.render ? column.render(row) : String((row as any)[column.key] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td data-label="إجراءات">
                  <div className="admin-table-actions">
                    {onEdit && (
                      <button type="button" className="admin-icon-btn" onClick={() => onEdit(row)} title="تعديل">
                        <Pencil size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        onClick={async () => { if (await confirm({ title: 'حذف هذا العنصر؟', description: 'لا يمكن التراجع عن هذا الإجراء بعد الحذف.', confirmLabel: 'حذف', tone: 'danger' })) onDelete(row); }}
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AdminModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
}

export function AdminModal({ title, open, onClose, children, onSave, saving }: AdminModalProps) {
  const { confirm } = useAdminFeedback();
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (open) setDirty(false); }, [open]);
  if (!open) return null;
  const close = async () => {
    if (!dirty || await confirm({ title: 'تجاهل التعديلات؟', description: 'هناك تغييرات لم يتم حفظها داخل هذه النافذة.', confirmLabel: 'تجاهل التعديلات', tone: 'danger' })) onClose();
  };
  return (
    <div className="admin-modal-overlay" onClick={event => { if (event.target === event.currentTarget) void close(); }}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{title}</h3>
          <button type="button" className="admin-modal-close" onClick={() => void close()} aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-body" onInputCapture={() => setDirty(true)} onChangeCapture={() => setDirty(true)}>{children}</div>
        {onSave && (
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => void close()}>إلغاء</button>
            <button type="button" className="admin-btn admin-btn--primary" onClick={() => { setDirty(false); onSave(); }} disabled={saving}>
              {saving ? <span className="admin-spinner admin-spinner--sm" /> : <Save size={16} />}
              حفظ التغييرات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminPagination({ page, totalPages, total, onChange }: { page: number; totalPages: number; total?: number; onChange: (page: number) => void }) {
  if (totalPages <= 1 && total === undefined) return null;
  return (
    <div className="admin-pagination" aria-label="ترقيم الصفحات">
      {total !== undefined && <span className="admin-pagination-summary">{total.toLocaleString('ar-EG')} عنصر</span>}
      <div className="admin-pagination-actions">
        <button type="button" className="admin-page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>التالي</button>
        <span className="admin-page-indicator">{page} / {Math.max(totalPages, 1)}</span>
        <button type="button" className="admin-page-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>السابق</button>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  helper?: string;
}

export function StatCard({ label, value, icon, color = '#9d027c', helper }: StatCardProps) {
  return (
    <div className="admin-stat-card" style={{ ['--stat-color' as string]: color }}>
      <div className="admin-stat-icon">{icon}</div>
      <div className="admin-stat-info">
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
        {helper && <div className="admin-stat-helper">{helper}</div>}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="admin-section-header">
      <div>
        <h3 className="admin-section-title">{title}</h3>
        {description && <p className="admin-section-desc">{description}</p>}
      </div>
      {action && <div className="admin-section-action">{action}</div>}
    </div>
  );
}

const statusColors: Record<string, string> = {
  published: 'admin-badge--green',
  draft: 'admin-badge--yellow',
  archived: 'admin-badge--gray',
  new: 'admin-badge--purple',
  read: 'admin-badge--gray',
  contacted: 'admin-badge--blue',
  won: 'admin-badge--green',
  lost: 'admin-badge--red',
};

const statusLabels: Record<string, string> = {
  published: 'منشور',
  draft: 'مسودة',
  archived: 'أرشيف',
  new: 'جديد',
  read: 'مقروء',
  contacted: 'تم التواصل',
  won: 'تم التحويل',
  lost: 'مغلق',
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`admin-badge ${statusColors[status] || 'admin-badge--gray'}`}>{statusLabels[status] || status}</span>;
}

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
      <span className="admin-toggle-track">
        <span className="admin-toggle-thumb">
          {checked && <Check size={11} />}
        </span>
      </span>
      {label && <span className="admin-toggle-label">{label}</span>}
    </label>
  );
}
