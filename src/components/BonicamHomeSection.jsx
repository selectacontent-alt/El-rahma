import React from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Factory,
  Gauge,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';

const benefits = [
  { icon: ShieldCheck, label: 'خامات مطابقة للمواصفات' },
  { icon: Gauge, label: 'مقاسات دقيقة وثابتة' },
  { icon: Wrench, label: 'تصنيع يناسب طبيعة الموقع' },
  { icon: Truck, label: 'توريد منظم للمشروعات' },
];

const services = [
  { icon: BadgeCheck, title: 'مراجعة متطلبات المشروع' },
  { icon: Wrench, title: 'تجهيز مكونات التأريض' },
  { icon: Truck, title: 'توريد لكل المحافظات' },
  { icon: Gauge, title: 'مطابقة المقاسات قبل التسليم' },
];

const supplySteps = [
  'تحديد نوع المكون والمقاس المطلوب للموقع.',
  'مراجعة الكمية والخامة المناسبة للتطبيق.',
  'تجهيز الطلب والتأكد من التشطيب النهائي.',
  'تنظيم التوريد والمتابعة حتى التسليم.',
];

const BonicamHomeSection = ({ setCurrentPage }) => {
  const goToBooking = () => {
    if (setCurrentPage) setCurrentPage('booking');
    window.scrollTo(0, 0);
  };

  return (
    <section className="rahma-supply-section" dir="rtl" aria-label="مميزات مكونات التأريض النحاسية">
      <div className="rahma-supply-shell">
        <div className="rahma-supply-hero">
          <div className="rahma-supply-copy">
            <span className="rahma-supply-eyebrow">
              <Factory size={18} />
              حلول تأريض وحماية للمشروعات
            </span>
            <h2>
              <span>مكونات معدنية دقيقة</span>
              <span>من مصنع الرحمة لتشكيل المعادن</span>
            </h2>
            <p>
              نوفر مكونات التأريض والحماية من الصواعق بخامات نحاسية وتشطيب صناعي يناسب
              المصانع والمباني والمواقع الهندسية.
            </p>

            <button type="button" className="rahma-supply-cta" onClick={goToBooking}>
              اطلب تجهيز منتجاتك
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="rahma-supply-visual" aria-hidden="true">
            <img src="/rahma-logo-full.png" alt="" />
          </div>
        </div>

        <div className="rahma-supply-benefits">
          {benefits.map((benefit) => (
            <article className="rahma-supply-card" key={benefit.label}>
              <benefit.icon size={24} />
              <h3>{benefit.label}</h3>
            </article>
          ))}
        </div>

        <div className="rahma-supply-lower">
          <div className="rahma-supply-panel">
            <div className="rahma-supply-panel-heading">
              <span>خدمة مصنع الرحمة</span>
              <h3>من مراجعة المقاسات حتى التوريد</h3>
            </div>
            <div className="rahma-supply-services">
              {services.map((service) => (
                <article className="rahma-supply-service" key={service.title}>
                  <service.icon size={22} />
                  <strong>{service.title}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="rahma-supply-panel">
            <div className="rahma-supply-panel-heading">
              <span>خطوات الطلب</span>
              <h3>تنفيذ واضح وسهل المتابعة</h3>
            </div>
            <ol className="rahma-supply-list">
              {supplySteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <style>{`
        .rahma-supply-section {
          background: #f8fafc;
          padding: 6rem 1.5rem;
        }

        .rahma-supply-shell {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          gap: 1.5rem;
        }

        .rahma-supply-hero,
        .rahma-supply-panel,
        .rahma-supply-card {
          background: #ffffff;
          border: 1px solid rgba(185, 91, 42, 0.14);
          border-radius: 8px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        }

        .rahma-supply-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
          gap: 2rem;
          align-items: center;
          padding: 2rem;
        }

        .rahma-supply-copy {
          display: grid;
          gap: 1.2rem;
        }

        .rahma-supply-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          width: fit-content;
          color: #b95b2a;
          background: rgba(185, 91, 42, 0.1);
          border: 1px solid rgba(185, 91, 42, 0.2);
          border-radius: 999px;
          padding: 0.45rem 0.9rem;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .rahma-supply-copy h2 {
          margin: 0;
          color: #111827;
          display: grid;
          gap: 0.3rem;
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 1.15;
          font-weight: 950;
        }

        .rahma-supply-copy p {
          color: #475569;
          line-height: 1.85;
          margin: 0;
          max-width: 720px;
        }

        .rahma-supply-benefits,
        .rahma-supply-services {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .rahma-supply-service {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: #fff7ed;
          border: 1px solid rgba(185, 91, 42, 0.14);
          border-radius: 8px;
          padding: 0.85rem;
          color: #7c2d12;
          font-weight: 800;
        }

        .rahma-supply-cta {
          border: 0;
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #b95b2a;
          color: #ffffff;
          border-radius: 8px;
          padding: 0.95rem 1.25rem;
          font-weight: 900;
          cursor: pointer;
        }

        .rahma-supply-visual {
          min-height: 260px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #111827, #2f1d16);
          border-radius: 8px;
          padding: 2rem;
        }

        .rahma-supply-visual img {
          width: min(360px, 92%);
          height: auto;
          filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.28));
        }

        .rahma-supply-card {
          padding: 1.2rem;
          display: grid;
          gap: 0.8rem;
        }

        .rahma-supply-card svg,
        .rahma-supply-service svg {
          color: #b95b2a;
          flex: 0 0 auto;
        }

        .rahma-supply-card h3 {
          color: #111827;
          margin: 0;
          font-size: 1rem;
        }

        .rahma-supply-lower {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .rahma-supply-panel {
          padding: 1.5rem;
        }

        .rahma-supply-panel-heading {
          display: grid;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .rahma-supply-panel-heading span {
          color: #b95b2a;
          font-weight: 900;
        }

        .rahma-supply-panel-heading h3 {
          margin: 0;
          color: #111827;
          font-size: 1.35rem;
        }

        .rahma-supply-services {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .rahma-supply-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.75rem;
        }

        .rahma-supply-list li {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: start;
          gap: 0.8rem;
        }

        .rahma-supply-list span {
          background: #111827;
          color: #ffffff;
          border-radius: 8px;
          min-width: 38px;
          min-height: 38px;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .rahma-supply-list p {
          margin: 0;
          color: #475569;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .rahma-supply-hero,
          .rahma-supply-lower {
            grid-template-columns: 1fr;
          }

          .rahma-supply-benefits,
          .rahma-supply-services {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .rahma-supply-section {
            padding: 4rem 1rem;
          }

          .rahma-supply-hero {
            padding: 1.2rem;
          }

          .rahma-supply-benefits,
          .rahma-supply-services {
            grid-template-columns: 1fr;
          }

          .rahma-supply-cta {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default BonicamHomeSection;
