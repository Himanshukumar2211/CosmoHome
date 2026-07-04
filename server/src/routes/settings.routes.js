import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authenticateAdmin, optionalAuthenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateSettingsValidator } from '../validators/settings.validator.js';

const router = Router();

router.get('/', optionalAuthenticateAdmin, getSettings);
router.patch(
  '/',
  authenticateAdmin,
  authorizeRoles(ROLES.ADMIN),
  updateSettingsValidator,
  validate,
  updateSettings,
);

export default router;
