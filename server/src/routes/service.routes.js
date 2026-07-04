import { Router } from 'express';
import {
  createService,
  deleteService,
  listServices,
  updateService,
} from '../controllers/service.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { singleUpload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createServiceValidator,
  listServicesValidator,
  serviceIdValidator,
  updateServiceValidator,
} from '../validators/service.validator.js';

const router = Router();
const adminOnly = [authenticateAdmin, authorizeRoles(ROLES.ADMIN)];

router.get('/', optionalAuthenticateAdmin, listServicesValidator, validate, listServices);
router.post('/', adminOnly, singleUpload('image'), createServiceValidator, validate, createService);
router.patch('/:id', adminOnly, singleUpload('image'), updateServiceValidator, validate, updateService);
router.delete('/:id', adminOnly, serviceIdValidator, validate, deleteService);

export default router;
