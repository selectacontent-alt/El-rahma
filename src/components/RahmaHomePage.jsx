import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Settings,
  Truck,
  Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_SITE_SETTINGS } from '../lib/homeSettings';

const getWaNumber = (settings) => {
  const raw = settings.support_whatsapp || settings.admin_whatsapp || DEFAULT_SITE_SETTINGS.support_whatsapp || '01158737530';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('0')) return `20${digits.slice(1)}`;
  return digits || '201158737530';
};

const AnimatedMetricValue = ({ value, isVisible }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return undefined;

    hasAnimated.current = true;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    const duration = 2600;
    const startedAt = performance.now();
    let frameId = null;
    let lastValue = -1;

    const updateValue = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(value * easedProgress);
      if (nextValue !== lastValue) {
        lastValue = nextValue;
        setDisplayValue(nextValue);
      }

      if (progress < 1) frameId = requestAnimationFrame(updateValue);
    };

    frameId = requestAnimationFrame(updateValue);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isVisible, value]);

  return <strong dir="ltr">{displayValue.toLocaleString('en-US')}+</strong>;
};

const CopperCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let frameId = null;
    let completed = false;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let lightCanvas = false;
    let lastFrameAt = 0;
    let startedAt = performance.now();
    const duration = 2300;

    const prefersReducedMotion = () => Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    const reduceMotion = prefersReducedMotion();
    const shouldUseLightCanvas = () => Boolean(
      window.matchMedia?.('(max-width: 760px)').matches ||
      navigator.connection?.saveData ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    );
    const isMobileScene = () => lightCanvas && canvasWidth <= 520;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      lightCanvas = shouldUseLightCanvas();
      canvasWidth = Math.max(1, rect.width);
      canvasHeight = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, lightCanvas ? 1 : 1.35);
      canvas.width = Math.max(1, Math.floor(canvasWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvasHeight * dpr));
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (progress, elapsed = 0) => {
      const w = canvasWidth;
      const h = canvasHeight;
      if (!w || !h) return;

      const clamp = (value) => Math.max(0, Math.min(1, value));
      const glowScale = lightCanvas ? 0.44 : 0.68;
      const mobileScene = isMobileScene();
      const groundY = h * (mobileScene ? 0.76 : 0.66);
      const lineStart = w * 0.12;
      const lineEnd = w * 0.88;
      const wireProgress = clamp(progress * 1.3);
      const currentX = lineStart + (lineEnd - lineStart) * wireProgress;

      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0d0b09');
      bg.addColorStop(0.58, '#17100c');
      bg.addColorStop(1, '#060403');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const floor = ctx.createLinearGradient(0, groundY, 0, h);
      floor.addColorStop(0, 'rgba(185,91,42,0.10)');
      floor.addColorStop(1, 'rgba(0,0,0,0.58)');
      ctx.fillStyle = floor;
      ctx.fillRect(0, groundY, w, h - groundY);

      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#9a958d';
      for (let x = 0; x < w; x += lightCanvas ? 78 : 56) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x - w * 0.18, h);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 18 * glowScale;
      ctx.shadowColor = '#e38a45';
      const wire = ctx.createLinearGradient(lineStart, 0, lineEnd, 0);
      wire.addColorStop(0, '#6a3010');
      wire.addColorStop(0.35, '#b95b2a');
      wire.addColorStop(0.7, '#e38a45');
      wire.addColorStop(1, '#ffa000');
      ctx.strokeStyle = wire;
      ctx.beginPath();
      ctx.moveTo(lineStart, groundY);
      ctx.lineTo(currentX, groundY);
      ctx.stroke();
      ctx.restore();

      const rods = [0.22, 0.42, 0.62, 0.78];
      rods.forEach((ratio, index) => {
        const x = w * ratio;
        const rodProgress = clamp((progress - 0.13 - index * 0.055) / 0.28);
        const rodHeight = (h * (mobileScene ? 0.24 : 0.46)) * rodProgress;
        ctx.save();
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 14 * glowScale;
        ctx.shadowColor = '#e38a45';
        ctx.strokeStyle = '#c8702f';
        ctx.beginPath();
        ctx.moveTo(x, groundY + 4);
        ctx.lineTo(x, groundY - rodHeight);
        ctx.stroke();
        ctx.restore();

        if (rodProgress > 0.95) {
          ctx.fillStyle = 'rgba(255,160,0,0.16)';
          ctx.beginPath();
          ctx.arc(x, groundY - rodHeight, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f5f1ea';
          ctx.fillRect(x - 17, groundY - rodHeight - 4, 34, 8);
        }
      });

      if (!mobileScene) {
        const lowerRodProgress = clamp((progress - 0.18) / 0.3);
        const lowerRodX = w * 0.52;
        const lowerRodBottom = groundY + h * 0.31;
        const lowerRodTop = lowerRodBottom - h * 0.31 * lowerRodProgress;
        ctx.save();
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 14 * glowScale;
        ctx.shadowColor = '#e38a45';
        ctx.strokeStyle = '#c8702f';
        ctx.beginPath();
        ctx.moveTo(lowerRodX, lowerRodBottom);
        ctx.lineTo(lowerRodX, lowerRodTop);
        ctx.stroke();
        ctx.restore();

        if (lowerRodProgress > 0.95) {
          ctx.save();
          ctx.fillStyle = 'rgba(255,160,0,0.16)';
          ctx.beginPath();
          ctx.arc(lowerRodX, lowerRodBottom, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffa000';
          ctx.fillRect(lowerRodX - 12, lowerRodBottom - 4, 24, 8);
          ctx.restore();
        }
      }

      const signalProgress = clamp(progress / 0.34);
      const waveStart = lineStart + (lineEnd - lineStart) * 0.06;
      const waveWidth = (lineEnd - lineStart) * 0.88;
      const pulseCycles = 3;
      const cyclePoints = [
        [0, 0], [0.07, 0], [0.12, -12], [0.17, 0], [0.24, 0],
        [0.28, 9], [0.315, -60], [0.35, 17], [0.405, 0],
        [0.55, 0], [0.64, -22], [0.74, 0], [1, 0]
      ];
      const wavePoints = Array.from({ length: pulseCycles }, (_, cycleIndex) => (
        cyclePoints.map(([x, y]) => [(cycleIndex + x) / pulseCycles, y])
      )).flat();
      const waveX = (ratio) => waveStart + waveWidth * ratio;
      const waveY = (offset) => groundY + offset;
      const drawWavePath = () => {
        for (let cycleIndex = 0; cycleIndex < pulseCycles; cycleIndex += 1) {
          const x = (ratio) => waveX((cycleIndex + ratio) / pulseCycles);
          ctx.moveTo(x(0), groundY);
          ctx.lineTo(x(0.07), groundY);
          ctx.quadraticCurveTo(x(0.12), waveY(-18), x(0.17), groundY);
          ctx.lineTo(x(0.24), groundY);
          ctx.lineTo(x(0.28), waveY(9));
          ctx.lineTo(x(0.315), waveY(-60));
          ctx.lineTo(x(0.35), waveY(17));
          ctx.lineTo(x(0.405), groundY);
          ctx.lineTo(x(0.55), groundY);
          ctx.quadraticCurveTo(x(0.64), waveY(-28), x(0.74), groundY);
          ctx.lineTo(x(1), groundY);
        }
      };

      ctx.save();
      ctx.beginPath();
      ctx.rect(waveStart - 12, groundY - 86, waveWidth * signalProgress + 24, 116);
      ctx.clip();
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 16 * glowScale;
      ctx.shadowColor = '#ffa000';
      ctx.strokeStyle = 'rgba(255, 160, 0, 0.2)';
      ctx.beginPath();
      drawWavePath();
      ctx.stroke();
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 8 * glowScale;
      ctx.strokeStyle = '#ffe09a';
      ctx.beginPath();
      drawWavePath();
      ctx.stroke();
      ctx.restore();

      const pointOnWave = (position) => {
        const pointPosition = position * (wavePoints.length - 1);
        const pointIndex = Math.min(wavePoints.length - 2, Math.floor(pointPosition));
        const pointFraction = pointPosition - pointIndex;
        const [fromX, fromY] = wavePoints[pointIndex];
        const [toX, toY] = wavePoints[pointIndex + 1];
        return [
          waveX(fromX + (toX - fromX) * pointFraction),
          waveY(fromY + (toY - fromY) * pointFraction)
        ];
      };

      if (!reduceMotion) {
        const pulseDuration = mobileScene ? 1650 : 2200;
        const overlayProgress = (elapsed % pulseDuration) / pulseDuration;
        const streakOffsets = mobileScene ? [0, 0.34, 0.68] : (lightCanvas ? [0.18] : [0, 0.34, 0.68]);
        const streakSteps = lightCanvas ? 6 : 10;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#ffa000';
        streakOffsets.forEach((offset) => {
          const streakStart = (overlayProgress + offset) % 1;
          const streakLength = 0.045;
          const drawStreak = () => {
            ctx.beginPath();
            for (let step = 0; step <= streakSteps; step += 1) {
              const rawPosition = streakStart + (step / streakSteps) * streakLength;
              const position = rawPosition % 1;
              const [x, y] = pointOnWave(position);
              if (step === 0 || rawPosition >= 1 && streakStart < 1) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
          };

          ctx.shadowBlur = 12 * glowScale;
          ctx.lineWidth = lightCanvas ? 5 : 7;
          ctx.strokeStyle = 'rgba(255, 160, 0, 0.24)';
          drawStreak();
          ctx.stroke();
          ctx.shadowBlur = 5 * glowScale;
          ctx.lineWidth = lightCanvas ? 1.5 : 2;
          ctx.strokeStyle = '#fff1c4';
          drawStreak();
          ctx.stroke();
        });
        ctx.restore();
      }
    };

    resize();
    const shouldAnimate = () => !reduceMotion && !lightCanvas;

    const renderFrame = (now) => {
      if (!shouldAnimate()) {
        frameId = null;
        completed = true;
        draw(1, duration);
        return;
      }

      const frameBudget = completed ? 48 : 32;
      if (now - lastFrameAt < frameBudget) {
        frameId = requestAnimationFrame(renderFrame);
        return;
      }
      lastFrameAt = now;
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / duration);
      completed = progress >= 1;
      draw(progress, elapsed);
      frameId = requestAnimationFrame(renderFrame);
    };

    const stopLoop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
    };

    const startLoop = () => {
      stopLoop();
      startedAt = performance.now() - 320;
      completed = false;
      lastFrameAt = 0;
      frameId = requestAnimationFrame(renderFrame);
    };

    const drawStatic = () => {
      const elapsed = performance.now() - startedAt;
      draw(completed ? 1 : Math.min(1, elapsed / duration), elapsed);
    };

    completed = true;
    draw(1, duration);
    if (shouldAnimate()) startLoop();

    const handleResize = () => {
      resize();
      lastFrameAt = 0;
      if (!shouldAnimate()) {
        stopLoop();
        completed = true;
        draw(1, duration);
        return;
      }
      drawStatic();
      if (!frameId) startLoop();
    };
    const handleVisibilityChange = () => {
      if (document.hidden || !shouldAnimate()) return;
      lastFrameAt = 0;
      if (!frameId) frameId = requestAnimationFrame(renderFrame);
    };
    const handlePageShow = (event) => {
      if (event.persisted && shouldAnimate()) startLoop();
    };
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(handleResize);

    resizeObserver?.observe(canvas.parentElement || canvas);
    window.addEventListener('resize', handleResize);
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopLoop();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="rahma-hero-canvas" aria-hidden="true" />;
};

