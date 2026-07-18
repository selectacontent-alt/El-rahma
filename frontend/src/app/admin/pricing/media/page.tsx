'use client';

import AdminPageWrapper from '../../components/AdminPageWrapper';
import PricingEditor from '../../components/PricingEditor';

export default function AdminMediaPricingPage() {
  return (
    <AdminPageWrapper title="خطط الميديا">
      <PricingEditor fixedSection="media" />
    </AdminPageWrapper>
  );
}
