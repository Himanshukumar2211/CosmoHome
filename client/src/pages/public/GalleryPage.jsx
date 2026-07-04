import { useEffect, useMemo, useState } from 'react';
import MetaTags from '../../SEO/MetaTags.jsx';
import GalleryGrid from '../../components/public/GalleryGrid.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { getGallery } from '../../services/gallery.api.js';
import { assetUrl, unwrapApiList } from '../../utils/apiData.js';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGallery = () => {
    setLoading(true);
    setError('');
    getGallery({ active: true, limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' })
      .then((response) => setItems(unwrapApiList(response, 'galleryItems')))
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load gallery right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadGallery, []);

  const categories = useMemo(() => ['All', ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const filtered = category === 'All' ? items : items.filter((item) => item.category === category);

  return (
    <>
      <MetaTags title="Gallery | Cosmo Home" path="/gallery" description="View Cosmo Home service results, bridal looks, skincare sessions, and beauty transformations." />
      <section className="section-shell py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">Gallery</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">Real looks, refined details.</h1>
          <p className="mt-5 text-lg leading-8 text-[#6f5364]">Browse recent Cosmo Home work across beauty, grooming, makeup, and skincare.</p>
        </div>
        {loading ? <Loader /> : null}
        {error ? <ErrorMessage message={error} onRetry={loadGallery} /> : null}
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
            <div className="mt-8">
              {filtered.length ? <GalleryGrid items={filtered} onSelect={setSelected} /> : <EmptyState title="No gallery items found" message="This category does not have published images yet." />}
            </div>
          </>
        ) : null}
      </section>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} labelledBy="gallery-lightbox-title">
        {selected ? (
          <div>
            <img className="max-h-[70vh] w-full rounded-2xl object-contain" src={assetUrl(selected.image)} alt={selected.title} />
            <div className="flex flex-wrap items-start justify-between gap-4 p-3">
              <div>
                <h2 id="gallery-lightbox-title" className="text-2xl font-black text-[#352633]">{selected.title}</h2>
                <p className="mt-1 text-sm text-[#846071]">{selected.description || selected.category}</p>
              </div>
              <button className="rounded-full bg-[#7d3c58] px-5 py-2 text-sm font-bold text-white" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
