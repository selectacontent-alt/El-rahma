/**
 * Stable public entrypoint for the home, services, and service-detail
 * surfaces.  Import from here instead of coupling pages to CMS internals.
 */
export {
  normalizeGoalKeys,
  normalizeHomePayload,
  normalizeProject,
  normalizePublicServices,
  readHomeText,
  readHomeSteps,
} from './growthSite';
export type {
  GrowthGoalKey,
  PublicHomePayload,
  PublicMetric,
  PublicPartner,
  PublicPortfolioProject,
  PublicProcessStep,
  PublicService,
  PublicTestimonial,
} from './growthSite';
