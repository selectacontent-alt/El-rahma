'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth, adminFetch } from '../lib/auth';
import { SectionHeader } from './AdminUI';

const DEFAULT_OPTIONS = [10500, 15000, 20000, 25000, 30000];

function parseOptions(value?: string) {
  try {
    const parsed = JSON.parse(value || '');
    const options = Array.isArray(parsed) ? parsed.map(Number) : [];
    const valid = [...new Set(options)].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b);
    return valid.length >= 2 ? valid : DEFAULT_OPTIONS;
  } catch {
    const options = (value || '').split(/[,،\n]+/).map(item => Number(item.trim()));
    const valid = [...new Set(options)].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b);
    return valid.length >= 2 ? valid : DEFAULT_OPTIONS;
  }
}

export default function AdvertisingBudgetSettings() {
  const { token } = useAdminAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    adminFetch('/settings', token)
      .then((data: Record<string, string>) => {
        setSettings(data);
        setOptions(parseOptions(data.advertising_budget_options));
      })
      .catch(error => alert(error.message))
      .finally(() => setLoading(false));
  }, [token]);

  const save = async () => {
    const cleanedOptions = [...new Set(options.map(Number))].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b);
    if (cleanedOptions.length < 2) {
      alert('أدخل سعرين محددين على الأقل، وكل سعر يجب أن يبدأ من 10500 جنيه.');
      return;
    }
    setSaving(true);
    try {
      await adminFetch('/settings', token, {
        method: 'PUT',
        body: JSON.stringify({
          ...settings,
          advertising_budget_options: JSON.stringify(cleanedOptions),
        }),
      });
      setOptions(cleanedOptions);
      setSettings(previous => ({ ...previous, advertising_budget_options: JSON.stringify(cleanedOptions) }));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <SectionHeader
        title="إعدادات شريط ميزانية الإعلانات"
        description="حدد أسعار الميزانية التي يختار منها العميل فقط. اكتب القيم مفصولة بفواصل."
        action={<button className="admin-btn admin-btn--primary" onClick={save} disabled={saving || loading}>{saving ? 'جاري الحفظ...' : 'حفظ إعدادات الشريط'}</button>}
      />
      <div className="admin-field">
        <label className="admin-label">الأسعار المحددة (جنيه)</label>
        <input className="admin-input" value={options.join(', ')} onChange={event => setOptions(event.target.value.split(/[,،\n]+/).map(item => Number(item.trim())).filter(item => Number.isFinite(item)))} placeholder="10500, 15000, 20000, 30000" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{options.map(option => <span key={option} className="rounded-full border border-[#9d027c]/15 bg-[#9d027c]/5 px-3 py-1.5 text-xs font-black text-[#9d027c]">{option.toLocaleString('ar-EG')} جنيه</span>)}</div>
    </div>
  );
}
