'use client';

import Link from 'next/link';
import { ArrowLeft, BadgeDollarSign, Film, Layers3, Palette } from 'lucide-react';
import AdminPageWrapper from '../components/AdminPageWrapper';

const pricingAreas = [
  {
    title: 'خطط البرمجيات',
    description: 'المواقع، المتاجر، والمنصات الرقمية. لكل خطة مزاياها وسعرها ونشرها المستقل.',
    href: '/admin/software',
    action: 'إدارة خطط البرمجيات',
    icon: Layers3,
    tone: 'violet',
  },
  {
    title: 'خطط السوشيال',
    description: 'خطط إدارة المحتوى، التصميم، والنمو. لن تختلط مع أسعار الخدمات أو البرمجيات.',
    href: '/admin/social',
    action: 'إدارة خطط السوشيال',
    icon: Palette,
    tone: 'rose',
  },
  {
    title: 'خطط الميديا',
    description: 'التصوير، الإنتاج، والفيديو. مساحة مستقلة لتفاصيل خطط الإنتاج فقط.',
    href: '/admin/pricing/media',
    action: 'إدارة خطط الميديا',
    icon: Film,
    tone: 'amber',
  },
  {
    title: 'ميزانية الإعلانات',
    description: 'خيارات ميزانية الإعلانات التي يختار منها العميل، بعيدًا عن أسعار الخطط.',
    href: '/admin/pricing/advertising',
    action: 'إعداد الميزانيات',
    icon: BadgeDollarSign,
    tone: 'blue',
  },
];

export default function AdminPricingPage() {
  return (
    <AdminPageWrapper title="مركز الخطط والأسعار">
      <section className="admin-pricing-hub" aria-label="أقسام الخطط والأسعار">
        <div className="admin-pricing-hub-intro">
          <span>تنظيم واضح حسب نوع الخدمة</span>
          <h2>اختر القسم الذي تريد إدارته</h2>
          <p>كل قسم له قائمة ونموذج مستقلان، لذلك ستظهر لك البيانات والحقول المناسبة له فقط.</p>
        </div>
        <div className="admin-pricing-hub-grid">
          {pricingAreas.map((area) => {
            const Icon = area.icon;
            return (
              <Link key={area.href} href={area.href} prefetch={false} className={`admin-pricing-area admin-pricing-area--${area.tone}`}>
                <span className="admin-pricing-area-icon"><Icon size={22} /></span>
                <div className="admin-pricing-area-content">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
                <span className="admin-pricing-area-action">{area.action}<ArrowLeft size={16} /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </AdminPageWrapper>
  );
}
