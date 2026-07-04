import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { ROLES } from '../constants/roles.constants.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get('/stats', authenticateAdmin, authorizeRoles(ROLES.ADMIN), getDashboardStats);

export default router;
