import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Select from '../../components/common/Select.jsx';
import { useToast } from '../../hooks/useToast.js';
import { deleteContactMessage, getContactMessages } from '../../services/contactMessages.api.js';
import { unwrapApiData, unwrapApiList } from '../../utils/apiData.js';
import { formatDate } from '../../utils/formatDate.js';

const sourceLabels = {
  contact_page: 'Contact page',
  whatsapp_cta: 'WhatsApp CTA',
  service_page: 'Service page',
};

export default function AdminContactMessagesPage() {
  const { pushToast } = useToast();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', source: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    getContactMessages({ ...filters, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((response) => {
        setRows(unwrapApiList(response));
        setPagination(unwrapApiData(response)?.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load contact messages.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const remove = async () => {
    await deleteContactMessage(confirmDelete._id);
    setConfirmDelete(null);
    pushToast({ message: 'Contact message deleted.' });
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black">Contact Messages</h2>
          <p className="text-sm text-[#846071]">Review customer inquiries, update status, and remove old messages.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input placeholder="Search messages" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
          <Select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })}>
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </Select>
          <Select value={filters.source} onChange={(event) => setFilters({ ...filters, source: event.target.value, page: 1 })}>
            <option value="">All sources</option>
            <option value="contact_page">Contact page</option>
            <option value="whatsapp_cta">WhatsApp CTA</option>
            <option value="service_page">Service page</option>
          </Select>
        </div>
      </div>

      {loading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {!loading && !error ? (
        <>
          <DataTable
            rows={rows}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'phone', header: 'Phone' },
              { key: 'email', header: 'Email', render: (row) => row.email || '-' },
              { key: 'purpose', header: 'Purpose', render: (row) => row.purpose || '-' },
              { key: 'source', header: 'Source', render: (row) => sourceLabels[row.source] || row.source || '-' },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
              { key: 'message', header: 'Message', render: (row) => <span className="block max-w-md whitespace-pre-line">{row.message}</span> },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" className="min-h-9 px-3 py-1 text-[#b4234d]" onClick={() => setConfirmDelete(row)}>Delete</Button>
                  </div>
                ),
              },
            ]}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#846071]">{pagination.total} messages</p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</Button>
              <Button variant="secondary" disabled={filters.page >= pagination.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</Button>
            </div>
          </div>
        </>
      ) : null}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete contact message"
        message="This will permanently delete the contact message."
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
