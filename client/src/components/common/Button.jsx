import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-[#7d3c58] text-white shadow-lg shadow-[#7d3c58]/20 hover:bg-[#653047]',
  secondary: 'bg-white text-[#7d3c58] border border-[#ead1d9] hover:border-[#7d3c58]',
  ghost: 'bg-transparent text-[#7d3c58] hover:bg-[#fff0f3]',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      type={type}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
