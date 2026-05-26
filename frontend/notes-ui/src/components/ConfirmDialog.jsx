export default function ConfirmDialog({ isOpen, noteTitle, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "400px" }}>
        <div className="modal-header">Confirm Deletion</div>
        <p className="confirm-text">
          Are you sure you want to delete "{noteTitle || "Untitled Note"}"? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
