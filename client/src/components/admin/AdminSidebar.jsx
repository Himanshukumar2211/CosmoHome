import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTES, PUBLIC_ROUTES } from '../../constants/routes.constants.js';
import Icon from '../../assets/branding/icon.svg';

const links = [
  [ADMIN_ROUTES.DASHBOARD, 'Dashboard'],
  [ADMIN_ROUTES.BEAUTICIANS, 'Beauticians'],
  [ADMIN_ROUTES.SERVICES, 'Services'],
  [ADMIN_ROUTES.GALLERY, 'Gallery'],
  [ADMIN_ROUTES.REVIEWS, 'Reviews'],
  [ADMIN_ROUTES.CONTACT_MESSAGES, 'Contact Messages'],
  [ADMIN_ROUTES.SETTINGS, 'Settings'],
];

export default function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#ead1d9] bg-[#352633] text-white lg:block">
      <div className="flex h-full flex-col p-6">
        <NavLink to={ADMIN_ROUTES.DASHBOARD} className="flex items-center gap-0">
          <img
              src={Icon}
              alt="Cosmo Home"
              className="h-12 w-13 object-contain"
          />
          <span>
            <span className="block text-xl font-black">Cosmo Home</span>
            <span className="text-xs font-semibold text-white/60">Admin Console</span>
          </span>
        </NavLink>
        <nav className="mt-10 grid gap-2">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-white text-[#352633]' : 'text-white/72 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <NavLink className="mt-auto rounded-2xl border border-white/15 px-4 py-3 text-sm font-bold text-white/72 hover:text-white" to={PUBLIC_ROUTES.HOME}>
          View Public Site
        </NavLink>
      </div>
    </aside>
  );
}
