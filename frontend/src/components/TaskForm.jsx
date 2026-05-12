import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiExclamationCircle } from 'react-icons/hi2';
import './TaskForm.css';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    setError('');
    setLoading(true);
    try {
      const data = { title: title.trim() };
      if (description.trim()) data.description = description.trim();
      if (priority) data.priority = priority;
      if (dueDate) data.dueDate = new Date(dueDate).toISOString();
      await onTaskCreated(data);
      setTitle(''); setDescription(''); setPriority('Medium'); setDueDate(''); setExpanded(false);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <motion.div className="task-form-wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form className="task-form" onSubmit={handleSubmit} id="create-task-form">
        <div className="task-form-main-row">
          <div className="input-group title-input-group">
            <input id="task-title-input" type="text" placeholder="What needs to be done?" value={title}
              onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }}
              className={error ? 'input-error' : ''} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} id="add-task-btn">
            <HiPlus /> {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>

        {error && (
          <motion.div className="error-message" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <HiExclamationCircle /> {error}
          </motion.div>
        )}

        <button type="button" className="expand-toggle" onClick={() => setExpanded(!expanded)} id="toggle-details-btn">
          {expanded ? '− Hide details' : '+ Add details (description, priority, due date)'}
        </button>

        {expanded && (
          <motion.div className="task-form-details" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <textarea id="task-description-input" placeholder="Description (optional)" value={description}
              onChange={(e) => setDescription(e.target.value)} rows={3} />
            <div className="details-row">
              <div className="field-group">
                <label htmlFor="task-priority-select">Priority</label>
                <select id="task-priority-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="field-group">
                <label htmlFor="task-due-date-input">Due Date</label>
                <input id="task-due-date-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
