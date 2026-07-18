# مخطط تصميم صفحة `/projects-photography` - Select Agency

> صفحة معرض مشاريع تصوير فوتوغرافي. الهدف ليس شرح خدمة التصوير، بل عرض أعمال حقيقية بطريقة تخلي الزائر يقول: "أنا عايز شغلي يظهر بالشكل ده".

---

## الفكرة الرئيسية

اسم التجربة المقترح: **The Proof Room**

الصفحة تتصرف كأنها غرفة فرز احترافية للصور بعد جلسة تصوير: طاولة ضوء، contact sheets، علامات اختيار، ملاحظات إنتاج، طبقات قبل/بعد، وفتح Case Study كأنك بتسحب ملف مشروع من الأرشيف.

الفرق عن صفحة `/media`:

- `/media` = صفحة خدمة وتصوير وإنتاج.
- `/projects-photography` = صفحة إثبات بصري، أعمال، نتائج، جودة، وتفاصيل تنفيذ.
- لا نكرر فكرة العدسة/الشريط السينمائي/الأبيرتشر كهوية أساسية.
- نستخدم لغة معرض أعمال راقية: proof marks, contact sheet, light table, project drawer, edit layers.

---

## الهدف التجاري

1. عرض مشاريع التصوير بطريقة تجعل الجودة واضحة في أول 5 ثواني.
2. مساعدة العميل يلاقي نوع التصوير المناسب له بسرعة: منتجات، أكل، عقارات، بورتريه، مناسبات، حملات.
3. تحويل المشاهدة إلى طلب مشروع: "نفذلي جلسة مشابهة".
4. بناء ثقة من خلال تفاصيل تنفيذ مختصرة: التحدي، الإضاءة، المعالجة، التسليم.
5. جعل الصفحة قابلة للتوسع عند إضافة مشاريع جديدة بدون إعادة تصميم.

---

## شخصية الصفحة

**الإحساس العام:** راقي، نظيف، بصري جدا، فيه حركة لكن مش استعراض زائد.

**المراجع الشعورية:**

- غرفة اختيار صور في ستوديو فاخر.
- مجلة تصميم فيها مساحات بيضاء وصور كبيرة.
- لوحة proofing احترافية للعميل.
- أرشيف أعمال مرتب، وليس جاليري عشوائي.

**ممنوعات تصميمية:**

- لا hero تسويقي تقليدي فيه نص كبير فقط.
- لا cards داخل cards.
- لا خلفيات gradient ضخمة تبلع الصور.
- لا صور stock غامضة أو مقصوصة بزيادة.
- لا تكرار "film reel" و "aperture" لأنهم مناسبين أكثر لصفحة `/media`.

---

## نظام الألوان

الصفحة Light Mode بشكل أساسي عشان الصور تاخد البطولة.

| الدور | اللون | الاستخدام |
|---|---:|---|
| Paper White | `#fbfaf7` | خلفية الصفحة الرئيسية |
| Gallery White | `#ffffff` | مساحات عرض الصور والـ proof panels |
| Graphite | `#171717` | النصوص الأساسية |
| Soft Ink | `#525252` | النصوص الثانوية |
| Select Magenta | `#9d027c` | CTA، active states، proof marks |
| Select Yellow | `#ffbc01` | highlights، counters، pins |
| Cyan Focus | `#06b6d4` | حالات hover تقنية، metadata |
| Moss Green | `#4d7c0f` | مؤشرات نجاح وتسليم |
| Line Gray | `#e7e5e4` | borders وخطوط الشبكة |

قاعدة مهمة: الصور هي اللون الأساسي. الواجهة نفسها هادئة، والـ accent يظهر في أماكن قليلة محسوبة.

---

## الخطوط والمقاسات

**العناوين:** خط قوي وواضح، وزن `700` أو `800`.

**النصوص:** وزن `400`، line-height مريح.

**أرقام ومعلومات EXIF:** monospace خفيف مثل `ui-monospace`.

**منع مشاكل النص:**

- لا نستخدم `vw` في أحجام الخط.
- أقصى عرض للنصوص الطويلة `680px`.
- أزرار الموبايل full-width عند الحاجة.
- أسماء المشاريع الطويلة تتحول لسطرين بحد أقصى ثم ellipsis.

---

## هيكل الصفحة المختصر

