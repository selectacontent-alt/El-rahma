import { Router } from 'express';
import {
  getPublicMediaAssets,
  getPublicHome,
  getPublicMediaSlider,
  getPublicPage,
  getPublicPortfolio,
  getPublicPricing,
  getPublicSoftwareCustomPlan,
  getPublicAdvertisingBudget,
  getPublicSocialMediaCategories,
  getPublicSocialMediaCategoryImages,
  getPublicWebsites,
  getSiteBootstrap,
  proxyDriveImage,
} from '../controllers/site.controller';
import { getPublicServiceBySlug, getPublicServices } from '../controllers/services.controller';

const router = Router();

router.get('/bootstrap', getSiteBootstrap);
router.get('/home', getPublicHome);
router.get('/services', getPublicServices);
router.get('/services/:slug', getPublicServiceBySlug);
router.get('/pricing', getPublicPricing);
router.get('/software-custom-plan', getPublicSoftwareCustomPlan);
router.get('/advertising-budget', getPublicAdvertisingBudget);
router.get('/media-slider', getPublicMediaSlider);
router.get('/media-assets', getPublicMediaAssets);
router.get('/social-media-categories', getPublicSocialMediaCategories);
router.get('/social-media-categories/:keyword/images', getPublicSocialMediaCategoryImages);
router.get('/websites', getPublicWebsites);
router.get('/portfolio', getPublicPortfolio);
router.get('/drive-image/:fileId', proxyDriveImage);
router.get('/page/:slug', getPublicPage);

export default router;
