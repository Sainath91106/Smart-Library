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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, recentRes, alertsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/my-recent-issues'),
          api.get('/dashboard/due-alerts'),
        ]);
        setStats(statsRes.data);
        setRecentIssues(recentRes.data);
        setAlerts(alertsRes.data);
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
        <h1 className="text-3xl font-bold text-white">
          🎓 Student{' '}
          <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="mt-2 text-slate-400">
          Welcome back, {user?.name || 'Student'}! Here's your reading journey.
        </p>
      </div>

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Alerts Section - Overdue and Due Soon */}
      {!loading && (alerts.overdue.length > 0 || alerts.dueSoon.length > 0) && (
        <div className="animate-fade-in-up mt-6 space-y-3">
          {alerts.overdue.length > 0 && (
            <div className="glass-light rounded-xl p-4 border-l-4 border-red-500 bg-red-500/5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-400">Overdue Books</h3>
                  <p className="text-sm text-red-300/70 mt-1">Please return these books as soon as possible</p>
                  <div className="mt-3 space-y-2">
                    {alerts.overdue.map((issue) => {
                      const daysOverdue = Math.abs(getDaysRemaining(issue.dueDate));
                      return (
                        <div
                          key={issue._id}
                          className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">{issue.bookId?.title}</p>
                            <p className="text-xs text-red-300/70 mt-0.5">
                              Due: {formatDate(issue.dueDate)} ({daysOverdue} days overdue)
                            </p>
                          </div>
                          <button
                            onClick={() => navigate('/my-issues')}
                            className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
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
            <div className="glass-light rounded-xl p-4 border-l-4 border-amber-500 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-400">Due Soon</h3>
                  <p className="text-sm text-amber-300/70 mt-1">These books are due within 3 days</p>
                  <div className="mt-3 space-y-2">
                    {alerts.dueSoon.map((issue) => {
                      const daysLeft = getDaysRemaining(issue.dueDate);
                      return (
                        <div
                          key={issue._id}
                          className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">{issue.bookId?.title}</p>
                            <p className="text-xs text-amber-300/70 mt-0.5">
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
        <div className="glass-light animate-fade-in-up card-hover relative overflow-hidden rounded-2xl p-6">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Currently Borrowed</p>
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

      {/* Recently Issued Books */}
      {!loading && recentIssues.length > 0 && (
        <div className="animate-fade-in-up mt-8 glass-light overflow-hidden rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h3 className="text-lg font-bold text-white">Recently Issued Books</h3>
            </div>
            <button
              onClick={() => navigate('/my-issues')}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-indigo-500/20 text-lg">
                    📖
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{issue.bookId?.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{issue.bookId?.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Issued</p>
                  <p className="text-sm font-medium text-slate-300">{formatDate(issue.issueDate)}</p>
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
          className="glass-light animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:bg-white/10 group border-none cursor-pointer text-left"
        >
          <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-indigo-500/20 text-2xl transition-transform duration-300 group-hover:scale-110">
            📚
          </span>
          <div>
            <p className="font-semibold text-white text-lg">Browse Books</p>
            <p className="text-sm text-slate-400">Search and issue available books</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/my-issues')}
          className="glass-light animate-fade-in-up flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:bg-white/10 group border-none cursor-pointer text-left"
        >
          <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-purple-500/20 text-2xl transition-transform duration-300 group-hover:scale-110">
            📖
          </span>
          <div>
            <p className="font-semibold text-white text-lg">My Issues</p>
            <p className="text-sm text-slate-400">View and return your books</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default StudentDashboard;
