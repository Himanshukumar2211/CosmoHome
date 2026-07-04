import { assetUrl } from '../../utils/apiData.js';

export default function ImageManager({ asset, label = 'Preview', className = '' }) {
  const url = assetUrl(asset);
  if (!url) return <span className="text-sm text-[#846071]">No file</span>;

  const isPdf = url.toLowerCase().includes('.pdf');
  return (
    <a
      className={`inline-flex items-center gap-3 rounded-2xl border border-[#ead1d9] bg-white p-2 text-sm font-bold text-[#7d3c58] hover:border-[#7d3c58] ${className}`}
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {isPdf ? (
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#fff0f3]">PDF</span>
      ) : (
        <img className="h-12 w-12 rounded-xl object-cover" src={url} alt={label} loading="lazy" />
      )}
      {label}
    </a>
  );
}
