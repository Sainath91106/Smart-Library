import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const statConfig = [
  {
    key: 'totalBooks',
    label: 'Total Books',
    icon: '📚',
    gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    bgGlow: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.15) 0%, transparent 60%)',
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: '👥',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    bgGlow: 'radial-gradient(circle at 80% 20%, rgba(168,85,247,0.15) 0%, transparent 60%)',
  },
  {
    key: 'issuedBooks',
    label: 'Issued Books',
    icon: '📖',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    bgGlow: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.15) 0%, transparent 60%)',
  },
  {
    key: 'availableBooks',
    label: 'Available Books',
    icon: '✅',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    bgGlow: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.15) 0%, transparent 60%)',
  },
];

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, overdueRes, recentRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/overdue'),
          api.get('/dashboard/recent-issues'),
        ]);
        setStats(statsRes.data);
        setOverdueBooks(overdueRes.data);
        setRecentIssues(recentRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          👨‍💼 Admin <span className="text-gradient">Control Panel</span>
        </h1>
        <p className="mt-2 text-slate-400">
          Welcome, {user?.name || 'Administrator'}. Monitor and manage your library system
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Admin Stats - 4 Cards */}
      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((card) => (
          <div
            key={card.key}
            className="glass-light animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6"
            style={{ backgroundImage: card.bgGlow }}
          >
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-400 mb-1">{card.label}</p>
                {loading ? (
                  <div className="skeleton mt-3 h-9 w-20" />
                ) : (
                  <p className="text-4xl font-extrabold tracking-tight text-white">
                    {stats?.[card.key] ?? 0}
                  </p>
                )}
              </div>
              <div
                className="flex w-14 h-14 items-center justify-center rounded-xl text-2xl shadow-lg"
                style={{ background: card.gradient }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OVERDUE BOOKS TABLE (VERY IMPORTANT) */}
      {!loading && overdueBooks.length > 0 && (
        <div className="animate-fade-in-up mt-8 glass overflow-hidden rounded-2xl border border-red-500/30 shadow-2xl">
          <div className="flex items-center gap-3 p-6 pb-4 border-b border-red-500/30 bg-gradient-to-r from-red-500/20 to-orange-500/10">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-xl font-bold text-white">Overdue Books - Immediate Action Required</h3>
            <span className="ml-auto px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-sm font-bold border border-red-500/40 backdrop-blur-sm">
              {overdueBooks.length} overdue
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Days Overdue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {overdueBooks.map((issue) => (
                  <tr key={issue._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-white">{issue.userId?.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{issue.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{issue.bookId?.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{issue.bookId?.author}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-300">{formatDate(issue.dueDate)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-sm font-bold border border-red-500/40">
                        {issue.daysOverdue} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Issues List */}
      {!loading && recentIssues.length > 0 && (
        <div className="animate-fade-in-up mt-8 glass overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <h3 className="text-xl font-bold text-white">Recent Issues</h3>
            </div>
            <button
              onClick={() => navigate('/my-issues')}
              className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex w-12 h-12 items-center justify-center rounded-xl text-xl shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                  >
                    📖
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{issue.bookId?.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Issued to: <span className="text-blue-400">{issue.userId?.name}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Issued</p>
                  <p className="text-sm font-semibold text-slate-300 mt-0.5">{formatDate(issue.issueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Admin Actions */}
      <div className="stagger mt-8 grid gap-5 grid-cols-1 md:grid-cols-3">
        <button
          onClick={() => navigate('/books')}
          className="animate-fade-in-up glass-light card-hover flex items-center gap-5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 hover:shadow-2xl transition-all group cursor-pointer text-left"
        >
          <span
            className="flex w-14 h-14 items-center justify-center rounded-xl text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            ➕
          </span>
          <div>
            <p className="font-bold text-white text-base">Add Book</p>
            <p className="text-sm text-slate-400 mt-1">Add new books to catalog</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/books')}
          className="animate-fade-in-up glass-light card-hover flex items-center gap-5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 hover:shadow-2xl transition-all group cursor-pointer text-left"
        >
          <span
            className="flex w-14 h-14 items-center justify-center rounded-xl text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          >
            📚
          </span>
          <div>
            <p className="font-bold text-white text-base">Manage Books</p>
            <p className="text-sm text-slate-400 mt-1">Edit and manage catalog</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/my-issues')}
          className="animate-fade-in-up glass-light card-hover flex items-center gap-5 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 hover:shadow-2xl transition-all group cursor-pointer text-left"
        >
          <span
            className="flex w-14 h-14 items-center justify-center rounded-xl text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
          >
            👥
          </span>
          <div>
            <p className="font-bold text-white text-base">View All Issues</p>
            <p className="text-sm text-slate-400 mt-1">Monitor all transactions</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default AdminDashboard;
