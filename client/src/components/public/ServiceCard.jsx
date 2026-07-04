import { motion } from 'framer-motion';
import { assetUrl } from '../../utils/apiData.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function ServiceCard({ service, compact = false }) {
  const image = assetUrl(service?.image);
  const price = service?.discountPrice ?? service?.price;
  const hasDiscount = service?.discountPrice && service.discountPrice < service.price;

  return (
    <motion.article
      className="premium-card overflow-hidden rounded-3xl"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="aspect-[4/3] bg-[#f8dfe5]">
        {image ? (
          <img className="h-full w-full object-cover" src={image} alt={service?.name || 'Cosmo Home service'} loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm font-semibold text-[#7d3c58]">
            Cosmo Home Signature Service
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#7d3c58]">
            {service?.category || 'Beauty'}
          </p>
          {service?.durationMinutes ? <p className="text-xs font-semibold text-[#846071]">{service.durationMinutes} min</p> : null}
        </div>
        <h3 className="mt-4 text-xl font-bold text-[#352633]">{service?.name}</h3>
        <p className={`mt-2 text-sm leading-6 text-[#6f5364] ${compact ? 'line-clamp-3' : ''}`}>{service?.description}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#a88796]">Starts at</p>
            <p className="text-2xl font-black text-[#7d3c58]">{formatCurrency(price || 0)}</p>
          </div>
          {hasDiscount ? <p className="text-sm font-semibold text-[#a88796] line-through">{formatCurrency(service.price)}</p> : null}
        </div>
      </div>
    </motion.article>
  );
}
