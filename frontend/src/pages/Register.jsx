import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "SALES" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post("/register", form);
            navigate("/"); 
        } catch (err) {
            setError(err.response?.data || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-crm-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-crm-dark via-crm-black to-black p-4">

            <div className="relative w-full max-w-md">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>

                <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-crm-sky to-crm-lavender mb-2">
                             CRM-System
                        </h1>
                        <p className="text-gray-400">Create a new account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input
                                required
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-crm-sky outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="jane@company.com"
                                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-crm-sky outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input
                                required
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-crm-sky outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-crm-sky outline-none transition"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="SALES">Sales Rep</option>
                            </select>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-crm-sky to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/" className="text-crm-sky hover:underline">Sign In</Link>
                    </p>

                </div>
            </div>
        </div>
    );
}