1. Hero Light Table - أول شاشة عبارة عن معرض تفاعلي وليس بانر.
2. Smart Filter Rail - فلترة المشاريع كأنها إعدادات كاميرا.
3. Signature Contact Sheet - شبكة المشاريع الرئيسية.
4. Featured Case Study Drawer - مشروع مميز يتفتح داخل الصفحة.
5. Before / Edit Layers - طبقات المعالجة قبل وبعد.
6. Shoot System Map - كيف اتحول المشروع من brief لصورة جاهزة.
7. Category Worlds - عوالم تصوير حسب المجال.
8. Proofing Experience - تجربة اختيار صور مفضلة.
9. Results Strip - أرقام مختصرة مرتبطة بالصور.
10. Final CTA - طلب جلسة مشابهة.

---

# SECTION 01 - Hero Light Table

## الفكرة

أول شاشة تكون "طاولة ضوء" عليها صور مشاريع حقيقية بأحجام مختلفة، مرتبة كأن المصور لسه بيعمل اختيار نهائي. في النص صورة كبيرة مختارة، وعلى الجوانب thumbnails عليها علامات proof.

بدل ما نقول "مشاريع التصوير"، نخلي الزائر يشوف المشروع فورًا.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Selected proof mark]    مشاريع تصوير تصنع رغبة الشراء       │
│                           مش صور حلوة وخلاص. صور مبنية       │
│                           على إضاءة، زاوية، ورسالة بيع.      │
│                                                              │
│  ┌───────────────┐        ┌───────────────────────────┐      │
│  │ thumb / food  │        │                           │      │
│  └───────────────┘        │     LARGE FEATURE PHOTO    │      │
│  ┌───────────────┐        │                           │      │
│  │ thumb/product │        └───────────────────────────┘      │
│  └───────────────┘             Client / Category / Shots     │
│                                                              │
│  [استعرض المشاريع] [اطلب جلسة مشابهة]                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## عناصر التفاعل

- عند hover على thumbnail، الصورة الكبيرة تتغير بسلاسة.
- كل thumbnail عليه علامة صغيرة:
  - `SELECTED`
  - `RETOUCHED`
  - `CAMPAIGN READY`
- metadata rail أسفل الصورة:
  - العميل
  - نوع المشروع
  - عدد الصور المسلمة
  - مدة التنفيذ
  - استخدام الصور: e-commerce / campaign / menu / social

## Copy مقترح

**H1:** مشاريع تصوير تخلي المنتج يتشاف كما يستحق

**Subtitle:** معرض مختار من جلسات تصوير منتجات، أكل، أماكن، بورتريه، وحملات. كل مشروع هنا له هدف واضح: إبراز القيمة، رفع الثقة، وتحريك قرار الشراء.

**CTA 1:** استعرض المشاريع

**CTA 2:** اطلب جلسة مشابهة

## حركة مميزة

عند دخول الصفحة:

1. الخلفية تظهر كـ light table خفيف.
2. الصور تظهر واحدة واحدة كأنها اتوضعت على الطاولة.
3. علامة `SELECTED` تتحرك على الصورة الرئيسية.
4. metadata يكتب نفسه بسرعة خفيفة مثل شاشة proofing.

---

# SECTION 02 - Smart Filter Rail

## الفكرة

فلتر المشاريع يظهر كأنه شريط إعدادات كاميرا، لكن بدون كليشيه. بدل "All / Product / Food"، نخليها عملية وجميلة:

```text
[كل المشاريع] [منتجات] [مطاعم] [عقارات] [بورتريه] [مناسبات] [حملات]
Sort: [الأحدث] [الأقوى بصريا] [الأكثر تنوعا]
View: [Grid] [Proof Sheet] [Full Bleed]
```

## تفاصيل UX

- الفلاتر sticky تحت الهيدر عند scroll.
- عند اختيار فلتر، الشبكة تتغير بحركة re-layout ناعمة.
- كل فلتر يعرض عدد المشاريع داخله.
- الموبايل: الفلاتر تتحول لشريط أفقي قابل للسحب.
- `View` يسمح بثلاث طرق مشاهدة:
  - Grid: أسرع تصفح.
  - Proof Sheet: شكل contact sheet.
  - Full Bleed: صور كبيرة واحدة تلو الأخرى.

