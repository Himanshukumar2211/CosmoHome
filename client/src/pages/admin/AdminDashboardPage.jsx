import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getContactMessages } from '../../services/contactMessages.api.js';
import { getDashboardStats } from '../../services/dashboard.api.js';
import { unwrapApiData } from '../../utils/apiData.js';
import { formatDate } from '../../utils/formatDate.js';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [contactTotal, setContactTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getDashboardStats(), getContactMessages({ limit: 1 })])
      .then(([statsResponse, contactResponse]) => {
        setStats(unwrapApiData(statsResponse, 'stats'));
        setContactTotal(unwrapApiData(contactResponse)?.pagination?.total || 0);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load dashboard.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  const cards = [
    ['Total Services', stats?.totalServices],
    ['Total Beauticians', (stats?.pendingBeauticians || 0) + (stats?.approvedBeauticians || 0) + (stats?.rejectedBeauticians || 0)],
    ['Pending Applications', stats?.pendingBeauticians],
    ['Approved Beauticians', stats?.approvedBeauticians],
    ['Total Reviews', stats?.totalReviews],
    ['Gallery Images', stats?.totalGalleryImages],
    ['Contact Messages', contactTotal],
  ];

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => <StatCard key={label} label={label} value={value} />)}
      </div>
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-black">Recent Beautician Applications</h2>
          <p className="text-sm text-[#846071]">Latest applications submitted to Cosmo Home.</p>
        </div>
        <DataTable
          rows={stats?.recentApplications || []}
          columns={[
            { key: 'fullName', header: 'Name' },
            { key: 'phone', header: 'Phone' },
            { key: 'city', header: 'City' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'createdAt', header: 'Applied', render: (row) => formatDate(row.createdAt) },
          ]}
        />
      </section>
    </div>
  );
}
