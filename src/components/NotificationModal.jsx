import Modal from './Modal'

function getIcon(type) {
  if (type === 'success') return '✓'
  if (type === 'error') return '!'
  if (type === 'warning') return 'i'
  return 'i'
}

export default function NotificationModal({
  open,
  type = 'info',
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = 'OK',
  cancelLabel = 'Batal',
}) {
  const isConfirm = typeof onConfirm === 'function'

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="notification-title">
      <div className="notification-modal">
        <div className={`notification-icon notification-${type}`}>{getIcon(type)}</div>
        <div className="notification-content">
          <h3 id="notification-title">{title}</h3>
          <p>{message}</p>
        </div>
        <div className="notification-actions">
          {isConfirm ? (
            <>
              <button type="button" className="btn-secondary" onClick={onClose}>
                {cancelLabel}
              </button>
              <button type="button" className={type === 'error' ? 'btn-delete' : 'btn-primary'} onClick={handleConfirm}>
                {confirmLabel}
              </button>
            </>
          ) : (
            <button type="button" className="btn-primary" onClick={onClose}>
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}