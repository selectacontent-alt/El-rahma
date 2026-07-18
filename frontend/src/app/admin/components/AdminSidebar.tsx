'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Boxes,
  BriefcaseBusiness,
  CircleDot,
  FilePenLine,
  Film,
  FolderKanban,
  Globe2,
  Home,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Newspaper,
  Palette,
  Settings,
  Tags,
  UserRound,
  Users,
} from 'lucide-react';
import { useAdminAuth } from '../lib/auth';

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'مركز التحكم',
    items: [
      { id: 'dashboard', label: 'لوحة القيادة', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'محتوى الموقع',
    items: [
      { id: 'home', label: 'الرئيسية', href: '/admin/home', icon: Home },
      { id: 'pages', label: 'الصفحات العامة', href: '/admin/pages', icon: FilePenLine },
      { id: 'services', label: 'خدمات النمو', href: '/admin/services', icon: Layers3 },
      { id: 'pricing', label: 'مركز الخطط والأسعار', href: '/admin/pricing', icon: Tags },
      { id: 'software-pricing', label: 'خطط البرمجيات', href: '/admin/software', icon: Layers3 },
      { id: 'software-custom-plan', label: 'الخطة المخصصة', href: '/admin/software/custom-plan', icon: CircleDot },
      { id: 'social-pricing', label: 'خطط السوشيال', href: '/admin/social', icon: Palette },
      { id: 'media-pricing', label: 'خطط الميديا', href: '/admin/pricing/media', icon: Film },
      { id: 'advertising-budget', label: 'ميزانية الإعلانات', href: '/admin/pricing/advertising', icon: Settings },
    ],
  },
  {
    label: 'استوديو المحتوى',
    items: [
      { id: 'news', label: 'الأخبار والمقالات', href: '/admin/news', icon: Newspaper },
      { id: 'media', label: 'الميديا والريلز', href: '/admin/media', icon: Film },
      { id: 'social-media', label: 'تصميمات السوشيال', href: '/admin/social-media', icon: Palette },
    ],
  },
  {
    label: 'المشاريع والأصول',
    items: [
      { id: 'portfolio', label: 'المعرض والهويات', href: '/admin/portfolio', icon: FolderKanban },
      { id: 'websites', label: 'مشاريع المواقع', href: '/admin/websites', icon: Globe2 },
      { id: 'team', label: 'فريق العمل', href: '/admin/team', icon: Users },
    ],
  },
  {
    label: 'العملاء والنظام',
    items: [
      { id: 'leads', label: 'العملاء المحتملين', href: '/admin/leads', icon: UserRound },
      { id: 'users', label: 'المديرين', href: '/admin/users', icon: BriefcaseBusiness },
      { id: 'audit', label: 'سجل النشاط', href: '/admin/audit', icon: Activity },
      { id: 'settings', label: 'الإعدادات', href: '/admin/settings', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    if (href === '/admin/pricing') return pathname === '/admin/pricing';
    if (href === '/admin/software') return pathname === '/admin/software';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar-brand">
        <a href="/admin" className="admin-sidebar-mark" aria-label="Select Admin">
          <span className="admin-sidebar-logo">
            <img src="/logo.png" alt="" />
          </span>
          {!collapsed && (
            <span className="admin-sidebar-brand-copy">
              <strong>Select Admin</strong>
              <small>مركز تشغيل الموقع</small>
            </span>
          )}
        </a>
        <button
          type="button"
          className="admin-sidebar-collapse-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
          title={collapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
        >
          <Menu size={17} />
        </button>
      </div>

      <div className="admin-sidebar-health">
        <span className="admin-sidebar-health-icon">
          <Boxes size={15} />
        </span>
        {!collapsed && (
          <span>
            <strong>المساحة جاهزة</strong>
            <small>إدارة المحتوى والأصول</small>
          </span>
        )}
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            {!collapsed && <div className="admin-nav-heading">{group.label}</div>}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`admin-nav-item ${active ? 'admin-nav-item--active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="admin-nav-icon"><Icon size={18} /></span>
                  {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                  {active && <span className="admin-nav-active-bar" />}
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-user">
        <div className="admin-sidebar-avatar">{user?.username?.[0]?.toUpperCase() || 'A'}</div>
        {!collapsed && (
          <div className="admin-sidebar-user-info">
            <span className="admin-sidebar-username">{user?.username || 'admin'}</span>
            <span className="admin-sidebar-role">صلاحيات {user?.role || 'admin'}</span>
          </div>
        )}
        <button onClick={logout} className="admin-sidebar-logout" title="تسجيل الخروج" type="button">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