## سبب الفكرة

العميل مش عايز يتفرج بس. هو غالبا بيدور على مثال قريب من نشاطه. الفلترة لازم تكون ظاهرة من البداية.

---

# SECTION 03 - Signature Contact Sheet

## الفكرة

المعرض الرئيسي يكون contact sheet حديث: شبكة صور بمقاسات ثابتة، كل مشروع يظهر كـ proof block مش كارت تسويقي.

## Layout

```text
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Project 1  │  Project 2  │  Project 3  │  Project 4  │
│  24 shots   │  menu       │  campaign   │  portrait   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│  Project 5 large image    │  Project 6  │  Project 7  │
├───────────────────────────┼─────────────┼─────────────┤
│  Project 8  │  Project 9  │  Project 10 large image   │
└─────────────┴─────────────┴───────────────────────────┘
```

## كارت المشروع

كل project tile يحتوي:

- صورة cover حقيقية.
- label صغير: `PRODUCT`, `FOOD`, `SPACE`, `PEOPLE`.
- اسم المشروع.
- سطر واحد يوضح الهدف: "رفع جودة صور المتجر"، "تصوير منيو جديد"، "حملة إطلاق".
- أرقام صغيرة:
  - `36 final shots`
  - `2 shoot days`
  - `8 reels assets`

## Hover state

عند hover:

- الصورة لا تظلم بالكامل. فقط تظهر طبقة شفافة خفيفة.
- تظهر 3 صور صغيرة من نفس المشروع تحت الاسم.
- زر صغير: `فتح المشروع`.
- border بلون Select Magenta حول الصورة.
- cursor يتحول إلى label صغير: `View set`.

## ملاحظة تنفيذ

لا تجعل الصور تتحرك أو تكبر لدرجة تكسر الشبكة. استخدم:

```css
.project-tile {
  aspect-ratio: 4 / 5;
  overflow: hidden;
}

.project-tile.is-wide {
  aspect-ratio: 16 / 9;
}
```

---

# SECTION 04 - Featured Case Study Drawer

## الفكرة

بدل ما فتح المشروع يوديك صفحة جديدة مباشرة، يظهر drawer كبير داخل الصفحة كأنه ملف مشروع اتسحب من الأرشيف.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ Case Study: Gourmet Burger Campaign                     [X]  │
├──────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────┐  Challenge                     │
│ │                           │  المنتج كان محتاج صور شهية     │
│ │        HERO IMAGE          │  تناسب المنيو والإعلانات.      │
│ │                           │                                 │
│ └───────────────────────────┘  Shoot Plan                     │
│ [thumb][thumb][thumb][thumb]  إضاءة جانبية + خلفيات دافئة    │
│                                                              │
│ Deliverables: 32 photos / 6 crops / 12 ad assets             │
└──────────────────────────────────────────────────────────────┘
```

## محتوى الـ drawer

كل مشروع يظهر كقصة قصيرة:

1. **Brief:** العميل كان محتاج إيه.
2. **Visual Decision:** اخترنا إضاءة/خلفية/زاوية ليه.
3. **Shoot Setup:** تفاصيل مختصرة بدون إطالة تقنية.
4. **Final Assets:** عدد الصور والمقاسات.
5. **Usage:** فين الصور اتنشرت.
6. **CTA:** عايز مشروع شبه ده؟

## تفاعل مميز

- الثمبنيل داخل الـ drawer تتحرك في rail أفقي.
- عند الضغط على صورة، تظهر full view داخل نفس الـ drawer.
- زر `Pin this style` يضيف المشروع لقائمة "أريد هذا الأسلوب" في CTA النهائي.

## لماذا drawer؟

لأن الصفحة تبقى سريعة ومستمرة. الزائر يفتح مشروع ويقفل ويرجع للشبكة بدون فقدان السياق.

---

# SECTION 05 - Before / Edit Layers

## الفكرة

مش مجرد before/after slider. نعرض مراحل الصورة كطبقات:

```text
[RAW] [LIGHT CORRECTION] [COLOR] [RETOUCH] [FINAL CROP]
```

كل tab يغير الصورة ويفسر خطوة واحدة فقط.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ من اللقطة الخام للصورة الجاهزة للبيع                          │
│                                                              │
│ [RAW] [Lighting] [Color] [Retouch] [Final]                   │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                  IMAGE STAGE VIEW                         │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Note: في مرحلة اللون ضبطنا حرارة الصورة عشان المنتج يظهر... │
└──────────────────────────────────────────────────────────────┘
```

