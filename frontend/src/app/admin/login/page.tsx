'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, User } from 'lucide-react';
import { useAdminAuth } from '../lib/auth';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. راجع البيانات وحاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <main className="admin-login-shell" aria-labelledby="admin-login-title">
        <section className="admin-login-panel">
          <div className="admin-login-brand-block">
            <span className="admin-login-logo-icon">
              <img src="/logo.png" alt="Select Website" className="admin-login-logo-img" />
            </span>
            <div>
              <span className="admin-login-brand">Select Website</span>
              <span className="admin-login-kicker">Admin Control Center</span>
            </div>
          </div>

          <div className="admin-login-copy">
            <span className="admin-login-chip"><ShieldCheck size={15} /> مساحة إدارة آمنة</span>
            <h1 id="admin-login-title" className="admin-login-title">دخول لوحة التحكم</h1>
            <p className="admin-login-sub">إدارة الأخبار، الصور، الفيديوهات، الأسعار، والمشاريع من مكان واحد.</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-field">
              <label className="admin-label" htmlFor="admin-username">اسم المستخدم</label>
              <div className="admin-login-input-wrap">
                <User size={18} className="admin-login-input-icon" />
                <input
                  id="admin-username"
                  type="text"
                  className="admin-input admin-login-input"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  placeholder="اكتب اسم المستخدم"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="admin-password">كلمة المرور</label>
              <div className="admin-login-input-wrap">
                <LockKeyhole size={18} className="admin-login-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input admin-login-input admin-login-password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="اكتب كلمة المرور"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-login-eye"
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-error-box" role="alert">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button id="admin-login-btn" type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? <span className="admin-spinner" /> : <><span>دخول إلى اللوحة</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </section>

        <aside className="admin-login-visual" aria-hidden="true">
          <div className="admin-login-window">
            <div className="admin-login-window-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="admin-login-metric admin-login-metric--wide">
              <strong>Drive CMS</strong>
              <span>folders / scopes / sequential names</span>
            </div>
            <div className="admin-login-metric-row">
              <div className="admin-login-metric"><strong>الأخبار</strong><span>SEO + Gallery</span></div>
              <div className="admin-login-metric"><strong>الميديا</strong><span>Reels + Pricing</span></div>
            </div>
            <div className="admin-login-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
