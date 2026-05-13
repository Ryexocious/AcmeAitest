import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { taskService } from './services/taskService';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import EditTaskModal from './components/EditTaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      const data = await taskService.getTasks(filters);
      setTasks(data);
      // Also fetch unfiltered for counts
      if (statusFilter || priorityFilter) {
        const all = await taskService.getTasks();
        setAllTasks(all);
      } else {
        setAllTasks(data);
      }
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, [statusFilter, priorityFilter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (data) => {
    await taskService.createTask(data);
    fetchTasks();
  };

  const handleToggle = async (id) => {
    await taskService.toggleTask(id);
    fetchTasks();
  };

  const handleUpdate = async (id, data) => {
    await taskService.updateTask(id, data);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await taskService.deleteTask(id);
    setDeletingTask(null);
    fetchTasks();
  };

  const taskCounts = {
    all: allTasks.length,
    pending: allTasks.filter(t => t.status === 'pending').length,
    completed: allTasks.filter(t => t.status === 'completed').length,
  };

  // Sort: High > Medium > Low, then by date
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  const sortedTasks = [...tasks].sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 1;
    const pb = priorityOrder[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="app">
      {/* Hero Header */}
      <header className="hero">
        <div className="hero-bg-texture" />
        <div className="hero-glow" />
        <div className="hero-container">
          <motion.div className="section-label" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="label-dot" />
            <span>Task Manager</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            Organize your day with <span className="gradient-text">Task-Flow</span>
          </motion.h1>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            A modern, minimal task manager. Create, prioritize, and track your tasks effortlessly.
          </motion.p>

          {/* Decorative floating element */}
          <div className="hero-decoration">
            <div className="rotating-ring" />
            <div className="floating-card fc-1">
              <div className="fc-dot" />
              <div className="fc-lines"><div /><div /></div>
            </div>
            <div className="floating-card fc-2">
              <div className="fc-check" />
              <div className="fc-lines"><div /><div /></div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{taskCounts.all}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number stat-pending">{taskCounts.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number stat-completed">{taskCounts.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <TaskForm onTaskCreated={handleCreate} />

          <FilterBar
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            taskCounts={taskCounts}
          />

          {/* Task List */}
          <div className="task-list" id="task-list">
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading tasks...</p>
              </div>
            ) : sortedTasks.length === 0 ? (
              <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="empty-icon">📋</div>
                <h3>No tasks yet</h3>
                <p>{statusFilter || priorityFilter ? 'No tasks match the selected filters.' : 'Create your first task above to get started!'}</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {sortedTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i}
                    onToggle={handleToggle}
                    onDelete={(t) => setDeletingTask(t)}
                    onEdit={(t) => setEditingTask(t)} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built by <span className="gradient-text">Jessan</span> • {new Date().getFullYear()}</p>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {editingTask && (
          <EditTaskModal task={editingTask} onSave={handleUpdate} onClose={() => setEditingTask(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deletingTask && (
          <DeleteConfirmModal task={deletingTask} onConfirm={handleDelete} onClose={() => setDeletingTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
