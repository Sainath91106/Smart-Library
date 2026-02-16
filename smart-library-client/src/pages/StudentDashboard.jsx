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
        
        // Calculate total penalty from all issues
        const allIssues = issuesRes.data?.issues || [];
        const totalPenalty = allIssues.reduce((sum, issue) => {
          const penalty = issue.currentPenalty || issue.penaltyAmount || 0;
          // Only count unpaid penalties
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome header */}
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🎓 Student{' '}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="mt-2 text-lg text-slate-600 font-medium">
          Welcome back, {user?.name || 'Student'}! Here's your reading journey.
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 p-4 text-base text-red-700 border-2 border-red-300 font-medium shadow-md">
          {error}
        </div>
      )}

      {/* Alerts Section - Overdue and Due Soon */}
      {!loading && (alerts.overdue.length > 0 || alerts.dueSoon.length > 0) && (
        <div className="animate-fade-in-up mt-6 space-y-4">
          {alerts.overdue.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border-l-4 border-red-500 shadow-xl shadow-red-500/10">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-600">Overdue Books</h3>
                  <p className="text-sm text-red-500 mt-1 font-medium">Please return these books as soon as possible</p>
                  <div className="mt-4 space-y-3">
                    {alerts.overdue.map((issue) => {
                      const daysOverdue = Math.abs(getDaysRemaining(issue.dueDate));
                      return (
                        <div
                          key={issue._id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 shadow-md"
                        >
                          <div>
                            <p className="text-base font-bold text-slate-900">{issue.bookId?.title}</p>
                            <p className="text-sm text-red-600 mt-1 font-medium">
                              Due: {formatDate(issue.dueDate)} ({daysOverdue} days overdue)
                            </p>
                          </div>
                          <button
                            onClick={() => navigate('/my-issues')}
                            className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-md border-none cursor-pointer"
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
            <div className="bg-white rounded-2xl p-6 border-l-4 border-amber-500 shadow-xl shadow-amber-500/10">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⏰</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-600">Due Soon</h3>
                  <p className="text-sm text-amber-500 mt-1 font-medium">These books are due within 3 days</p>
                  <div className="mt-4 space-y-3">
                    {alerts.dueSoon.map((issue) => {
                      const daysLeft = getDaysRemaining(issue.dueDate);
                      return (
                        <div
                          key={issue._id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-md"
                        >
                          <div>
                            <p className="text-base font-bold text-slate-900">{issue.bookId?.title}</p>
                            <p className="text-sm text-amber-600 mt-1 font-medium">
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

      {/* Student Stats */}
      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-emerald-200 shadow-emerald-500/10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600">Currently Borrowed</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-emerald-600">
                  {stats?.issuedBooks ?? 0}
                </p>
              )}
            </div>
            <div
              className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
              }}
            >
              📖
            </div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-amber-200 shadow-amber-500/10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600">Reading Points</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-amber-600">
                  {user?.points ?? 0}
                </p>
              )}
            </div>
            <div
              className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #eab308)',
              }}
            >
              ⭐
            </div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-purple-200 shadow-purple-500/10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600">Reader Level</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-4xl font-extrabold tracking-tight text-purple-600">
                  {(user?.points || 0) >= 100 ? 'Expert' : (user?.points || 0) >= 50 ? 'Advanced' : 'Beginner'}
                </p>
              )}
            </div>
            <div
              className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              }}
            >
              🎖️
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Monitoring Stats - NEW SECTION */}
      <div className="stagger mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-indigo-200 shadow-indigo-500/10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600">Active Issues</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-indigo-600">
                  {stats?.issuedBooks ?? 0}
                </p>
              )}
            </div>
            <div
              className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}
            >
              📚
            </div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-red-200 shadow-red-500/10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600">Overdue Books</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-red-600">
                  {alerts?.overdue?.length ?? 0}
                </p>
              )}
            </div>
            <div
              className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              }}
            >
              ⚠️
            </div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-yellow-200 shadow-yellow-500/10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600">Due Soon</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-yellow-600">
                  {alerts?.dueSoon?.length ?? 0}
                </p>
              )}
            </div>
            <div
              className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #eab308, #f59e0b)',
              }}
            >
              ⏰
            </div>
          </div>
        </div>

        <div className="bg-white animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-rose-200 shadow-rose-500/10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600">Total Penalty Due</p>
              {loading ? (
                <div className="skeleton mt-3 h-9 w-20" />
              ) : (
                <p className={`mt-2 text-5xl font-extrabold tracking-tight ${penaltyStats.totalPenalty > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ₹{penaltyStats.totalPenalty}
                </p>
              )}
            </div>
            <div
              className="flex w-14 h-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #fb7185, #e11d48)',
              }}
            >
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Recently Issued Books */}
      {!loading && recentIssues.length > 0 && (
        <div className="animate-fade-in-up mt-8 bg-white overflow-hidden rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <h3 className="text-xl font-bold text-slate-900">Recently Issued Books</h3>
            </div>
            <button
              onClick={() => navigate('/my-issues')}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors border-none bg-transparent cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border-2 border-slate-200 hover:border-indigo-300 transition-all shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl shadow-lg">
                    📖
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{issue.bookId?.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{issue.bookId?.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Issued</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(issue.issueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="stagger mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
        <button
          onClick={() => navigate('/books')}
          className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 group border-2 border-indigo-200 cursor-pointer text-left shadow-xl"
        >
          <span className="flex w-14 h-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl transition-transform duration-300 group-hover:scale-110 shadow-lg">
            📚
          </span>
          <div>
            <p className="font-extrabold text-slate-900 text-xl">Browse Books</p>
            <p className="text-sm text-slate-600 font-medium mt-1">Search and issue available books</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/my-issues')}
          className="bg-white animate-fade-in-up flex items-center gap-4 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group border-2 border-purple-200 cursor-pointer text-left shadow-xl"
        >
          <span className="flex w-14 h-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-3xl transition-transform duration-300 group-hover:scale-110 shadow-lg">
            📖
          </span>
          <div>
            <p className="font-extrabold text-slate-900 text-xl">My Issues</p>
            <p className="text-sm text-slate-600 font-medium mt-1">View and return your books</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default StudentDashboard;
