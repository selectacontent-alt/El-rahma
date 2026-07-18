'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ExternalLink, Radio } from 'lucide-react';

const breadcrumbMap: Record<string, { title: string; eyebrow: string }> = {
  '/admin': { title: 'لوحة القيادة', eyebrow: 'نظرة عامة على محتوى الموقع' },
  '/admin/home': { title: 'الصفحة الرئيسية', eyebrow: 'Hero، أقسام، وشهادات' },
  '/admin/services': { title: 'خدمات النمو', eyebrow: 'رحلات العميل، المحتوى، والوجهات' },
  '/admin/social-media': { title: 'تصميمات السوشيال', eyebrow: 'تصنيفات وصور Drive مخصصة' },
  '/admin/websites': { title: 'مشاريع المواقع', eyebrow: 'لوجوهات ولقطات شاشة منظمة' },
  '/admin/portfolio': { title: 'المعرض والهويات', eyebrow: 'أعمال حقيقية وهويات بصرية' },
  '/admin/news': { title: 'الأخبار والمقالات', eyebrow: 'تحكم كامل في النشر والـ SEO' },
  '/admin/software': { title: 'خطط البرمجيات', eyebrow: 'أسعار وخطط قابلة للتعديل' },
  '/admin/software/custom-plan': { title: 'الخطة المخصصة', eyebrow: 'دائرة احتياجات العميل وإعدادات الطلب' },
  '/admin/social': { title: 'خطط السوشيال', eyebrow: 'خطط سوشيال مستقلة ومنظمة' },
  '/admin/media': { title: 'الميديا والريلز', eyebrow: 'ريلز، لقطات، وأسعار' },
  '/admin/pages': { title: 'الصفحات العامة', eyebrow: 'محرر أقسام الموقع' },
  '/admin/pricing': { title: 'مركز الخطط والأسعار', eyebrow: 'كل قسم في مساحة إدارة مستقلة' },
  '/admin/pricing/media': { title: 'خطط الميديا', eyebrow: 'أسعار وخطط الإنتاج والمحتوى المرئي' },
  '/admin/pricing/advertising': { title: 'ميزانية الإعلانات', eyebrow: 'خيارات الميزانية التي يختار منها العميل' },
  '/admin/leads': { title: 'العملاء المحتملين', eyebrow: 'طلبات التواصل والفرص' },
  '/admin/settings': { title: 'الإعدادات', eyebrow: 'مفاتيح الموقع العامة' },
  '/admin/team': { title: 'الفريق', eyebrow: 'أعضاء الفريق وترتيب الظهور' },
  '/admin/users': { title: 'المديرين', eyebrow: 'صلاحيات حسابات الأدمن' },
  '/admin/audit': { title: 'سجل النشاط', eyebrow: 'تتبع تغييرات لوحة التحكم' },
};

interface AdminTopBarProps {
  collapsed: boolean;
}

export default function AdminTopBar({ collapsed }: AdminTopBarProps) {
  const pathname = usePathname();
  const page = breadcrumbMap[pathname] || { title: 'لوحة التحكم', eyebrow: 'Select Website CMS' };
  const now = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className={`admin-topbar ${collapsed ? 'admin-topbar--collapsed' : ''}`}>
      <div className="admin-topbar-left">
        <span className="admin-topbar-eyebrow">{page.eyebrow}</span>
        <h2 className="admin-topbar-title">{page.title}</h2>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-topbar-status">
          <Radio size={14} />
          <span>متصل</span>
        </div>
        <span className="admin-topbar-date">{now}</span>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-topbar-preview-btn"
          title="معاينة الموقع"
        >
          <ExternalLink size={15} />
          <span>معاينة</span>
        </a>
      </div>
    </header>
  );
}
