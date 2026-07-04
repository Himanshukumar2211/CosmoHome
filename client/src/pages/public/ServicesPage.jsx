import { useEffect, useMemo, useState } from 'react';
import MetaTags from '../../SEO/MetaTags.jsx';
import ServiceCard from '../../components/public/ServiceCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { getServices } from '../../services/services.api.js';
import { unwrapApiList } from '../../utils/apiData.js';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadServices = () => {
    setLoading(true);
    setError('');
    getServices({ active: true, limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' })
      .then((response) => setServices(unwrapApiList(response, 'services')))
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load services right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadServices, []);

  const categories = useMemo(() => ['All', ...new Set(services.map((service) => service.category).filter(Boolean))], [services]);
  const filtered = category === 'All' ? services : services.filter((service) => service.category === category);

  return (
    <>
      <MetaTags title="Services | Cosmo Home" path="/services" description="Explore Cosmo Home salon, skincare, makeup, grooming, and beauty services with transparent pricing." />
      <section className="section-shell py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">Services</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Choose your at-home salon ritual.</h1>
          <p className="mt-5 text-lg leading-8 text-[#6f5364]">Every service is designed for comfort, hygiene, and a polished finish at your doorstep.</p>
        </div>
        {loading ? <Loader /> : null}
        {error ? <ErrorMessage message={error} onRetry={loadServices} /> : null}
        {!loading && !error ? (
          <>
            <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition ${category === item ? 'bg-[#7d3c58] text-white' : 'bg-white text-[#5e4354]'}`}
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            {filtered.length ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((service) => <ServiceCard key={service._id || service.slug} service={service} />)}
              </div>
            ) : (
              <div className="mt-8">
                <EmptyState title="No services found" message="This category does not have active services yet." />
              </div>
            )}
          </>
        ) : null}
      </section>
    </>
  );
}
