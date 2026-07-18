import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const productFeatureKeys = ['feature1', 'feature2', 'feature3', 'feature4'];
const sectorKeys = ['sector1', 'sector2', 'sector3', 'sector4'];

const GroundingSeoArticle = () => {
  const { t } = useLanguage();

  return (
    <section className="checkout-seo-article" aria-label={t('seoArticle.ariaLabel')}>
      <div className="checkout-seo-container">
        <h2 className="checkout-seo-title">
          {t('seoArticle.title')}
          <span className="checkout-seo-title-accent"> {t('seoArticle.titleAccent')}</span>
        </h2>

        <p className="checkout-seo-lead">{t('seoArticle.lead')}</p>

        <div className="checkout-seo-grid">
          <div className="checkout-seo-card">
            <div className="checkout-seo-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h3>{t('seoArticle.groundingTitle')}</h3>
            <p>{t('seoArticle.groundingDesc')}</p>
          </div>

          <div className="checkout-seo-card">
            <div className="checkout-seo-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3>{t('seoArticle.featuresTitle')}</h3>
            <ul className="checkout-seo-list">
              {productFeatureKeys.map((key) => <li key={key}>{t(`seoArticle.${key}`)}</li>)}
            </ul>
          </div>

          <div className="checkout-seo-card">
            <div className="checkout-seo-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3>{t('seoArticle.sectorsTitle')}</h3>
            <ul className="checkout-seo-list">
              {sectorKeys.map((key) => <li key={key}>{t(`seoArticle.${key}`)}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroundingSeoArticle;
