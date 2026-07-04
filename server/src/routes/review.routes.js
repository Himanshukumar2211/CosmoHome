import { Router } from 'express';
import {
  createReview,
  deleteReview,
  listReviews,
  updateReview,
} from '../controllers/review.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { singleUpload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createReviewValidator,
  listReviewsValidator,
  reviewIdValidator,
  updateReviewValidator,
} from '../validators/review.validator.js';

const router = Router();
const adminOnly = [authenticateAdmin, authorizeRoles(ROLES.ADMIN)];

router.get('/', optionalAuthenticateAdmin, listReviewsValidator, validate, listReviews);
router.post('/', optionalAuthenticateAdmin, singleUpload('image'), createReviewValidator, validate, createReview);
router.patch('/:id', adminOnly, singleUpload('image'), updateReviewValidator, validate, updateReview);
router.delete('/:id', adminOnly, reviewIdValidator, validate, deleteReview);

export default router;
