import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  LogOut,
  Package,
  ShoppingBag,
  Mail,
  Phone,
  ReceiptText,
  WalletCards,
  CalendarDays,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const getStatusTheme = (status) => {
  const normalized = String(status || '').trim().toLowerCase();

  if (
    normalized.includes('delivered') ||
    normalized.includes('completed') ||
    normalized.includes('تم التوصيل') ||
    normalized.includes('مكتمل')
  ) {
    return 'success';
  }

  if (
    normalized.includes('shipped') ||
    normalized.includes('shipping') ||
    normalized.includes('dispatch') ||
    normalized.includes('قيد الشحن') ||
    normalized.includes('تم الشحن')
  ) {
    return 'info';
  }

  if (
    normalized.includes('cancel') ||
    normalized.includes('رفض') ||
    normalized.includes('ملغي') ||
    normalized.includes('مرفوض')
  ) {
    return 'danger';
  }

  if (
    normalized.includes('review') ||
    normalized.includes('pending') ||
    normalized.includes('processing') ||
    normalized.includes('قيد') ||
    normalized.includes('مراجعة') ||
    normalized.includes('انتظار')
  ) {
    return 'warning';
  }

  return 'neutral';
};

const CustomerDashboard = ({ setCurrentPage, customerAuth, setCustomerAuth }) => {
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (!customerAuth) {
      setCurrentPage('login');
      return;
    }

    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setOrdersError('');

        const response = await fetch('/api/customer/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('customer_token')}`,
          },
        });

        const data = await response.json();

        if (!isMounted) return;

        if (!response.ok) {
          setOrders([]);
          setOrdersError(
            data?.error || t('account.loadFailed')
          );
          return;
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Customer orders fetch failed:', error);
        if (!isMounted) return;
        setOrders([]);
        setOrdersError(t('account.loadError'));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [customerAuth, language, setCurrentPage, t]);

  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  const formatDate = (value) => {
    if (!value) return '---';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '---';
    return date.toLocaleDateString(locale);
  };

  const orderSummary = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => {
      const value = Number(order.total);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    const latestOrder = orders
      .filter((order) => order.created_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    return {
      count: orders.length,
      totalSpent,
      latestDate: latestOrder?.created_at || null,
    };
  }, [orders]);

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
    setCustomerAuth(null);
    setCurrentPage('home');
  };

  if (!customerAuth) return null;

  return (
    <main className="customer-dashboard" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="customer-dashboard-shell">
        <header className="customer-dashboard-hero">
          <div className="customer-dashboard-hero-main">
            <img src="/rahma-logo-full.png" alt={t('nav.logoAlt')} className="customer-dashboard-logo" />
            <div>
              <h1>{t('account.title')}</h1>
              <p>{t('account.welcome', { name: customerAuth.name })}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="customer-dashboard-logout">
            <LogOut size={18} />
            <span>{t('account.logout')}</span>
          </button>
        </header>

        <section className="customer-dashboard-stats" aria-label={t('account.orders')}>
          <article className="customer-dashboard-stat">
            <span className="customer-dashboard-stat-icon">
              <ReceiptText size={21} />
            </span>
            <div>
              <span>{t('account.orders')}</span>
              <strong>{orderSummary.count}</strong>
            </div>
          </article>

          <article className="customer-dashboard-stat">
            <span className="customer-dashboard-stat-icon">
              <WalletCards size={21} />
            </span>
            <div>
              <span>{t('account.total')}</span>
              <strong>{orderSummary.totalSpent.toLocaleString(locale)} {t('account.currency')}</strong>
            </div>
          </article>

          <article className="customer-dashboard-stat">
            <span className="customer-dashboard-stat-icon">
              <CalendarDays size={21} />
            </span>
            <div>
              <span>{t('account.date')}</span>
              <strong>{formatDate(orderSummary.latestDate)}</strong>
            </div>
          </article>
        </section>

        <section className="customer-dashboard-grid">
          <article className="customer-dashboard-card customer-profile-card">
            <div className="customer-dashboard-card-heading">
              <span className="customer-dashboard-card-icon">
                <User size={23} />
              </span>
              <h2>{t('account.details')}</h2>
            </div>

            <div className="customer-profile-list">
              <div className="customer-profile-row">
                <span className="customer-profile-row-icon">
                  <User size={18} />
                </span>
                <div>
                  <span>{t('account.name')}</span>
                  <strong>{customerAuth.name}</strong>
                </div>
              </div>

              <div className="customer-profile-row">
                <span className="customer-profile-row-icon">
                  <Mail size={18} />
                </span>
                <div>
                  <span>{t('account.email')}</span>
                  <strong>{customerAuth.email}</strong>
                </div>
              </div>

              <div className="customer-profile-row">
                <span className="customer-profile-row-icon">
                  <Phone size={18} />
                </span>
                <div>
                  <span>{t('account.phone')}</span>
                  <strong className="customer-profile-phone">{customerAuth.phone || '---'}</strong>
                </div>
              </div>
            </div>
          </article>

          <article className="customer-dashboard-card customer-orders-card">
            <div className="customer-dashboard-card-heading">
              <span className="customer-dashboard-card-icon">
                <Package size={23} />
              </span>
              <h2>{t('account.orders')}</h2>
            </div>

            {loading ? (
              <div className="customer-orders-state">{t('account.loading')}</div>
            ) : ordersError ? (
              <div className="customer-orders-error">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="customer-orders-empty">
                <ShoppingBag size={48} />
                <h3>{t('account.empty')}</h3>
                <button onClick={() => setCurrentPage('store')} className="customer-orders-browse">
                  {t('account.browse')}
                </button>
              </div>
            ) : (
              <>
                <div className="customer-orders-table-wrap">
                  <table className="customer-orders-table">
                    <thead>
                      <tr>
                        <th>{t('account.orderNumber')}</th>
                        <th>{t('account.date')}</th>
                        <th>{t('account.total')}</th>
                        <th>{t('account.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const statusTheme = getStatusTheme(order.status);

                        return (
                          <tr key={order.id}>
                            <td>
                              <strong className="customer-order-number">#{order.order_number || order.id}</strong>
                            </td>
                            <td>{formatDate(order.created_at)}</td>
                            <td><strong>{order.total} {t('account.currency')}</strong></td>
                            <td>
                              <span className={`customer-order-status customer-order-status--${statusTheme}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="customer-orders-mobile-list">
                  {orders.map((order) => {
                    const statusTheme = getStatusTheme(order.status);

                    return (
                      <article key={order.id} className="customer-order-card">
                        <div className="customer-order-card__top">
                          <div className="customer-order-card__meta">
                            <span className="customer-order-card__label">{t('account.orderNumber')}</span>
                            <strong>#{order.order_number || order.id}</strong>
                          </div>
                          <span className={`customer-order-status customer-order-status--${statusTheme}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="customer-order-card__grid">
                          <div className="customer-order-card__field">
                            <span>{t('account.date')}</span>
                            <strong>{formatDate(order.created_at)}</strong>
                          </div>
                          <div className="customer-order-card__field">
                            <span>{t('account.total')}</span>
                            <strong>{order.total} {t('account.currency')}</strong>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </article>
        </section>
      </div>
    </main>
  );
};

export default CustomerDashboard;
