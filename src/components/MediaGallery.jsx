import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Camera, X, Play, Filter } from 'lucide-react';
import '../app/globals.css';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchJsonCached } from '../lib/prefetchCache';
import ImageWithSkeleton from './ImageWithSkeleton';
import { isVideoUrl, normalizeMediaUrl } from '../lib/mediaUtils';


const MediaGallery = () => {
  const { t, language } = useLanguage();
  const [selectedImg, setSelectedImg] = useState(null);
  const galleryRef = useRef(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colCount, setColCount] = useState(4);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!loading && mediaItems.length > 0) {
      const interval = setInterval(() => {
        setVisibleCount(prev => {
          if (prev < mediaItems.length) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 100); // Reveal one image every 100ms
      return () => clearInterval(interval);
    }
  }, [loading, mediaItems]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) setColCount(2);
      else if (window.innerWidth <= 900) setColCount(2);
      else if (window.innerWidth <= 1200) setColCount(3);
      else setColCount(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchJsonCached('/api/media')
      .then(data => {
        const formattedData = Array.isArray(data) ? data.map((item) => ({
          ...item,
          url: normalizeMediaUrl(item.image_url),
          thumbUrl: normalizeMediaUrl(item.image_url),
          isVideo: isVideoUrl(item.image_url)
        })) : [];
        setMediaItems(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load media gallery:', err);
        setLoading(false);
      });
  }, []);

  // Scroll Animation Logic
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, observerOptions);

    if (galleryRef.current) {
      const elements = galleryRef.current.querySelectorAll('.scroll-reveal');
      elements.forEach((el, index) => {
        // Add staggered delay to grid items
        if (el.classList.contains('masonry-item')) {
          el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, [mediaItems, visibleCount]);

  return (
    <div className="media-gallery-section" id="media" ref={galleryRef} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="media-container">
        <div className="media-gallery-header scroll-reveal">
          <h2 className="media-title">{t('media.title')}</h2>
          <p className="media-subtitle">{t('media.subtitle')}</p>
        </div>

        {loading ? null : mediaItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(245, 241, 234, 0.72)', padding: '4rem', fontSize: '1.2rem', fontWeight: 800 }}>{t('media.empty')}</div>
        ) : (
          <div className="masonry-grid-flex">
            {Array.from({ length: colCount }).map((_, colIndex) => (
              <div key={colIndex} className="masonry-column">
                {mediaItems.slice(0, visibleCount).filter((_, i) => i % colCount === colIndex).map((item, index) => (
                  <div 
                    key={item.id} 
                    className="masonry-item scroll-reveal" 
                    onClick={() => setSelectedImg(item)}
                  >
                      <ImageWithSkeleton src={item.thumbUrl} alt={item.title || t('media.imageAlt')} loading="lazy" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Modal via React Portal to escape stacking context */}
      {selectedImg && typeof document !== 'undefined' && createPortal(
        <div className="media-lightbox" onClick={() => setSelectedImg(null)}>
           <button className="close-lightbox" aria-label={t('media.close')}><X size={32}/></button>
           <div className="lightbox-content-wrapper" onClick={e => e.stopPropagation()}>
               {selectedImg.isVideo ? (
                 <video src={selectedImg.url} className="lightbox-img" controls playsInline preload="metadata" />
               ) : (
                 <img src={selectedImg.url} alt={selectedImg.title} className="lightbox-img" />
               )}
           </div>
        </div>,
        document.body
      )}

      <style>{`
        .media-gallery-section {
          padding: 10rem 0 7rem 0 !important;
          background: #0d0b09;
          background-image: 
            linear-gradient(180deg, rgba(255, 160, 0, 0.08), transparent 24%),
            radial-gradient(circle at 15% 22%, rgba(185, 91, 42, 0.2), transparent 28%),
            radial-gradient(circle at 82% 12%, rgba(255, 160, 0, 0.12), transparent 30%),
            linear-gradient(135deg, #0d0b09 0%, #17100c 52%, #0a0807 100%);
          min-height: 100vh;
          direction: ${language === 'ar' ? 'rtl' : 'ltr'};
          position: relative;
          overflow: hidden;
        }

        .media-gallery-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 160, 0, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 160, 0, 0.05) 1px, transparent 1px);
          background-size: 58px 58px;
          opacity: 0.24;
          pointer-events: none;
        }

        /* Scroll Reveal Animation Classes */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(60px) scale(0.92);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .media-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
        }

        .media-gallery-header {
          text-align: center;
          margin: 0 auto 4rem;
          max-width: 760px;
        }

        .media-title {
          font-size: clamp(2.4rem, 5vw, 4.6rem);
          font-weight: 950;
          margin-bottom: 1rem;
          color: #f5f1ea;
          text-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
          letter-spacing: 0;
        }

        .media-subtitle {
          font-size: 1.25rem;
          color: rgba(245, 241, 234, 0.7);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.8;
          font-weight: 800;
        }

        .masonry-grid-flex {
          display: flex;
          gap: 2rem;
          width: 100%;
          align-items: flex-start;
        }

        .masonry-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          min-width: 0; /* Prevent flex blowouts */
        }

        .masonry-item {
          width: 100%;
          margin-bottom: 0; /* Handled by gap */
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 18px 38px rgba(0, 0, 0, 0.26);
          background: rgba(19, 14, 10, 0.92);
          border: 1px solid rgba(255, 160, 0, 0.16);
          transform: translateZ(0); /* Hardware acceleration */
        }

        /* Physics-based hover transition */
        .masonry-item.visible {
           transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .masonry-item img, .masonry-item video {
          width: 100%;
          height: auto;
          display: block;
          border-radius: inherit; /* Ensure corners are clipped */
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s ease;
        }

        .masonry-item:hover {
          transform: translateY(-10px) scale(1.015) !important;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255, 160, 0, 0.34);
          z-index: 2;
        }

        .masonry-item:hover img, .masonry-item:hover video {
          transform: scale(1.07);
          filter: brightness(1.06) contrast(1.04);
        }

        /* Lightbox Physics */
        .media-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(10, 8, 7, 0.94);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          animation: fadeInLightbox 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          padding: 2rem;
        }

        @keyframes fadeInLightbox {
          from { opacity: 0; background: rgba(10, 8, 7, 0); }
          to { opacity: 1; background: rgba(10, 8, 7, 0.94); }
        }

        .lightbox-content-wrapper {
          position: relative;
          max-width: 90%;
          max-height: 80vh;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 80vh;
          border-radius: 8px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 160, 0, 0.28);
          animation: physicsPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          object-fit: contain;
          transform-origin: center;
          border: 1px solid rgba(255, 160, 0, 0.22);
        }

        .lightbox-caption {
          color: #f5f1ea;
          margin-top: 2rem;
          font-size: 1.8rem;
          font-weight: 900;
          text-align: center;
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.15s;
          opacity: 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .close-lightbox {
          position: absolute;
          top: 40px;
          right: 40px;
          background: rgba(20, 14, 10, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 160, 0, 0.28);
          color: #f5f1ea;
          cursor: pointer;
          width: 55px;
          height: 55px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
        .close-lightbox:hover { 
          transform: scale(1.08) rotate(90deg); 
          background: #ffa000;
          color: white;
          border-color: #ffa000;
          box-shadow: 0 14px 30px rgba(255, 160, 0, 0.28);
        }

        @keyframes physicsPop {
          0% { transform: scale(0.4) translateY(80px) rotate(-2deg); opacity: 0; }
          100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; }
        }

        @keyframes slideUpFade {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          /* Handled by JS */
        }
        
        @media (max-width: 900px) {
          .media-title { font-size: 3rem; }
        }

        @media (max-width: 600px) {
          .masonry-grid-flex { gap: 1rem; }
          .masonry-column { gap: 1rem; }
          .media-gallery-section { padding: 8.5rem 0 6rem 0 !important; }
          .media-container { padding: 0 1rem; }
          .media-title {
            font-size: clamp(2rem, 8vw, 2.7rem);
            line-height: 1.15;
            white-space: normal;
            letter-spacing: 0;
          }
          .masonry-item { border-radius: 12px; }
          .close-lightbox { top: 20px; right: 20px; width: 45px; height: 45px; }
        }
      `}</style>
    </div>
  );
};

export default MediaGallery;
