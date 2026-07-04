import { Navigate, Outlet } from 'react-router-dom';
import { ADMIN_ROUTES } from '../constants/routes.constants.js';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

export function RequireAdmin() {
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) return <Loader label="Checking admin session..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to={ADMIN_ROUTES.LOGIN} replace />;
}

export function RedirectAuthenticatedAdmin() {
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) return <Loader label="Checking admin session..." />;

  return isAuthenticated ? <Navigate to={ADMIN_ROUTES.DASHBOARD} replace /> : <Outlet />;
}
