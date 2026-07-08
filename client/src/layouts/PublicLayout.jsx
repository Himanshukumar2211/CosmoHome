import { useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import WhatsAppButton from '../components/public/WhatsAppButton.jsx';
import Icon from "../assets/branding/icon.svg";
import { AppContext } from '../context/AppContext.jsx';

export default function PublicLayout() {
  const location = useLocation();
  const { settings } = useContext(AppContext);
  const links = [
    ['/', 'Home'],
    ['/services', 'Services'],
    ['/gallery', 'Gallery'],
    ['/about', 'About'],
    ['/beautician-apply', 'Join Us'],
    ['/contact', 'Contact'],
  ];
  const socialLinks = [
    {
      label: 'Instagram',
      href: settings?.socialLinks?.instagram,
      external: true,
      icon: (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: settings?.socialLinks?.facebook,
      external: true,
      icon: (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 8.5V6.7c0-.8.4-1.2 1.3-1.2H17V2.4c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.4v1.9H7v3.6h3V22h3.8v-9.9h2.9l.5-3.6H14Z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: settings?.businessEmail ? `mailto:${settings.businessEmail}` : '',
      icon: (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Phone',
      href: settings?.businessPhone ? `tel:${settings.businessPhone}` : '',
      icon: (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M6.6 3.5 9 3l2 5-1.7 1.1a12 12 0 0 0 5.6 5.6L16 13l5 2-.5 2.4c-.3 1.5-1.6 2.6-3.2 2.6A14.3 14.3 0 0 1 4 6.7c0-1.6 1.1-2.9 2.6-3.2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
    },
  ].filter((link) => link.href);

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
            <div className="mt-5 flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/72 transition hover:border-white/40 hover:text-white"
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
