import { motion } from 'framer-motion';
import { HiExclamationTriangle, HiXMark } from 'react-icons/hi2';
import './Modal.css';

export default function DeleteConfirmModal({ task, onConfirm, onClose }) {
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="delete-confirm-modal">
      <motion.div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}>
        <div className="modal-header">
          <h2>Delete Task</h2>
          <button className="modal-close" onClick={onClose} id="close-delete-modal"><HiXMark /></button>
        </div>
        <div className="delete-body">
          <div className="delete-icon-wrap">
            <HiExclamationTriangle />
          </div>
          <p>Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.</p>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} id="cancel-delete-btn">Cancel</button>
          <button className="btn-danger" onClick={() => onConfirm(task.id)} id="confirm-delete-btn">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}
