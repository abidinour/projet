import "./Dialog.css";

export default function Dialog({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", isDestructive = false }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>{title}</h3>
        <div className="dialog-content">{children}</div>
        <div className="dialog-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className={`btn-primary ${isDestructive ? 'btn-danger' : ''}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}