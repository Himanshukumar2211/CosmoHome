export default function EmptyState({ title = 'Nothing here yet', message = 'Please check back soon.' }) {
  return (
    <div className="rounded-3xl border border-[#ead1d9] bg-white/75 p-8 text-center">
      <p className="text-lg font-bold text-[#4a3444]">{title}</p>
      <p className="mt-2 text-sm text-[#846071]">{message}</p>
    </div>
  );
}
