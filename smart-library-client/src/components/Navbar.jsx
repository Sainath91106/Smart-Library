import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Role-based navigation items
  const isAdmin = user?.role === 'admin';
  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';
  
  const navItems = isAdmin
    ? [
        { to: dashboardPath, label: 'Admin Dashboard', icon: '📊' },
        { to: '/books', label: 'Books', icon: '📚' },
        { to: '/my-issues', label: 'All Issues', icon: '📖' },
      ]
    : [
        { to: dashboardPath, label: 'Dashboard', icon: '📊' },
        { to: '/books', label: 'Books', icon: '📚' },
        { to: '/my-issues', label: 'My Issues', icon: '📖' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass animate-slide-down sticky top-0 z-50 border-b-2 border-slate-200 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Brand */}
        <button
          onClick={() => navigate(dashboardPath)}
          className="flex items-center gap-3 border-none bg-transparent cursor-pointer outline-none group"
        >
          <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-brand text-xl shadow-lg">
            📚
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
            Smart Library
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive}) =>
                `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Points display for students */}
          {user?.role === 'student' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-md">
              <span className="text-xl">⭐</span>
              <div className="flex flex-col">
                <span className="text-xs text-amber-700 font-bold leading-none">Points</span>
                <span className="text-sm font-extrabold text-amber-900 leading-none mt-0.5">
                  {user?.points || 0}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <span className="flex w-9 h-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-lg">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-bold text-slate-800">
              {user?.name || user?.email || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-none"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex w-11 h-11 items-center justify-center rounded-xl text-slate-700 bg-slate-100 border-2 border-slate-200 cursor-pointer hover:text-slate-900 hover:bg-slate-200 transition-all"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden animate-slide-down border-t-2 border-indigo-200 p-5 pb-4 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm rounded-b-2xl shadow-xl">
          <nav className="flex flex-col gap-2 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold border-l-4 border-indigo-500 shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border-l-4 border-transparent'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t-2 border-slate-200 pt-4">
            <div className="flex items-center gap-3">
              <span className="flex w-10 h-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-base font-bold text-white shadow-lg">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-slate-800">{user?.name || user?.email || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 px-4 py-2 text-sm font-bold text-red-600 cursor-pointer hover:from-red-100 hover:to-rose-100 transition-all shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
