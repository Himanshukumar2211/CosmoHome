import { body, param, query } from 'express-validator';

export const listServicesValidator = [
  query('category').optional({ values: 'falsy' }).trim(),
  query('search').optional({ values: 'falsy' }).trim(),
  query('featured').optional({ values: 'falsy' }).isBoolean(),
  query('active').optional({ values: 'falsy' }).isBoolean(),
  query('sortBy').optional({ values: 'falsy' }).isIn(['name', 'category', 'price', 'displayOrder', 'createdAt', 'updatedAt']),
  query('sortOrder').optional({ values: 'falsy' }).isIn(['asc', 'desc']),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }),
];

export const createServiceValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('category').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('discountPrice').optional({ values: 'falsy' }).isFloat({ min: 0 }),
  body('durationMinutes').optional({ values: 'falsy' }).isInt({ min: 5 }),
  body('isActive').optional({ values: 'falsy' }).isBoolean(),
  body('isFeatured').optional({ values: 'falsy' }).isBoolean(),
  body('displayOrder').optional({ values: 'falsy' }).isInt({ min: 0 }),
];

export const updateServiceValidator = [
  param('id').isMongoId(),
  body('name').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 120 }),
  body('description').optional({ values: 'falsy' }).trim().isLength({ min: 10, max: 1000 }),
  body('category').optional({ values: 'falsy' }).trim().notEmpty(),
  body('price').optional({ values: 'falsy' }).isFloat({ min: 0 }),
  body('discountPrice').optional({ values: 'falsy' }).isFloat({ min: 0 }),
  body('durationMinutes').optional({ values: 'falsy' }).isInt({ min: 5 }),
  body('isActive').optional({ values: 'falsy' }).isBoolean(),
  body('isFeatured').optional({ values: 'falsy' }).isBoolean(),
  body('displayOrder').optional({ values: 'falsy' }).isInt({ min: 0 }),
];

export const serviceIdValidator = [param('id').isMongoId()];
