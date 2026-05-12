import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import './Modal.css';

export default function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    setError('');
    setLoading(true);
    try {
      const data = { title: title.trim(), description: description.trim() || null, priority };
      if (dueDate) data.dueDate = new Date(dueDate).toISOString();
      else data.dueDate = null;
      await onSave(task.id, data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="edit-task-modal">
      <motion.div className="modal-content" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="modal-close" onClick={onClose} id="close-edit-modal"><HiXMark /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form" id="edit-task-form">
          <div className="modal-field">
            <label htmlFor="edit-title">Title</label>
            <input id="edit-title" type="text" value={title}
              onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }}
              className={error ? 'input-error' : ''} />
          </div>
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-field">
            <label htmlFor="edit-description">Description</label>
            <textarea id="edit-description" value={description}
              onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="edit-priority">Priority</label>
              <select id="edit-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="edit-due-date">Due Date</label>
              <input id="edit-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
