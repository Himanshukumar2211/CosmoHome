import { motion } from 'framer-motion';
import { assetUrl } from '../../utils/apiData.js';

export default function GalleryGrid({ items = [], onSelect }) {
  return (
    <div className="masonry-grid">
      {items.map((item, index) => {
        const image = assetUrl(item.image);
        return (
          <motion.button
            className="mb-4 w-full break-inside-avoid overflow-hidden rounded-3xl bg-white text-left shadow-lg shadow-[#7d3c58]/10"
            type="button"
            key={item._id || item.id || item.title || index}
            onClick={() => onSelect?.(item)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -4 }}
          >
            {image ? <img className="w-full object-cover" src={image} alt={item.title || 'Cosmo Home gallery'} loading="lazy" /> : null}
            <span className="block p-4">
              <span className="block text-sm font-bold text-[#352633]">{item.title}</span>
              <span className="mt-1 block text-xs text-[#846071]">{item.category}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
