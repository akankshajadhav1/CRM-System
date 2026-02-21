import { useState, useEffect } from 'react';
import api from '../api';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', address: '', notes: '', assignedSalesRep: '', status: 'Active' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error('Failed to fetch customers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        try {
            await api.delete(`/customers/${id}`);
            setCustomers(customers.filter(c => c.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleEdit = (customer) => {
        setFormData(customer);
        setEditingId(customer.id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await api.put(`/customers/${editingId}`, formData);
                setCustomers(customers.map(c => c.id === editingId ? res.data : c));
            } else {
                const res = await api.post('/customers', formData);
                setCustomers([...customers, res.data]);
            }
            closeModal();
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '', company: '', address: '', notes: '', assignedSalesRep: '', status: 'Active' });
        setEditingId(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Customers</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-crm-sky hover:bg-sky-600 text-black font-bold py-2 px-4 rounded-lg transition shadow-lg"
                >
                    + Add Customer
                </button>
            </div>

            {loading ? (
                <div className="text-gray-400 text-center py-16">Loading customers...</div>
            ) : (
                <div className="bg-crm-dark rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Company</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Sales Rep</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-800/50 transition">
                                    <td className="p-4 text-white font-medium">{customer.name}</td>
                                    <td className="p-4 text-gray-400">{customer.company || '—'}</td>
                                    <td className="p-4 text-gray-400">{customer.email}</td>
                                    <td className="p-4 text-gray-400">{customer.phone}</td>
                                    <td className="p-4 text-gray-400">{customer.assignedSalesRep || '—'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(customer)} className="text-crm-sky hover:text-sky-300 transition">Edit</button>
                                        <button onClick={() => handleDelete(customer.id)} className="text-red-400 hover:text-red-300 transition">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {customers.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No customers yet. Add one to get started.</div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-crm-dark border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {[
                                { label: 'Name', name: 'name', placeholder: 'Full Name', required: true },
                                { label: 'Email', name: 'email', placeholder: 'email@company.com', type: 'email', required: true },
                                { label: 'Phone', name: 'phone', placeholder: '(555) 555-5555' },
                                { label: 'Company', name: 'company', placeholder: 'Company name' },
                                { label: 'Address', name: 'address', placeholder: 'Street address' },
                                { label: 'Assigned Sales Rep', name: 'assignedSalesRep', placeholder: 'Rep name' },
                                { label: 'Notes', name: 'notes', placeholder: 'Additional notes' },
                            ].map(field => (
                                <div key={field.name}>
                                    <label className="block text-gray-400 text-sm mb-1">{field.label}</label>
                                    <input
                                        required={field.required}
                                        type={field.type || 'text'}
                                        value={formData[field.name]}
                                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-crm-sky outline-none transition"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition">Cancel</button>
                                <button type="submit" className="flex-1 bg-crm-sky hover:bg-sky-600 text-black font-bold py-2 rounded transition">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
