'use client';

import AdminPageWrapper from '../../components/AdminPageWrapper';
import AdvertisingBudgetSettings from '../../components/AdvertisingBudgetSettings';

export default function AdminAdvertisingBudgetPage() {
  return (
    <AdminPageWrapper title="ميزانية الإعلانات">
      <AdvertisingBudgetSettings />
    </AdminPageWrapper>
  );
}
