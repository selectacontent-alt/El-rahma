import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Factory,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_SITE_SETTINGS } from '../lib/homeSettings';

const normalizePhone = (value) => String(value || '').replace(/\D/g, '');
const normalizeWhatsappPhone = (value) => {
  const phone = normalizePhone(value);
  if (phone.startsWith('0')) return `20${phone.slice(1)}`;
  return phone;
};

const CONTACT_SUBJECT_KEYS = ['quote', 'technical', 'supply', 'custom', 'followup'];

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  subject: 'quote',
  message: ''
};

const ContactUs = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formState, setFormState] = useState({ status: 'idle', message: '' });

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

  const phones = useMemo(() => {
    const values = [
      settings.admin_whatsapp || DEFAULT_SITE_SETTINGS.admin_whatsapp,
      settings.support_whatsapp || DEFAULT_SITE_SETTINGS.support_whatsapp,
      settings.contact_phone_3 || DEFAULT_SITE_SETTINGS.contact_phone_3
    ].filter(Boolean);
    return [...new Set(values)];
  }, [settings]);

  const email = settings.contact_email || DEFAULT_SITE_SETTINGS.contact_email;
  const address = language === 'ar'
    ? (settings.contact_address || t('footer.contactLocation'))
    : t('contact.factoryAddress');
  const mapQuery = encodeURIComponent(address);
  const primaryPhone = phones[0] || DEFAULT_SITE_SETTINGS.admin_whatsapp;
  const whatsappNumber = normalizeWhatsappPhone(primaryPhone);
  const whatsappText = encodeURIComponent(t('contact.whatsappText'));

  const contactChannels = [
    {
      key: 'whatsapp',
      icon: MessageCircle,
      eyebrow: t('contact.v2WhatsappEyebrow'),
      title: t('contact.v2WhatsappTitle'),
      detail: primaryPhone,
      href: `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappText}`,
      external: true
    },
    {
      key: 'phone',
      icon: Phone,
      eyebrow: t('contact.v2PhoneEyebrow'),
      title: t('contact.v2PhoneTitle'),
      detail: phones[1] || primaryPhone,
      href: `tel:${normalizePhone(phones[1] || primaryPhone)}`
    },
    {
      key: 'email',
      icon: Mail,
      eyebrow: t('contact.v2EmailEyebrow'),
      title: t('contact.v2EmailTitle'),
      detail: email,
      href: `mailto:${email}`
    }
  ];

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormState({ status: 'submitting', message: '' });

    try {
      const subjectLabel = t(`contact.subject_${form.subject}`);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: `${t('contact.requestTypePrefix')}: ${subjectLabel}\n\n${form.message.trim()}`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('contact.v2Error'));
      }

      setForm(EMPTY_FORM);
      setFormState({ status: 'success', message: t('contact.v2Success') });
    } catch (error) {
      setFormState({ status: 'error', message: error.message || t('contact.v2Error') });
    }
  };

  return (
    <main className="rahma-static-page rahma-contact-v2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <section className="rahma-contact-v2-hero">
        <div className="rahma-contact-v2-hero-grid" aria-hidden="true" />
        <div className="rahma-contact-v2-container rahma-contact-v2-hero-content">
          <div className="rahma-contact-v2-hero-copy">
            <span className="rahma-contact-v2-kicker"><Factory size={16} /> {t('contact.v2Kicker')}</span>
            <h1>{t('contact.v2HeroTitle')}</h1>
            <p>{t('contact.v2HeroDesc')}</p>
            <div className="rahma-contact-v2-hero-actions">
              <a className="rahma-contact-v2-button primary" href="#contact-form">
                {t('contact.v2PrimaryCta')}
                <ArrowLeft size={18} />
              </a>
              <a className="rahma-contact-v2-button secondary" href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappText}`} target="_blank" rel="noreferrer">
                <MessageCircle size={19} />
                {t('contact.v2SecondaryCta')}
              </a>
            </div>
          </div>

          <div className="rahma-contact-v2-hero-notes" aria-label={t('contact.v2HeroNotesAria')}>
            <div><Clock3 size={20} /><span>{t('contact.v2NoteResponse')}</span></div>
            <div><Headphones size={20} /><span>{t('contact.v2NoteSupport')}</span></div>
            <div><CheckCircle2 size={20} /><span>{t('contact.v2NoteFollowup')}</span></div>
          </div>
        </div>
      </section>

      <section className="rahma-contact-v2-channels-section">
        <div className="rahma-contact-v2-container">
          <div className="rahma-contact-v2-section-heading">
            <span>{t('contact.v2ChannelsEyebrow')}</span>
            <h2>{t('contact.v2ChannelsTitle')}</h2>
          </div>

          <div className="rahma-contact-v2-channels">
            {contactChannels.map(channel => {
              const Icon = channel.icon;
              return (
                <a
                  className="rahma-contact-v2-channel"
                  href={channel.href}
                  key={channel.key}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noreferrer' : undefined}
                >
                  <span className="rahma-contact-v2-channel-icon"><Icon size={22} /></span>
                  <span className="rahma-contact-v2-channel-copy">
                    <small>{channel.eyebrow}</small>
                    <strong>{channel.title}</strong>
                    <b dir="ltr">{channel.detail}</b>
                  </span>
                  <ArrowLeft className="rahma-contact-v2-channel-arrow" size={19} />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rahma-contact-v2-workspace">
        <div className="rahma-contact-v2-container rahma-contact-v2-workspace-grid">
          <section className="rahma-contact-v2-form-panel" id="contact-form" aria-labelledby="contact-form-title">
            <div className="rahma-contact-v2-panel-heading">
              <span>{t('contact.v2FormEyebrow')}</span>
              <h2 id="contact-form-title">{t('contact.v2FormTitle')}</h2>
              <p>{t('contact.v2FormDesc')}</p>
            </div>

            <form className="rahma-contact-v2-form" onSubmit={handleSubmit}>
              <div className="rahma-contact-v2-form-grid">
                <label>
                  <span>{t('contact.firstName')}</span>
                  <input name="firstName" value={form.firstName} onChange={updateField} autoComplete="given-name" required />
                </label>
                <label>
                  <span>{t('contact.lastName')}</span>
                  <input name="lastName" value={form.lastName} onChange={updateField} autoComplete="family-name" required />
                </label>
                <label>
                  <span>{t('contact.phone')}</span>
                  <input name="phone" value={form.phone} onChange={updateField} inputMode="tel" autoComplete="tel" dir="ltr" required />
                </label>
                <label>
                  <span>{t('contact.email')}</span>
                  <input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" dir="ltr" required />
                </label>
              </div>

              <label>
                <span>{t('contact.subjectLabel')}</span>
                <select name="subject" value={form.subject} onChange={updateField}>
                  {CONTACT_SUBJECT_KEYS.map((key) => (
                    <option key={key} value={key}>{t(`contact.subject_${key}`)}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>{t('contact.messageDetailsLabel')}</span>
                <textarea name="message" value={form.message} onChange={updateField} placeholder={t('contact.messageDetailsPlaceholder')} rows="5" required />
              </label>

              <div className="rahma-contact-v2-form-footer">
                <button type="submit" disabled={formState.status === 'submitting'}>
                  <Send size={18} />
                  {formState.status === 'submitting' ? t('contact.v2Submitting') : t('contact.v2Submit')}
                </button>
                <p>{t('contact.v2FormNote')}</p>
              </div>

              {formState.status !== 'idle' && (
                <p className={`rahma-contact-v2-form-message ${formState.status}`} aria-live="polite">
                  {formState.status === 'success' && <CheckCircle2 size={18} />}
                  {formState.message}
                </p>
              )}
            </form>
          </section>

          <aside className="rahma-contact-v2-location" aria-labelledby="location-title">
            <div className="rahma-contact-v2-location-copy">
              <span><MapPin size={17} /> {t('contact.locationEyebrow')}</span>
              <h2 id="location-title">{t('contact.locationTitle')}</h2>
              <p>{address}</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">
                {t('contact.openGoogleMaps')}
                <Navigation size={18} />
              </a>
            </div>
            <div className="rahma-contact-v2-map">
              <iframe
                title={t('contact.mapTitle')}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rahma-contact-v2-location-callout">
              <Phone size={19} />
              <span>{t('contact.urgentFollowup')}: <a href={`tel:${normalizePhone(primaryPhone)}`} dir="ltr">{primaryPhone}</a></span>
            </div>
          </aside>
        </div>
      </section>

      <section className="rahma-contact-v2-process">
        <div className="rahma-contact-v2-container">
          <span>{t('contact.processEyebrow')}</span>
          <div>
            <p><b>01</b> {t('contact.processStep1')}</p>
            <p><b>02</b> {t('contact.processStep2')}</p>
            <p><b>03</b> {t('contact.processStep3')}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
