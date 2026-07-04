import { body, param, query } from 'express-validator';

export const registerBeauticianValidator = [
  body('fullName').trim().isLength({ min: 2, max: 100 }),
  body('phone').trim().isLength({ min: 7, max: 20 }),
  body('email').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  body('gender').optional({ values: 'falsy' }).isIn(['female', 'male', 'other']),
  body('experienceYears').isInt({ min: 0, max: 50 }),
  body('specializations').custom((value) => Array.isArray(value) || typeof value === 'string'),
  body('address').trim().isLength({ min: 5, max: 500 }),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('pincode').trim().notEmpty(),
];

export const listBeauticiansValidator = [
  query('status').optional({ values: 'falsy' }).isIn(['pending', 'approved', 'rejected']),
  query('city').optional({ values: 'falsy' }).trim(),
  query('search').optional({ values: 'falsy' }).trim(),
  query('sortBy').optional({ values: 'falsy' }).isIn(['fullName', 'city', 'status', 'experienceYears', 'createdAt', 'updatedAt']),
  query('sortOrder').optional({ values: 'falsy' }).isIn(['asc', 'desc']),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }),
];

export const beauticianIdValidator = [param('id').isMongoId()];

export const updateBeauticianValidator = [
  param('id').isMongoId(),
  body('fullName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ min: 7, max: 20 }),
  body('email').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  body('gender').optional({ values: 'falsy' }).isIn(['female', 'male', 'other']),
  body('experienceYears').optional({ values: 'falsy' }).isInt({ min: 0, max: 50 }),
  body('specializations').optional({ values: 'falsy' }).custom((value) => Array.isArray(value) || typeof value === 'string'),
  body('address').optional({ values: 'falsy' }).trim().isLength({ min: 5, max: 500 }),
  body('city').optional({ values: 'falsy' }).trim().notEmpty(),
  body('state').optional({ values: 'falsy' }).trim().notEmpty(),
  body('pincode').optional({ values: 'falsy' }).trim().notEmpty(),
  body('status').optional({ values: 'falsy' }).isIn(['pending', 'approved', 'rejected']),
  body('rejectionReason').optional({ values: 'falsy' }).trim().isLength({ min: 3, max: 500 }),
];

export const rejectBeauticianValidator = [
  param('id').isMongoId(),
  body('rejectionReason').trim().isLength({ min: 3, max: 500 }),
];
