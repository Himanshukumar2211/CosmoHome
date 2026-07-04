export default function FileUpload({ label, helper, error, className = '', ...props }) {
  return (
    <label className={`block rounded-3xl border border-dashed border-[#d8abb9] bg-white/70 p-4 ${className}`}>
      <span className="block text-sm font-semibold text-[#4a3444]">{label}</span>
      {helper ? <span className="mt-1 block text-xs text-[#846071]">{helper}</span> : null}
      <input
        type="file"
        className="mt-3 block w-full cursor-pointer text-sm text-[#5e4354] file:mr-4 file:rounded-full file:border-0 file:bg-[#7d3c58] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        {...props}
      />
      {error ? <span className="mt-2 block text-sm text-[#b4234d]">{error}</span> : null}
    </label>
  );
}
