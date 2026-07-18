"use client";

import React, { useEffect, useState } from 'react';
import type { Language } from '../types';

import MediaHero from './media/MediaHero';
import ApertureGallery from './media/ApertureGallery';
import ServicesLensGrid from './media/ServicesLensGrid';
import ProductionTimeline from './media/ProductionTimeline';
import StudioStats from './media/StudioStats';
import TapePricing from './media/TapePricing';
import ClapperCTA from './media/ClapperCTA';
import { siteFetch } from '../lib/siteApi';
import './media/MediaServicePage.css';
import { addPlanToCart } from '../lib/planCart';
import type { PricingPlan } from './media/types';

interface MediaServicePageProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
}

export interface PublicMediaItem {
  id: number | string;
  type?: string;
  fileId?: string;
  url?: string;
  thumbnailUrl?: string;
  titleAr?: string;
  titleEn?: string;
  description?: string;
  originalName?: string;
  driveName?: string;
  mimeType?: string;
}

export interface PublicPricingPackage {
  id: number;
  section: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  badgeAr?: string;
  badgeEn?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  period: string;
  priceNoteAr?: string;
  priceNoteEn?: string;
  featuresAr: string[];
  featuresEn: string[];
  detailsAr?: string[];
  detailsEn?: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export default function MediaServicePage({ currentLang, setActiveTab }: MediaServicePageProps) {
  const isAr = currentLang === 'ar';
  const [reels, setReels] = useState<PublicMediaItem[]>([]);
  const [cameraShots, setCameraShots] = useState<PublicMediaItem[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PublicPricingPackage[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('service') === 'production') {
        setTimeout(() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadCmsContent = async () => {
      const [reelData, shotData, planData] = await Promise.all([
        siteFetch<PublicMediaItem[]>('/media-slider?type=video'),
        siteFetch<PublicMediaItem[]>('/media-assets?folder=media/camera-shots&kind=image'),
        siteFetch<PublicPricingPackage[]>('/pricing?section=media'),
      ]);
      if (!active) return;
      setReels(reelData || []);
      setCameraShots(shotData || []);
      setPricingPlans(planData || []);
    };
    loadCmsContent();
    return () => { active = false; };
  }, []);

  const handleLanguageToggle = () => {
    // Language is controlled globally by the Header/App in this architecture
  };

  const requestMediaPlan = (plan: PricingPlan) => {
    const shownPrice = Number(plan.price.replace(/[^0-9.]/g, ''));
    const originalPrice = Number(plan.originalPrice?.replace(/[^0-9.]/g, ''));
    addPlanToCart({
      section: 'media',
      id: plan.id,
      title: isAr ? plan.titleAr : plan.titleEn,
      price: Number.isFinite(shownPrice) && shownPrice > 0 ? shownPrice : null,
      originalPrice: Number.isFinite(originalPrice) && originalPrice > shownPrice ? originalPrice : null,
      currency: 'EGP',
      description: isAr ? plan.descriptionAr : plan.descriptionEn,
      features: isAr ? plan.featuresAr : plan.featuresEn,
      details: { price: plan.price, pricePeriodAr: plan.pricePeriodAr, pricePeriodEn: plan.pricePeriodEn, featuresAr: plan.featuresAr, featuresEn: plan.featuresEn },
    });
  };

  return (
    <div className="media-service-page-wrapper">
      <div className="min-h-screen bg-transparent text-white overflow-x-hidden antialiased selection:bg-media-pink-100 selection:text-media-pink-800">
        <MediaHero isAr={isAr} onLanguageToggle={handleLanguageToggle} reels={reels} />
        <ApertureGallery isAr={isAr} items={cameraShots} />
        <ServicesLensGrid isAr={isAr} />
        <ProductionTimeline isAr={isAr} />
        <StudioStats isAr={isAr} />
        <TapePricing isAr={isAr} plans={pricingPlans} onRequest={requestMediaPlan} />
        <ClapperCTA isAr={isAr} />
      </div>
    </div>
  );
}
