# مخطط ضبط الهوية البصرية لـ S C News

## Summary
تحويل `/news` من صفحة أخبار بألوان ومكونات متفرقة إلى هوية واحدة واضحة: **S C News = غرفة تحرير ذكية للتسويق والنمو الرقمي**. سنحافظ على البنفسجي `#9d027c` والأصفر `#ffbc01` كألوان رئيسية، مع استخدام ألوان الأقسام كإشارات مساعدة فقط، لا كهوية مستقلة لكل صفحة.

## Key Changes
- بناء نظام هوية داخل `frontend/src/components/SCNewsPage.tsx`: كائن tokens واحد للألوان، الخطوط، الحدود، الظلال، حالات hover، وأحجام الكروت، ثم استخدامه بدل تكرار القيم hardcoded.
- توحيد Header/Masthead عبر الرئيسية، صفحة القسم، وصفحة المقال: شعار `S C News` أقوى، شريط أقسام ثابت، بحث، CTA، وتاريخ اليوم بنفس التكوين بدل تكرار 3 نسخ متشابهة.
- إعادة تصميم Hero الرئيسية كـ **Digital News Command Center**: خبر رئيسي بصورة قوية، شريط live/breaking واضح، لوحة ترندات، وملخص أقسام، مع إزالة الزخارف الضبابية واستبدالها بنمط تحريري نظيف.
- توحيد الكروت: radius ثابت 8px، نفس نظام badge/date/read time، نفس hover، ونفس تعامل الصور؛ عند غياب الصورة يظهر placeholder براندد باسم القسم بدل مربعات ألوان عامة.
- ضبط صفحات الأقسام: كل قسم يحتفظ بأيقونة ولهجة لون، لكن يلتزم بنفس masthead، شبكة الأخبار، special block، sidebar، newsletter، وCTA.
- ضبط صفحة المقال: قالب قراءة أكثر هدوءًا، عنوان واضح، ميتاداتا موحدة، جدول محتوى، quote/insight block، CTA، author card، related articles، وshare buttons بنفس الهوية.
- تحديث `frontend/src/app/globals.css` فقط لو احتجنا classes عامة لـ S C News مثل ticker animation أو utilities للـ scrollbar/brand tokens؛ بدون تغيير API أو Django models.

## Public Interfaces / Types
- لا تغيير في API الحالي: نستمر باستخدام `/api/news/home/`, `/api/news/articles/:slug/`, `/api/news/categories/:slug/articles/`, و`/api/news/newsletter/`.
- إضافة/تنظيم types محلية فقط داخل `SCNewsPage.tsx` مثل `NewsBrandTokens` و`SectionIdentity` لتثبيت الهوية، بدون migrations أو backend schema changes.
- الحفاظ على routes الحالية: `/news`, `/news/:category`, `/news/articles/:slug/`.

## Test Plan
- تشغيل `npm run build` داخل `frontend`.
- فحص `/news`, `/news/company-news`, `/news/technology`, ومقال واحد على مقاسات 375px و768px و1440px.
- التأكد من عدم تداخل الهيدر الثابت مع شريط S C News، وعدم قص النصوص العربية/الإنجليزية داخل الأزرار والكروت.
- اختبار fallback عند فشل API: الصفحة تظل بهوية صحيحة مع بيانات `fallbackHome`.
- اختبار البحث، التنقل بين الأقسام، فتح المقال، newsletter states، وshare/copy link.

## Assumptions
- الاتجاه المعتمد: **Newsroom ذكي** مع الحفاظ على البنفسجي/الأصفر الموجودين.
- المطلوب هو مخطط تنفيذ قابل للتطبيق مباشرة، وليس Brand Guide منفصل فقط.
- لا نغير الباك إند ولا نظام الـ CMS إلا إذا ظهر أثناء التنفيذ أن صورة/حقل ناقص يمنع الهوية.
