import { lazy } from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { RedirectAuthenticatedAdmin, RequireAdmin } from './routeGuards.jsx';

const AdminBeauticiansPage = lazy(() => import('../pages/admin/AdminBeauticiansPage.jsx'));
const AdminContactMessagesPage = lazy(() => import('../pages/admin/AdminContactMessagesPage.jsx'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage.jsx'));
const AdminGalleryPage = lazy(() => import('../pages/admin/AdminGalleryPage.jsx'));
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage.jsx'));
const AdminReviewsPage = lazy(() => import('../pages/admin/AdminReviewsPage.jsx'));
const AdminServicesPage = lazy(() => import('../pages/admin/AdminServicesPage.jsx'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage.jsx'));

export const adminRoutes = (
  <>
    <Route element={<RedirectAuthenticatedAdmin />}>
      <Route element={<AuthLayout />}>
        <Route path="admin/login" element={<AdminLoginPage />} />
      </Route>
    </Route>
    <Route element={<RequireAdmin />}>
      <Route element={<AdminLayout />}>
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="admin/services" element={<AdminServicesPage />} />
        <Route path="admin/gallery" element={<AdminGalleryPage />} />
        <Route path="admin/reviews" element={<AdminReviewsPage />} />
        <Route path="admin/beauticians" element={<AdminBeauticiansPage />} />
        <Route path="admin/contact-messages" element={<AdminContactMessagesPage />} />
        <Route path="admin/settings" element={<AdminSettingsPage />} />
      </Route>
    </Route>
  </>
);
