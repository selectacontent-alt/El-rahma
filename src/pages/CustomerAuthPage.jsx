import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CustomerAuthPage = ({ setCurrentPage, setCustomerAuth }) => {
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/customer/auth/login' : '/api/customer/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t(isLogin ? 'customerAuth.loginFailed' : 'customerAuth.registerFailed'));
      }

      setSuccess(t(isLogin ? 'customerAuth.loginSuccess' : 'customerAuth.registerSuccess'));
      localStorage.setItem('customer_token', data.token);
      localStorage.setItem('customer_data', JSON.stringify(data.customer));

      setTimeout(() => {
        setCustomerAuth(data.customer);
        setCurrentPage('account');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <main className="customer-auth-shell" dir={dir}>
      <section className="customer-auth-card" aria-label={t(isLogin ? 'customerAuth.loginTitle' : 'customerAuth.registerTitle')}>
        <div className="customer-auth-brand">
          <span className="customer-auth-mark" aria-hidden="true">
            <img src="/rahma-site-icon.png" alt="" />
          </span>
          <img
            src="/rahma-logo-full.png"
            alt={t('nav.logoAlt')}
            className="customer-auth-logo"
          />
        </div>

        <div className="customer-auth-header">
          <h1>{t(isLogin ? 'customerAuth.loginTitle' : 'customerAuth.registerTitle')}</h1>
          <p>
            {isLogin
              ? t('customerAuth.loginSubtitle')
              : t('customerAuth.registerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="customer-auth-alert customer-auth-alert--error" role="alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="customer-auth-alert customer-auth-alert--success" role="status" aria-live="polite">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="customer-auth-form">
          {!isLogin && (
            <label className="customer-auth-field">
              <User size={20} aria-hidden="true" />
              <input
                type="text"
                name="name"
                placeholder={t('customerAuth.namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                autoComplete="name"
              />
            </label>
          )}

          <label className="customer-auth-field">
            <Mail size={20} aria-hidden="true" />
            <input
              type="email"
              name="email"
              placeholder={t('customerAuth.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              inputMode="email"
            />
          </label>

          <label className="customer-auth-field">
            <Lock size={20} aria-hidden="true" />
            <input
              type="password"
              name="password"
              placeholder={t('customerAuth.passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </label>

          <button type="submit" disabled={loading} className="customer-auth-submit">
            <span>{loading ? t('customerAuth.loading') : t(isLogin ? 'customerAuth.signIn' : 'customerAuth.register')}</span>
            {!loading && <ArrowRight size={22} className="customer-auth-submit-icon" aria-hidden="true" />}
          </button>
        </form>

        <div className="customer-auth-switch">
          <span>{t(isLogin ? 'customerAuth.noAccount' : 'customerAuth.hasAccount')}</span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
          >
            {t(isLogin ? 'customerAuth.registerNow' : 'customerAuth.signIn')}
          </button>
        </div>
      </section>
    </main>
  );
};

export default CustomerAuthPage;
