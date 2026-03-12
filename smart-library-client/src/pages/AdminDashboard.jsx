import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const statConfig = [
  { key: 'totalBooks', label: 'Total Books', icon: '📚', valueColor: 'text-[#2563EB]', iconBg: 'bg-blue-50' },
  { key: 'totalUsers', label: 'Total Users', icon: '👥', valueColor: 'text-[#2563EB]', iconBg: 'bg-blue-50' },
  { key: 'issuedBooks', label: 'Issued Books', icon: '📖', valueColor: 'text-[#10B981]', iconBg: 'bg-emerald-50' },
  { key: 'availableBooks', label: 'Available Books', icon: '✅', valueColor: 'text-[#F59E0B]', iconBg: 'bg-amber-50' },
  { key: 'overdueBooks', label: 'Overdue Books', icon: '⚠️', valueColor: 'text-[#EF4444]', iconBg: 'bg-red-50' },
  {
    key: 'totalPendingPenalties',
    label: 'Pending Penalties',
    icon: '💰',
    valueColor: 'text-[#EF4444]',
    iconBg: 'bg-red-50',
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

        const totalPendingPenalties = overdueRes.data.reduce((sum, issue) => sum + (issue.penaltyAmount || 0), 0);

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
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-bold text-[#111827]">
          👨‍💼 Admin <span className="text-[#2563EB]">Control Panel</span>
        </h1>
        <p className="mt-2 text-[#6B7280] text-base">
          Welcome, {user?.name || 'Administrator'}. Monitor and manage your library system.
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200 font-medium">
          {error}
        </div>
      )}

      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statConfig.map((card) => (
          <div
            key={card.key}
            className="animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 bg-white border border-[#E5E7EB] shadow-sm"
          >
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#6B7280] mb-2">{card.label}</p>
                {loading ? (
                  <div className="skeleton mt-3 h-10 w-20" />
                ) : (
                  <p className={`text-4xl font-extrabold tracking-tight ${card.valueColor}`}>
                    {card.prefix ? `${card.prefix}${stats?.[card.key] ?? 0}` : stats?.[card.key] ?? 0}
                  </p>
                )}
              </div>
              <div className={`flex w-16 h-16 items-center justify-center rounded-xl text-2xl ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && overdueBooks.length > 0 && (
        <div className="animate-fade-in-up mt-8 bg-white overflow-hidden rounded-2xl border border-red-200 shadow-sm">
          <div className="flex items-center gap-3 p-6 pb-4 border-b border-red-200 bg-red-50">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-xl font-bold text-red-700">Overdue Books Monitor</h3>
            <span className="ml-auto px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-bold border border-red-200">
              {overdueBooks.length} overdue
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#E5E7EB]">
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Book Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Days Overdue</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Penalty Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {overdueBooks.map((issue) => (
                  <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{issue.userId?.name}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{issue.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{issue.bookId?.title}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{issue.bookId?.author}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-[#111827]">{formatDate(issue.dueDate)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-bold border border-red-200">
                        {issue.daysOverdue} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${issue.penaltyAmount > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                        ₹{issue.penaltyAmount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 shadow-sm">
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

      {!loading && recentIssues.length > 0 && (
        <div className="animate-fade-in-up mt-8 bg-white overflow-hidden rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <h3 className="text-xl font-bold text-[#111827]">Recent Issues</h3>
            </div>
            <button
              onClick={() => navigate('/my-issues')}
              className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-all"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#BFDBFE] hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex w-12 h-12 items-center justify-center rounded-xl text-xl bg-[#EFF6FF]">📖</div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{issue.bookId?.title}</p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Issued to: <span className="text-[#2563EB] font-semibold">{issue.userId?.name}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280] font-medium">Issued</p>
                  <p className="text-sm font-bold text-[#111827] mt-0.5">{formatDate(issue.issueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stagger mt-8 grid gap-5 grid-cols-1 md:grid-cols-3">
        <button
          onClick={() => navigate('/books')}
          className="animate-fade-in-up bg-white card-hover flex items-center gap-5 rounded-2xl p-6 border border-[#E5E7EB] hover:shadow-md transition-all group cursor-pointer text-left"
        >
          <span className="flex w-16 h-16 items-center justify-center rounded-xl text-2xl bg-[#EFF6FF] transition-transform duration-300 group-hover:scale-105">
            ➕
          </span>
          <div>
            <p className="font-bold text-[#111827] text-lg">Add Book</p>
            <p className="text-sm text-[#6B7280] mt-1">Add new books to catalog</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/books')}
          className="animate-fade-in-up bg-white card-hover flex items-center gap-5 rounded-2xl p-6 border border-[#E5E7EB] hover:shadow-md transition-all group cursor-pointer text-left"
        >
          <span className="flex w-16 h-16 items-center justify-center rounded-xl text-2xl bg-[#EFF6FF] transition-transform duration-300 group-hover:scale-105">
            📚
          </span>
          <div>
            <p className="font-bold text-[#111827] text-lg">Manage Books</p>
            <p className="text-sm text-[#6B7280] mt-1">Edit and manage catalog</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/my-issues')}
          className="animate-fade-in-up bg-white card-hover flex items-center gap-5 rounded-2xl p-6 border border-[#E5E7EB] hover:shadow-md transition-all group cursor-pointer text-left"
        >
          <span className="flex w-16 h-16 items-center justify-center rounded-xl text-2xl bg-[#EFF6FF] transition-transform duration-300 group-hover:scale-105">
            👥
          </span>
          <div>
            <p className="font-bold text-[#111827] text-lg">View All Issues</p>
            <p className="text-sm text-[#6B7280] mt-1">Monitor all transactions</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default AdminDashboard;
