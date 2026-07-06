import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import WhatsAppButton from '../components/public/WhatsAppButton.jsx';
import Icon from "../assets/branding/icon.svg";

export default function PublicLayout() {
  const location = useLocation();
  const links = [
    ['/', 'Home'],
    ['/services', 'Services'],
    ['/gallery', 'Gallery'],
    ['/about', 'About'],
    ['/beautician-apply', 'Join Us'],
    ['/contact', 'Contact'],
  ];

  return (
    <div className="min-h-screen text-[#352633]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <nav className="section-shell flex min-h-20 items-center justify-between gap-5">
          <NavLink to="/" className="flex items-center gap-0" aria-label="Cosmo Home">
            <img
                src={Icon}
                alt="Cosmo Home"
                className="h-12 w-13 object-contain"
            />
            <span>
              <span className="block text-lg font-black leading-none">Cosmo Home</span>
              <span className="block text-xs font-semibold text-[#846071]">Salon at your doorstep</span>
            </span>
          </NavLink>
          <div className="hidden items-center gap-1 rounded-full border border-[#ead1d9] bg-white/70 p-1 lg:flex">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-[#7d3c58] text-white' : 'text-[#5e4354] hover:bg-[#fff0f3]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="hidden sm:block">
            <WhatsAppButton>Book Now</WhatsAppButton>
          </div>
        </nav>
        <div className="section-shell flex gap-2 overflow-x-auto pb-3 lg:hidden">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive ? 'bg-[#7d3c58] text-white' : 'bg-white text-[#5e4354]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <footer className="mt-20 border-t border-[#ead1d9] bg-[#352633] text-white">
        <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <h2 className="text-2xl font-black">Cosmo Home</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
              Premium salon, skincare, grooming, and makeup services delivered by trained professionals in the comfort of your home.
            </p>
          </div>
          <div>
            <h3 className="font-bold">Explore</h3>
            <div className="mt-4 grid gap-2 text-sm text-white/72">
              {links.slice(1).map(([to, label]) => (
                <NavLink className="hover:text-white" to={to} key={to}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold">Working Hours</h3>
            <p className="mt-4 text-sm leading-6 text-white/72">Monday to Sunday<br />9:00 AM - 8:00 PM</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
