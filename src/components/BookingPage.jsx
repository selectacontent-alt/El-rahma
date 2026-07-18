"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchJsonCached } from '../lib/prefetchCache';
import { normalizeMediaUrl } from '../lib/mediaUtils';
import { ArrowDown, BadgeCheck, ChevronUp, Leaf, ShieldCheck, Truck, X, MapPin, ChevronDown, Check } from 'lucide-react';
import GroundingSeoArticle from './GroundingSeoArticle';
import { getGovernorateOptions } from '../lib/localizedGovernorates';

const QIRAT_PER_FEDDAN = 22;

const BookingPage = ({ setCurrentPage }) => {
  const { language, t } = useLanguage();
  const [config, setConfig] = useState({ pricePerTray: 120, traysPerQirat: 6, galleryImages: [], notes: '', seoImages: {} });
  const [unitType, setUnitType] = useState('qirat');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isGovDropdownOpen, setIsGovDropdownOpen] = useState(false);
  
  // Gallery Touch & Lightbox States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const formRef = useRef(null);
  const galleryScrollRef = useRef(null);
  const thumbsScrollRef = useRef(null);

  useEffect(() => {
    fetchJsonCached('/api/booking')
      .then(data => {
        const galleryImages = Array.isArray(data?.galleryImages)
          ? data.galleryImages.map(normalizeMediaUrl).filter(Boolean)
          : [];

        setConfig({
          ...data,
          galleryImages
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load booking config:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeImageIndex >= config.galleryImages.length) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, config.galleryImages.length]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;
    const checkKeyboard = () => setIsKeyboardOpen(window.innerHeight - viewport.height > 160);
    viewport.addEventListener('resize', checkKeyboard);
    return () => viewport.removeEventListener('resize', checkKeyboard);
  }, []);

  // Calculations
  const numericQuantity = Number(quantity) || 0;
  const totalQirat = Math.ceil(unitType === 'feddan' ? numericQuantity * QIRAT_PER_FEDDAN : numericQuantity);
  const totalTrays = Math.ceil(totalQirat * config.traysPerQirat);
  const totalPrice = totalTrays * config.pricePerTray;
  const totalFeddan = unitType === 'feddan' ? numericQuantity : (numericQuantity / QIRAT_PER_FEDDAN);
  const governorateOptions = useMemo(() => getGovernorateOptions(t), [language, t]);
  const selectedGovernorateLabel = governorateOptions.find(option => option.value === governorate)?.label || governorate;
  const bookingNote = language === 'ar' ? config.notes : t('booking.defaultNote');

  const renderSeoThumb = (key) => {
    const src = normalizeMediaUrl(config.seoImages?.[key] || '');
    if (!src) return null;
    return <img src={src} alt="" className="checkout-seo-card-image" loading="lazy" />;
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(i => i === config.galleryImages.length - 1 ? 0 : i + 1);
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(i => i === 0 ? config.galleryImages.length - 1 : i - 1);
  };

  const touchStartX = useRef(0);
  const currentDragX = useRef(0);
  const isDragging = useRef(false);

  const handleDragStart = (clientX) => {
    touchStartX.current = clientX;
    isDragging.current = true;
    if (galleryScrollRef.current) {
      galleryScrollRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (clientX) => {
    if (!isDragging.current || !galleryScrollRef.current) return;
    currentDragX.current = touchStartX.current - clientX;
    galleryScrollRef.current.style.transform = `translateX(calc(-${activeImageIndex * 100}% - ${currentDragX.current}px))`;
  };

  const handleDragEnd = () => {
    if (!isDragging.current || !galleryScrollRef.current) return;
    isDragging.current = false;
    galleryScrollRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    
    if (currentDragX.current > 50) {
      handleNextImage();
    } else if (currentDragX.current < -50) {
      handlePrevImage();
    } else {
      galleryScrollRef.current.style.transform = `translateX(-${activeImageIndex * 100}%)`;
    }
    currentDragX.current = 0;
  };

  useEffect(() => {
    if (galleryScrollRef.current && !isDragging.current) {
      galleryScrollRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      galleryScrollRef.current.style.transform = `translateX(-${activeImageIndex * 100}%)`;
    }
    
    if (thumbsScrollRef.current) {
      const thumbsContainer = thumbsScrollRef.current;
      const activeThumb = thumbsContainer.children[activeImageIndex];
      if (activeThumb) {
        const containerCenter = thumbsContainer.clientWidth / 2;
        const thumbCenter = activeThumb.offsetLeft + (activeThumb.clientWidth / 2);
        const scrollTarget = thumbCenter - containerCenter;
        
        thumbsContainer.scrollTo({
          left: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  }, [activeImageIndex]);

  const toggleZoom = (e) => {
    if (e) e.stopPropagation();
    if (lightboxZoom > 1) {
      setLightboxZoom(1);
      setPanPosition({ x: 0, y: 0 });
    } else {
      setLightboxZoom(2.5);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          alt_phone: altPhone,
          governorate: governorate,
          customer_address: customerAddress,
          unit_type: unitType,
          quantity,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('booking.requestFailed'));
      
      setOrderResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFormError(err.message || t('booking.requestFailed'));
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
        <div className="booking-loader">
          <div className="booking-loader-ring"></div>
          <p style={{ marginTop: '1.5rem', fontWeight: '800', color: '#166534', fontSize: '1.1rem' }}>{t('booking.loading')}</p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (orderResult) {
    return (
      <div className="booking-success-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="booking-success-card animate-up">
          <div className="booking-success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1>{t('booking.successTitle')}</h1>
          <p className="booking-success-order-num">{t('booking.orderNumber')}: <strong>#{orderResult.orderNumber}</strong></p>
          
          <div className="booking-success-details">
            <div className="booking-success-row">
              <span>{t('booking.totalQirat')}</span>
              <strong>{orderResult.totalQirat} {t('booking.qirat')}</strong>
            </div>
            <div className="booking-success-row">
              <span>{t('booking.totalTrays')}</span>
              <strong>{orderResult.totalTrays} {t('booking.tray')}</strong>
            </div>
            <div className="booking-success-row total">
              <span>{t('booking.total')}</span>
              <strong>{Number(orderResult.totalPrice).toLocaleString()} {t('booking.currency')}</strong>
            </div>
          </div>
          
          <p className="booking-success-note">{t('booking.successNote')}</p>
          
          <button className="booking-btn-primary" onClick={() => { setOrderResult(null); setQuantity(1); setCustomerName(''); setCustomerPhone(''); setAltPhone(''); setGovernorate(''); setCustomerAddress(''); setNotes(''); }}>
            {t('booking.newOrder')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>

      <section className="booking-hero">
        <div className="booking-hero-orb booking-hero-orb-one" aria-hidden="true" />
        <div className="booking-hero-orb booking-hero-orb-two" aria-hidden="true" />
        <div className="booking-hero-content animate-up">

          <h1 className="booking-hero-title">{t('booking.heroTitle')} <span className="text-highlight">{t('booking.heroTitleAccent')}</span></h1>
          <p className="booking-hero-desc">{t('booking.heroDesc')}</p>
          <div className="booking-hero-benefits">
            <span><BadgeCheck size={18} /> {t('booking.heroQuality')}</span>
            <span><Truck size={18} /> {t('booking.heroDelivery')}</span>
            <span><ShieldCheck size={18} /> {t('booking.heroSupport')}</span>
          </div>
          <button type="button" className="booking-hero-cta" onClick={scrollToForm}>
            {t('booking.heroCta')} <ArrowDown size={20} />
          </button>
        </div>
      </section>


      {/* Gallery Section */}
      {config.galleryImages && config.galleryImages.length > 0 && (
        <section className="booking-gallery-section">
          <div className="booking-section-header">
            <h2>{t('booking.galleryTitle')}</h2>
            <p>{t('booking.gallerySubtitle')}</p>
          </div>
          <div className="booking-gallery">
            <div 
              className="booking-gallery-main"
              onClick={() => setIsLightboxOpen(true)}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              style={{ cursor: 'grab', overflow: 'hidden', position: 'relative' }}
            >
              <div 
                className="booking-gallery-slider"
                dir="ltr"
                ref={galleryScrollRef}
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '100%'
                }}
              >
                {config.galleryImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={t('booking.imageAlt', { number: idx + 1 })}
                    className="booking-gallery-main-img"
                    draggable="false"
                    style={{ flexShrink: 0, width: '100%', height: '100%', objectFit: 'cover', userSelect: 'none' }}
                  />
                ))}
              </div>
              <div className="booking-gallery-counter" style={{ zIndex: 10 }}>{activeImageIndex + 1} / {config.galleryImages.length}</div>
              {config.galleryImages.length > 1 && (
                <>
                  <button type="button" aria-label={t('booking.previousImage')} className="booking-gallery-nav prev" onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} style={{ zIndex: 10 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                  <button type="button" aria-label={t('booking.nextImage')} className="booking-gallery-nav next" onClick={(e) => { e.stopPropagation(); handleNextImage(); }} style={{ zIndex: 10 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                </>
              )}
            </div>
            <div className="booking-gallery-thumbs" ref={thumbsScrollRef} style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
              {config.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`booking-gallery-thumb ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={t('booking.thumbnailAlt', { number: idx + 1 })} />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <GroundingSeoArticle />

      {/* Booking Form Section */}
      <section className="booking-form-section" ref={formRef}>
        <div className="booking-section-header">
          <h2 className="booking-form-title-mobile-nowrap">{t('booking.formTitle')}</h2>
          <p>{t('booking.formSubtitle')}</p>
        </div>

        <div className="booking-form-layout">
          {/* Left: Form */}
          <form id="booking-order-form" className="booking-form-card" onSubmit={handleSubmit}>
            {formError && (
              <div className="booking-form-error" role="alert">
                <X size={18} /> <span>{formError}</span>
              </div>
            )}
            {/* Unit Type Selector */}
            <div className="booking-field-group">
              <label className="booking-label">{t('booking.chooseUnit')}</label>
              <div className="booking-unit-toggle">
                <button
                  type="button"
                  className={`booking-unit-btn ${unitType === 'qirat' ? 'active' : ''}`}
                  onClick={() => { setUnitType('qirat'); setQuantity(1); }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  <span>{t('booking.qirat')}</span>
                  <small>{config.pricePerTray} {t('booking.currency')} / {t('booking.tray')}</small>
                </button>
                <button
                  type="button"
                  className={`booking-unit-btn ${unitType === 'feddan' ? 'active' : ''}`}
                  onClick={() => { setUnitType('feddan'); setQuantity(1); }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  <span>{t('booking.feddan')}</span>
                  <small>{(QIRAT_PER_FEDDAN * config.traysPerQirat * config.pricePerTray).toLocaleString()} {t('booking.currency')} / {t('booking.feddan')}</small>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="booking-field-group">
              <label className="booking-label">
                {t('booking.quantity')} ({t(unitType === 'feddan' ? 'booking.feddan' : 'booking.qirat')})
              </label>
              <div className="booking-quantity-control">
                <button type="button" aria-label={t('booking.decreaseQuantity')} className="booking-qty-btn" onClick={() => setQuantity(q => { const val = Number(q) || 0; return Math.max(0.1, val > 1 ? val - 1 : val - 0.5); })}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="booking-qty-input"
                />
                <button type="button" aria-label={t('booking.increaseQuantity')} className="booking-qty-btn" onClick={() => setQuantity(q => { const val = Number(q) || 0; return val >= 1 ? val + 1 : val + 0.5; })}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>

            {/* Quick Breakdown */}
            <div className="booking-breakdown">
              <div className="booking-breakdown-item">
                <span>{t('booking.trayCount')}</span>
                <strong>{totalTrays.toLocaleString()} {t('booking.tray')}</strong>
              </div>
              <div className="booking-breakdown-item">
                <span>{t('booking.totalQirat')}</span>
                <strong>{totalQirat.toLocaleString()} {t('booking.qirat')}</strong>
              </div>
              {unitType === 'qirat' && totalQirat >= QIRAT_PER_FEDDAN && (
                <div className="booking-breakdown-item hint">
                  <span>{t('booking.equivalent')}</span>
                  <strong>{totalFeddan.toFixed(1)} {t('booking.feddan')}</strong>
                </div>
              )}
            </div>

            <div className="booking-divider" />

            {/* Customer Info */}
            <div className="booking-field-group">
              <label className="booking-label">{t('booking.fullName')}</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('booking.fullNamePlaceholder')}
                className="booking-input"
                required
              />
            </div>

            <div className="booking-two-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="booking-field-group" style={{ marginBottom: 0 }}>
                <label className="booking-label">{t('booking.primaryPhoneLabel')}</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="booking-input"
                  dir="ltr"
                  required
                />
              </div>
              <div className="booking-field-group" style={{ marginBottom: 0 }}>
                <label className="booking-label">{t('booking.altPhoneLabel')}</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="booking-input"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="booking-two-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginTop: '0.85rem' }}>
              <div className="booking-field-group" style={{ marginBottom: 0 }}>
                <label className="booking-label">{t('booking.governorateLabel')}</label>
                <div style={{ position: 'relative' }}>
                  <button 
                    type="button" 
                    className={`booking-input ${isGovDropdownOpen ? 'open' : ''} ${!governorate ? 'placeholder' : ''}`}
                    onClick={() => setIsGovDropdownOpen(!isGovDropdownOpen)}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      textAlign: language === 'ar' ? 'right' : 'left', cursor: 'pointer', background: isGovDropdownOpen ? '#ffffff' : '#f8fafc',
                      borderColor: isGovDropdownOpen ? 'var(--primary-color)' : '#e2e8f0',
                      boxShadow: isGovDropdownOpen ? '0 0 0 4px rgba(20, 90, 36, 0.1)' : 'none',
                      color: governorate ? 'var(--text-dark)' : '#94a3b8'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: governorate ? 'bold' : 'normal' }}>
                      <MapPin size={18} style={{ color: governorate ? 'var(--primary-color)' : '#94a3b8' }} />
                      {selectedGovernorateLabel || t('booking.governoratePlaceholder')}
                    </span>
                    <ChevronDown size={18} style={{ color: '#94a3b8', transition: 'transform 0.3s ease', transform: isGovDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>
                  
                  {isGovDropdownOpen && (
                    <>
                      <div 
                        onClick={() => setIsGovDropdownOpen(false)} 
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                      />
                      <div 
                        className="animate-up" 
                        style={{ 
                          position: 'absolute', top: '100%', right: language === 'ar' ? 0 : 'auto', left: language === 'ar' ? 'auto' : 0, width: '100%', marginTop: '8px',
                          background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '280px', overflowY: 'auto',
                          padding: '0.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '4px'
                        }}
                      >
                        {governorateOptions.map(({ value, label }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => { setGovernorate(value); setIsGovDropdownOpen(false); }}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: 'none',
                              background: governorate === value ? '#f0fdf4' : 'transparent',
                              color: governorate === value ? 'var(--primary-color)' : '#334155',
                              fontWeight: governorate === value ? '900' : '700',
                              cursor: 'pointer', transition: 'all 0.2s ease', textAlign: language === 'ar' ? 'right' : 'left',
                              fontSize: '0.95rem'
                            }}
                            onMouseEnter={(e) => { if(governorate !== value) e.currentTarget.style.background = '#f8fafc' }}
                            onMouseLeave={(e) => { if(governorate !== value) e.currentTarget.style.background = 'transparent' }}
                          >
                            {label}
                            {governorate === value && <Check size={18} color="var(--primary-color)" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="booking-field-group" style={{ marginBottom: 0 }}>
                <label className="booking-label">{t('booking.cityLabel')}</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={t('booking.cityPlaceholder')}
                  className="booking-input"
                  required
                />
              </div>
            </div>

            <div className="booking-field-group" style={{ marginTop: '0.85rem' }}>
              <label className="booking-label">{t('booking.detailedAddressLabel')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('booking.detailedAddressPlaceholder')}
                className="booking-textarea"
                rows={2}
                required
              />
            </div>

            <div className={`booking-mobile-dock ${isKeyboardOpen ? 'keyboard-open' : ''}`}>
              {isMobileSummaryOpen && (
                <div className="booking-mobile-summary-panel">
                  <div className="booking-mobile-summary-head">
                    <strong>{t('booking.summary')}</strong>
                    <button type="button" onClick={() => setIsMobileSummaryOpen(false)} aria-label={t('booking.closeSummary')}><X size={20} /></button>
                  </div>
                  <div><span>{t('booking.unit')}</span><b>{t(unitType === 'feddan' ? 'booking.feddan' : 'booking.qirat')}</b></div>
                  <div><span>{t('booking.totalQirat')}</span><b>{totalQirat.toLocaleString()}</b></div>
                  <div><span>{t('booking.totalTrays')}</span><b>{totalTrays.toLocaleString()}</b></div>
                  <div><span>{t('booking.shipping')}</span><b className="free">{t('booking.free')}</b></div>
                </div>
              )}
              <div className="booking-mobile-dock-row">
                <button type="button" className="booking-mobile-total" onClick={() => setIsMobileSummaryOpen(value => !value)} aria-expanded={isMobileSummaryOpen}>
                  <span>{t('booking.total')}</span>
                  <strong>{totalPrice.toLocaleString()} {t('booking.currency')}</strong>
                  <ChevronUp size={18} className={isMobileSummaryOpen ? 'rotated' : ''} />
                </button>
                <button type="submit" form="booking-order-form" className="booking-mobile-submit" disabled={isSubmitting || !customerName || !customerPhone || !governorate || !customerAddress || !notes}>
                  {isSubmitting ? t('booking.sending') : t('booking.mobileConfirm')}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="booking-submit-btn"
              disabled={isSubmitting || !customerName || !customerPhone || !governorate || !customerAddress || !notes}
            >
              {isSubmitting ? (
                <span className="booking-submit-loading">
                  <span className="booking-spinner" />
                  {t('booking.sending')}
                </span>
              ) : (
                <span>
                  {t('booking.confirm', { total: totalPrice.toLocaleString(), currency: t('booking.currency') })}
                </span>
              )}
            </button>
          </form>

          {/* Right: Live Summary */}
          <div className="booking-summary-card">
            <div className="booking-summary-header">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
              <h3>{t('booking.summary')}</h3>
            </div>

            <div className="booking-summary-body">
              <div className="booking-summary-line">
                <span>{t('booking.unit')}</span>
                <span>{unitType === 'feddan' ? t('booking.feddan') : t('booking.qirat')}</span>
              </div>
              <div className="booking-summary-line">
                <span>{t('booking.quantity')}</span>
                <span>{quantity} {t(unitType === 'feddan' ? 'booking.feddan' : 'booking.qirat')}</span>
              </div>
              <div className="booking-summary-line">
                <span>{t('booking.trayPrice')}</span>
                <span>{config.pricePerTray} {t('booking.currency')}</span>
              </div>
              
              <div className="booking-summary-divider" />

              <div className="booking-summary-line">
                <span>{t('booking.totalQirat')}</span>
                <strong>{totalQirat.toLocaleString()}</strong>
              </div>
              <div className="booking-summary-line">
                <span>{t('booking.totalTrays')}</span>
                <strong>{totalTrays.toLocaleString()}</strong>
              </div>

              {unitType === 'feddan' && (
                <div className="booking-summary-line">
                  <span>{t('booking.feddanCount')}</span>
                  <strong>{quantity}</strong>
                </div>
              )}

              <div className="booking-summary-divider" />

              <div className="booking-summary-line">
                <span>{t('booking.shipping')}</span>
                <span className="booking-free-badge">{t('booking.free')}</span>
              </div>

              <div className="booking-summary-total">
                <span>{t('booking.total')}</span>
                <span>{totalPrice.toLocaleString()} {t('booking.currency')}</span>
              </div>
            </div>

            {bookingNote && (
              <div className="booking-summary-notes">
                <strong>{t('booking.noteLabel')}</strong> {bookingNote}
              </div>
            )}
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div 
          className="booking-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: lightboxZoom > 1 ? 'zoom-out' : 'zoom-in'
          }}
        >
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            style={{
              position: 'absolute', top: '20px', right: '20px', background: 'white',
              border: 'none', borderRadius: '50%', width: '40px', height: '40px',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', zIndex: 100000
            }}
          >
            <X size={24} />
          </button>
          <img
            src={config.galleryImages[activeImageIndex]}
            alt={t('booking.zoomedImageAlt')}
            onClick={toggleZoom}
            style={{
              maxWidth: '90%', maxHeight: '90vh',
              transform: `scale(${lightboxZoom}) translate(${panPosition.x}px, ${panPosition.y}px)`,
              transition: isPanning ? 'none' : 'transform 0.3s ease-out',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BookingPage;
