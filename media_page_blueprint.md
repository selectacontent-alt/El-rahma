# 🎬 مخطط تصميم صفحة `/media` — Select Agency
> **التصوير والإنتاج الإعلامي** | الفكرة الكاملة والمبتكرة

![Visual Design Mockup](C:\Users\Elmotkhasess\antigravity\brain\4007693b-dae2-4764-9133-4ba86c143af9\artifacts\media_page_mockup.png)

---

## 🎯 المفهوم العام — "The Living Lens"

الفكرة المحورية: **الصفحة نفسها تتصرف كـ كاميرا حية** — من لحظة فتح الصفحة حتى CTA الأخير، كل تأثير بصري مستوحى من عالم التصوير والسينما. المستخدم يشعر أنه داخل استوديو احترافي.

---

## 🗂️ هيكل الصفحة — Section by Section

---

### 1️⃣ HERO — "فتحة العدسة" (Aperture Opening Effect)

**الفكرة الفريدة:** عند تحميل الصفحة، تفتح فتحة عدسة كاميرا (aperture iris) تدريجياً تكشف عن المحتوى من الوسط للخارج — مش fade عادي!

```
┌─────────────────────────────────────────────┐
│  ████████████████████████████████████████   │
│  ██  ╔══════════════════════════════╗  ██   │
│  ██  ║  🔴 LIVE  ●●●●●●●●●●●●●●   ║  ██   │
│  ██  ║                              ║  ██   │
│  ██  ║    التصوير والإنتاج          ║  ██   │
│  ██  ║    الإعلامي الاحترافي        ║  ██   │
│  ██  ║                              ║  ██   │
│  ██  ║    [Aperture Ring Glow]      ║  ██   │
│  ██  ╚══════════════════════════════╝  ██   │
│  ████████████████████████████████████████   │
│  ═══════[FILM STRIP BORDER]═══════════════  │
└─────────────────────────────────────────────┘
```

**العناصر:**
- 🌀 **Aperture SVG Ring** — دايرة من خطوط تتفتح بـ CSS animation على load
- 🔴 **"LIVE REC" Blinking Dot** — نقطة حمراء وامضة زي كاميرات البث المباشر
- 🎞️ **Film Strip Border** — شريط أفلام سينمائي بيفصل الـ Hero عن باقي الصفحة
- 📊 **Shutter Count** — عداد رقمي متحرك `SHOT_00001 → 00247` (عدد مشاريعنا)
- 🎨 **Gradient**: من `#9d027c` لـ `#f43f5e` لـ `#ffbc01`

**التأثيرات:**
```css
/* Aperture Opening */
@keyframes aperture-open {
  0%   { clip-path: circle(0% at 50% 50%); }
  100% { clip-path: circle(75% at 50% 50%); }
}

/* Film Grain Overlay */
background: url('/noise.svg') + slate-950;
```

---

### 2️⃣ "THE REEL" — شريط الأفلام التفاعلي

**الفكرة الفريدة:** شريط أفلام سينمائي بـ sprocket holes (ثقوب الأفلام) على الحواف، بيتحرك horizontally أوتوماتيك لكن المستخدم يقدر يمسكه بالـ drag. كل frame بيكبر ويظهر معلومات لما يعدي عليه الـ cursor.

```
  ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●  
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │IMG 1 │ │IMG 2 │ │IMG 3 │ │IMG 4 │ │IMG 5 │
  │      │ │      │ │      │ │      │ │      │
  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
  ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●  
```

**التفاصيل التقنية:**
- `overflow: hidden` container مع داخله `display: flex` بيتحرك بـ `translate3d`
- على hover لـ card → `scale(1.15)` + blur لباقي الـ cards
- داخل كل frame: اسم المشروع، نوعه، أيقونة (📷 🎬 🚁)
- Speed: `--reel-speed: 40s` قابل للـ pause على hover

---

### 3️⃣ "THE APERTURE GALLERY" — المعرض بفتحة العدسة

**الفكرة الفريدة:** معرض صور بشكل دائري rotating. في الوسط دايرة كبيرة بتعرض الصورة المختارة، وحواليها thumbnails بتتحرك في orbit (مدار) زي الكواكب حول الشمس. لما تضغط على thumbnail، بتنتقل للوسط بـ smooth animation.

```
             [thumb]
         [thumb]   [thumb]

    [thumb]  [◉ MAIN IMAGE]  [thumb]

         [thumb]   [thumb]
             [thumb]
```

**التأثيرات:**
- Outer ring: `border` دوار + `box-shadow: 0 0 40px #9d027c40`
- Main image: circular clip-path + lens flare overlay
- Orbit rotation: `@keyframes orbit { 360deg }` لكل thumbnail بـ delay مختلف

---

### 4️⃣ SERVICES GRID — "بنتو العدسات"

