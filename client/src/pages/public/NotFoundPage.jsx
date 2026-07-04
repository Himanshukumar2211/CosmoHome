import { Link } from 'react-router-dom';
import MetaTags from '../../SEO/MetaTags.jsx';

export default function NotFoundPage() {
  return (
    <>
      <MetaTags title="Page Not Found | Cosmo Home" path="/404" />
      <section className="section-shell grid min-h-[60vh] place-items-center py-14 text-center">
        <div className="glass-panel max-w-2xl rounded-[2rem] p-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">404</p>
          <h1 className="mt-3 text-4xl font-black">This page is not available.</h1>
          <p className="mt-4 leading-7 text-[#6f5364]">The link may have moved, but your beauty appointment plans are still safe.</p>
          <Link className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#7d3c58] px-6 py-3 text-sm font-bold text-white" to="/">
            Return Home
          </Link>
        </div>
      </section>
    </>
  );
}
