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
    <header className="glass animate-slide-down sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <button
          onClick={() => navigate(dashboardPath)}
          className="flex items-center gap-2.5 border-none bg-transparent cursor-pointer outline-none group"
        >
          <span className="flex w-9 h-9 items-center justify-center rounded-lg bg-gradient-brand text-lg">
            📚
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900 hover:text-blue-800 transition-colors">
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-lg">⭐</span>
              <div className="flex flex-col">
                <span className="text-xs text-amber-700 font-medium leading-none">Points</span>
                <span className="text-sm font-bold text-amber-900 leading-none mt-0.5">
                  {user?.points || 0}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2.5">
            <span className="flex w-8 h-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {user?.name || user?.email || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer transition-colors hover:bg-gray-200 border-none"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex w-10 h-10 items-center justify-center rounded-lg text-gray-600 bg-transparent border-none cursor-pointer hover:text-gray-900 hover:bg-gray-50 transition-colors"
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
        <div className="md:hidden animate-slide-down border-t border-gray-200 p-4 pb-4 bg-white">
          <nav className="flex flex-col gap-1 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <div className="flex items-center gap-3">
              <span className="flex w-8 h-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-gray-700">{user?.name || user?.email || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 border-none cursor-pointer hover:bg-gray-200 transition-colors"
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
