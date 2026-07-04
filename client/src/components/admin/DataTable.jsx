import EmptyState from '../common/EmptyState.jsx';

export default function DataTable({ columns = [], rows = [], getRowKey }) {
  if (!rows.length) return <EmptyState title="No records found" message="Try adjusting your filters or create a new record." />;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#ead1d9] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#ead1d9] text-left text-sm">
          <thead className="bg-[#fff8f8] text-xs font-black uppercase tracking-wide text-[#846071]">
            <tr>
              {columns.map((column) => (
                <th className="px-5 py-4" key={column.key}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0e1e6]">
            {rows.map((row, index) => (
              <tr className="align-top hover:bg-[#fff8f8]" key={getRowKey?.(row) || row._id || row.id || index}>
                {columns.map((column) => (
                  <td className="px-5 py-4" key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