## طبقات مقترحة

| الطبقة | الهدف |
|---|---|
| RAW | توضيح أصل اللقطة بدون معالجة |
| Lighting | إبراز فرق ضبط الإضاءة |
| Color | توحيد ألوان البراند |
| Retouch | إزالة عيوب بسيطة بدون تزييف المنتج |
| Final Crop | نسخ جاهزة للإعلانات والمتجر |

## Micro-interaction

- عند تغيير الطبقة، لا نعمل fade فقط. نعمل wipe خفيف أفقي مثل مرور أداة مراجعة.
- labels تظهر كـ annotations على الصورة، مثل:
  - `shadow softened`
  - `label cleaned`
  - `background balanced`

---

# SECTION 06 - Shoot System Map

## الفكرة

قسم صغير يشرح النظام خلف الصور. ليس timeline تقليدي. يكون مثل خريطة إنتاج:

```text
Brief -> Mood Direction -> Set Build -> Shoot -> Retouch -> Delivery
```

كل خطوة عبارة عن node، وعند hover تظهر لقطة/معلومة صغيرة.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ النظام اللي بيطلع الصور بالشكل ده                            │
│                                                              │
│   [Brief] ---- [Mood] ---- [Set] ---- [Shoot] ---- [Edit]    │
│      |          |          |          |          |           │
│   هدف البيع   مرجع بصري   تجهيزات    التقاط     تسليم        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## تفاصيل كل خطوة

1. **Brief:** نفهم المنتج، الجمهور، وقناة النشر.
2. **Mood Direction:** نحدد moodboard، خلفيات، وزوايا.
3. **Set Build:** تجهيز الإضاءة، props، وترتيب المشهد.
4. **Shoot:** التقاط زوايا متعددة بناء على الاستخدام.
5. **Retouch:** معالجة واقعية تحافظ على المنتج.
6. **Delivery:** مقاسات جاهزة للمتجر، الإعلانات، والسوشيال.

## الشكل البصري

الخريطة تكون full-width band بدون كروت داخل كروت. كل node له رقم وخط رفيع، والألوان بسيطة.

---

# SECTION 07 - Category Worlds

## الفكرة

بدل list عادي لأنواع التصوير، نعمل "عوالم" مختلفة. كل عالم له شكل صور وتفاصيل:

| العالم | visual behavior | أمثلة |
|---|---|---|
| Product Shelf | صور كأنها على رف عرض | عطور، عبوات، أجهزة، مستحضرات |
| Food Heat | صور دافئة وقريبة | مطاعم، منيو، مشروبات |
| Space Lines | صور واسعة وهندسية | عقارات، عيادات، مكاتب |
| People Proof | بورتريه نظيف | فرق عمل، مؤسسين، corporate |
| Campaign Burst | صور متعددة المقاسات | إطلاق منتج، ads, social |

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ اختر العالم الأقرب لمشروعك                                  │
│                                                              │
│ Product Shelf     Food Heat     Space Lines                  │
│ [image strip]     [image strip] [image strip]                │
│                                                              │
│ People Proof      Campaign Burst                             │
│ [image strip]     [image strip]                              │
└──────────────────────────────────────────────────────────────┘
```

## تفاعل

- كل عالم عند hover يعرض 3 لقطات مختلفة بسرعة بطيئة.
- عند الضغط على عالم، يتم تطبيق فلتر المشاريع الخاص به في الشبكة.
- لا نفتح modal هنا. الضغط ينقل المستخدم للمشاريع مباشرة.

---

# SECTION 08 - Proofing Experience

## الفكرة

قسم ممتع ومفيد: "اختار الصور اللي شبه ستايلك". المستخدم يضغط على صور مصغرة، وتتجمع في شريط سفلي اسمه `Your Mood Picks`.

## الهدف

بدل CTA عام، نخلي العميل يبعت لنا ذوقه المختار من الصفحة نفسها.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ كوّن مرجعك البصري                                            │
│ اختر 3 صور قريبة من الشكل اللي عايزه                         │
│                                                              │
│ [img] [img] [img] [img] [img] [img]                          │
│ [img] [img] [img] [img] [img] [img]                          │
│                                                              │
│ Your Mood Picks: [1] [2] [3]      [اطلب جلسة بهذا الستايل]    │
└──────────────────────────────────────────────────────────────┘
```

