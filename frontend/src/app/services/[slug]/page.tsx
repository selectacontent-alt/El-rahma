import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetailPage, { ServiceDetailData } from '../../../components/ServiceDetailPage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

async function getService(slug: string): Promise<ServiceDetailData | null> {
  try {
    // Service activation, ordering, and copy are CMS-managed. Do not cache a
    // dynamic detail response here, otherwise a just-disabled service could
    // remain reachable until a revalidation window expires.
    const response = await fetch(`${API_BASE}/api/site/services/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const payload = await response.json();
    return (payload?.data || payload) as ServiceDetailData;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: 'Service not found | S C Marketing', robots: { index: false, follow: false } };
  const title = service.titleAr || service.titleEn || 'Service';
  const description = service.descAr || service.descEn || undefined;
  return {
    title: `${title} | S C Marketing`,
    description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}
