export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-[#4a3444]">{label}</span> : null}
      <select
        className={`w-full rounded-2xl border border-[#ead1d9] bg-white/85 px-4 py-3 text-[#352633] outline-none transition focus:border-[#7d3c58] focus:ring-4 focus:ring-[#f4c2c2]/30 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-sm text-[#b4234d]">{error}</span> : null}
    </label>
  );
}
