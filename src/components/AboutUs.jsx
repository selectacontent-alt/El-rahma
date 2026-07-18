import React, { useEffect, useState } from 'react';
import { Award, CheckCircle, Factory, ShieldCheck, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_SITE_SETTINGS } from '../lib/homeSettings';

const objectiveKeys = ['objective1', 'objective2', 'objective3', 'objective4', 'objective5'];
const missionKeys = ['missionPoint1', 'missionPoint2', 'missionPoint3', 'missionPoint4'];

const AboutUs = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings')
      .then(res => (res.ok ? res.json() : DEFAULT_SITE_SETTINGS))
      .then(data => {
        if (!cancelled) setSettings({ ...DEFAULT_SITE_SETTINGS, ...data });
      })
      .catch(() => {
        if (!cancelled) setSettings(DEFAULT_SITE_SETTINGS);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fromSettings = (settingKey, translationKey) => (
    language === 'ar'
      ? (settings[settingKey] || t(translationKey))
      : t(translationKey)
  );

  const objectives = objectiveKeys.map((key) => t(`about.${key}`));
  const missionPoints = missionKeys.map((key) => t(`about.${key}`));

  return (
    <main className="rahma-static-page rahma-about-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <section className="rahma-page-hero about">
        <h1>{t('about.innerHeroTitle')}</h1>
        <p>{t('about.innerHeroSubtitle')}</p>
      </section>

      <section className="rahma-about-content">
        <div className="rahma-logo-showcase">
          <img src="/rahma-logo-full.png" alt={t('nav.logoAlt')} />
        </div>

        <h2>{fromSettings('about_title', 'about.companyTitle')}</h2>

        <article className="rahma-about-block featured">
          <div className="rahma-about-heading">
            <ShieldCheck size={24} />
            <h3>{fromSettings('about_subtitle', 'about.companySubtitle')}</h3>
          </div>
          <p>{fromSettings('about_text', 'about.companyText')}</p>
          <p>{t('about.extraParagraph')}</p>
        </article>

        <div className="rahma-about-grid">
          <article className="rahma-about-block">
            <div className="rahma-about-heading">
              <Target size={24} />
              <h3>{t('about.objectivesTitle')}</h3>
            </div>
            <ul>
              {objectives.map(item => (
                <li key={item}><CheckCircle size={18} /> {item}</li>
              ))}
            </ul>
          </article>

          <article className="rahma-about-block">
            <div className="rahma-about-heading">
              <Award size={24} />
              <h3>{t('about.missionSectionTitle')}</h3>
            </div>
            <ul>
              {missionPoints.map(item => (
                <li key={item}><CheckCircle size={18} /> {item}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="rahma-about-block abb">
          <div className="rahma-about-heading">
            <Factory size={24} />
            <h3>{t('about.abbTitle')}</h3>
          </div>
          <p>{t('about.abbParagraph1')}</p>
          <p>{t('about.abbParagraph2')}</p>
        </article>
      </section>
    </main>
  );
};

export default AboutUs;
