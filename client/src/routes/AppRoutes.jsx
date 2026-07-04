import { Suspense } from 'react';
import { Routes } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { adminRoutes } from './AdminRoutes.jsx';
import { publicRoutes } from './PublicRoutes.jsx';

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {adminRoutes}
        {publicRoutes}
      </Routes>
    </Suspense>
  );
}
