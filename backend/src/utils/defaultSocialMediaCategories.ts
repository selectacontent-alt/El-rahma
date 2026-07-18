import type { PrismaClient } from '@prisma/client';

export const defaultSocialMediaCategories = [
  { nameAr: 'أثاث منزلي', nameEn: 'Home Furniture', keyword: 'furniture' },
  { nameAr: 'مطابخ', nameEn: 'Kitchens', keyword: 'kitchen' },
  { nameAr: 'جيم ورياضة', nameEn: 'Gym & Sports', keyword: 'gym' },
  { nameAr: 'بنوك وخدمات مالية', nameEn: 'Banking & Finance', keyword: 'finance' },
  { nameAr: 'طب وعيادات', nameEn: 'Medical & Clinics', keyword: 'medical' },
  { nameAr: 'تجميل وتخسيس', nameEn: 'Beauty & Slimming', keyword: 'beauty' },
  { nameAr: 'أدوات منزلية', nameEn: 'Home Appliances', keyword: 'appliance' },
  { nameAr: 'بيوتي سنتر وصالونات', nameEn: 'Beauty Centers & Salons', keyword: 'salon' },
  { nameAr: 'مجوهرات', nameEn: 'Jewelry', keyword: 'jewelry' },
  { nameAr: 'سياحة', nameEn: 'Tourism', keyword: 'tourism' },
  { nameAr: 'عقارات', nameEn: 'Real Estate', keyword: 'realestate' },
  { nameAr: 'مكافحة حشرات', nameEn: 'Pest Control', keyword: 'pest' },
  { nameAr: 'ديكورات', nameEn: 'Decor', keyword: 'decor' },
  { nameAr: 'أجهزة كهربائية', nameEn: 'Electronics', keyword: 'electronics' },
  { nameAr: 'خدمات سيارات', nameEn: 'Car Services', keyword: 'car' },
  { nameAr: 'مؤسسات تعليمية', nameEn: 'Education', keyword: 'education' },
  { nameAr: 'عطور', nameEn: 'Perfumes', keyword: 'perfume' },
  { nameAr: 'تسويق وبرامج', nameEn: 'Marketing & Software', keyword: 'software' },
  { nameAr: 'مفروشات ومراتب', nameEn: 'Furnishings & Mattresses', keyword: 'bed' },
  { nameAr: 'مطاعم', nameEn: 'Restaurants', keyword: 'restaurant' },
  { nameAr: 'موضة وأزياء', nameEn: 'Fashion', keyword: 'fashion' },
  { nameAr: 'شحن وتوصيل', nameEn: 'Shipping & Delivery', keyword: 'delivery' },
  { nameAr: 'محتوى ديني', nameEn: 'Religious Content', keyword: 'mosque' },
  { nameAr: 'منتجات غذائية', nameEn: 'Food Products', keyword: 'food' },
  { nameAr: 'مياه وفلاتر', nameEn: 'Water & Filters', keyword: 'water' },
  { nameAr: 'أعمال زجاج وخشب', nameEn: 'Glass & Wood Works', keyword: 'glass' },
  { nameAr: 'إكسسوارات', nameEn: 'Accessories', keyword: 'accessories' },
  { nameAr: 'أثاث مكتبي', nameEn: 'Office Furniture', keyword: 'office' },
  { nameAr: 'زراعة', nameEn: 'Agriculture', keyword: 'agriculture' },
  { nameAr: 'تركيب وتنظيف', nameEn: 'Installation & Cleaning', keyword: 'cleaning' },
  { nameAr: 'أعمال الكهرباء', nameEn: 'Electrical Works', keyword: 'construction' },
  { nameAr: 'مستحضرات تجميل', nameEn: 'Cosmetics', keyword: 'cosmetics' },
  { nameAr: 'أعمال صناعية', nameEn: 'Industrial Works', keyword: 'industrial' },
  { nameAr: 'دعاية وإعلان', nameEn: 'Advertising', keyword: 'advertising' },
];

let seedPromise: Promise<void> | null = null;

export async function ensureDefaultSocialMediaCategories(prisma: PrismaClient) {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const existingCount = await prisma.socialMediaCategory.count();
    if (existingCount > 0) return;

    await prisma.socialMediaCategory.createMany({
      data: defaultSocialMediaCategories.map((category, index) => ({
        ...category,
        order: index,
        isActive: true,
        images: '[]',
      })),
    });
  })().catch(error => {
    seedPromise = null;
    throw error;
  });

  return seedPromise;
}
