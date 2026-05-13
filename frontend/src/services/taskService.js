const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

export const taskService = {
  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    const q = params.toString();
    const res = await fetch(q ? `${API}?${q}` : API);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },
  async createTask(data) {
    const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.details?.[0]?.message || e.error || 'Failed to create'); }
    return res.json();
  },
  async updateTask(id, data) {
    const res = await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.details?.[0]?.message || e.error || 'Failed to update'); }
    return res.json();
  },
  async toggleTask(id) {
    const res = await fetch(`${API}/${id}/toggle`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to toggle');
    return res.json();
  },
  async deleteTask(id) {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    return true;
  },
};
