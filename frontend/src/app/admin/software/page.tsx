'use client';

import AdminPageWrapper from '../components/AdminPageWrapper';
import PricingEditor from '../components/PricingEditor';

export default function AdminSoftwarePage() {
  return (
    <AdminPageWrapper title="خطط البرمجيات">
      <PricingEditor fixedSection="software" />
    </AdminPageWrapper>
  );
}
