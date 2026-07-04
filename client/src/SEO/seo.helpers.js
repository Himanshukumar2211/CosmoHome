import { SEO_CONFIG } from '../config/seo.config.js';

export const buildPageTitle = (title) => (title ? `${title} | ${SEO_CONFIG.defaultTitle}` : SEO_CONFIG.defaultTitle);
