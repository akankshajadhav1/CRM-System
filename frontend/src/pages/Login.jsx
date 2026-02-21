import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/login", { email, password });
      const token = res.data;

    
      if (!token || token.startsWith("Invalid")) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      localStorage.setItem("token", token);


      try {
        const userRes = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = userRes.data;
        localStorage.setItem("role", user.role || "SALES");
        localStorage.setItem("fullName", user.fullName || email);
      } catch (profileErr) {
        console.warn("Could not fetch profile, using email as name:", profileErr);
        localStorage.setItem("role", "SALES");
        localStorage.setItem("fullName", email);
      }

      navigate("/dashboard");
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-crm-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-crm-dark via-crm-black to-black p-4">

      <div className="relative w-full max-w-md">
        {/* Background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-crm-sky to-crm-lavender mb-2">
              CRM-System
            </h1>
            <p className="text-gray-400">Welcome back! Please login to your account.</p>
          </div>

          <form onSubmit={login} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                required
                type="email"
                placeholder="Enter your email"
                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-crm-sky focus:border-transparent outline-none transition"
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-black/50 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-crm-sky focus:border-transparent outline-none transition"
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-crm-sky to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-crm-sky hover:underline">Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