## تفاصيل UX

- حد أقصى 5 اختيارات.
- عند اختيار صورة، تظهر علامة صغيرة بلون Select Yellow.
- CTA يأخذ أسماء المشاريع المختارة كبيانات داخل نموذج الطلب.
- لو المستخدم لم يختار شيء، CTA يبقى عام: "اطلب جلسة تصوير".

## فكرة قوية

هذا القسم يحول المعرض من مشاهدة سلبية إلى briefing بسيط. العميل يبدأ يحضر طلبه بدون ما يشعر.

---

# SECTION 09 - Results Strip

## الفكرة

شريط نتائج مختصر، لكن مرتبط بالتصوير، مش أرقام عامة.

```text
36K+     صورة تم تسليمها
48h      متوسط تسليم أول batch
6        مقاسات لكل صورة للحملات
92%      مشاريع تم استخدامها في إعلانات مباشرة
```

## ملاحظات

- لو الأرقام غير مؤكدة، لا نعرضها كحقائق. نستخدم صياغة قابلة للتعديل:
  - `+120 مشروع تصوير`
  - `تسليم منظم حسب الاستخدام`
  - `نسخ جاهزة للمتجر والإعلانات`
- لا نضع claims قوية بدون مصدر داخلي.

## حركة

الأرقام تظهر عند scroll بدقة، بدون مبالغة في العد.

---

# SECTION 10 - Final CTA

## الفكرة

CTA يبني على اختيارات المستخدم وسياق الصفحة:

- لو اختار صور في Proofing Experience:
  - "ابدأ جلسة بنفس الستايل المختار"
- لو فتح مشروع product:
  - "نفذ تصوير منتجات مشابه"
