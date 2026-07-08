import { body, param, query } from 'express-validator';

export const registerBeauticianValidator = [
  body('fullName').trim().isLength({ min: 2, max: 100 }),
  body('phone').trim().isLength({ min: 7, max: 20 }),
  body('alternatePhone').trim().isLength({ min: 7, max: 20 }),
  body('email').isEmail().normalizeEmail(),
  body('gender').isIn(['female', 'male', 'other']),
  body('dateOfBirth').isISO8601(),
  body('fathersHusbandName').trim().isLength({ min: 2, max: 100 }),
  body('aadhaarNumber').trim().isLength({ min: 12, max: 20 }),
  body('panNumber').optional({ values: 'falsy' }).trim().isLength({ min: 10, max: 10 }),
  body('experienceYears').isInt({ min: 0, max: 50 }),
  body('currentProfession').trim().isLength({ min: 2, max: 100 }),
  body('workPreference').isIn(['part-time', 'full-time']),
  body('specializations').custom((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return typeof value === 'string' && value.trim().length > 0;
  }),
  body('otherService')
    .if(body('specializations').custom((value) => (Array.isArray(value) ? value.includes('Others') : value === 'Others')))
    .trim()
    .isLength({ min: 2, max: 100 }),
  body('workedInSalonBefore').isIn(['yes', 'no']),
  body('previousSalonName').if(body('workedInSalonBefore').equals('yes')).trim().isLength({ min: 2, max: 200 }),
  body('ownToolsProducts').isIn(['yes', 'no']),
  body('preferredWorkAreas').trim().isLength({ min: 2, max: 300 }),
  body('address').trim().isLength({ min: 5, max: 500 }),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('pincode').trim().notEmpty(),
  body('declarationAccepted').isBoolean().custom((value) => value === true || value === 'true'),
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
  body('alternatePhone').optional({ values: 'falsy' }).trim().isLength({ min: 7, max: 20 }),
  body('email').optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  body('gender').optional({ values: 'falsy' }).isIn(['female', 'male', 'other']),
  body('dateOfBirth').optional({ values: 'falsy' }).isISO8601(),
  body('fathersHusbandName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('aadhaarNumber').optional({ values: 'falsy' }).trim().isLength({ min: 12, max: 20 }),
  body('panNumber').optional({ values: 'falsy' }).trim().isLength({ min: 10, max: 10 }),
  body('experienceYears').optional({ values: 'falsy' }).isInt({ min: 0, max: 50 }),
  body('currentProfession').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('workPreference').optional({ values: 'falsy' }).isIn(['part-time', 'full-time']),
  body('specializations').optional({ values: 'falsy' }).custom((value) => Array.isArray(value) || typeof value === 'string'),
  body('otherService').optional({ values: 'falsy' }).trim().isLength({ max: 100 }),
  body('workedInSalonBefore').optional({ values: 'falsy' }).isIn(['yes', 'no']),
  body('previousSalonName').optional({ values: 'falsy' }).trim().isLength({ max: 200 }),
  body('ownToolsProducts').optional({ values: 'falsy' }).isIn(['yes', 'no']),
  body('preferredWorkAreas').optional({ values: 'falsy' }).trim().isLength({ max: 300 }),
  body('address').optional({ values: 'falsy' }).trim().isLength({ min: 5, max: 500 }),
  body('city').optional({ values: 'falsy' }).trim().notEmpty(),
  body('state').optional({ values: 'falsy' }).trim().notEmpty(),
  body('pincode').optional({ values: 'falsy' }).trim().notEmpty(),
  body('status').optional({ values: 'falsy' }).isIn(['pending', 'approved', 'rejected']),
  body('rejectionReason').optional({ values: 'falsy' }).trim().isLength({ min: 3, max: 500 }),
  body('declarationAccepted').optional({ values: 'falsy' }).isBoolean(),
];

export const rejectBeauticianValidator = [
  param('id').isMongoId(),
  body('rejectionReason').trim().isLength({ min: 3, max: 500 }),
];
