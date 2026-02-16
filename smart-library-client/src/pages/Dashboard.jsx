import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const statConfig = [
  {
    key: 'totalBooks',
    label: 'Total Books',
    icon: '📚',
    gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    shadow: '0 10px 25px rgba(99,102,241,0.2)',
    bgGlow: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.15) 0%, transparent 60%)',
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: '👥',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    shadow: '0 10px 25px rgba(168,85,247,0.2)',
    bgGlow: 'radial-gradient(circle at 80% 20%, rgba(168,85,247,0.15) 0%, transparent 60%)',
  },
  {
    key: 'issuedBooks',
    label: 'Issued Books',
    icon: '📖',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    shadow: '0 10px 25px rgba(16,185,129,0.2)',
    bgGlow: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.15) 0%, transparent 60%)',
  },
];

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

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
      {/* Welcome header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          {isAdmin ? '👨‍💼 Admin ' : '🎓 Student '} 
          <span className="text-gradient">
            Dashboard
          </span>
        </h1>
        <p className="mt-2 text-slate-400">
          {isAdmin 
            ? `Manage your library system efficiently, ${user?.name || 'Admin'}` 
            : `Welcome back, ${user?.name || 'Student'}! Here's your reading journey.`}
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Stat cards */}
      {isAdmin ? (
        /* Admin Stats */
        <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {statConfig.map((card) => (
            <div
              key={card.key}
              className="glass-light animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 cursor-default"
              style={{
                backgroundImage: card.bgGlow,
              }}
            >
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{card.label}</p>
                  {loading ? (
                    <div className="skeleton mt-3 h-9 w-20" />
                  ) : (
                    <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">
                      {stats?.[card.key] ?? 0}
                    </p>
                  )}
                </div>
                <div
                  className="flex w-12 h-12 items-center justify-center rounded-2xl text-xl"
                  style={{
                    background: card.gradient,
                    boxShadow: card.shadow,
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Student Stats */
        <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass-light animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6">
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Books Issued</p>
                {loading ? (
                  <div className="skeleton mt-3 h-9 w-20" />
                ) : (
                  <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">
                    {stats?.issuedBooks ?? 0}
                  </p>
                )}
              </div>
              <div
                className="flex w-12 h-12 items-center justify-center rounded-2xl text-xl"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                  boxShadow: '0 10px 25px rgba(16,185,129,0.2)',
                }}
              >
                📖
              </div>
            </div>
          </div>
          
          <div className="glass-light animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6">
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Reading Points</p>
                {loading ? (
                  <div className="skeleton mt-3 h-9 w-20" />
                ) : (
                  <p className="mt-2 text-4xl font-extrabold tracking-tight text-amber-300">
                    {user?.points ?? 0}
                  </p>
                )}
              </div>
              <div
                className="flex w-12 h-12 items-center justify-center rounded-2xl text-xl"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                  boxShadow: '0 10px 25px rgba(245,158,11,0.2)',
                }}
              >
                ⭐
              </div>
            </div>
          </div>
          
          <div className="glass-light animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6">
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Reader Level</p>
                {loading ? (
                  <div className="skeleton mt-3 h-9 w-20" />
                ) : (
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-purple-300">
                    {(user?.points || 0) >= 100 ? 'Expert' : (user?.points || 0) >= 50 ? 'Advanced' : 'Beginner'}
                  </p>
                )}
              </div>
              <div
                className="flex w-12 h-12 items-center justify-center rounded-2xl text-xl"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  boxShadow: '0 10px 25px rgba(168,85,247,0.2)',
                }}
              >
                🎖️
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Admin System Overview */}
      {isAdmin && !loading && (
        <div className="animate-fade-in-up mt-6 glass-light overflow-hidden rounded-2xl p-6 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚙️</span>
            <h3 className="text-lg font-bold text-white">System Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Available Books */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">
                ✅
              </div>
              <div>
                <p className="text-sm text-emerald-300/70">Books Available</p>
                <p className="text-xl font-bold text-emerald-300">
                  {stats?.totalBooks - stats?.issuedBooks || 0}
                </p>
              </div>
            </div>
            
            {/* Active Students */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-blue-500/20 text-2xl">
                👨‍🎓
              </div>
              <div>
                <p className="text-sm text-blue-300/70">Active Students</p>
                <p className="text-xl font-bold text-blue-300">
                  {stats?.totalUsers || 0}
                </p>
              </div>
            </div>
            
            {/* Active Issues */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-amber-500/20 text-2xl">
                ⏳
              </div>
              <div>
                <p className="text-sm text-amber-300/70">Active Issues</p>
                <p className="text-xl font-bold text-amber-300">
                  {stats?.issuedBooks || 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick tip */}
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">💡 Admin Tip:</span> Monitor overdue books regularly and manage user accounts efficiently.
            </p>
          </div>
        </div>
      )}
      
      {/* Student Gamification Card */}
      {user?.role === 'student' && !loading && (
        <div className="animate-fade-in-up mt-6 glass-light overflow-hidden rounded-2xl p-6 border border-amber-500/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏆</span>
                <h3 className="text-lg font-bold text-white">Your Reading Progress</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Reading Points */}
                <div className="flex flex-col p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-2xl mb-1">⭐</span>
                  <span className="text-2xl font-bold text-amber-300">{user?.points || 0}</span>
                  <span className="text-xs text-amber-300/70 mt-0.5">Reading Points</span>
                </div>
                
                {/* Books Read */}
                <div className="flex flex-col p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-2xl mb-1">📚</span>
                  <span className="text-2xl font-bold text-emerald-300">{stats?.issuedBooks || 0}</span>
                  <span className="text-xs text-emerald-300/70 mt-0.5">Books Issued</span>
                </div>
                
                {/* Achievement Badge */}
                <div className="flex flex-col p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-2xl mb-1">🎖️</span>
                  <span className="text-lg font-bold text-purple-300">
                    {(user?.points || 0) >= 100 ? 'Expert' : (user?.points || 0) >= 50 ? 'Advanced' : 'Beginner'}
                  </span>
                  <span className="text-xs text-purple-300/70 mt-0.5">Reader Level</span>
                </div>
                
                {/* Next Milestone */}
                <div className="flex flex-col p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-2xl mb-1">🎯</span>
                  <span className="text-2xl font-bold text-indigo-300">
                    {(user?.points || 0) >= 100 ? '150' : (user?.points || 0) >= 50 ? '100' : '50'}
                  </span>
                  <span className="text-xs text-indigo-300/70 mt-0.5">Next Goal</span>
                </div>
              </div>
              
              {/* Progress tip */}
              <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">💡 Tip:</span> Return books on time to earn bonus points!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick-links */}
      <div className="stagger mt-10 grid gap-4 grid-cols-1 md:grid-cols-2">
        {isAdmin ? (
          /* Admin Quick Links */
          <>
            <a
              href="/books"
              className="glass-light animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:bg-white/10 group"
            >
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-indigo-500/20 text-lg transition-transform duration-300 group-hover:scale-110">
                📚
              </span>
              <div>
                <p className="font-semibold text-white">Manage Books</p>
                <p className="text-sm text-slate-400">Add, edit and manage library catalog</p>
              </div>
            </a>
            <a
              href="/my-issues"
              className="glass-light animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:bg-white/10 group"
            >
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-purple-500/20 text-lg transition-transform duration-300 group-hover:scale-110">
                📋
              </span>
              <div>
                <p className="font-semibold text-white">All Issues</p>
                <p className="text-sm text-slate-400">Monitor all book issues and returns</p>
              </div>
            </a>
          </>
        ) : (
          /* Student Quick Links */
          <>
            <a
              href="/books"
              className="glass-light animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:bg-white/10 group"
            >
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-indigo-500/20 text-lg transition-transform duration-300 group-hover:scale-110">
                📚
              </span>
              <div>
                <p className="font-semibold text-white">Browse Books</p>
                <p className="text-sm text-slate-400">Search, filter and issue available books</p>
              </div>
            </a>
            <a
              href="/my-issues"
              className="glass-light animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-300 hover:bg-white/10 group"
            >
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-purple-500/20 text-lg transition-transform duration-300 group-hover:scale-110">
                📖
              </span>
              <div>
                <p className="font-semibold text-white">My Issues</p>
                <p className="text-sm text-slate-400">View and return your currently issued books</p>
              </div>
            </a>
          </>
        )}
      </div>
    </section>
  );
}

export default Dashboard;

