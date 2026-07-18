import type { Metadata } from 'next';
import { AdminAuthProvider } from './lib/auth';
import { AdminFeedbackProvider } from './components/AdminFeedback';
import './admin.css';

export const metadata: Metadata = {
  title: 'SC Admin Panel',
  description: 'Select Customers Admin Dashboard',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminFeedbackProvider>{children}</AdminFeedbackProvider>
    </AdminAuthProvider>
  );
}
