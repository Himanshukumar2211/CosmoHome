import { body, param, query } from 'express-validator';

const purposeOptions = [
  'General Enquiry',
  'Service Booking',
  'Partnership',
  'Salon Collaboration',
  'Franchise Enquiry',
  'Corporate Booking',
  'Complaint',
  'Feedback',
];

export const createContactMessageValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('phone').trim().isLength({ min: 7, max: 20 }),
  body('email').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  body('purpose').optional({ values: 'falsy' }).isIn(purposeOptions),
  body('message').trim().isLength({ min: 10, max: 2000 }),
  body('source').optional({ values: 'falsy' }).isIn(['contact_page', 'whatsapp_cta', 'service_page']),
];

export const listContactMessagesValidator = [
  query('status').optional({ values: 'falsy' }).isIn(['new', 'read', 'archived']),
  query('source').optional({ values: 'falsy' }).isIn(['contact_page', 'whatsapp_cta', 'service_page']),
  query('search').optional({ values: 'falsy' }).trim(),
  query('sortBy').optional({ values: 'falsy' }).isIn(['name', 'status', 'source', 'createdAt', 'updatedAt']),
  query('sortOrder').optional({ values: 'falsy' }).isIn(['asc', 'desc']),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }),
];

export const updateContactMessageValidator = [
  param('id').isMongoId(),
  body('status').isIn(['new', 'read', 'archived']),
];

export const contactMessageIdValidator = [param('id').isMongoId()];
