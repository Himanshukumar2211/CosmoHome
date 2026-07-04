import { AnimatePresence, motion } from 'framer-motion';

export default function Modal({ open, onClose, children, labelledBy }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#2f2430]/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white p-4 shadow-2xl"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
