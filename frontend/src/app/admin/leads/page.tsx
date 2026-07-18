'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { useAdminAuth, adminFetch } from '../lib/auth';
import { AdminModal, AdminPagination, AdminTable, SectionHeader, StatusBadge } from '../components/AdminUI';
import { useAdminList } from '../lib/useAdminList';
import { useAdminFeedback } from '../components/AdminFeedback';

interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  businessActivity?: string;
  budget?: number;
  requestType?: 'contact' | 'plan' | 'advertising' | string;
  planSection?: string;
  planId?: string;
  planTitle?: string;
  planPrice?: number;
  planCurrency?: string;
  requestDetails?: Record<string, unknown> | null;
  selectedServices?: string;
  message?: string;
  status: string;
  source: string;
  adminNote?: string;
  createdAt: string;
}

const statuses = ['new', 'read', 'in_progress', 'won', 'lost', 'archived'];
const requestTypes = ['', 'plan', 'advertising', 'contact'];
const requestTypeLabels: Record<string, string> = { '': 'كل الطلبات', plan: 'طلبات الخطط', advertising: 'طلبات الإعلانات', contact: 'رسائل التواصل' };
const statusLabels: Record<string, string> = { new: 'جديد', read: 'تمت القراءة', in_progress: 'قيد المتابعة', won: 'تم التحويل', lost: 'غير مناسب', archived: 'مؤرشف' };

function customSoftwarePlanDetails(details?: Record<string, unknown> | null) {
  if (!details) return { requirements: [] as string[], brief: '' };
  const cart = Array.isArray(details.cart) ? details.cart : [];
  const customCartItem = cart.find((item): item is { section?: unknown; details?: unknown } => !!item && typeof item === 'object' && (item as { section?: unknown }).section === 'software-custom');
  const source = customCartItem?.details && typeof customCartItem.details === 'object'
    ? customCartItem.details as Record<string, unknown>
    : details;
  const requirements = Array.isArray(source.selectedRequirements)
    ? source.selectedRequirements.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  return { requirements, brief: typeof source.projectBrief === 'string' ? source.projectBrief : '' };
}

