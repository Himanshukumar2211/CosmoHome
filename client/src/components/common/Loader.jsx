import { motion } from 'framer-motion';

export default function Loader({ label = 'Preparing your glow...' }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-center text-[#6f5364]">
      <motion.span
        className="h-12 w-12 rounded-full border-4 border-[#f4c2c2] border-t-[#7d3c58]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
