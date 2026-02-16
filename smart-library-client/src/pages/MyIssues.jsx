import { useEffect, useState } from 'react';
import api from '../services/api';

const statusClasses = {
  issued: 'bg-amber-500/15 text-amber-400 ring-amber-500/20',
  returned: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20',
  overdue: 'bg-red-500/15 text-red-400 ring-red-500/20',
  default: 'bg-slate-400/15 text-slate-400 ring-slate-400/20',
};

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returningId, setReturningId] = useState(null);
  const [filter, setFilter] = useState('active'); // 'active', 'returned', 'all'

  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/issues/my');
      setIssues(response.data?.issues || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your issued books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleReturn = async (issueId) => {
    setReturningId(issueId);
    setError('');
    try {
      await api.patch(`/issues/${issueId}/return`);
      await fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

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

  const isOverdue = (dueDate, status) => {
    if (status === 'returned') return false;
    const days = getDaysRemaining(dueDate);
    return days !== null && days < 0;
  };

  const getStatusClass = (status) => statusClasses[status] || statusClasses.default;
  
  const filteredIssues = issues.filter(issue => {
    if (filter === 'active') return issue.status !== 'returned';
    if (filter === 'returned') return issue.status === 'returned';
    return true; // 'all'
  });
  
  const activeCount = issues.filter(i => i.status !== 'returned').length;
  const returnedCount = issues.filter(i => i.status === 'returned').length;

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          📖 My{' '}
          <span className="text-gradient">
            Issued Books
          </span>
        </h1>
        <p className="mt-2 text-slate-400">
          Track your borrowed books and return them on time.
        </p>
      </div>
      
      {/* Filter tabs */}
      {!loading && issues.length > 0 && (
        <div className="animate-fade-in-up mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'active'
                ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            📚 Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('returned')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'returned'
                ? 'bg-emerald-500/20 text-white border border-emerald-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            ✅ History ({returnedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-purple-500/20 text-white border border-purple-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            📋 All ({issues.length})
          </button>
        </div>
      )}

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="stagger mt-8 flex flex-col gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton animate-fade-in-up h-20" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="animate-fade-in mt-16 flex flex-col items-center text-center">
          <span className="text-5xl">📭</span>
          <p className="mt-4 text-lg font-medium text-slate-400">No issued books</p>
          <p className="mt-1 text-sm text-slate-500">Head to the catalog to issue some books.</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="animate-fade-in mt-16 flex flex-col items-center text-center">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg font-medium text-slate-400">
            No {filter === 'returned' ? 'reading history' : 'active issues'} found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {filter === 'returned' 
              ? 'You haven\'t returned any books yet.' 
              : 'All your books have been returned.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block glass-light animate-fade-in-up mt-8 overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {['Book', 'Author', 'Due Date', 'Status', 'Action'].map((h) => (
                      <th key={h} className="p-4 md:px-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue, idx) => {
                    const canReturn = issue.status !== 'returned';
                    return (
                      <tr
                        key={issue._id}
                        className="animate-fade-in-up border-t border-white/10 transition-colors hover:bg-white/5"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <td className="p-4 md:px-6 font-medium text-white">{issue.bookId?.title || '—'}</td>
                        <td className="p-4 md:px-6 text-slate-400">{issue.bookId?.author || '—'}</td>
                        <td className="p-4 md:px-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400">{formatDate(issue.dueDate)}</span>
                            {issue.status !== 'returned' && getDaysRemaining(issue.dueDate) !== null && (
                              <span className={`text-xs font-medium ${
                                isOverdue(issue.dueDate, issue.status)
                                  ? 'text-red-400'
                                  : getDaysRemaining(issue.dueDate) <= 3
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}>
                                {isOverdue(issue.dueDate, issue.status)
                                  ? `⚠️ ${Math.abs(getDaysRemaining(issue.dueDate))} days overdue`
                                  : getDaysRemaining(issue.dueDate) <= 3
                                  ? `⏰ ${getDaysRemaining(issue.dueDate)} days left`
                                  : `✓ ${getDaysRemaining(issue.dueDate)} days left`}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 md:px-6">
                          <div className="flex flex-col gap-1.5">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClass(issue.status)}`}
                            >
                              {issue.status}
                            </span>
                            {isOverdue(issue.dueDate, issue.status) && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 md:px-6">
                          <button
                            onClick={() => handleReturn(issue._id)}
                            disabled={!canReturn || returningId === issue._id}
                            className="btn-primary py-2 px-4 shadow-md text-xs w-auto min-w-[80px]"
                          >
                            {returningId === issue._id ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <svg className="w-3 h-3 animate-spin-fast" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Returning…
                              </span>
                            ) : (
                              'Return'
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden stagger mt-8 flex flex-col gap-3">
            {filteredIssues.map((issue) => {
              const canReturn = issue.status !== 'returned';
              return (
                <div key={issue._id} className="glass-light animate-fade-in-up rounded-2xl p-5 border border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-white line-clamp-1">{issue.bookId?.title || '—'}</p>
                      <p className="mt-0.5 text-sm text-slate-400 line-clamp-1">{issue.bookId?.author || '—'}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClass(issue.status)}`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  
                  {/* Overdue warning banner for mobile */}
                  {isOverdue(issue.dueDate, issue.status) && (
                    <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold text-red-400">
                        {Math.abs(getDaysRemaining(issue.dueDate))} days overdue
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm text-slate-400">Due: {formatDate(issue.dueDate)}</p>
                      {issue.status !== 'returned' && getDaysRemaining(issue.dueDate) !== null && !isOverdue(issue.dueDate, issue.status) && (
                        <span className={`text-xs font-medium ${
                          getDaysRemaining(issue.dueDate) <= 3 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {getDaysRemaining(issue.dueDate) <= 3 ? '⏰' : '✓'} {getDaysRemaining(issue.dueDate)} days left
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleReturn(issue._id)}
                      disabled={!canReturn || returningId === issue._id}
                      className="btn-primary py-2 px-4 shadow-md text-xs w-auto shrink-0"
                    >
                      {returningId === issue._id ? 'Returning…' : 'Return'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default MyIssues;
