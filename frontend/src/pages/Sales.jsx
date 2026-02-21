import { useState, useEffect } from 'react';
import api from '../api';

const STAGES = ['Proposal', 'Negotiation', 'Closed-Won', 'Closed-Lost'];

export default function Sales() {
  const [deals, setDeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ product: '', amount: '', status: 'Proposal', assignedSalesRep: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setDeals(res.data);
    } catch (err) {
      console.error('Failed to load sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/sales/${editingId}`, formData);
        setDeals(deals.map(d => d.id === editingId ? res.data : d));
      } else {
        const res = await api.post('/sales', formData);
        setDeals([...deals, res.data]);
      }
      closeModal();
    } catch (err) { console.error('Save failed:', err); }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ product: '', amount: '', status: 'Proposal', assignedSalesRep: '', date: '' });
    setEditingId(null);
  };

  const getStageColor = (stage) => {
    const map = { 'Closed-Won': 'bg-green-500/20 text-green-400', 'Closed-Lost': 'bg-red-500/20 text-red-400', 'Negotiation': 'bg-yellow-500/20 text-yellow-400', 'Proposal': 'bg-blue-500/20 text-blue-400' };
    return map[stage] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Sales Pipeline</h1>
        <button onClick={() => setShowModal(true)} className="bg-crm-sky hover:bg-sky-600 text-black font-bold py-2 px-4 rounded-lg transition">
          + New Deal
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-16">Loading deals...</div>
      ) : (
        <div className="bg-crm-dark rounded-xl border border-gray-800 overflow-hidden shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Sales Rep</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 text-white font-medium">{deal.product}</td>
                  <td className="p-4 text-white font-bold">${deal.amount?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStageColor(deal.status)}`}>{deal.status}</span>
                  </td>
                  <td className="p-4 text-gray-400">{deal.assignedSalesRep || '—'}</td>
                  <td className="p-4 text-gray-400">{deal.date}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setFormData({ product: deal.product, amount: deal.amount, status: deal.status, assignedSalesRep: deal.assignedSalesRep, date: deal.date }); setEditingId(deal.id); setShowModal(true); }} className="text-crm-sky hover:text-sky-300 text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {deals.length === 0 && (
            <div className="p-8 text-center text-gray-500">No deals yet. Create your first deal.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-crm-dark border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Update Deal' : 'New Deal'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Product / Deal Name</label>
                <input required value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" placeholder="e.g. Annual subscription" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Amount ($)</label>
                <input required type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" placeholder="5000" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Stage</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none">
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Assigned Sales Rep</label>
                <input value={formData.assignedSalesRep} onChange={e => setFormData({ ...formData, assignedSalesRep: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" placeholder="Rep name" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none" />
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
