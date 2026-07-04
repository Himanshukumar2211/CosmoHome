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
import Textarea from '../../components/common/Textarea.jsx';
import { useToast } from '../../hooks/useToast.js';
import { createGalleryItem, deleteGalleryItem, getGallery, updateGalleryItem } from '../../services/gallery.api.js';
import { unwrapApiData, unwrapApiList } from '../../utils/apiData.js';

const blank = { title: '', description: '', category: 'Makeup', tags: '', displayOrder: '0', isActive: true };

export default function AdminGalleryPage() {
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
    getGallery({ ...filters, limit: 10, sortBy: 'displayOrder', sortOrder: 'asc' })
      .then((response) => {
        setRows(unwrapApiList(response));
        setPagination(unwrapApiData(response)?.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load gallery.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const openForm = (item = null) => {
    setEditing(item);
    setFormOpen(true);
    setImage(null);
    setForm(item ? { ...blank, ...item, tags: item.tags?.join(', ') || '' } : blank);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append('image', image);
    try {
      if (editing) await updateGalleryItem(editing._id, payload);
      else await createGalleryItem(payload);
      pushToast({ message: editing ? 'Gallery item updated.' : 'Gallery item uploaded.' });
      setFormOpen(false);
      setEditing(null);
      setForm(blank);
      load();
    } catch (err) {
      pushToast({ type: 'error', message: err?.response?.data?.message || 'Unable to save gallery item.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await deleteGalleryItem(confirmDelete._id);
    setConfirmDelete(null);
    pushToast({ message: 'Gallery item deleted.' });
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black">Gallery</h2>
          <p className="text-sm text-[#846071]">Upload, edit, publish, and preview portfolio images.</p>
        </div>
        <Button onClick={() => openForm()}>Upload Image</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Search gallery" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
        <Input placeholder="Category filter" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value, page: 1 })} />
      </div>
      {loading ? <Loader /> : null}
      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {!loading && !error ? (
        <>
          <DataTable
            rows={rows}
            columns={[
              { key: 'image', header: 'Image', render: (row) => <ImageManager asset={row.image} label={row.title} /> },
              { key: 'title', header: 'Title' },
              { key: 'category', header: 'Category' },
              { key: 'tags', header: 'Tags', render: (row) => row.tags?.join(', ') || '-' },
              { key: 'isActive', header: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
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
            <p className="text-sm text-[#846071]">{pagination.total} images</p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</Button>
              <Button variant="secondary" disabled={filters.page >= pagination.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</Button>
            </div>
          </div>
        </>
      ) : null}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); setForm(blank); }} labelledBy="gallery-form-title">
        <form className="p-2" onSubmit={submit}>
          <h2 id="gallery-form-title" className="text-2xl font-black">{editing ? 'Edit Gallery Image' : 'Upload Gallery Image'}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <Input label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
            <Input label="Tags" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="bridal, glow, hair" />
            <Input label="Display order" type="number" min="0" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: event.target.value })} />
            <Textarea label="Description" className="md:col-span-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <FileUpload label="Gallery image" accept="image/*" required={!editing} onChange={(event) => setImage(event.target.files?.[0])} />
            <label className="flex items-center gap-3 rounded-3xl bg-[#fff8f8] p-4 text-sm font-bold">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Active
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setFormOpen(false); setEditing(null); setForm(blank); }}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Gallery Item'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(confirmDelete)} title="Delete gallery item" message="This will permanently delete the image." confirmLabel="Delete" onCancel={() => setConfirmDelete(null)} onConfirm={remove} />
    </div>
  );
}
