import { createContext, useCallback, useMemo, useState } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((toast) => {
    const id = crypto.randomUUID?.() || String(Date.now());
    setToasts((current) => [...current, { id, type: 'success', ...toast }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);
  }, []);
  const clearToasts = useCallback(() => setToasts([]), []);
  const value = useMemo(() => ({ toasts, pushToast, clearToasts }), [toasts, pushToast, clearToasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[70] grid w-[min(360px,calc(100vw-32px))] gap-3">
        {toasts.map((toast) => (
          <div
            className={`rounded-2xl border p-4 text-sm font-semibold shadow-xl ${
              toast.type === 'error'
                ? 'border-[#f2b8c8] bg-[#fff1f4] text-[#8f2443]'
                : 'border-[#cbeed8] bg-[#effaf3] text-[#1f7a45]'
            }`}
            key={toast.id}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
