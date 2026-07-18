'use client';

import AdminPageWrapper from '../../components/AdminPageWrapper';
import SoftwareCustomPlanSettings from '../../components/SoftwareCustomPlanSettings';

export default function AdminSoftwareCustomPlanPage() {
  return (
    <AdminPageWrapper title="الخطة المخصصة">
      <SoftwareCustomPlanSettings />
    </AdminPageWrapper>
  );
}
