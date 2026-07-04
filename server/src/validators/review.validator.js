import { body, param, query } from 'express-validator';

export const listReviewsValidator = [
  query('approved').optional({ values: 'falsy' }).isBoolean(),
  query('featured').optional({ values: 'falsy' }).isBoolean(),
  query('search').optional({ values: 'falsy' }).trim(),
  query('sortBy').optional({ values: 'falsy' }).isIn(['customerName', 'rating', 'createdAt', 'updatedAt']),
  query('sortOrder').optional({ values: 'falsy' }).isIn(['asc', 'desc']),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }),
];

export const createReviewValidator = [
  body('customerName').trim().isLength({ min: 2, max: 100 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 10, max: 1000 }),
  body('serviceName').optional({ values: 'falsy' }).trim(),
  body('customerLocation').optional({ values: 'falsy' }).trim(),
];

export const updateReviewValidator = [
  param('id').isMongoId(),
  body('customerName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('rating').optional({ values: 'falsy' }).isInt({ min: 1, max: 5 }),
  body('comment').optional({ values: 'falsy' }).trim().isLength({ min: 10, max: 1000 }),
  body('serviceName').optional({ values: 'falsy' }).trim(),
  body('customerLocation').optional({ values: 'falsy' }).trim(),
  body('isApproved').optional({ values: 'falsy' }).isBoolean(),
  body('isFeatured').optional({ values: 'falsy' }).isBoolean(),
];

export const reviewIdValidator = [param('id').isMongoId()];
