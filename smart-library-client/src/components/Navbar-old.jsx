import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <header className="animate-slide-down sticky top-0 z-50 border-b border-[#E5E7EB] bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <button
          onClick={() => navigate(dashboardPath)}
          className="flex items-center gap-2.5 border-none bg-transparent cursor-pointer outline-none group"
        >
          <span className="flex w-9 h-9 items-center justify-center rounded-xl bg-[#2563EB] text-lg text-white shadow-sm">
            📖
          </span>
          <span className="text-lg font-bold tracking-tight text-[#111827] group-hover:text-[#2563EB] transition-colors">
            Smart Library
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user?.role === 'student' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB]">
              <span className="text-lg">⭐</span>
              <div className="flex flex-col">
                <span className="text-xs text-[#6B7280] font-medium leading-none">Points</span>
                <span className="text-sm font-bold text-[#111827] leading-none mt-0.5">{user?.points || 0}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <span className="flex w-8 h-8 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-sm">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-medium text-[#111827]">{user?.name || user?.email || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#EF4444] px-4 py-2 text-sm font-medium text-white cursor-pointer transition-colors hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex w-10 h-10 items-center justify-center rounded-xl text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] cursor-pointer hover:text-[#111827] hover:bg-[#E5E7EB] transition-colors"
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

      {mobileOpen && (
        <div className="md:hidden animate-slide-down border-t border-[#E5E7EB] p-4 pb-4 bg-white">
          <nav className="flex flex-col gap-1 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-[#E5E7EB] pt-3">
            <div className="flex items-center gap-3">
              <span className="flex w-8 h-8 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-sm">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-[#111827]">{user?.name || user?.email || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-[#F3F4F6] px-4 py-2 text-sm font-medium text-[#111827] border border-[#E5E7EB] cursor-pointer hover:bg-[#E5E7EB] transition-colors"
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
