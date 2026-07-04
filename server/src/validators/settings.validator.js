import { body } from 'express-validator';

export const updateSettingsValidator = [
  body('businessName').optional({ values: 'falsy' }).trim().notEmpty(),
  body('businessEmail').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  body('businessPhone').optional({ values: 'falsy' }).trim().isLength({ min: 7, max: 20 }),
  body('whatsappNumber').optional({ values: 'falsy' }).trim().isLength({ min: 7, max: 20 }),
  body('address').optional({ values: 'falsy' }).trim(),
  body('city').optional({ values: 'falsy' }).trim(),
  body('state').optional({ values: 'falsy' }).trim(),
  body('pincode').optional({ values: 'falsy' }).trim(),
  body('socialLinks.instagram').optional({ values: 'falsy' }).isURL(),
  body('socialLinks.facebook').optional({ values: 'falsy' }).isURL(),
  body('socialLinks.youtube').optional({ values: 'falsy' }).isURL(),
  body('socialLinks.linkedin').optional({ values: 'falsy' }).isURL(),
  body('workingHours').optional({ values: 'falsy' }),
  body('seo.defaultTitle').optional({ values: 'falsy' }).trim(),
  body('seo.defaultDescription').optional({ values: 'falsy' }).trim(),
  body('seo.defaultKeywords').optional({ values: 'falsy' }).custom((value) => Array.isArray(value) || typeof value === 'string'),
  body('homepage.heroTitle').optional({ values: 'falsy' }).trim(),
  body('homepage.heroSubtitle').optional({ values: 'falsy' }).trim(),
  body('homepage.featuredServiceIds').optional({ values: 'falsy' }).custom((value) => Array.isArray(value) || typeof value === 'string'),
  body('isMaintenanceMode').optional({ values: 'falsy' }).isBoolean(),
];
