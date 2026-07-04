import { Router } from 'express';
import { getAdminProfile, loginAdmin, logoutAdmin } from '../controllers/admin.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authRateLimiter } from '../config/rateLimit.config.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginAdminValidator } from '../validators/admin.validator.js';

const router = Router();

router.post('/login', authRateLimiter, loginAdminValidator, validate, loginAdmin);
router.post('/logout', authenticateAdmin, authorizeRoles(ROLES.ADMIN), logoutAdmin);
router.get('/profile', authenticateAdmin, authorizeRoles(ROLES.ADMIN), getAdminProfile);

export default router;
