'use client';

import AdminPageWrapper from '../components/AdminPageWrapper';
import CmsPageEditor from '../components/CmsPageEditor';

export default function AdminPagesPage() {
  return (
    <AdminPageWrapper title="إدارة صفحات الموقع">
      <CmsPageEditor />
    </AdminPageWrapper>
  );
}
