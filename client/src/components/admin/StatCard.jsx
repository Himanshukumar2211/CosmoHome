import { motion } from 'framer-motion';

export default function StatCard({ label, value, helper }) {
  return (
    <motion.article className="premium-card rounded-3xl p-5" whileHover={{ y: -3 }}>
      <p className="text-sm font-bold text-[#846071]">{label}</p>
      <p className="mt-3 text-3xl font-black text-[#352633]">{value ?? 0}</p>
      {helper ? <p className="mt-2 text-xs font-semibold text-[#b76d86]">{helper}</p> : null}
    </motion.article>
  );
}
