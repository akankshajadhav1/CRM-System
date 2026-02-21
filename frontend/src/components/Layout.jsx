import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const role = (localStorage.getItem("role") || "").toUpperCase();
  const fullName = localStorage.getItem("fullName") || localStorage.getItem("token") ? (localStorage.getItem("fullName") || "User") : "User";
  const isAdmin = role === "ADMIN";

  // Initials for avatar
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    navigate("/");
  };

  const adminNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Customers", path: "/customers" },
    { name: "Leads", path: "/leads" },
    { name: "Tasks", path: "/tasks" },
    { name: "Sales", path: "/sales" },
    { name: "Purchase", path: "/purchase" },
  ];

  // Sales reps only see Dashboard and Tasks
  const salesNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Tasks", path: "/tasks" },
  ];

  const navItems = isAdmin ? adminNavItems : salesNavItems;

  return (
    <div className="flex min-h-screen bg-crm-black text-crm-text">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-crm-dark to-black border-r border-gray-800 flex flex-col">

        {/* Top: logo + nav */}
        <div className="p-6 flex-1">
          <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-crm-sky to-crm-lavender">
            CRM-System
          </h1>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium ${location.pathname === item.path
                  ? 'bg-crm-sky/20 text-crm-sky border border-crm-sky/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom: User profile card */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            {/* <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-crm-sky to-crm-lavender p-[2px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-crm-black flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
            </div> */}
            {/* Name + role */}
            {/* <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{fullName}</p>
              <p className={`text-xs font-semibold ${isAdmin ? 'text-crm-sky' : 'text-purple-400'}`}>
                {isAdmin ? '⚙ Administrator' : '👤 Sales Rep'}
              </p>
            </div> */}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 p-2.5 rounded-lg hover:bg-red-500/20 transition-all font-medium border border-red-500/20 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-crm-black relative">
        {/* Top Navbar */}
        <header className="bg-crm-dark/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 p-4 flex justify-between items-center px-8">
          <div>
            <p className="text-sm text-gray-400 mb-0.5">
              {isAdmin ? "Admin Panel" : "My Workspace"} &mdash; logged in as
            </p>
            {/* <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-crm-sky to-crm-lavender leading-tight">
              {fullName}
            </h2> */}
            <p className="text-xs text-gray-500">{isAdmin ? "Administrator" : "Sales Representative"}</p>
          </div>

          <div className="flex items-center gap-6">

            {/* Quick Add — Admin only */}
            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-crm-sky/10 text-crm-sky px-4 py-2 rounded-lg border border-crm-sky/20 hover:bg-crm-sky/20 transition cursor-pointer">
                  <span>+ Quick Add</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-crm-dark border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50 overflow-hidden">
                  <Link to="/customers" className="block px-4 py-3 hover:bg-gray-800 text-gray-300 hover:text-white transition">Add Customer</Link>
                  <Link to="/sales" className="block px-4 py-3 hover:bg-gray-800 text-gray-300 hover:text-white transition">New Deal</Link>
                  <Link to="/tasks" className="block px-4 py-3 hover:bg-gray-800 text-gray-300 hover:text-white transition">Create Task</Link>
                  <Link to="/leads" className="block px-4 py-3 hover:bg-gray-800 text-gray-300 hover:text-white transition">Add Lead</Link>
                </div>
              </div>
            )}

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">{fullName}</p>
                <p className="text-xs text-gray-400">{isAdmin ? "Administrator" : "Sales Representative"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-crm-sky to-crm-lavender p-[2px]">
                <div className="w-full h-full rounded-full bg-crm-black flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
              </div>
            </div>

          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
