import { Router } from 'express';
import {
  approveBeautician,
  deleteBeautician,
  getBeautician,
  listBeauticians,
  registerBeautician,
  rejectBeautician,
  updateBeautician,
} from '../controllers/beautician.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { fieldsUpload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  beauticianIdValidator,
  listBeauticiansValidator,
  registerBeauticianValidator,
  rejectBeauticianValidator,
  updateBeauticianValidator,
} from '../validators/beautician.validator.js';

const router = Router();
const adminOnly = [authenticateAdmin, authorizeRoles(ROLES.ADMIN)];

router.post(
  '/register',
  fieldsUpload([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'portfolioImages', maxCount: 10 },
    { name: 'certificates', maxCount: 10 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
  ]),
  registerBeauticianValidator,
  validate,
  registerBeautician,
);
router.get('/', adminOnly, listBeauticiansValidator, validate, listBeauticians);
router.get('/:id', adminOnly, beauticianIdValidator, validate, getBeautician);
router.patch(
  '/:id',
  adminOnly,
  fieldsUpload([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'portfolioImages', maxCount: 10 },
    { name: 'certificates', maxCount: 10 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
  ]),
  updateBeauticianValidator,
  validate,
  updateBeautician,
);
router.patch('/:id/approve', adminOnly, beauticianIdValidator, validate, approveBeautician);
router.patch('/:id/reject', adminOnly, rejectBeauticianValidator, validate, rejectBeautician);
router.delete('/:id', adminOnly, beauticianIdValidator, validate, deleteBeautician);

export default router;
