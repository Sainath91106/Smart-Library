import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const statConfig = [
  { key: 'totalBooks', label: 'Total Books', icon: '📚', valueColor: 'text-[#2563EB]' },
  { key: 'totalUsers', label: 'Total Users', icon: '👥', valueColor: 'text-[#2563EB]' },
  { key: 'issuedBooks', label: 'Issued Books', icon: '📖', valueColor: 'text-[#10B981]' },
];

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#111827]">
          {isAdmin ? '👨‍💼 Admin ' : '🎓 Student '} <span className="text-[#2563EB]">Dashboard</span>
        </h1>
        <p className="mt-2 text-[#6B7280]">
          {isAdmin
            ? `Manage your library system efficiently, ${user?.name || 'Admin'}`
            : `Welcome back, ${user?.name || 'Student'}! Here's your reading journey.`}
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statConfig
          .filter((card) => (isAdmin ? true : card.key !== 'totalUsers'))
          .map((card) => (
            <div key={card.key} className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">{card.label}</p>
                  {loading ? (
                    <div className="skeleton mt-3 h-9 w-20" />
                  ) : (
                    <p className={`mt-2 text-4xl font-extrabold tracking-tight ${card.valueColor}`}>{stats?.[card.key] ?? 0}</p>
                  )}
                </div>
                <div className="flex w-12 h-12 items-center justify-center rounded-xl text-xl bg-[#EFF6FF]">{card.icon}</div>
              </div>
            </div>
          ))}
      </div>

      {isAdmin && !loading && (
        <div className="animate-fade-in-up mt-6 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚙️</span>
            <h3 className="text-lg font-bold text-[#111827]">System Overview</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-white text-2xl">✅</div>
              <div>
                <p className="text-sm text-[#6B7280]">Books Available</p>
                <p className="text-xl font-bold text-[#10B981]">{stats?.totalBooks - stats?.issuedBooks || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-white text-2xl">👨‍🎓</div>
              <div>
                <p className="text-sm text-[#6B7280]">Active Students</p>
                <p className="text-xl font-bold text-[#2563EB]">{stats?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-white text-2xl">⏳</div>
              <div>
                <p className="text-sm text-[#6B7280]">Active Issues</p>
                <p className="text-xl font-bold text-[#F59E0B]">{stats?.issuedBooks || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'student' && !loading && (
        <div className="animate-fade-in-up mt-6 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏆</span>
            <h3 className="text-lg font-bold text-[#111827]">Your Reading Progress</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col p-3 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-2xl mb-1">⭐</span>
              <span className="text-2xl font-bold text-[#F59E0B]">{user?.points || 0}</span>
              <span className="text-xs text-[#6B7280] mt-0.5">Reading Points</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-2xl mb-1">📚</span>
              <span className="text-2xl font-bold text-[#10B981]">{stats?.issuedBooks || 0}</span>
              <span className="text-xs text-[#6B7280] mt-0.5">Books Issued</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-2xl mb-1">🎖️</span>
              <span className="text-lg font-bold text-[#2563EB]">
                {(user?.points || 0) >= 100 ? 'Expert' : (user?.points || 0) >= 50 ? 'Advanced' : 'Beginner'}
              </span>
              <span className="text-xs text-[#6B7280] mt-0.5">Reader Level</span>
            </div>
            <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xl mb-1">🎯</span>
              <span className="text-2xl font-bold text-[#111827]">
                {(user?.points || 0) >= 100 ? '150' : (user?.points || 0) >= 50 ? '100' : '50'}
              </span>
              <span className="text-xs text-[#6B7280] mt-0.5">Next Goal</span>
            </div>
          </div>
        </div>
      )}

      <div className="stagger mt-10 grid gap-4 grid-cols-1 md:grid-cols-2">
        {isAdmin ? (
          <>
            <a href="/books" className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:shadow-md group border border-[#E5E7EB]">
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-lg transition-transform duration-300 group-hover:scale-105">📚</span>
              <div>
                <p className="font-semibold text-[#111827]">Manage Books</p>
                <p className="text-sm text-[#6B7280]">Add, edit and manage library catalog</p>
              </div>
            </a>
            <a href="/my-issues" className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:shadow-md group border border-[#E5E7EB]">
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-lg transition-transform duration-300 group-hover:scale-105">📋</span>
              <div>
                <p className="font-semibold text-[#111827]">All Issues</p>
                <p className="text-sm text-[#6B7280]">Monitor all book issues and returns</p>
              </div>
            </a>
          </>
        ) : (
          <>
            <a href="/books" className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:shadow-md group border border-[#E5E7EB]">
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-lg transition-transform duration-300 group-hover:scale-105">📚</span>
              <div>
                <p className="font-semibold text-[#111827]">Browse Books</p>
                <p className="text-sm text-[#6B7280]">Search, filter and issue available books</p>
              </div>
            </a>
            <a href="/my-issues" className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:shadow-md group border border-[#E5E7EB]">
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-lg transition-transform duration-300 group-hover:scale-105">📖</span>
              <div>
                <p className="font-semibold text-[#111827]">My Issues</p>
                <p className="text-sm text-[#6B7280]">View and return your currently issued books</p>
              </div>
            </a>
          </>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
