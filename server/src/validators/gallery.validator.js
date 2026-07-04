import { body, param, query } from 'express-validator';

export const listGalleryValidator = [
  query('category').optional({ values: 'falsy' }).trim(),
  query('search').optional({ values: 'falsy' }).trim(),
  query('active').optional({ values: 'falsy' }).isBoolean(),
  query('sortBy').optional({ values: 'falsy' }).isIn(['title', 'category', 'displayOrder', 'createdAt', 'updatedAt']),
  query('sortOrder').optional({ values: 'falsy' }).isIn(['asc', 'desc']),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }),
];

export const createGalleryItemValidator = [
  body('title').trim().isLength({ min: 2, max: 120 }),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
  body('category').trim().notEmpty(),
  body('tags').optional({ values: 'falsy' }),
  body('displayOrder').optional({ values: 'falsy' }).isInt({ min: 0 }),
];

export const updateGalleryItemValidator = [
  param('id').isMongoId(),
  body('title').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 120 }),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
  body('category').optional({ values: 'falsy' }).trim().notEmpty(),
  body('tags').optional({ values: 'falsy' }),
  body('isActive').optional({ values: 'falsy' }).isBoolean(),
  body('displayOrder').optional({ values: 'falsy' }).isInt({ min: 0 }),
];

export const galleryIdValidator = [param('id').isMongoId()];
