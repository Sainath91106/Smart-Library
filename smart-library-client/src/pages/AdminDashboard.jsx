import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const statConfig = [
  {
    key: 'totalBooks',
    label: 'Total Books',
    icon: '📚',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    bgGlow: 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
    borderColor: 'border-indigo-200',
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: '👥',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    bgGlow: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    borderColor: 'border-pink-200',
  },
  {
    key: 'issuedBooks',
    label: 'Issued Books',
    icon: '📖',
    gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
    bgGlow: 'linear-gradient(135deg, #dcfce7, #d1fae5)',
    borderColor: 'border-emerald-200',
  },
  {
    key: 'availableBooks',
    label: 'Available Books',
    icon: '✅',
    gradient: 'linear-gradient(135deg, #f59e0b, #fb923c)',
    bgGlow: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
    borderColor: 'border-amber-200',
  },
  {
    key: 'overdueBooks',
    label: 'Overdue Books',
    icon: '⚠️',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    bgGlow: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    borderColor: 'border-red-200',
  },
  {
    key: 'totalPendingPenalties',
    label: 'Pending Penalties',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #fb7185, #e11d48)',
    bgGlow: 'linear-gradient(135deg, #ffe4e6, #fecdd3)',
    borderColor: 'border-rose-200',
    prefix: '₹',
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
        
        // Calculate total pending penalties from overdue books
        const totalPendingPenalties = overdueRes.data.reduce((sum, issue) => {
          return sum + (issue.penaltyAmount || 0);
        }, 0);
        
        // Extend stats with overdueBooks count and total penalties
        const enrichedStats = {
          ...statsRes.data,
          overdueBooks: overdueRes.data.length,
          totalPendingPenalties,
        };
        
        setStats(enrichedStats);
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
        <h1 className="text-4xl font-bold text-slate-800">
          👨‍💼 Admin <span className="text-gradient">Control Panel</span>
        </h1>
        <p className="mt-2 text-slate-600 text-base">
          Welcome, {user?.name || 'Administrator'}. Monitor and manage your library system
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200 font-medium">
          {error}
        </div>
      )}

      {/* Admin Stats - 6 Cards */}
      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statConfig.map((card) => (
          <div
            key={card.key}
            className={`animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 bg-white border-2 ${card.borderColor} shadow-lg`}
            style={{ background: card.bgGlow }}
          >
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-2">{card.label}</p>
                {loading ? (
                  <div className="skeleton mt-3 h-10 w-20" />
                ) : (
                  <p className="text-4xl font-extrabold tracking-tight text-slate-800">
                    {card.prefix ? `${card.prefix}${stats?.[card.key] ?? 0}` : (stats?.[card.key] ?? 0)}
                  </p>
                )}
              </div>
              <div
                className="flex w-16 h-16 items-center justify-center rounded-xl text-2xl shadow-xl"
                style={{ background: card.gradient }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OVERDUE BOOKS MONITOR - SYSTEM WIDE */}
      {!loading && overdueBooks.length > 0 && (
        <div className="animate-fade-in-up mt-8 bg-white overflow-hidden rounded-2xl border-2 border-red-300 shadow-2xl">
          <div className="flex items-center gap-3 p-6 pb-4 border-b-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-xl font-bold text-red-700">Overdue Books Monitor</h3>
            <span className="ml-auto px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-bold border-2 border-red-300">
              {overdueBooks.length} overdue
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-slate-200">
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Book Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Penalty Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {overdueBooks.map((issue) => (
                  <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{issue.userId?.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{issue.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{issue.bookId?.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{issue.bookId?.author}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-700">{formatDate(issue.dueDate)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-bold border-2 border-red-300">
                        {issue.daysOverdue} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${issue.penaltyAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        ₹{issue.penaltyAmount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-2 border-red-300 shadow-md">
                        OVERDUE
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
        <div className="animate-fade-in-up mt-8 bg-white overflow-hidden rounded-2xl border-2 border-slate-200 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <h3 className="text-xl font-bold text-slate-800">Recent Issues</h3>
            </div>
            <button
              onClick={() => navigate('/my-issues')}
              className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex w-12 h-12 items-center justify-center rounded-xl text-xl shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    📖
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{issue.bookId?.title}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Issued to: <span className="text-indigo-600 font-semibold">{issue.userId?.name}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Issued</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{formatDate(issue.issueDate)}</p>
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
          className="animate-fade-in-up bg-white card-hover flex items-center gap-5 rounded-2xl p-6 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-2xl transition-all group cursor-pointer text-left"
        >
          <span
            className="flex w-16 h-16 items-center justify-center rounded-xl text-2xl shadow-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            ➕
          </span>
          <div>
            <p className="font-bold text-slate-800 text-lg">Add Book</p>
            <p className="text-sm text-slate-600 mt-1">Add new books to catalog</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/books')}
          className="animate-fade-in-up bg-white card-hover flex items-center gap-5 rounded-2xl p-6 border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all group cursor-pointer text-left"
        >
          <span
            className="flex w-16 h-16 items-center justify-center rounded-xl text-2xl shadow-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}
          >
            📚
          </span>
          <div>
            <p className="font-bold text-slate-800 text-lg">Manage Books</p>
            <p className="text-sm text-slate-600 mt-1">Edit and manage catalog</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/my-issues')}
          className="animate-fade-in-up bg-white card-hover flex items-center gap-5 rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl transition-all group cursor-pointer text-left"
        >
          <span
            className="flex w-16 h-16 items-center justify-center rounded-xl text-2xl shadow-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}
          >
            👥
          </span>
          <div>
            <p className="font-bold text-slate-800 text-lg">View All Issues</p>
            <p className="text-sm text-slate-600 mt-1">Monitor all transactions</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default AdminDashboard;
