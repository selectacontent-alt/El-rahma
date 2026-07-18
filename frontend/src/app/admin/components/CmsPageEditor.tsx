'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAdminAuth, adminFetch } from '../lib/auth';
import { AdminModal, AdminTable, SectionHeader, StatusBadge, Toggle } from './AdminUI';

interface CmsPage {
  id: number;
  slug: string;
  titleAr: string;
  titleEn?: string;
  metaTitleAr?: string;
  metaTitleEn?: string;
  metaDescAr?: string;
  metaDescEn?: string;
  status: string;
  publishedAt?: string;
  _count?: { sections: number };
  sections?: CmsSection[];
}

interface CmsSection {
  id: number;
  key: string;
  labelAr: string;
  labelEn?: string;
  type: string;
  content: string;
  draftContent?: string | null;
  order: number;
  isVisible: boolean;
}

function defaultSection(): Partial<CmsSection> {
  return {
    key: '',
    labelAr: '',
    labelEn: '',
    type: 'content',
    content: JSON.stringify({ ar: { title: '', subtitle: '' }, en: { title: '', subtitle: '' } }, null, 2),
    order: 0,
    isVisible: true,
  };
}

export default function CmsPageEditor({ initialSlug }: { initialSlug?: string }) {
  const { token } = useAdminAuth();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [selectedSlug, setSelectedSlug] = useState(initialSlug || 'home');
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editPage, setEditPage] = useState<Partial<CmsPage>>({});
  const [editSection, setEditSection] = useState<Partial<CmsSection> | null>(null);
  const updateSectionDraft = (patch: Partial<CmsSection>) => {
    setEditSection(current => ({ ...(current || defaultSection()), ...patch }));
  };

  const loadPages = async () => {
    if (!token) return;
    const data = await adminFetch('/pages', token);
    setPages(data);
    if (!data.find((page: CmsPage) => page.slug === selectedSlug) && data[0]) {
      setSelectedSlug(data[0].slug);
    }
  };

  const loadSelected = async () => {
    if (!token || !selectedSlug) return;
    setLoading(true);
    try {
      const data = await adminFetch(`/pages/${selectedSlug}`, token);
      setSelectedPage(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadPages().catch(console.error);
  }, [token]);
  useEffect(() => {
    if (!token) return;
    loadSelected().catch(console.error);
  }, [selectedSlug, token]);

  const selectedSections = useMemo(() => selectedPage?.sections || [], [selectedPage]);

  const savePage = async () => {
    if (!editPage.slug || !editPage.titleAr) {
      alert('Page slug and Arabic title are required');
      return;
    }
    setSaving(true);
    try {
      if (pages.find(page => page.slug === editPage.slug)) {
        await adminFetch(`/pages/${editPage.slug}`, token, { method: 'PUT', body: JSON.stringify(editPage) });
      } else {
        await adminFetch('/pages', token, { method: 'POST', body: JSON.stringify(editPage) });
      }
      setPageModalOpen(false);
      setSelectedSlug(editPage.slug);
      await loadPages();
      await loadSelected();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async () => {
    if (!editSection?.key || !editSection.labelAr) {
      alert('Section key and label are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editSection,
        content: editSection.content || '{}',
        draftContent: editSection.draftContent || null,
      };
      if (editSection.id) {
        await adminFetch(`/pages/${selectedSlug}/sections/${editSection.id}`, token, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/pages/${selectedSlug}/sections`, token, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setSectionModalOpen(false);
      await loadSelected();
      await loadPages();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const publishPage = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      await adminFetch(`/pages/${selectedPage.slug}/publish`, token, { method: 'POST' });
      await loadSelected();
      await loadPages();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (section: CmsSection) => {
    await adminFetch(`/pages/${selectedSlug}/sections/${section.id}`, token, { method: 'DELETE' });
    await loadSelected();
  };

  const openPageModal = (page?: CmsPage) => {
    setEditPage(page || { slug: '', titleAr: '', titleEn: '', status: 'draft' });
    setPageModalOpen(true);
  };

  const openSectionModal = (section?: CmsSection) => {
    setEditSection(section || defaultSection());
    setSectionModalOpen(true);
  };

  const pageColumns = [
    { key: 'slug', label: 'Slug' },
    { key: 'titleAr', label: 'Arabic title' },
    { key: 'status', label: 'Status', render: (page: CmsPage) => <StatusBadge status={page.status} /> },
    { key: 'sections', label: 'Sections', render: (page: CmsPage) => page._count?.sections || 0 },
  ];

  const sectionColumns = [
    { key: 'order', label: 'Order' },
    { key: 'key', label: 'Key' },
    { key: 'labelAr', label: 'Label' },
    { key: 'type', label: 'Type' },
    { key: 'isVisible', label: 'Visible', render: (section: CmsSection) => section.isVisible ? 'Yes' : 'No' },
    { key: 'draftContent', label: 'Draft', render: (section: CmsSection) => section.draftContent ? 'Has draft' : '-' },
  ];

  return (
    <div className="admin-grid-2" style={{ alignItems: 'start' }}>
      <div className="admin-card">
        <SectionHeader
          title="صفحات الموقع"
          description="Edit page metadata and choose which page sections to manage."
          action={<button className="admin-btn admin-btn--primary" onClick={() => openPageModal()}>+ Page</button>}
        />
        <AdminTable
          columns={pageColumns}
          data={pages}
          loading={!pages.length && loading}
          onEdit={(page) => { setSelectedSlug(page.slug); openPageModal(page); }}
        />
        <div className="admin-divider" />
        <div className="admin-field">
          <label className="admin-label">Selected page</label>
          <select className="admin-select" value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>
            {pages.map(page => <option key={page.slug} value={page.slug}>{page.slug} - {page.titleAr}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-card">
        <SectionHeader
          title={selectedPage ? `${selectedPage.titleAr} sections` : 'Sections'}
          description="Save drafts per section, then publish the page when ready."
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => openSectionModal()}>+ Section</button>
              <button className="admin-btn admin-btn--accent" onClick={publishPage} disabled={saving || !selectedPage}>Publish</button>
            </div>
          }
        />
        <AdminTable columns={sectionColumns} data={selectedSections} loading={loading} onEdit={openSectionModal} onDelete={deleteSection} />
      </div>

      <AdminModal title={editPage.id ? 'Edit page' : 'New page'} open={pageModalOpen} onClose={() => setPageModalOpen(false)} onSave={savePage} saving={saving}>
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">Slug</label>
              <input className="admin-input" value={editPage.slug || ''} onChange={event => setEditPage({ ...editPage, slug: event.target.value })} disabled={!!editPage.id} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Status</label>
              <select className="admin-select" value={editPage.status || 'draft'} onChange={event => setEditPage({ ...editPage, status: event.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">Title AR</label><input className="admin-input" value={editPage.titleAr || ''} onChange={event => setEditPage({ ...editPage, titleAr: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">Title EN</label><input className="admin-input" value={editPage.titleEn || ''} onChange={event => setEditPage({ ...editPage, titleEn: event.target.value })} /></div>
          </div>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">Meta title AR</label><input className="admin-input" value={editPage.metaTitleAr || ''} onChange={event => setEditPage({ ...editPage, metaTitleAr: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">Meta title EN</label><input className="admin-input" value={editPage.metaTitleEn || ''} onChange={event => setEditPage({ ...editPage, metaTitleEn: event.target.value })} /></div>
          </div>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">Meta desc AR</label><textarea className="admin-textarea" value={editPage.metaDescAr || ''} onChange={event => setEditPage({ ...editPage, metaDescAr: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">Meta desc EN</label><textarea className="admin-textarea" value={editPage.metaDescEn || ''} onChange={event => setEditPage({ ...editPage, metaDescEn: event.target.value })} /></div>
          </div>
        </div>
      </AdminModal>

      <AdminModal title={editSection?.id ? 'Edit section' : 'New section'} open={sectionModalOpen} onClose={() => setSectionModalOpen(false)} onSave={saveSection} saving={saving}>
        <div className="admin-form-grid">
          <div className="admin-grid-3">
            <div className="admin-field"><label className="admin-label">Key</label><input className="admin-input" value={editSection?.key || ''} onChange={event => updateSectionDraft({ key: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">Type</label><input className="admin-input" value={editSection?.type || 'content'} onChange={event => updateSectionDraft({ type: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">Order</label><input type="number" className="admin-input" value={editSection?.order || 0} onChange={event => updateSectionDraft({ order: Number(event.target.value) })} /></div>
          </div>
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">Label AR</label><input className="admin-input" value={editSection?.labelAr || ''} onChange={event => updateSectionDraft({ labelAr: event.target.value })} /></div>
            <div className="admin-field"><label className="admin-label">Label EN</label><input className="admin-input" value={editSection?.labelEn || ''} onChange={event => updateSectionDraft({ labelEn: event.target.value })} /></div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Published content JSON / text</label>
            <textarea className="admin-textarea" style={{ minHeight: 160, fontFamily: 'monospace' }} value={editSection?.content || ''} onChange={event => updateSectionDraft({ content: event.target.value })} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Draft content JSON / text</label>
            <textarea className="admin-textarea" style={{ minHeight: 160, fontFamily: 'monospace' }} value={editSection?.draftContent || ''} onChange={event => updateSectionDraft({ draftContent: event.target.value })} />
          </div>
          <Toggle checked={!!editSection?.isVisible} onChange={value => updateSectionDraft({ isVisible: value })} label="Visible on public page" />
        </div>
      </AdminModal>
    </div>
  );
}
