'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastTone = 'success' | 'error' | 'info';

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  tone?: 'danger' | 'primary';
};

type Toast = { id: number; message: string; tone: ToastTone };

type FeedbackContextValue = {
  notify: (message: string, tone?: ToastTone) => void;
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function AdminFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pendingConfirm, setPendingConfirm] = useState<(ConfirmOptions & { resolve: (value: boolean) => void }) | null>(null);

  const notify = useCallback((message: string, tone: ToastTone = 'info') => {
    if (!message) return;
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(current => [...current, { id, message, tone }].slice(-4));
    window.setTimeout(() => setToasts(current => current.filter(toast => toast.id !== id)), 4200);
  }, []);

  const confirm = useCallback((options: ConfirmOptions = {}) => new Promise<boolean>((resolve) => {
    setPendingConfirm({
      title: options.title || 'تأكيد الإجراء',
      description: options.description || 'هل تريد المتابعة؟',
      confirmLabel: options.confirmLabel || 'متابعة',
      tone: options.tone || 'primary',
      resolve,
    });
  }), []);

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message?: string) => notify(String(message || ''), 'error');
    return () => { window.alert = originalAlert; };
  }, [notify]);

  const value = useMemo(() => ({ notify, confirm }), [confirm, notify]);
  const closeConfirm = (result: boolean) => {
    if (!pendingConfirm) return;
    pendingConfirm.resolve(result);
    setPendingConfirm(null);
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div className="admin-toast-region" aria-live="polite" aria-atomic="true">
        {toasts.map(toast => {
          const Icon = toast.tone === 'success' ? CheckCircle2 : toast.tone === 'error' ? XCircle : Info;
          return (
            <div className={`admin-toast admin-toast--${toast.tone}`} key={toast.id}>
              <Icon size={18} />
              <span>{toast.message}</span>
              <button type="button" onClick={() => setToasts(current => current.filter(item => item.id !== toast.id))} aria-label="إغلاق التنبيه"><X size={15} /></button>
            </div>
          );
        })}
      </div>
      {pendingConfirm && (
        <div className="admin-confirm-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeConfirm(false); }}>
          <section className="admin-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title">
            <span className={`admin-confirm-icon admin-confirm-icon--${pendingConfirm.tone}`}><AlertTriangle size={22} /></span>
            <div>
              <h2 id="admin-confirm-title">{pendingConfirm.title}</h2>
              <p>{pendingConfirm.description}</p>
            </div>
            <div className="admin-confirm-actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => closeConfirm(false)}>إلغاء</button>
              <button type="button" className={`admin-btn ${pendingConfirm.tone === 'danger' ? 'admin-btn--danger' : 'admin-btn--primary'}`} onClick={() => closeConfirm(true)}>{pendingConfirm.confirmLabel}</button>
            </div>
          </section>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function useAdminFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('useAdminFeedback must be used inside AdminFeedbackProvider');
  return context;
}
