import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import ImageManager from '../../components/admin/ImageManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { useToast } from '../../hooks/useToast.js';
import { createService, deleteService, getServices, updateService } from '../../services/services.api.js';
import { unwrapApiData, unwrapApiList } from '../../utils/apiData.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const blank = {
  name: '',
  description: '',
  category: 'Hair',
  price: '',
  discountPrice: '',
  durationMinutes: '',
  displayOrder: '0',
  isActive: true,
  isFeatured: false,
};

export default function AdminServicesPage() {
  const { pushToast } = useToast();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', category: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    getServices({ ...filters, limit: 10, sortBy: 'displayOrder', sortOrder: 'asc' })
      .then((response) => {
        setRows(unwrapApiList(response));
        setPagination(unwrapApiData(response)?.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load services.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const openForm = (service = null) => {
    setEditing(service);
    setFormOpen(true);
    setImage(null);
    setForm(service ? { ...blank, ...service, discountPrice: service.discountPrice || '', durationMinutes: service.durationMinutes || '' } : blank);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '') payload.append(key, value);
    });
    if (image) payload.append('image', image);
    try {
      if (editing) await updateService(editing._id, payload);
      else await createService(payload);
      pushToast({ message: editing ? 'Service updated.' : 'Service created.' });
      setEditing(null);
      setFormOpen(false);
      setForm(blank);
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err?.response?.data?.message || 'Unable to save service.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await deleteService(confirmDelete._id);
    setConfirmDelete(null);
    pushToast({ message: 'Service deleted.' });
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black">Services</h2>
          <p className="text-sm text-[#846071]">Create, price, feature, and publish beauty services.</p>
        </div>
        <Button onClick={() => openForm()}>Create Service</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Search services" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
        <Input placeholder="Category filter" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value, page: 1 })} />
      </div>
      {loading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {!loading && !error ? (
        <>
          <DataTable
            rows={rows}
            columns={[
              { key: 'image', header: 'Image', render: (row) => <ImageManager asset={row.image} label={row.name} /> },
              { key: 'name', header: 'Name' },
              { key: 'category', header: 'Category' },
              { key: 'price', header: 'Price', render: (row) => formatCurrency(row.discountPrice || row.price) },
              { key: 'isActive', header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
              { key: 'isFeatured', header: 'Featured', render: (row) => (row.isFeatured ? <StatusBadge status="featured" /> : '-') },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <Button variant="secondary" className="min-h-9 px-3 py-1" onClick={() => openForm(row)}>Edit</Button>
                    <Button variant="ghost" className="min-h-9 px-3 py-1 text-[#b4234d]" onClick={() => setConfirmDelete(row)}>Delete</Button>
                  </div>
                ),
              },
            ]}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#846071]">{pagination.total} services</p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</Button>
              <Button variant="secondary" disabled={filters.page >= pagination.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</Button>
            </div>
          </div>
        </>
      ) : null}

      <Modal open={formOpen} onClose={() => { setEditing(null); setFormOpen(false); setForm(blank); }} labelledBy="service-form-title">
        <form className="p-2" onSubmit={submit}>
          <h2 id="service-form-title" className="text-2xl font-black">{editing ? 'Edit Service' : 'Create Service'}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <Input label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
            <Input label="Price" type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
            <Input label="Discount price" type="number" min="0" value={form.discountPrice} onChange={(event) => setForm({ ...form, discountPrice: event.target.value })} />
            <Input label="Duration minutes" type="number" min="5" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} />
            <Input label="Display order" type="number" min="0" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: event.target.value })} />
            <Textarea label="Description" className="md:col-span-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required minLength={10} />
            <FileUpload label="Service image" accept="image/*" onChange={(event) => setImage(event.target.files?.[0])} />
            <div className="grid content-center gap-3 rounded-3xl bg-[#fff8f8] p-4">
              <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Active</label>
              <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} /> Featured</label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setEditing(null); setFormOpen(false); setForm(blank); }}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Service'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(confirmDelete)} title="Delete service" message="This will permanently delete the service and its image." confirmLabel="Delete" onCancel={() => setConfirmDelete(null)} onConfirm={remove} />
    </div>
  );
}
