import { motion } from 'framer-motion';
import { HiCheck, HiTrash, HiPencilSquare, HiClock, HiFlag, HiExclamationTriangle } from 'react-icons/hi2';
import './TaskCard.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate, status) {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
}

const priorityMap = { High: 'high', Medium: 'medium', Low: 'low' };

export default function TaskCard({ task, index, onToggle, onDelete, onEdit }) {
  const overdue = isOverdue(task.dueDate, task.status);
  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      className={`task-card ${isCompleted ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
      id={`task-card-${task.id}`}
    >
      <button className={`toggle-btn ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)} title="Toggle status" id={`toggle-${task.id}`}>
        {isCompleted && <HiCheck />}
      </button>

      <div className="task-content">
        <div className="task-header">
          <h3 className={`task-title ${isCompleted ? 'done' : ''}`}>{task.title}</h3>
          <div className="task-badges">
            <span className={`priority-badge ${priorityMap[task.priority] || 'medium'}`}>
              <HiFlag /> {task.priority || 'Medium'}
            </span>
            {overdue && (
              <span className="overdue-badge"><HiExclamationTriangle /> Overdue</span>
            )}
          </div>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className="meta-item"><HiClock /> Created {formatDate(task.createdAt)}</span>
          {task.dueDate && (
            <span className={`meta-item ${overdue ? 'overdue-text' : ''}`}>
              Due {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(task)} title="Edit" id={`edit-${task.id}`}>
          <HiPencilSquare />
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(task)} title="Delete" id={`delete-${task.id}`}>
          <HiTrash />
        </button>
      </div>
    </motion.div>
  );
}
