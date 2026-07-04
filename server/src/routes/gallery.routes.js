import { Router } from 'express';
import {
  createGalleryItem,
  deleteGalleryItem,
  listGallery,
  updateGalleryItem,
} from '../controllers/gallery.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { singleUpload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createGalleryItemValidator,
  galleryIdValidator,
  listGalleryValidator,
  updateGalleryItemValidator,
} from '../validators/gallery.validator.js';

const router = Router();
const adminOnly = [authenticateAdmin, authorizeRoles(ROLES.ADMIN)];

router.get('/', optionalAuthenticateAdmin, listGalleryValidator, validate, listGallery);
router.post('/', adminOnly, singleUpload('image'), createGalleryItemValidator, validate, createGalleryItem);
router.patch('/:id', adminOnly, singleUpload('image'), updateGalleryItemValidator, validate, updateGalleryItem);
router.delete('/:id', adminOnly, galleryIdValidator, validate, deleteGalleryItem);

export default router;
