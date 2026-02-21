import { useState, useEffect } from 'react';
import api from '../api';

const STATUSES = ['All', 'New', 'Contacted', 'Converted', 'Lost'];

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', contactInfo: '', source: 'Web', status: 'New', assignedSalesRep: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLeads(); }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
        } catch (err) {
            console.error('Failed to load leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this lead?')) return;
        await api.delete(`/leads/${id}`);
        setLeads(leads.filter(l => l.id !== id));
    };

    const handleEdit = (lead) => {
        setFormData(lead);
        setEditingId(lead.id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await api.put(`/leads/${editingId}`, formData);
                setLeads(leads.map(l => l.id === editingId ? res.data : l));
            } else {
                const res = await api.post('/leads', formData);
                setLeads([...leads, res.data]);
            }
            closeModal();
        } catch (err) { console.error('Save failed:', err); }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: '', contactInfo: '', source: 'Web', status: 'New', assignedSalesRep: '' });
        setEditingId(null);
    };

    const displayed = filter === 'All' ? leads : leads.filter(l => l.status === filter);

    const getStatusColor = (status) => {
        const map = { 'New': 'bg-blue-500/20 text-blue-400', 'Contacted': 'bg-yellow-500/20 text-yellow-400', 'Converted': 'bg-green-500/20 text-green-400', 'Lost': 'bg-red-500/20 text-red-400' };
        return map[status] || 'bg-gray-500/20 text-gray-400';
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">Leads Pipeline</h1>
                <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === s ? 'bg-crm-sky text-black' : 'bg-crm-dark text-gray-400 hover:bg-gray-800'}`}>
                            {s}
                        </button>
                    ))}
                </div>
                <button onClick={() => setShowModal(true)} className="bg-crm-sky hover:bg-sky-600 text-black font-bold py-2 px-4 rounded-lg transition">
                    + Add Lead
                </button>
            </div>

            {loading ? (
                <div className="text-gray-400 text-center py-16">Loading leads...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayed.map(lead => (
                        <div key={lead.id} className="bg-crm-dark p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition group hover:shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-crm-sky transition">{lead.name}</h3>
                                    <p className="text-gray-400 text-sm">{lead.contactInfo}</p>
                                    <p className="text-gray-500 text-xs mt-1">Source: {lead.source}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(lead.status)}`}>{lead.status}</span>
                            </div>
                            <p className="text-gray-500 text-sm">Rep: {lead.assignedSalesRep || 'Unassigned'}</p>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => handleEdit(lead)} className="flex-1 bg-gray-800 hover:bg-crm-sky hover:text-black text-gray-300 py-2 rounded transition text-sm">Edit</button>
                                <button onClick={() => handleDelete(lead.id)} className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition text-sm">Del</button>
                            </div>
                        </div>
                    ))}
                    {displayed.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-16">No leads found.</div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-crm-dark border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Lead' : 'Add New Lead'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" placeholder="Lead name" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Contact Info</label>
                                <input value={formData.contactInfo} onChange={e => setFormData({ ...formData, contactInfo: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" placeholder="Email or phone" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Source</label>
                                <select value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none">
                                    {['Referral', 'Ads', 'Web'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none">
                                    {['New', 'Contacted', 'Converted', 'Lost'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Assigned Sales Rep</label>
                                <input value={formData.assignedSalesRep} onChange={e => setFormData({ ...formData, assignedSalesRep: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" placeholder="Rep name" />
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
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
