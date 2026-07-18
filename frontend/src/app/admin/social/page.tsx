'use client';

import AdminPageWrapper from '../components/AdminPageWrapper';
import PricingEditor from '../components/PricingEditor';

export default function AdminSocialServicePage() {
  return (
    <AdminPageWrapper title="خطط السوشيال">
      <PricingEditor fixedSection="social" />
    </AdminPageWrapper>
  );
}
