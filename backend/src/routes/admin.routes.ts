import { Router } from 'express';
import {
  getHomepageSettings, updateHomepageSettings,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getPartners, createPartner, updatePartner, deletePartner,
  getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
  getContacts, updateContactStatus, deleteContact,
  getDashboardStats,
} from '../controllers/admin.controller';
import {
  createAdminService,
  deleteAdminService,
  getAdminServices,
  updateAdminService,
} from '../controllers/services.controller';
import {
  getWebsites, createWebsite, updateWebsite, deleteWebsite,
  getMediaSlider, createMediaSliderItem, updateMediaSliderItem, deleteMediaSliderItem,
  getPricingPackages, createPricingPackage, updatePricingPackage, deletePricingPackage,
  getSocialMediaCategories, createSocialMediaCategory, updateSocialMediaCategory, deleteSocialMediaCategory,
} from '../controllers/pages.admin.controller';
import {
  getArticles, getArticle, createArticle, updateArticle, deleteArticle,
  getNewsCategories, createNewsCategory, updateNewsCategory, deleteNewsCategory,
  getBreakingNews, createBreakingNews, updateBreakingNews, deleteBreakingNews,
  getAuthors, createAuthor, updateAuthor, deleteAuthor,
  getNewsStats,
} from '../controllers/news.admin.controller';
import {
  createAdminUser,
  createMediaAsset,
  createPage,
  createPageSection,
  deleteMediaAsset,
  deletePageSection,
  getPage,
  getPageSections,
  listAdminUsers,
  listAuditLogs,
  listMediaAssets,
  listPages,
  publishPage,
  resetAdminUserPassword,
  updateAdminUser,
  updateMediaAsset,
  updatePage,
  updatePageSection,
} from '../controllers/cms.admin.controller';
import { upload, uploadToDrive, deleteFromDrive, listDriveFiles } from '../controllers/drive.controller';
import { adminOnly, auditAdminAction, authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate, adminOnly, auditAdminAction);

// Dashboard
router.get('/dashboard', getDashboardStats);

// CMS Pages
router.get('/pages', listPages);
router.post('/pages', createPage);
router.get('/pages/:slug', getPage);
router.put('/pages/:slug', updatePage);
router.post('/pages/:slug/publish', publishPage);
router.get('/pages/:slug/sections', getPageSections);
router.post('/pages/:slug/sections', createPageSection);
router.put('/pages/:slug/sections/:sectionId', updatePageSection);
router.delete('/pages/:slug/sections/:sectionId', deletePageSection);

// Admin users, audit, and media library
router.get('/audit', listAuditLogs);
router.get('/users', listAdminUsers);
router.post('/users', createAdminUser);
router.put('/users/:id', updateAdminUser);
router.post('/users/:id/reset-password', resetAdminUserPassword);
router.get('/media-assets', listMediaAssets);
router.post('/media-assets', createMediaAsset);
router.put('/media-assets/:id', updateMediaAsset);
router.delete('/media-assets/:id', deleteMediaAsset);

// Home Settings
router.get('/home', getHomepageSettings);
router.put('/home', updateHomepageSettings);
router.get('/settings', getHomepageSettings);
router.put('/settings', updateHomepageSettings);

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Partners
router.get('/partners', getPartners);
router.post('/partners', createPartner);
router.put('/partners/:id', updatePartner);
router.delete('/partners/:id', deletePartner);

// Portfolio
router.get('/portfolio', getPortfolioItems);
router.post('/portfolio', createPortfolioItem);
router.put('/portfolio/:id', updatePortfolioItem);
router.delete('/portfolio/:id', deletePortfolioItem);

// Services
router.get('/services', getAdminServices);
router.post('/services', createAdminService);
router.put('/services/:id', updateAdminService);
router.delete('/services/:id', deleteAdminService);

// Contacts
router.get('/contacts', getContacts);
router.put('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

// Websites (/websites page)
router.get('/websites', getWebsites);
router.post('/websites', createWebsite);
router.put('/websites/:id', updateWebsite);
router.delete('/websites/:id', deleteWebsite);

// Media Slider
router.get('/media-slider', getMediaSlider);
router.post('/media-slider', createMediaSliderItem);
router.put('/media-slider/:id', updateMediaSliderItem);
router.delete('/media-slider/:id', deleteMediaSliderItem);

// Pricing Packages (shared for software/social/media sections)
router.get('/pricing', getPricingPackages);
router.post('/pricing', createPricingPackage);
router.put('/pricing/:id', updatePricingPackage);
router.delete('/pricing/:id', deletePricingPackage);

// Social Media Categories
router.get('/social-media-categories', getSocialMediaCategories);
router.post('/social-media-categories', createSocialMediaCategory);
router.put('/social-media-categories/:id', updateSocialMediaCategory);
router.delete('/social-media-categories/:id', deleteSocialMediaCategory);

// ─── News Panel ───────────────────────────────────────────────────────────────
router.get('/news/stats', getNewsStats);
router.get('/news/articles', getArticles);
router.get('/news/articles/:id', getArticle);
router.post('/news/articles', createArticle);
router.put('/news/articles/:id', updateArticle);
router.delete('/news/articles/:id', deleteArticle);

router.get('/news/categories', getNewsCategories);
router.post('/news/categories', createNewsCategory);
router.put('/news/categories/:id', updateNewsCategory);
router.delete('/news/categories/:id', deleteNewsCategory);

router.get('/news/breaking', getBreakingNews);
router.post('/news/breaking', createBreakingNews);
router.put('/news/breaking/:id', updateBreakingNews);
router.delete('/news/breaking/:id', deleteBreakingNews);

router.get('/news/authors', getAuthors);
router.post('/news/authors', createAuthor);
router.put('/news/authors/:id', updateAuthor);
router.delete('/news/authors/:id', deleteAuthor);

// ─── Google Drive Upload ──────────────────────────────────────────────────────
router.post('/upload/drive', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 100 }]), uploadToDrive);
router.delete('/upload/drive/:fileId', deleteFromDrive);
router.get('/upload/drive/list', listDriveFiles);

export default router;
