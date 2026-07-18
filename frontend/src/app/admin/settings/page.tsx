'use client';

import React, { useEffect, useState } from 'react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { useAdminAuth, adminFetch } from '../lib/auth';
import { SectionHeader } from '../components/AdminUI';

export default function AdminSettingsPage() {
  const { token } = useAdminAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState('');

  const loadSettings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      setSettings(await adminFetch('/settings', token));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadSettings().catch(console.error);
  }, [token]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminFetch('/settings', token, { method: 'PUT', body: JSON.stringify(settings) });
      await loadSettings();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addKey = () => {
    if (!newKey.trim()) return;
    setSettings({ ...settings, [newKey.trim()]: '' });
    setNewKey('');
  };

  return (
    <AdminPageWrapper title="إعدادات الموقع">
      <div className="admin-card">
        <SectionHeader
          title="إعدادات الموقع العامة"
          description="Manage phone, email, social links, and reusable site settings."
          action={<button className="admin-btn admin-btn--primary" onClick={saveSettings} disabled={saving || loading}>{saving ? 'Saving...' : 'Save settings'}</button>}
        />
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">New key</label>
              <input className="admin-input" value={newKey} onChange={event => setNewKey(event.target.value)} placeholder="facebook" />
            </div>
            <div className="admin-field" style={{ justifyContent: 'end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={addKey}>Add key</button>
            </div>
          </div>
          {Object.entries(settings).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => (
            <div key={key} className="admin-grid-2">
              <div className="admin-field">
                <label className="admin-label">{key}</label>
                <input className="admin-input" value={key} readOnly />
              </div>
              <div className="admin-field">
                <label className="admin-label">Value</label>
                <input className="admin-input" value={value || ''} onChange={event => setSettings({ ...settings, [key]: event.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageWrapper>
  );
}
