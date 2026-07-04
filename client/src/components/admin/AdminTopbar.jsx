import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../constants/routes.constants.js';
import { useAuth } from '../../hooks/useAuth.js';

const mobileLinks = [
  [ADMIN_ROUTES.DASHBOARD, 'Dashboard'],
  [ADMIN_ROUTES.BEAUTICIANS, 'Beauticians'],
  [ADMIN_ROUTES.SERVICES, 'Services'],
  [ADMIN_ROUTES.GALLERY, 'Gallery'],
  [ADMIN_ROUTES.REVIEWS, 'Reviews'],
  [ADMIN_ROUTES.SETTINGS, 'Settings'],
];

export default function AdminTopbar() {
  const { admin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') || 'dashboard';

  const logout = async () => {
    await signOut();
    navigate(ADMIN_ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#ead1d9] bg-white/85 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b76d86]">Admin</p>
          <h1 className="capitalize text-2xl font-black text-[#352633]">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-[#846071]">{admin?.email}</p>
          </div>
          <button className="rounded-full bg-[#7d3c58] px-4 py-2 text-sm font-bold text-white" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {mobileLinks.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-4 py-2 text-sm font-bold ${isActive ? 'bg-[#352633] text-white' : 'bg-white text-[#5e4354]'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
