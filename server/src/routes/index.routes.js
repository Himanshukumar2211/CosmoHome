import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import beauticianRoutes from './beautician.routes.js';
import contactMessageRoutes from './contactMessage.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import galleryRoutes from './gallery.routes.js';
import reviewRoutes from './review.routes.js';
import serviceRoutes from './service.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

router.use('/admin', adminRoutes);
router.use('/beauticians', beauticianRoutes);
router.use('/services', serviceRoutes);
router.use('/gallery', galleryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/contact-messages', contactMessageRoutes);

export default router;
