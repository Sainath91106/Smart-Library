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
    <header className="animate-slide-down sticky top-0 z-50 border-b border-[#E5E7EB] bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        <button
          onClick={() => navigate(dashboardPath)}
          className="flex items-center gap-3 border-none bg-transparent cursor-pointer outline-none group"
        >
          <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-[#2563EB] text-xl text-white shadow-sm">
            📚
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#111827] group-hover:text-[#2563EB] transition-colors">
            Smart Library
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB]">
              <span className="text-lg">⭐</span>
              <div className="flex flex-col">
                <span className="text-xs text-[#6B7280] font-semibold leading-none">Points</span>
                <span className="text-sm font-bold text-[#111827] leading-none mt-0.5">{user?.points || 0}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="flex w-9 h-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-[#111827]">{user?.name || user?.email || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#EF4444] px-5 py-2.5 text-sm font-bold text-white cursor-pointer transition-colors hover:bg-red-600 border-none"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex w-11 h-11 items-center justify-center rounded-xl text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] cursor-pointer hover:text-[#111827] hover:bg-[#E5E7EB] transition-all"
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

      {mobileOpen && (
        <div className="md:hidden animate-slide-down border-t border-[#E5E7EB] p-5 pb-4 bg-white">
          <nav className="flex flex-col gap-2 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] border-l-4 border-[#2563EB]'
                      : 'text-[#374151] hover:text-[#111827] hover:bg-[#F3F4F6] border-l-4 border-transparent'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
            <div className="flex items-center gap-3">
              <span className="flex w-10 h-10 items-center justify-center rounded-full bg-[#2563EB] text-base font-bold text-white">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-[#111827]">{user?.name || user?.email || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] px-4 py-2 text-sm font-bold text-[#111827] cursor-pointer hover:bg-[#E5E7EB] transition-all"
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
