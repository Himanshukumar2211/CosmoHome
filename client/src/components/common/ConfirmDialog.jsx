import Button from './Button.jsx';
import Modal from './Modal.jsx';

export default function ConfirmDialog({
  open,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="confirm-dialog-title">
      <div className="p-4">
        <h2 id="confirm-dialog-title" className="text-2xl font-black text-[#352633]">{title}</h2>
        <p className="mt-3 leading-7 text-[#6f5364]">{message}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button onClick={onConfirm} disabled={loading}>{loading ? 'Working...' : confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
