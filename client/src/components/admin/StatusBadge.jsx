const styles = {
  pending: 'bg-[#fff4d8] text-[#8a5a00]',
  approved: 'bg-[#e4f8ec] text-[#1f7a45]',
  rejected: 'bg-[#ffe6eb] text-[#b4234d]',
  active: 'bg-[#e4f8ec] text-[#1f7a45]',
  inactive: 'bg-[#f0e8ec] text-[#6f5364]',
  featured: 'bg-[#fff0f3] text-[#7d3c58]',
  new: 'bg-[#fff4d8] text-[#8a5a00]',
  read: 'bg-[#e7f0ff] text-[#285a9b]',
  archived: 'bg-[#f0e8ec] text-[#6f5364]',
};

export default function StatusBadge({ status }) {
  const value = String(status || 'inactive');
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${styles[value] || styles.inactive}`}>
      {value}
    </span>
  );
}
