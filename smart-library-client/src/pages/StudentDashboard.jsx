import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [alerts, setAlerts] = useState({ dueSoon: [], overdue: [] });
  const [penaltyStats, setPenaltyStats] = useState({ totalPenalty: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, recentRes, alertsRes, issuesRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/my-recent-issues'),
          api.get('/dashboard/due-alerts'),
          api.get('/issues/my'),
        ]);

        setStats(statsRes.data);
        setRecentIssues(recentRes.data);
        setAlerts(alertsRes.data);

        const allIssues = issuesRes.data?.issues || [];
        const totalPenalty = allIssues.reduce((sum, issue) => {
          const penalty = issue.currentPenalty || issue.penaltyAmount || 0;
          if (!issue.penaltyPaid && penalty > 0) {
            return sum + penalty;
          }
          return sum;
        }, 0);

        setPenaltyStats({ totalPenalty });
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

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-[#111827]">
          🎓 Student <span className="text-[#2563EB]">Dashboard</span>
        </h1>
        <p className="mt-2 text-lg text-[#6B7280] font-medium">
          Welcome back, {user?.name || 'Student'}! Here&apos;s your reading journey.
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-50 p-4 text-base text-red-700 border border-red-200 font-medium shadow-sm">
          {error}
        </div>
      )}

      {!loading && (alerts.overdue.length > 0 || alerts.dueSoon.length > 0) && (
        <div className="animate-fade-in-up mt-6 space-y-4">
          {alerts.overdue.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-600">Overdue Books</h3>
                  <p className="text-sm text-red-500 mt-1 font-medium">Please return these books as soon as possible</p>
                  <div className="mt-4 space-y-3">
                    {alerts.overdue.map((issue) => {
                      const daysOverdue = Math.abs(getDaysRemaining(issue.dueDate));
                      return (
                        <div key={issue._id} className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm">
                          <div>
                            <p className="text-base font-bold text-[#111827]">{issue.bookId?.title}</p>
                            <p className="text-sm text-red-600 mt-1 font-medium">
                              Due: {formatDate(issue.dueDate)} ({daysOverdue} days overdue)
                            </p>
                          </div>
                          <button
                            onClick={() => navigate('/my-issues')}
                            className="px-4 py-2 text-sm font-bold bg-[#EF4444] text-white rounded-lg hover:bg-red-600 transition-all border-none cursor-pointer"
                          >
                            Return Now
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {alerts.dueSoon.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⏰</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-600">Due Soon</h3>
                  <p className="text-sm text-amber-600 mt-1 font-medium">These books are due within 3 days</p>
                  <div className="mt-4 space-y-3">
                    {alerts.dueSoon.map((issue) => {
                      const daysLeft = getDaysRemaining(issue.dueDate);
                      return (
                        <div key={issue._id} className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                          <div>
                            <p className="text-base font-bold text-[#111827]">{issue.bookId?.title}</p>
                            <p className="text-sm text-amber-700 mt-1 font-medium">
                              Due: {formatDate(issue.dueDate)} ({daysLeft} day{daysLeft !== 1 ? 's' : ''} left)
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#6B7280]">Currently Borrowed</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-[#10B981]">{stats?.issuedBooks ?? 0}</p>
              )}
            </div>
            <div className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl bg-emerald-50">📖</div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#6B7280]">Reading Points</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-[#F59E0B]">{user?.points ?? 0}</p>
              )}
            </div>
            <div className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl bg-amber-50">⭐</div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#6B7280]">Reader Level</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-4xl font-extrabold tracking-tight text-[#2563EB]">
                  {(user?.points || 0) >= 100 ? 'Expert' : (user?.points || 0) >= 50 ? 'Advanced' : 'Beginner'}
                </p>
              )}
            </div>
            <div className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl bg-blue-50">🎖️</div>
          </div>
        </div>
      </div>

      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#6B7280]">Active Issues</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-[#2563EB]">{stats?.issuedBooks ?? 0}</p>
              )}
            </div>
            <div className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl bg-blue-50">📚</div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#6B7280]">Overdue Books</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-[#EF4444]">{alerts?.overdue?.length ?? 0}</p>
              )}
            </div>
            <div className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl bg-red-50">⚠️</div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#6B7280]">Due Soon</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-[#F59E0B]">{alerts?.dueSoon?.length ?? 0}</p>
              )}
            </div>
            <div className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl bg-amber-50">⏰</div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#6B7280]">Total Penalty Due</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className={`mt-2 text-5xl font-extrabold tracking-tight ${penaltyStats.totalPenalty > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                  ₹{penaltyStats.totalPenalty}
                </p>
              )}
            </div>
            <div className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl bg-red-50">💰</div>
          </div>
        </div>
      </div>

      {!loading && recentIssues.length > 0 && (
        <div className="animate-fade-in-up mt-8 bg-white overflow-hidden rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <h3 className="text-xl font-bold text-[#111827]">Recently Issued Books</h3>
            </div>
            <button
              onClick={() => navigate('/my-issues')}
              className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors border-none bg-transparent cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#BFDBFE] transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-2xl">📖</div>
                  <div>
                    <p className="text-base font-bold text-[#111827]">{issue.bookId?.title}</p>
                    <p className="text-sm text-[#6B7280] mt-1">{issue.bookId?.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280] font-medium">Issued</p>
                  <p className="text-sm font-bold text-[#111827]">{formatDate(issue.issueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stagger mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
        <button
          onClick={() => navigate('/books')}
          className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-6 transition-all duration-300 hover:shadow-md group border border-[#E5E7EB] cursor-pointer text-left shadow-sm"
        >
          <span className="flex w-14 h-14 items-center justify-center rounded-xl bg-[#EFF6FF] text-3xl transition-transform duration-300 group-hover:scale-105">
            📚
          </span>
          <div>
            <p className="font-extrabold text-[#111827] text-xl">Browse Books</p>
            <p className="text-sm text-[#6B7280] font-medium mt-1">Search and issue available books</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/my-issues')}
          className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-6 transition-all duration-300 hover:shadow-md group border border-[#E5E7EB] cursor-pointer text-left shadow-sm"
        >
          <span className="flex w-14 h-14 items-center justify-center rounded-xl bg-[#EFF6FF] text-3xl transition-transform duration-300 group-hover:scale-105">
            📖
          </span>
          <div>
            <p className="font-extrabold text-[#111827] text-xl">My Issues</p>
            <p className="text-sm text-[#6B7280] font-medium mt-1">View and return your books</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default StudentDashboard;
