import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../api';
import { Link } from 'react-router-dom';

const chartData = [
  { name: 'Jan', revenue: 4000, leads: 24 },
  { name: 'Feb', revenue: 3000, leads: 13 },
  { name: 'Mar', revenue: 2000, leads: 98 },
  { name: 'Apr', revenue: 2780, leads: 39 },
  { name: 'May', revenue: 1890, leads: 48 },
  { name: 'Jun', revenue: 2390, leads: 38 },
];

export default function Dashboard() {
  const role = localStorage.getItem("role") || "SALES";
  const fullName = localStorage.getItem("fullName") || "";
  const isAdmin = role === "ADMIN";

  const [myTasks, setMyTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    // Fetch tasks assigned to this user (for Sales Reps especially)
    api.get('/tasks').then(res => {
      const tasks = res.data;
      // Sales reps see only their tasks; admins see all
      const filtered = isAdmin
        ? tasks
        : tasks.filter(t =>
          t.assignedTo?.toLowerCase() === fullName.toLowerCase()
        );
      setMyTasks(filtered);
    }).catch(err => {
      console.error('Failed to load tasks:', err);
    }).finally(() => {
      setLoadingTasks(false);
    });
  }, []);

  const getPriorityColor = (p) => ({
    'High': 'text-red-400 bg-red-500/10 border-red-500/30',
    'Medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    'Low': 'text-green-400 bg-green-500/10 border-green-500/30',
  }[p] || 'text-gray-400 bg-gray-500/10 border-gray-500/30');

  const pendingTasks = myTasks.filter(t => t.status !== 'Completed');
  const completedTasks = myTasks.filter(t => t.status === 'Completed');

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-white">
        {isAdmin ? "Dashboard Overview" : "My Dashboard"}
      </h1>

      {/* --- ADMIN VIEW --- */}
      {isAdmin && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-crm-dark p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-crm-sky/20 transition-all duration-300">
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
              <p className="text-3xl font-bold text-white mt-2">$54,230</p>
              <span className="text-green-400 text-sm font-medium flex items-center gap-1">↑ 12% from last month</span>
            </div>
            <div className="bg-crm-dark p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-crm-lavender/20 transition-all duration-300">
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Leads</h3>
              <p className="text-3xl font-bold text-white mt-2">1,203</p>
              <span className="text-crm-sky text-sm font-medium flex items-center gap-1">↑ 5% new leads</span>
            </div>
            <div className="bg-crm-dark p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Pending Tasks</h3>
              <p className="text-3xl font-bold text-white mt-2">{pendingTasks.length}</p>
              <span className="text-yellow-400 text-sm font-medium">across all reps</span>
            </div>
          </div>
        </>
      )}

      {/* --- SALES REP VIEW — My assigned stats --- */}
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-crm-dark p-6 rounded-xl border border-crm-sky/20 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">My Total Tasks</h3>
            <p className="text-3xl font-bold text-white mt-2">{myTasks.length}</p>
            <span className="text-crm-sky text-sm">assigned to me</span>
          </div>
          <div className="bg-crm-dark p-6 rounded-xl border border-yellow-500/20 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Pending</h3>
            <p className="text-3xl font-bold text-white mt-2">{pendingTasks.length}</p>
            <span className="text-yellow-400 text-sm">need attention</span>
          </div>
          <div className="bg-crm-dark p-6 rounded-xl border border-green-500/20 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Completed</h3>
            <p className="text-3xl font-bold text-white mt-2">{completedTasks.length}</p>
            <span className="text-green-400 text-sm">great work!</span>
          </div>
        </div>
      )}

      {/* --- MY TASKS SECTION (both roles, but filtered differently) --- */}
      <div className="bg-crm-dark rounded-xl border border-gray-800 shadow-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">
            {isAdmin ? "All Tasks Overview" : "My Assigned Tasks"}
          </h3>
          <Link to="/tasks" className="text-crm-sky text-sm hover:underline">View all →</Link>
        </div>

        {loadingTasks ? (
          <div className="p-8 text-center text-gray-500">Loading tasks...</div>
        ) : pendingTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {isAdmin ? "No pending tasks." : "🎉 No pending tasks — you're all caught up!"}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {pendingTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 hover:bg-gray-800/30 transition">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-crm-sky flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="text-sm text-gray-400">
                      {task.description && <span>{task.description} · </span>}
                      Due: {task.dueDate || 'No date'}{isAdmin && task.assignedTo ? ` · ${task.assignedTo}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{task.status}</span>
                </div>
              </div>
            ))}
            {pendingTasks.length > 5 && (
              <div className="p-4 text-center">
                <Link to="/tasks" className="text-crm-sky text-sm hover:underline">
                  +{pendingTasks.length - 5} more tasks — view all
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- CHARTS — visible to all roles --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-crm-dark p-6 rounded-xl border border-gray-800 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-white">Revenue Analytics</h3>
          <div className="h-80" style={{ minHeight: 0, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip cursor={{ fill: '#374151', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-crm-dark p-6 rounded-xl border border-gray-800 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-white">Leads Growth</h3>
          <div className="h-80" style={{ minHeight: 0, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#4b5563' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="leads" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4, fill: '#a78bfa', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
