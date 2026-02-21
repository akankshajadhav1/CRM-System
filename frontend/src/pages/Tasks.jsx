import { useState, useEffect } from 'react';
import api from '../api';

export default function Tasks() {
    const role = localStorage.getItem('role') || 'SALES';
    const fullName = localStorage.getItem('fullName') || '';
    const isAdmin = role === 'ADMIN';

    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '', status: 'Open' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            const all = res.data;
     
            const filtered = isAdmin
                ? all
                : all.filter(t => t.assignedTo?.toLowerCase() === fullName.toLowerCase());
            setTasks(filtered);
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleDone = async (task) => {
        const updated = { ...task, status: task.status === 'Completed' ? 'Open' : 'Completed' };
        try {
            const res = await api.put(`/tasks/${task.id}`, updated);
            setTasks(tasks.map(t => t.id === task.id ? res.data : t));
        } catch (err) { console.error('Toggle failed:', err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await api.put(`/tasks/${editingId}`, formData);
                setTasks(tasks.map(t => t.id === editingId ? res.data : t));
            } else {
                const res = await api.post('/tasks', formData);
                setTasks([...tasks, res.data]);
            }
            closeModal();
        } catch (err) { console.error('Save failed:', err); }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '', status: 'Open' });
        setEditingId(null);
    };

    const getPriorityColor = (p) => ({ 'High': 'text-red-400 border-red-500/30 bg-red-500/10', 'Medium': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', 'Low': 'text-green-400 border-green-500/30 bg-green-500/10' }[p] || '');

    const displayedTasks = filterStatus === 'All'
        ? tasks
        : tasks.filter(t => t.status === filterStatus);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
                    {!isAdmin && <p className="text-gray-400 text-sm mt-1">Showing tasks assigned to you</p>}
                </div>
                {isAdmin && (
                    <button onClick={() => setShowModal(true)} className="bg-crm-sky hover:bg-sky-600 text-black font-bold py-2 px-4 rounded-lg transition">
                        + Assign Task
                    </button>
                )}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 mb-6">
                {['All', 'Open', 'In Progress', 'Completed'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filterStatus === s ? 'bg-crm-sky text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-gray-400 text-center py-16">Loading tasks...</div>
            ) : (
                <div className="space-y-4">
                    {displayedTasks.map(task => (
                        <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${task.status === 'Completed' ? 'bg-gray-900/50 border-gray-800 opacity-60' : 'bg-crm-dark border-gray-800 hover:border-gray-700 shadow-md'}`}>
                            <div className="flex items-center gap-4">
                                <button onClick={() => toggleDone(task)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-crm-sky border-crm-sky' : 'border-gray-500 hover:border-crm-sky'}`}>
                                    {task.status === 'Completed' && (
                                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    )}
                                </button>
                                <div className={task.status === 'Completed' ? 'line-through text-gray-500' : ''}>
                                    <h3 className="font-bold text-white">{task.title}</h3>
                                    <p className="text-sm text-gray-400">
                                        {task.description && <span>{task.description} · </span>}
                                        Due: {task.dueDate || 'No date'}
                                        {isAdmin && task.assignedTo && <span> · Assigned to: <span className="text-crm-sky">{task.assignedTo}</span></span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{task.status}</span>
                                {isAdmin && (
                                    <>
                                        <button onClick={() => { setFormData(task); setEditingId(task.id); setShowModal(true); }} className="text-crm-sky text-sm hover:text-sky-300">Edit</button>
                                        <button onClick={() => handleDelete(task.id)} className="text-red-400 text-sm hover:text-red-300">Del</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {displayedTasks.length === 0 && (
                        <div className="text-center text-gray-500 py-16">
                            {filterStatus === 'All' ? 'No tasks assigned to you.' : `No ${filterStatus} tasks.`}
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-crm-dark border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Task' : 'Assign New Task'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {[
                                { label: 'Title', name: 'title', required: true, placeholder: 'Task title' },
                                { label: 'Description', name: 'description', placeholder: 'Description' },
                                { label: 'Assigned To', name: 'assignedTo', placeholder: 'User name or ID' },
                            ].map(f => (
                                <div key={f.name}>
                                    <label className="block text-gray-400 text-sm mb-1">{f.label}</label>
                                    <input required={f.required} value={formData[f.name]} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" placeholder={f.placeholder} />
                                </div>
                            ))}
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Due Date</label>
                                <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Priority</label>
                                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none">
                                    {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none">
                                    {['Open', 'In Progress', 'Completed'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-700">
                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-700 text-white py-2 rounded">Cancel</button>
                                <button type="submit" className="flex-1 bg-crm-sky text-black font-bold py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