**الفكرة الفريدة:** مش بنتو عادي — كل كارت ليه شكل مختلف (بعضها portrait، بعضها landscape، بعضها square) وعليه **تأثير عدسة** — لما تعدي بالـ cursor تحس إن في عدسة بتكبر منطقة معينة من الكارت (CSS lens magnifier effect).

| الخدمة | الأيقون | الـ accent Color | الحجم |
|---|---|---|---|
| تصوير المنتجات | 📦 | `#ffbc01` amber | 2×1 |
| إنتاج فيديو إعلاني | 🎬 | `#f43f5e` rose | 1×2 |
| تصوير جوي بالدرون | 🚁 | `#60a5fa` blue | 1×1 |
| تصوير احترافي للبورتريه | 👤 | `#a78bfa` violet | 1×1 |
| موشن جرافيك وأنيميشن | ✨ | `#10b981` emerald | 2×1 |
| بث مباشر Live Stream | 🔴 | `#ef4444` red | 1×1 |

**تأثير العدسة CSS:**
```css
.service-card::after {
  content: '';
  position: absolute;
  /* Radial gradient يتحرك مع cursor via JS */
  background: radial-gradient(
    circle 120px at var(--mx) var(--my),
    rgba(255,255,255,0.05) 0%,
    transparent 70%
  );
}
```

---

### 5️⃣ "PRODUCTION JOURNEY" — رحلة الإنتاج

**الفكرة الفريدة:** Timeline عمودي على شكل **Film Roll** — الخط الفاصل بين الـ steps هو شريط الأفلام نفسه (بـ SVG) وكل step بيكون في frame من الأفلام.

```
     │
  ╔══╧══╗
  ║ 01  ║  📋 الإحاطة والتخطيط
  ║─────║  Brief & Creative Planning
  ╚══╤══╝
  🎞️🎞️🎞️  ← Film strip connector
  ╔══╧══╗
  ║ 02  ║  📍 اختيار الموقع والإعداد
  ║─────║  Location & Studio Setup
  ╚══╤══╝
  🎞️🎞️🎞️
  ╔══╧══╗
  ║ 03  ║  📸 يوم التصوير
  ║─────║  Shooting Day
  ╚══╤══╝
  🎞️🎞️🎞️
  ╔══╧══╗
  ║ 04  ║  🎨 المونتاج والتحرير
  ║─────║  Post-Production & Edit
  ╚══╤══╝
  🎞️🎞️🎞️
  ╔══╧══╗
  ║ 05  ║  🚀 التسليم والنشر
  ║─────║  Delivery & Publishing
  ╚══╤══╝
```

---

### 6️⃣ BEFORE/AFTER MASTER — "غرفة التحميض الرقمية"

**الفكرة الفريدة:** مش slider عادي — الـ divider بين Before و After هو **خط نيون متوهج** بيشبه ضوء ماسح (Scanner line). والـ Before يكون بالأبيض والأسود، والـ After يكون ملون وساطع.

```
┌─────────────────┃━━━━━━━━━━━━━━━━━━━━┐
│   BEFORE        ┃      AFTER          │
│   (B&W + grain) ┃   (Full Color)      │
│                 ┃                     │
│    📷 هاتف      ┃  🎯 استوديو SELECT   │
└─────────────────┃━━━━━━━━━━━━━━━━━━━━┘
                  ↑
           [Neon Scanner Line]
         box-shadow: 0 0 20px #9d027c
```

**التفاصيل:**
- Left side: `filter: grayscale(100%) contrast(1.2)` + noise overlay
- Right side: Full color + subtle vignette
- Divider: `box-shadow: 0 0 30px #9d027c, 0 0 60px #f43f5e40`
- Handle: دايرة زجاجية بـ glassmorphism بداخلها سهمين ←→

---

### 7️⃣ STATS COUNTER — "إحصائيات الاستوديو"

**الفكرة الفريدة:** الأرقام بتظهر كأنها **عداد كاميرا** — بتتقلب زي الـ odometer/slot machine.

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  [0247]  │  │  [4.8K]  │  │  [98%]   │  │  [500+]  │
│  مشروع   │  │  صورة    │  │  رضا     │  │  ساعة    │
│ منجز     │  │ محررة    │  │ عملاء    │  │ تصوير    │
│ ──────── │  │ ──────── │  │ ──────── │  │ ──────── │
│📸 Projects│  │🖼️ Photos  │  │⭐ Satis.  │  │⏱️ Hours   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

**التأثير:**
```css
/* Flip counter animation */
@keyframes digit-flip {
  0%   { transform: rotateX(0deg); }
  50%  { transform: rotateX(-90deg); }
  100% { transform: rotateX(0deg); }
}
```

---

### 8️⃣ PRICING — "باقات الإنتاج"

**الفكرة الفريدة:** الكروت على شكل **كاسيت أو VHS tape** بدل الكروت الـ boring المستطيلة التقليدية!

