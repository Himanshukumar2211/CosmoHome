import { Suspense, useEffect } from 'react';
import { Routes, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { adminRoutes } from './AdminRoutes.jsx';
import { publicRoutes } from './PublicRoutes.jsx';

const ADMIN_HOSTNAME = 'admin.cosmohome.co.in';
const ADMIN_PATHS = new Set([
  '/dashboard',
  '/services',
  '/gallery',
  '/reviews',
  '/beauticians',
  '/contact-messages',
  '/settings',
]);

function AdminSubdomainRouting() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hostname !== ADMIN_HOSTNAME) return;

    if (location.pathname === '/') {
      navigate(`/admin/login${location.search}${location.hash}`, { replace: true });
      return;
    }

    if (ADMIN_PATHS.has(location.pathname)) {
      navigate(`/admin${location.pathname}${location.search}${location.hash}`, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <AdminSubdomainRouting />
      <Routes>
        {adminRoutes}
        {publicRoutes}
      </Routes>
    </Suspense>
  );
}
