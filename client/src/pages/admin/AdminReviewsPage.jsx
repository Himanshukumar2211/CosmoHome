import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import ImageManager from '../../components/admin/ImageManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { useToast } from '../../hooks/useToast.js';
import { createReview, deleteReview, getReviews, updateReview } from '../../services/reviews.api.js';
import { unwrapApiData, unwrapApiList } from '../../utils/apiData.js';

const blank = {
  customerName: '',
  rating: '5',
  comment: '',
  serviceName: '',
  customerLocation: '',
  isApproved: true,
  isFeatured: false,
};

export default function AdminReviewsPage() {
  const { pushToast } = useToast();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', approved: '', featured: '', page: 1 });
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
    getReviews({ ...filters, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((response) => {
        setRows(unwrapApiList(response));
        setPagination(unwrapApiData(response)?.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load reviews.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const openForm = (review = null) => {
    setEditing(review);
    setFormOpen(true);
    setImage(null);
    setForm(review ? { ...blank, ...review } : blank);
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '') payload.append(key, value);
    });
    if (image) payload.append('image', image);
    try {
      if (editing) await updateReview(editing._id, payload);
      else await createReview(payload);
      pushToast({ message: editing ? 'Review updated.' : 'Review created.' });
      setFormOpen(false);
      setEditing(null);
      setForm(blank);
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err?.response?.data?.message || 'Unable to save review.' });
    } finally {
      setSaving(false);
    }
  };

  const quickUpdate = async (row, payload) => {
    await updateReview(row._id, payload);
    pushToast({ message: 'Review updated.' });
    load();
  };

  const remove = async () => {
    await deleteReview(confirmDelete._id);
    setConfirmDelete(null);
    pushToast({ message: 'Review deleted.' });
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black">Reviews</h2>
          <p className="text-sm text-[#846071]">Approve, feature, edit, and publish customer testimonials.</p>
        </div>
        <Button onClick={() => openForm()}>Create Review</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Search reviews" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
        <Select value={filters.approved} onChange={(event) => setFilters({ ...filters, approved: event.target.value, page: 1 })}>
          <option value="">All approval states</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </Select>
        <Select value={filters.featured} onChange={(event) => setFilters({ ...filters, featured: event.target.value, page: 1 })}>
          <option value="">All featured states</option>
          <option value="true">Featured</option>
          <option value="false">Not featured</option>
        </Select>
      </div>
      {loading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {!loading && !error ? (
        <>
          <DataTable
            rows={rows}
            columns={[
              { key: 'image', header: 'Image', render: (row) => <ImageManager asset={row.image} label={row.customerName} /> },
              { key: 'customerName', header: 'Customer' },
              { key: 'rating', header: 'Rating', render: (row) => `${row.rating}/5` },
              { key: 'serviceName', header: 'Service', render: (row) => row.serviceName || '-' },
              { key: 'isApproved', header: 'Approval', render: (row) => <StatusBadge status={row.isApproved ? 'approved' : 'pending'} /> },
              { key: 'isFeatured', header: 'Featured', render: (row) => (row.isFeatured ? <StatusBadge status="featured" /> : '-') },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" className="min-h-9 px-3 py-1" onClick={() => openForm(row)}>Edit</Button>
                    <Button className="min-h-9 px-3 py-1" onClick={() => quickUpdate(row, { isApproved: !row.isApproved })}>{row.isApproved ? 'Reject' : 'Approve'}</Button>
                    <Button variant="ghost" className="min-h-9 px-3 py-1" onClick={() => quickUpdate(row, { isFeatured: !row.isFeatured })}>{row.isFeatured ? 'Unfeature' : 'Feature'}</Button>
                    <Button variant="ghost" className="min-h-9 px-3 py-1 text-[#b4234d]" onClick={() => setConfirmDelete(row)}>Delete</Button>
                  </div>
                ),
              },
            ]}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#846071]">{pagination.total} reviews</p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</Button>
              <Button variant="secondary" disabled={filters.page >= pagination.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</Button>
            </div>
          </div>
        </>
      ) : null}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); setForm(blank); }} labelledBy="review-form-title">
        <form className="p-2" onSubmit={save}>
          <h2 id="review-form-title" className="text-2xl font-black">{editing ? 'Edit Review' : 'Create Review'}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input label="Customer name" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} required />
            <Input label="Rating" type="number" min="1" max="5" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} required />
            <Input label="Service name" value={form.serviceName} onChange={(event) => setForm({ ...form, serviceName: event.target.value })} />
            <Input label="Customer location" value={form.customerLocation} onChange={(event) => setForm({ ...form, customerLocation: event.target.value })} />
            <Textarea label="Comment" className="md:col-span-2" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} required minLength={10} />
            <FileUpload label="Customer image" accept="image/*" onChange={(event) => setImage(event.target.files?.[0])} />
            <div className="grid content-center gap-3 rounded-3xl bg-[#fff8f8] p-4">
              <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.isApproved} onChange={(event) => setForm({ ...form, isApproved: event.target.checked })} /> Approved</label>
              <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} /> Featured</label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setFormOpen(false); setEditing(null); setForm(blank); }}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Review'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(confirmDelete)} title="Delete review" message="This will permanently delete the review." confirmLabel="Delete" onCancel={() => setConfirmDelete(null)} onConfirm={remove} />
    </div>
  );
}