```
┌─────────────────────────────┐
│  ╔═══════════════════════╗  │
│  ║   [●●●]   TAPE        ║  │
│  ╚═══════════════════════╝  │
│  BASIC SHOT                 │
│  ──────────────────         │
│  • تصوير منتجات (10 قطع)    │
│  • خلفيات بيضاء وملونة      │
│  • تسليم خلال 48 ساعة       │
│                             │
│  ████  2,500 ج.م  ████     │
└─────────────────────────────┘
```

3 باقات: **BASIC SHOT** / **PRO REEL** / **CINEMATIC SUITE**

---

### 9️⃣ CTA FINALE — "كلاكيت الانطلاق"

**الفكرة الفريدة:** CTA section على شكل **كلاكيت سينمائي** (clapperboard) بيُغلق على الشاشة ثم يفتح عن زر "احجز جلستك الآن" — مع صوت صرير (optional, with mute).

```
┌═══════════════════════════════════════════┐
│  /////  SELECT MEDIA STUDIO  /////        │
│  SCENE: Your Brand  TAKE: 1               │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                           │
│     مستعد تشوف منتجك/خدمتك بعين          │
│              كاميرتنا؟                    │
│                                           │
│   [ 🎬  احجز جلسة تصوير الآن  ]          │
│   [ 📞  اتصل بالاستوديو مباشرة ]          │
│                                           │
└═══════════════════════════════════════════┘
```

---

## 🎨 نظام الألوان والتأثيرات

| العنصر | القيمة |
|---|---|
| Background | `#0a0a1a` + noise texture |
| Primary Accent | `#9d027c` (magenta) |
| Secondary Accent | `#f43f5e` (rose) |
| Highlight | `#ffbc01` (amber) |
| Text Primary | `#f1f5f9` (slate-100) |
| Text Secondary | `#94a3b8` (slate-400) |
| Glass Cards | `rgba(15,15,30,0.6) + backdrop-blur-md` |
| Border | `rgba(157,2,124,0.2)` |
| Neon Glow | `box-shadow: 0 0 30px #9d027c40` |

---

## ✨ الـ Micro-Animations الفريدة

| Animation | Trigger | Effect |
|---|---|---|
| Aperture Open | Page Load | `clip-path: circle(0% → 75%)` |
| Film Reel Scroll | Auto + Drag | `translateX` loop |
| Lens Magnifier | Mouse Move | CSS radial gradient follows cursor |
| Before/After | Drag | Neon divider slides |
| Digit Flip | Scroll into view | 3D `rotateX` odometer |
| Card 3D Tilt | Mouse Move | `perspective(1000px) rotateX/Y` |
| Clapperboard | Scroll to CTA | Closing + opening animation |
| Live REC blink | Always | `opacity: 1 → 0` pulse |

---

## 🛠️ التطبيق التقني

### Component Structure
```
MediaPage.tsx
├── MediaHero.tsx          → Aperture + film strip
├── TheReel.tsx            → Draggable filmstrip
├── ApertureGallery.tsx    → Orbital circular gallery
├── ServicesLensGrid.tsx   → Bento + lens magnifier
├── ProductionTimeline.tsx → Film roll steps
├── DarkroomSlider.tsx     → B&W vs Color slider
├── StudioStats.tsx        → Flip counter
├── TapePricing.tsx        → VHS card pricing
└── ClapperCTA.tsx         → Clapperboard CTA
```

### في App.tsx — إضافة الـ tab
```tsx
// في pathToTab:
if (cleanPath === '/media') return 'media';

// في tabToPath:
if (tab === 'media') return '/media';

// في الـ render:
{activeTab === 'media' && (
  <MediaPage currentLang={lang} setActiveTab={setActiveTab} />
)}
```

---

## 📐 Responsive Breakpoints

| Section | Mobile (< 768px) | Desktop (≥ 1024px) |
|---|---|---|
| Hero | Full width, aperture smaller | Centered, large aperture |
| Film Reel | Touch swipe | Auto scroll + drag |
| Orbital Gallery | Single image + prev/next | Full orbital layout |
| Services Bento | 2-col grid | Full asymmetric bento |
| Before/After | Stacked | Side by side slider |
| Stats | 2×2 grid | 4-col row |
| Pricing | Vertical stack | 3-col horizontal |

---

## 🚀 الأولوية في التنفيذ

1. ✅ **أولاً**: `MediaHero` + Aperture animation
2. ✅ **ثانياً**: `ServicesLensGrid` + Lens magnifier effect
3. ✅ **ثالثاً**: `DarkroomSlider` (Before/After)
4. ✅ **رابعاً**: `TheReel` (Film strip)
5. ✅ **خامساً**: `ProductionTimeline` + `StudioStats`
6. ✅ **سادساً**: `TapePricing` + `ClapperCTA`
7. ✅ **أخيراً**: `ApertureGallery` (الأعقد)

---

> **ملاحظة**: كل الـ animations مبنية على `transform` و `opacity` فقط — لا `filter: blur()` ولا layout thrashing — للحفاظ على أداء 60fps مستقر.
