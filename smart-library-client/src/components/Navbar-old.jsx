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
    <header className="glass animate-slide-down sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <button
          onClick={() => navigate(dashboardPath)}
          className="flex items-center gap-2.5 border-none bg-transparent cursor-pointer outline-none group"
        >
          <span className="flex w-9 h-9 items-center justify-center rounded-xl bg-gradient-brand text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
            📖
          </span>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            Smart Library
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive}) =>
                `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-lg">⭐</span>
              <div className="flex flex-col">
                <span className="text-xs text-amber-400 font-medium leading-none">Points</span>
                <span className="text-sm font-bold text-amber-300 leading-none mt-0.5">
                  {user?.points || 0}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2.5">
            <span className="flex w-8 h-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-md">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-medium text-slate-300">
              {user?.name || user?.email || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 cursor-pointer transition-all duration-300 hover:bg-red-500/25"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex w-10 h-10 items-center justify-center rounded-xl text-slate-400 bg-transparent border-none cursor-pointer hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
        <div className="md:hidden animate-slide-down border-t border-white/5 p-4 pb-4 bg-white">
          <nav className="flex flex-col gap-1 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
                    ? 'bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-3">
              <span className="flex w-8 h-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-md shadow-indigo-500/30">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-slate-400">{user?.name || user?.email || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 border-none cursor-pointer hover:bg-red-500/25 transition-colors"
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