export default function AdminLeadsPage() {
  const { token } = useAdminAuth();
  const { notify } = useAdminFeedback();
  const [status, setStatus] = useState('');
  const [requestType, setRequestType] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Lead | null>(null);
  const { items, pagination, loading, error, refresh } = useAdminList<Lead>('/contacts', { page, limit: 25, status, requestType, q: debouncedQuery });

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 280);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const resetPage = (setValue: (value: string) => void, value: string) => { setValue(value); setPage(1); };

  const saveLead = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      await adminFetch(`/contacts/${editItem.id}/status`, token, { method: 'PUT', body: JSON.stringify({ status: editItem.status, adminNote: editItem.adminNote || null }) });
      setModalOpen(false);
      notify('تم حفظ متابعة العميل', 'success');
      await refresh();
    } catch (requestError: any) {
      notify(requestError?.message || 'تعذر حفظ متابعة العميل', 'error');
    } finally { setSaving(false); }
  };

  const deleteLead = async (lead: Lead) => {
    try {
      await adminFetch(`/contacts/${lead.id}`, token, { method: 'DELETE' });
      notify('تم حذف الطلب', 'success');
      await refresh();
    } catch (requestError: any) { notify(requestError?.message || 'تعذر حذف الطلب', 'error'); }
  };

  const columns = [
    { key: 'name', label: 'العميل', render: (lead: Lead) => <span className="admin-cell-primary"><strong>{lead.name}</strong><small>{lead.company || lead.email || 'بدون شركة'}</small></span> },
    { key: 'phone', label: 'التواصل', render: (lead: Lead) => lead.phone || lead.email || '—' },
    { key: 'requestType', label: 'نوع الطلب', render: (lead: Lead) => requestTypeLabels[lead.requestType || ''] || lead.requestType || 'تواصل' },
    { key: 'planTitle', label: 'الخدمة / الخطة', render: (lead: Lead) => lead.planTitle || lead.businessActivity || lead.company || '—' },
    { key: 'planPrice', label: 'القيمة', render: (lead: Lead) => lead.planPrice != null ? `${lead.planPrice.toLocaleString('ar-EG')} ${lead.planCurrency || 'EGP'}` : (lead.requestType === 'advertising' && lead.budget ? `${lead.budget.toLocaleString('ar-EG')} EGP` : '—') },
    { key: 'status', label: 'الحالة', render: (lead: Lead) => <StatusBadge status={lead.status} /> },
    { key: 'createdAt', label: 'تاريخ الطلب', render: (lead: Lead) => new Date(lead.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) },
  ];

  return (
    <AdminPageWrapper title="العملاء المحتملون">
      <div className="admin-card admin-card--table-page">
        <SectionHeader title="صندوق متابعة العملاء" description="كل طلبات الموقع في مكان واحد؛ صفِّها، افتح التفاصيل، وسجّل نتيجة المتابعة." action={<span className="admin-record-count">{pagination.total.toLocaleString('ar-EG')} طلب</span>} />
        <div className="admin-data-toolbar">
          <label className="admin-search"><Search size={17} /><input className="admin-search-input" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="ابحث بالاسم أو الهاتف أو الشركة" /></label>
          <div className="admin-toolbar-filters">
            <select className="admin-select" value={requestType} onChange={event => resetPage(setRequestType, event.target.value)}>{requestTypes.map(item => <option key={item} value={item}>{requestTypeLabels[item]}</option>)}</select>
            <select className="admin-select" value={status} onChange={event => resetPage(setStatus, event.target.value)}><option value="">كل الحالات</option>{statuses.map(item => <option key={item} value={item}>{statusLabels[item]}</option>)}</select>
          </div>
        </div>
        {error ? <div className="admin-inline-error"><div><strong>تعذر تحميل العملاء</strong><span>{error}</span></div><button className="admin-btn admin-btn--ghost" type="button" onClick={() => void refresh()}>إعادة المحاولة</button></div> : <><AdminTable columns={columns} data={items} loading={loading} onEdit={(lead) => { setEditItem(lead); setModalOpen(true); }} onDelete={deleteLead} /><AdminPagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onChange={setPage} /></>}
      </div>

      <AdminModal title="تفاصيل ومتابعة العميل" open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveLead} saving={saving}>
        {editItem && <div className="admin-form-grid">
          <div className="admin-detail-summary"><span>الطلب وصل {new Date(editItem.createdAt).toLocaleString('ar-EG')}</span><strong>{editItem.name}</strong><small>{editItem.company || editItem.businessActivity || 'طلب من الموقع'}</small></div>
          <div className="admin-grid-2"><div className="admin-field"><label className="admin-label">الهاتف</label><input className="admin-input" value={editItem.phone || ''} readOnly /></div><div className="admin-field"><label className="admin-label">البريد</label><input className="admin-input" value={editItem.email || ''} readOnly /></div></div>
          <div className="admin-grid-2"><div className="admin-field"><label className="admin-label">نوع الطلب</label><input className="admin-input" value={requestTypeLabels[editItem.requestType || ''] || editItem.requestType || 'تواصل'} readOnly /></div><div className="admin-field"><label className="admin-label">الخطة / الميزانية</label><input className="admin-input" value={editItem.planPrice != null ? `${editItem.planPrice} ${editItem.planCurrency || 'EGP'}` : editItem.budget ? `${editItem.budget} EGP` : editItem.planTitle || ''} readOnly /></div></div>
          {editItem.planTitle && <div className="admin-field"><label className="admin-label">الخطة المختارة</label><input className="admin-input" value={editItem.planTitle} readOnly /></div>}
          {editItem.planSection === 'software-custom' && (() => {
            const customPlan = customSoftwarePlanDetails(editItem.requestDetails);
            return <div className="admin-field"><label className="admin-label">الخطة البرمجية المخصصة</label><div className="rounded-2xl border border-[#9d027c]/15 bg-[#9d027c]/5 p-4"><strong className="block text-sm text-[#7d0564]">احتياجات العميل المختارة</strong><div className="mt-3 flex flex-wrap gap-2">{customPlan.requirements.length ? customPlan.requirements.map(item => <span key={item} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">{item}</span>) : <span className="text-sm text-slate-500">لم يحدد العميل اختيارات من الدائرة.</span>}</div>{customPlan.brief && <><strong className="mt-4 block text-sm text-[#7d0564]">وصف المشروع</strong><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{customPlan.brief}</p></>}</div></div>;
          })()}
          <div className="admin-field"><label className="admin-label">الخدمات المطلوبة</label><textarea className="admin-textarea" value={editItem.selectedServices || ''} readOnly /></div>
          <div className="admin-field"><label className="admin-label">رسالة العميل</label><textarea className="admin-textarea" value={editItem.message || ''} readOnly /></div>
          {editItem.requestDetails && <div className="admin-field"><label className="admin-label">تفاصيل الطلب</label><pre className="admin-textarea admin-json-preview">{JSON.stringify(editItem.requestDetails, null, 2)}</pre></div>}
          <div className="admin-grid-2"><div className="admin-field"><label className="admin-label">حالة المتابعة</label><select className="admin-select" value={editItem.status} onChange={event => setEditItem({ ...editItem, status: event.target.value })}>{statuses.map(item => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></div><div className="admin-field"><label className="admin-label">المصدر</label><input className="admin-input" value={editItem.source || 'الموقع'} readOnly /></div></div>
          <div className="admin-field"><label className="admin-label">ملاحظة داخلية</label><textarea className="admin-textarea" value={editItem.adminNote || ''} placeholder="اكتب الخطوة القادمة أو نتيجة التواصل..." onChange={event => setEditItem({ ...editItem, adminNote: event.target.value })} /></div>
        </div>}
      </AdminModal>
    </AdminPageWrapper>
  );
}
