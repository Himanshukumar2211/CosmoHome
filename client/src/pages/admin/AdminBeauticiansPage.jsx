import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import ImageManager from '../../components/admin/ImageManager.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { useToast } from '../../hooks/useToast.js';
import {
  approveBeautician,
  deleteBeautician,
  getBeauticians,
  getBeauticianById,
  rejectBeautician,
} from '../../services/beauticians.api.js';
import { unwrapApiData, unwrapApiList } from '../../utils/apiData.js';
import { formatDate } from '../../utils/formatDate.js';

export default function AdminBeauticiansPage() {
  const { pushToast } = useToast();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    getBeauticians({ ...filters, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((response) => {
        setRows(unwrapApiList(response));
        setPagination(unwrapApiData(response)?.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load beauticians.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const viewProfile = async (row) => {
    const response = await getBeauticianById(row._id);
    setSelected(unwrapApiData(response, 'beautician'));
  };

  const approve = async (row) => {
    await approveBeautician(row._id);
    pushToast({ message: 'Beautician approved.' });
    load();
  };

  const reject = async () => {
    await rejectBeautician(rejecting._id, { rejectionReason: rejectReason });
    setRejecting(null);
    setRejectReason('');
    pushToast({ message: 'Beautician rejected.' });
    load();
  };

  const remove = async () => {
    await deleteBeautician(confirmDelete._id);
    setConfirmDelete(null);
    pushToast({ message: 'Application deleted.' });
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black">Beauticians</h2>
          <p className="text-sm text-[#846071]">Review applications, documents, and onboarding status.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Search name, city, phone" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
          <Select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
              { key: 'fullName', header: 'Name' },
              { key: 'phone', header: 'Phone' },
              { key: 'city', header: 'City' },
              { key: 'experienceYears', header: 'Experience', render: (row) => `${row.experienceYears || 0} yrs` },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              { key: 'createdAt', header: 'Applied', render: (row) => formatDate(row.createdAt) },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" className="min-h-9 px-3 py-1" onClick={() => viewProfile(row)}>View</Button>
                    <Button className="min-h-9 px-3 py-1" onClick={() => approve(row)} disabled={row.status === 'approved'}>Approve</Button>
                    <Button variant="ghost" className="min-h-9 px-3 py-1" onClick={() => setRejecting(row)} disabled={row.status === 'rejected'}>Reject</Button>
                    <Button variant="ghost" className="min-h-9 px-3 py-1 text-[#b4234d]" onClick={() => setConfirmDelete(row)}>Delete</Button>
                  </div>
                ),
              },
            ]}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#846071]">{pagination.total} applications</p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</Button>
              <Button variant="secondary" disabled={filters.page >= pagination.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</Button>
            </div>
          </div>
        </>
      ) : null}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} labelledBy="beautician-profile-title">
        {selected ? (
          <div className="p-2">
            <h2 id="beautician-profile-title" className="text-2xl font-black">{selected.fullName}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ['Father / Husband', selected.fathersHusbandName || 'Not provided'],
                ['Date of birth', formatDate(selected.dateOfBirth) || 'Not provided'],
                ['Gender', selected.gender || 'Not provided'],
                ['Mobile', selected.phone],
                ['Alternate mobile', selected.alternatePhone || 'Not provided'],
                ['Email', selected.email || 'Not provided'],
                ['Aadhaar number', selected.aadhaarNumber || 'Not provided'],
                ['PAN number', selected.panNumber || 'Not provided'],
                ['Experience', `${selected.experienceYears || 0} years`],
                ['Current profession', selected.currentProfession || 'Not provided'],
                ['Work preference', selected.workPreference || 'Not provided'],
                ['Services offered', selected.specializations?.join(', ')],
                ['Other service', selected.otherService || 'Not provided'],
                ['Worked in salon before', selected.workedInSalonBefore || 'Not provided'],
                ['Previous salon name', selected.previousSalonName || 'Not provided'],
                ['Own tools & products', selected.ownToolsProducts || 'Not provided'],
                ['Preferred area', selected.preferredWorkAreas || 'Not provided'],
                ['Location', `${selected.address}, ${selected.city}, ${selected.state} ${selected.pincode}`],
                ['Declaration', selected.declarationAccepted ? 'Accepted' : 'Not accepted'],
              ].map(([label, value]) => (
                <div className="rounded-2xl bg-[#fff8f8] p-4" key={label}>
                  <p className="text-xs font-black uppercase tracking-wide text-[#b76d86]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#352633]">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <ImageManager asset={selected.profilePhoto} label="Passport Size Photo" />
              <ImageManager asset={selected.governmentId} label="Aadhaar Card" />
              <ImageManager asset={selected.addressProof} label="Address Proof" />
              {selected.certificates?.map((asset, index) => <ImageManager asset={asset} label={`Certificate ${index + 1}`} key={asset.url || index} />)}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={Boolean(rejecting)} onClose={() => setRejecting(null)} labelledBy="reject-title">
        <div className="p-2">
          <h2 id="reject-title" className="text-2xl font-black">Reject application</h2>
          <Textarea className="mt-5" label="Rejection reason" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} minLength={3} />
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button onClick={reject} disabled={rejectReason.trim().length < 3}>Reject</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete application"
        message="This will permanently delete the beautician application and uploaded files."
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
