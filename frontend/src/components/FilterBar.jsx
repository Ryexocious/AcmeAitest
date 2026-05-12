import './FilterBar.css';

const STATUSES = ['All', 'pending', 'completed'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

export default function FilterBar({ statusFilter, priorityFilter, onStatusChange, onPriorityChange, taskCounts }) {
  return (
    <div className="filter-bar" id="filter-bar">
      <div className="filter-group">
        <span className="filter-label">Status</span>
        <div className="filter-pills">
          {STATUSES.map((s) => (
            <button key={s} id={`filter-status-${s.toLowerCase()}`}
              className={`filter-pill ${(statusFilter || 'All') === s ? 'active' : ''}`}
              onClick={() => onStatusChange(s === 'All' ? '' : s)}>
              {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              {taskCounts && <span className="pill-count">{s === 'All' ? taskCounts.all : s === 'pending' ? taskCounts.pending : taskCounts.completed}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <span className="filter-label">Priority</span>
        <div className="filter-pills">
          {PRIORITIES.map((p) => (
            <button key={p} id={`filter-priority-${p.toLowerCase()}`}
              className={`filter-pill ${(priorityFilter || 'All') === p ? 'active' : ''} ${p !== 'All' ? `priority-${p.toLowerCase()}` : ''}`}
              onClick={() => onPriorityChange(p === 'All' ? '' : p)}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