const RahmaHomePage = ({ setCurrentPage }) => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [flowVisible, setFlowVisible] = useState(false);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [revealedSections, setRevealedSections] = useState({});
  const flowSectionRef = useRef(null);
  const productLinksSectionRef = useRef(null);
  const whySectionRef = useRef(null);
  const metricsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings')
      .then(res => (res.ok ? res.json() : DEFAULT_SITE_SETTINGS))
      .catch(() => DEFAULT_SITE_SETTINGS)
      .then(settingsData => {
      if (cancelled) return;
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...settingsData });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = flowSectionRef.current;
    if (!section || flowVisible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFlowVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [flowVisible]);

  useEffect(() => {
    const sections = [
      ['product-links', productLinksSectionRef.current],
      ['why', whySectionRef.current]
    ].filter(([, section]) => section);

    if (!sections.length) return undefined;
    if (!('IntersectionObserver' in window)) {
      setRevealedSections(Object.fromEntries(sections.map(([key]) => [key, true])));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = entry.target.dataset.revealSection;
          setRevealedSections((current) => (current[key] ? current : { ...current, [key]: true }));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach(([, section]) => observer.observe(section));
    return () => observer.disconnect();
  }, [settings.rahma_featured_enabled]);

  useEffect(() => {
    const section = metricsRef.current;
    if (!section || metricsVisible) return undefined;

    if (!('IntersectionObserver' in window)) {
      setMetricsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMetricsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: '0px 0px -4% 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [metricsVisible]);

  const content = useMemo(() => {
    const s = (settingKey, translationKey) => (
      language === 'ar'
        ? (settings[settingKey] || t(translationKey))
        : t(translationKey)
    );
    return {
      heroTitle: s('hero_title', 'rahmaHome.heroTitle'),
      heroDesc: s('hero_desc', 'rahmaHome.heroDesc'),
      heroPrimary: s('rahma_hero_primary_cta', 'rahmaHome.heroPrimary'),
      heroSecondary: s('rahma_hero_secondary_cta', 'rahmaHome.heroSecondary'),
      flowTitle: s('rahma_flow_title', 'rahmaHome.flowTitle'),
      flowSub: s('rahma_flow_subtitle', 'rahmaHome.flowSubtitle'),
      whyTitle: s('why_title', 'rahmaHome.whyTitle'),
      whySub: s('why_desc', 'rahmaHome.whySubtitle'),
      featuredTitle: s('rahma_featured_title', 'rahmaHome.featuredTitle'),
      featuredSub: s('rahma_featured_subtitle', 'rahmaHome.featuredSubtitle'),
      featuredButton: s('rahma_featured_button', 'rahmaHome.featuredButton'),
      ctaTitle: s('rahma_cta_title', 'rahmaHome.ctaTitle'),
      ctaSub: s('rahma_cta_subtitle', 'rahmaHome.ctaSubtitle'),
      ctaButton: s('rahma_cta_button', 'rahmaHome.ctaButton'),
      email: settings.contact_email || DEFAULT_SITE_SETTINGS.contact_email,
      address: language === 'ar'
        ? (settings.contact_address || t('footer.contactLocation'))
        : t('contact.factoryAddress')
    };
  }, [settings, language, t]);

  const productLinks = [
    {
      id: 'featured',
      title: content.featuredTitle,
      desc: content.featuredSub,
      button: content.featuredButton,
      enabled: settings.rahma_featured_enabled !== 'false'
    }
  ].filter(item => item.enabled);

  const flowSteps = useMemo(() => (
    [1, 2, 3, 4, 5, 6].map((index) => t(`rahmaHome.flowStep${index}`))
  ), [language, t]);

  const features = [Settings, Award, Zap, Truck, Headphones].map((icon, index) => {
    const number = index + 1;
    return {
      icon,
      title: language === 'ar'
        ? (settings[`feature_title_${number}`] || t(`rahmaHome.featureTitle${number}`))
        : t(`rahmaHome.featureTitle${number}`),
      desc: language === 'ar'
        ? (settings[`feature_desc_${number}`] || t(`rahmaHome.featureDesc${number}`))
        : t(`rahmaHome.featureDesc${number}`)
    };
  });

  const metrics = [
    { value: 16, settingKey: 'ticker_text_1', translationKey: 'rahmaHome.metric1' },
    { value: 35, settingKey: 'ticker_text_2', translationKey: 'rahmaHome.metric2' },
    { value: 20000, settingKey: 'ticker_text_3', translationKey: 'rahmaHome.metric3' }
  ].map((metric) => ({
    ...metric,
    label: language === 'ar'
      ? (settings[metric.settingKey] || t(metric.translationKey))
      : t(metric.translationKey)
  }));

  const waNumber = getWaNumber(settings);
  const whatsappUrl = `https://wa.me/${waNumber}`;
  const contactText = encodeURIComponent(t('rahmaHome.whatsappMessage'));
  const displayPhones = [
    settings.admin_whatsapp || DEFAULT_SITE_SETTINGS.admin_whatsapp,
    settings.support_whatsapp || DEFAULT_SITE_SETTINGS.support_whatsapp,
    settings.contact_phone_3 || DEFAULT_SITE_SETTINGS.contact_phone_3
  ].filter(Boolean);
  const goStore = (categoryName = '') => {
    const cleanCategory = String(categoryName || '').trim();
    const targetPath = cleanCategory ? `/store?category=${encodeURIComponent(cleanCategory)}` : '/store';
    if (setCurrentPage) {
      setCurrentPage('store', targetPath);
    } else {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goContact = () => {
    if (setCurrentPage) {
      setCurrentPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <main className="rahma-home" id="home">
      <section className="rahma-hero-section">
        <div className="rahma-hero-light" />
        <CopperCanvas />
        <div className="rahma-hero-shell">
          <div className="rahma-hero-copy">
            <h1>{content.heroTitle}</h1>
            <p>{content.heroDesc}</p>
            <div className="rahma-hero-actions">
              <button type="button" className="rahma-btn primary" onClick={goStore}>
                {content.heroPrimary}
                <ArrowLeft size={18} />
              </button>
              <a className="rahma-btn ghost" href={`${whatsappUrl}?text=${contactText}`} target="_blank" rel="noreferrer">
                <Phone size={18} />
                {content.heroSecondary}
              </a>
            </div>
          </div>
        </div>
        <div className="rahma-scroll-indicator" aria-hidden="true"><span /></div>
      </section>

      <section
        ref={flowSectionRef}
        className={`rahma-flow-section ${flowVisible ? 'is-visible' : ''}`}
        id="rahma-flow"
      >
        <div className="rahma-section-heading">
          <h2>{content.flowTitle}</h2>
          <p>{content.flowSub}</p>
        </div>
        <div className="rahma-flow-track">
          {flowSteps.map((step, index) => (
            <div className="rahma-flow-step" key={step} style={{ '--flow-index': index }}>
              <b>{index + 1}</b>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      {productLinks.length > 0 && (
        <section
          ref={productLinksSectionRef}
          data-reveal-section="product-links"
          className={`rahma-product-links-section rahma-reveal-section ${revealedSections['product-links'] ? 'is-visible' : ''}`}
          id="rahma-products"
        >
          <div className="rahma-product-links-shell">
            {productLinks.map((item, index) => (
              <button
                type="button"
                className="rahma-product-link"
                key={item.id}
                style={{ '--reveal-index': index }}
                onClick={() => goStore()}
              >
                <span className="rahma-product-link-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="rahma-product-link-copy">
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </span>
                <span className="rahma-product-link-action">
                  {item.button}
                  <ArrowLeft size={17} />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section
        ref={whySectionRef}
        data-reveal-section="why"
        className={`rahma-why-section rahma-reveal-section ${revealedSections.why ? 'is-visible' : ''}`}
        id="rahma-about"
      >
        <div className="rahma-section-heading">
          <h2>{content.whyTitle}</h2>
          <p>{content.whySub}</p>
        </div>
        <div className="rahma-feature-grid">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="rahma-feature-card" key={`${item.title}-${index}`} style={{ '--reveal-index': index }}>
                <div><Icon size={24} /></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
        <div className="rahma-metrics" ref={metricsRef}>
          {metrics.map((metric, index) => (
            <div className="rahma-metric" key={metric.value} style={{ '--reveal-index': index }}>
              <AnimatedMetricValue value={metric.value} isVisible={metricsVisible} />
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rahma-cta-section">
        <div className="rahma-cta-grid" aria-hidden="true" />
        <div className="rahma-cta-inner">
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaSub}</p>
          <div className="rahma-hero-actions centered">
            <button type="button" className="rahma-btn primary" onClick={goContact}>
              <Phone size={18} />
              {content.ctaButton}
            </button>
            <a className="rahma-btn ghost" href={`mailto:${content.email}`}>
              <Mail size={18} />
              {content.email}
            </a>
          </div>
          <div className="rahma-contact-line">
            <span><MapPin size={16} /> {content.address}</span>
            {displayPhones.slice(0, 2).map(phone => (
              <span key={phone} dir="ltr"><Phone size={16} /> {phone}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RahmaHomePage;
