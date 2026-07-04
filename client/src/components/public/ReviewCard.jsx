import { motion } from 'framer-motion';
import { assetUrl } from '../../utils/apiData.js';

export default function ReviewCard({ review }) {
  const image = assetUrl(review?.image);
  const rating = Number(review?.rating || 5);

  return (
    <motion.article className="premium-card rounded-3xl p-6" whileHover={{ y: -4 }}>
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f8dfe5] text-lg font-black text-[#7d3c58]">
          {image ? <img className="h-full w-full object-cover" src={image} alt={review?.name || 'Customer'} loading="lazy" /> : review?.name?.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="font-bold text-[#352633]">{review?.name || review?.customerName || 'Cosmo Home customer'}</h3>
          <p className="text-sm text-[#846071]">{'★'.repeat(Math.min(rating, 5))}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-[#6f5364]">{review?.message || review?.comment || review?.review}</p>
    </motion.article>
  );
}