- لو لم يتفاعل:
  - "احجز جلسة تصوير لمشروعك"

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ عندك منتج أو مكان محتاج يظهر بمستواه الحقيقي؟                 │
│ ابعتلنا نوع المشروع، وهنرشح لك شكل جلسة مناسب للهدف والقناة.  │
│                                                              │
│ [نوع المشروع v] [عدد المنتجات/الصور] [واتساب] [ارسال]         │
└──────────────────────────────────────────────────────────────┘
```

## CTA fields

- نوع المشروع:
  - منتجات
  - أكل
  - عقار/مكان
  - بورتريه
  - حملة
- حجم المشروع:
  - أقل من 10 صور
  - 10-30 صورة
  - 30+ صورة
- قناة الاستخدام:
  - متجر إلكتروني
  - إعلانات
  - سوشيال
  - مطبوعات

---

## Data Model مقترح

```ts
export type PhotographyProject = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  category: 'product' | 'food' | 'space' | 'people' | 'campaign' | 'event';
  clientName: string;
  industry: string;
  coverImage: string;
  palette: {
    primary: string;
    secondary: string;
  };
  summaryAr: string;
  summaryEn: string;
  briefAr: string;
  visualDecisionAr: string;
  shootSetupAr: string;
  deliverables: {
    finalPhotos: number;
    crops: string[];
    shootDays: number;
    formats: string[];
  };
  usage: Array<'ecommerce' | 'ads' | 'social' | 'menu' | 'print'>;
  images: Array<{
    src: string;
    altAr: string;
    altEn: string;
    orientation: 'portrait' | 'landscape' | 'square';
    isHero?: boolean;
  }>;
  editLayers?: {
    raw: string;
    lighting: string;
    color: string;
    retouch: string;
    final: string;
  };
  stats?: Array<{
    labelAr: string;
    value: string;
  }>;
};
```

---

## Component Plan

مسار الصفحة المقترح:

```text
frontend/src/app/projects-photography/page.tsx
frontend/src/components/photography-projects/PhotographyProjectsPage.tsx
frontend/src/components/photography-projects/LightTableHero.tsx
frontend/src/components/photography-projects/ProjectFilterRail.tsx
frontend/src/components/photography-projects/ContactSheetGrid.tsx
frontend/src/components/photography-projects/ProjectCaseDrawer.tsx
frontend/src/components/photography-projects/EditLayersViewer.tsx
frontend/src/components/photography-projects/ShootSystemMap.tsx
frontend/src/components/photography-projects/CategoryWorlds.tsx
frontend/src/components/photography-projects/ProofingPicks.tsx
frontend/src/components/photography-projects/PhotographyCTA.tsx
frontend/src/components/photography-projects/data.ts
frontend/src/components/photography-projects/PhotographyProjectsPage.css
```

## ربط الـ route داخل التطبيق الحالي

المشروع الحالي عنده `pathToTab` و `tabToPath` في `frontend/src/App.tsx`.

نحتاج إضافة:

```ts
if (cleanPath === '/projects-photography') return 'projects-photography';
```

وفي `tabToPath`:

```ts
if (tab === 'projects-photography') return '/projects-photography';
```

ثم render:

```tsx
{activeTab === 'projects-photography' && (
  <PhotographyProjectsPage currentLang={lang} />
)}
```

أو إنشاء route مستقل في Next إذا أردنا عزله عن SPA.

---

## Motion Plan

استخدم `motion/react` الموجود في المشروع.

| العنصر | الحركة |
|---|---|
| Hero images | دخول stagger كأن الصور توضع على الطاولة |
| Filter rail | active indicator ينزلق تحت الفلتر |
| Contact sheet | layout animation عند تغيير الفلتر |
| Drawer | slide + scale بسيط من جهة المشروع |
| Edit layers | horizontal wipe وليس fade فقط |
| Proofing picks | selected image تطير للشريط السفلي بحركة قصيرة |
| CTA | يتغير النص حسب اختيارات المستخدم |

## Reduced Motion

لو المستخدم مفعل `prefers-reduced-motion`:

- نلغي parallax.
- نلغي stagger الزائد.
- نحافظ على تغييرات opacity بسيطة فقط.

---

## Mobile Design

الموبايل ليس نسخة مصغرة من الديسكتوب.

### Hero

- الصورة الرئيسية أولا.
- النص تحتها مباشرة.
- thumbnails في rail أفقي.
- metadata تتحول إلى chips.

### Filters

- scroll-snap chips.
- زر `View` يتحول إلى segmented control صغير.

### Contact Sheet

- عمود واحد أو عمودين حسب عرض الشاشة.
- المشاريع المميزة تظهر full-width.
- drawer يتحول إلى bottom sheet.

### Proofing Picks

- شريط الاختيارات sticky bottom.
- CTA يظهر فقط بعد اختيار أول صورة.

---

## SEO و Metadata

### Title

`مشاريع تصوير فوتوغرافي | Select Agency`

### Description

`شاهد نماذج من مشاريع تصوير المنتجات، المطاعم، الأماكن، البورتريه، والحملات الإعلانية من Select Agency، مع تفاصيل التنفيذ والتسليم.`

### H1

`مشاريع تصوير تخلي المنتج يتشاف كما يستحق`

### Keywords داخل المحتوى

- تصوير منتجات
- تصوير مطاعم
- تصوير فوتوغرافي احترافي
- تصوير إعلانات
- تصوير منتجات للمتاجر الإلكترونية
- تصوير بورتريه للشركات
- تصوير عقارات وأماكن

---

## Accessibility

- كل صورة لها `alt` يصف المنتج/المشهد والغرض، وليس "صورة جميلة".
- كل مشروع يفتح بالكيبورد.
- drawer يغلق بزر واضح وبـ `Esc`.
- focus trap داخل drawer.
- ألوان النصوص تحقق contrast جيد فوق الصور.
- لا نعتمد على اللون وحده لإظهار اختيار الفلاتر.
- gallery controls لها `aria-label`.

---

## Performance

1. استخدام `next/image` للمشاريع الحقيقية.
2. تحميل أول 6 صور فقط بأولوية أعلى.
3. باقي صور الشبكة lazy load.
4. صور drawer لا تتحمل إلا عند فتح المشروع.
5. استخدام thumbnails منفصلة عن الصور الكبيرة.
6. عدم استخدام blur ثقيل فوق صور كثيرة.
7. تثبيت أبعاد الصور بـ `aspect-ratio` لمنع layout shift.

---

## Content Requirements

لكي الصفحة تطلع قوية فعلا، نحتاج لكل مشروع:

- 1 cover قوي.
- 4-8 صور داخلية.
- اسم العميل أو اسم مجال عام لو العميل غير مسموح.
- نوع المشروع.
- هدف المشروع في جملة واحدة.
- عدد الصور المسلمة.
- استخدام الصور.
- قبل/بعد واحد على الأقل لأقوى المشاريع.

## أمثلة مشاريع Dummy للبدء

| الاسم | النوع | الهدف | صور |
|---|---|---|---|
| Noir Perfume Launch | منتجات | إطلاق عطر جديد بصور premium | 8 |
| Cairo Burger Menu | أكل | تحديث صور المنيو والإعلانات | 10 |
| Dental Clinic Space | مكان | إبراز النظافة والثقة | 7 |
| Founder Portrait Set | بورتريه | صور شخصية لموقع الشركة | 6 |
| Summer Beverage Campaign | حملة | صور social وإعلانات موسمية | 12 |
| Handmade Jewelry Catalog | منتجات | كتالوج متجر إلكتروني | 9 |

---

## Visual Details جديدة

### Proof Marks

علامات صغيرة فوق الصور:

```text
SELECTED
FINAL
AD READY
WEB CROP
RETOUCHED
```

تكون بخط monospace، border خفيف، وخلفية شبه شفافة.

### Crop Guides

عند hover على صورة، تظهر خطوط خفيفة توضح crop ratios:

```text
1:1
4:5
9:16
16:9
```

هذا يوضح للعميل أننا لا نسلم صورة واحدة فقط، بل assets مناسبة لكل قناة.

### Project Pins

بدل badges ضخمة، نستخدم pins صغيرة بلون Select Yellow على زوايا الصور. عند الضغط عليها تظهر معلومة:

- "تم تصويره لاستخدامه في Instagram ads"
- "نسخة 9:16 جاهزة للـ reels"
- "خلفية نظيفة للمتجر الإلكتروني"

### Color Strip

كل project drawer يعرض 3 ألوان مأخوذة من الصور كـ strip صغير. يعطي إحساس editorial ويميز كل مشروع.

---

## نصوص جاهزة للأقسام

### Section Intro

`كل صورة هنا اتصورت لهدف. بعض الصور صممت لتبيع منتج، وبعضها لتفتح شهية، وبعضها لتبني ثقة في مكان أو شخص. اختار المجال الأقرب لك وشوف التفاصيل.`

### Contact Sheet Heading

`أرشيف مختار من جلسات التصوير`

### Edit Layers Heading

`المعالجة التي لا تسرق حقيقة المنتج`

### Shoot System Heading

`من الفكرة للصورة النهائية بنظام واضح`

### Proofing Heading

`كوّن مرجعك البصري قبل ما تبعت لنا`

### CTA Heading

`جاهز نخلي مشروعك يدخل الأرشيف ده؟`

---

## Implementation Priority

### MVP قوي

1. Light Table Hero.
2. Filter Rail.
3. Contact Sheet Grid.
4. Case Study Drawer.
5. CTA.

### Premium بعد كده

1. Edit Layers Viewer.
2. Proofing Picks.
3. Crop Guides.
4. Dynamic CTA based on selected projects.
5. Full project deep links.

---

## Checklist للتنفيذ

- [ ] إنشاء route `/projects-photography`.
- [ ] تجهيز data file للمشاريع.
- [ ] بناء LightTableHero بصور حقيقية.
- [ ] بناء ProjectFilterRail مع state.
- [ ] بناء ContactSheetGrid مع layout ثابت.
- [ ] بناء ProjectCaseDrawer مع focus management.
- [ ] بناء ProofingPicks اختياري في المرحلة الأولى.
- [ ] إضافة CTA يقرأ الاختيارات.
- [ ] اختبار desktop و mobile.
- [ ] فحص عدم وجود layout shift عند تحميل الصور.
- [ ] إضافة metadata و alt text.

---

## الخلاصة

الصفحة لازم تكون معرض أعمال حي، مش صفحة تعريفية. أقوى قرار هنا هو جعل أول شاشة نفسها قابلة للتصفح، ثم تحويل كل مشروع إلى proof file قصير. بهذه الطريقة الزائر يشوف الجودة، يفهم طريقة التفكير، ويقدر يطلب مشروع مشابه بدون مجهود.

