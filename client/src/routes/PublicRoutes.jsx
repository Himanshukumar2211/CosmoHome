import { lazy } from 'react';
import { Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';

const AboutPage = lazy(() => import('../pages/public/AboutPage.jsx'));
const BeauticianApplyPage = lazy(() => import('../pages/public/BeauticianApplyPage.jsx'));
const ContactPage = lazy(() => import('../pages/public/ContactPage.jsx'));
const GalleryPage = lazy(() => import('../pages/public/GalleryPage.jsx'));
const HomePage = lazy(() => import('../pages/public/HomePage.jsx'));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage.jsx'));
const ServicesPage = lazy(() => import('../pages/public/ServicesPage.jsx'));

export const publicRoutes = (
  <Route element={<PublicLayout />}>
    <Route index element={<HomePage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="gallery" element={<GalleryPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="beautician-apply" element={<BeauticianApplyPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);
