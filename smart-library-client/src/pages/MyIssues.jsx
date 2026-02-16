import { useEffect, useState } from 'react';
import api from '../services/api';

const statusClasses = {
  issued: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-2 border-amber-300',
  returned: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-2 border-emerald-300',
  overdue: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-2 border-red-300',
  default: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-2 border-slate-300',
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

  const isOverdue = (issue) => {
    // Prefer backend isOverdue field if available
    if (typeof issue.isOverdue === 'boolean') {
      return issue.isOverdue;
    }
    
    // Fallback to frontend calculation
    if (issue.status === 'returned') return false;
    const days = getDaysRemaining(issue.dueDate);
    return days !== null && days < 0;
  };

  const getDaysInfo = (issue) => {
    // Prefer backend fields if available
    if (typeof issue.isOverdue === 'boolean') {
      if (issue.isOverdue) {
        return { type: 'overdue', days: issue.daysOverdue || 0 };
      } else {
        return { type: 'remaining', days: issue.daysLeft || 0 };
      }
    }
    
    // Fallback to frontend calculation
    const days = getDaysRemaining(issue.dueDate);
    if (days === null) return null;
    
    if (days < 0) {
      return { type: 'overdue', days: Math.abs(days) };
    } else {
      return { type: 'remaining', days };
    }
  };

  const getStatusBadgeColor = (issue) => {
    if (issue.status === 'returned') {
      return 'text-emerald-600';
    }
    
    const daysInfo = getDaysInfo(issue);
    if (!daysInfo) return 'text-slate-600';
    
    if (daysInfo.type === 'overdue') {
      return 'text-red-600';
    } else if (daysInfo.days <= 2) {
      return 'text-yellow-600';
    } else {
      return 'text-emerald-600';
    }
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
        <h1 className="text-4xl font-extrabold">
          📖 <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My</span>{' '}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Issued Books
          </span>
        </h1>
        <p className="mt-2 text-lg text-slate-600 font-medium">
          Track your borrowed books and return them on time.
        </p>
      </div>
      
      {/* Filter tabs */}
      {!loading && issues.length > 0 && (
        <div className="animate-fade-in-up mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilter('active')}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md ${
              filter === 'active'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-2 border-indigo-600 shadow-indigo-500/20'
                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-indigo-400'
            }`}
          >
            📚 Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('returned')}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md ${
              filter === 'returned'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-2 border-emerald-600 shadow-emerald-500/20'
                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-emerald-400'
            }`}
          >
            ✅ History ({returnedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-600 shadow-purple-500/20'
                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-purple-400'
            }`}
          >
            📋 All ({issues.length})
          </button>
        </div>
      )}

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 p-4 text-base text-red-700 border-2 border-red-300 font-medium shadow-md">
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5 border-2 border-slate-300 shadow-xl">
            <span className="text-5xl">📭</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900">No issued books</p>
          <p className="mt-2 text-base text-slate-600 font-medium">Head to the catalog to issue some books.</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="animate-fade-in mt-16 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5 border-2 border-slate-300 shadow-xl">
            <span className="text-5xl">🔍</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            No {filter === 'returned' ? 'reading history' : 'active issues'} found
          </p>
          <p className="mt-2 text-base text-slate-600 font-medium">
            {filter === 'returned' 
              ? 'You haven\'t returned any books yet.' 
              : 'All your books have been returned.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white animate-fade-in-up mt-8 overflow-hidden rounded-2xl border-2 border-slate-200 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    {['Book', 'Author', 'Due Date', 'Status', 'Penalty', 'Action'].map((h) => (
                      <th key={h} className="p-4 md:px-6 text-xs font-extrabold uppercase tracking-wider text-slate-700">
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
                        className="animate-fade-in-up border-t-2 border-slate-100 transition-colors hover:bg-slate-50"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <td className="p-4 md:px-6 font-extrabold text-slate-900">{issue.bookId?.title || '—'}</td>
                        <td className="p-4 md:px-6 text-slate-600 font-medium">{issue.bookId?.author || '—'}</td>
                        <td className="p-4 md:px-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-700 font-bold">{formatDate(issue.dueDate)}</span>
                            {issue.status !== 'returned' && (() => {
                              const daysInfo = getDaysInfo(issue);
                              if (!daysInfo) return null;
                              
                              return (
                                <span className={`text-xs font-extrabold ${
                                  daysInfo.type === 'overdue'
                                    ? 'text-red-600'
                                    : daysInfo.days <= 2
                                    ? 'text-amber-600'
                                    : 'text-emerald-600'
                                }`}>
                                  {daysInfo.type === 'overdue'
                                    ? `⚠️ ${daysInfo.days} days overdue`
                                    : daysInfo.days <= 2
                                    ? `⏰ ${daysInfo.days} days left`
                                    : `✓ ${daysInfo.days} days left`}
                                </span>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="p-4 md:px-6">
                          <div className="flex flex-col gap-1.5">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold shadow-md ${getStatusClass(issue.status)}`}
                            >
                              {issue.status}
                            </span>
                            {isOverdue(issue) && (
                              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-600">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 md:px-6">
                          {(() => {
                            const penalty = issue.currentPenalty || issue.penaltyAmount || 0;
                            return (
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-extrabold ${penalty > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                  ₹{penalty}
                                </span>
                                {penalty > 0 && !issue.penaltyPaid && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                                    Due
                                  </span>
                                )}
                                {penalty > 0 && issue.penaltyPaid && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                                    Paid
                                  </span>
                                )}
                              </div>
                            );
                          })()}
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
          <div className="md:hidden stagger mt-8 flex flex-col gap-4">
            {filteredIssues.map((issue) => {
              const canReturn = issue.status !== 'returned';
              return (
                <div key={issue._id} className="bg-white animate-fade-in-up rounded-2xl p-5 border-2 border-slate-200 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-extrabold text-slate-900 line-clamp-1 text-base">{issue.bookId?.title || '—'}</p>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-1 font-medium">{issue.bookId?.author || '—'}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold shadow-md ${getStatusClass(issue.status)}`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  
                  {/* Overdue warning banner for mobile */}
                  {isOverdue(issue) && (() => {
                    const daysInfo = getDaysInfo(issue);
                    return (
                      <div className="mt-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 flex items-center gap-2 shadow-md">
                        <svg className="w-4 h-4 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-extrabold text-red-700">
                          {daysInfo?.days || 0} days overdue
                        </span>
                      </div>
                    );
                  })()}
                  
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-slate-700 font-bold">Due: {formatDate(issue.dueDate)}</p>
                      {issue.status !== 'returned' && !isOverdue(issue) && (() => {
                        const daysInfo = getDaysInfo(issue);
                        if (!daysInfo) return null;
                        
                        return (
                          <span className={`text-xs font-extrabold ${
                            daysInfo.days <= 2 ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {daysInfo.days <= 2 ? '⏰' : '✓'} {daysInfo.days} days left
                          </span>
                        );
                      })()}
                      {/* Penalty Display */}
                      {(() => {
                        const penalty = issue.currentPenalty || issue.penaltyAmount || 0;
                        if (penalty > 0) {
                          return (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-extrabold text-red-600">
                                Penalty: ₹{penalty}
                              </span>
                              {!issue.penaltyPaid && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                                  Due
                                </span>
                              )}
                              {issue.penaltyPaid && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                                  Paid
                                </span>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <button
                      onClick={() => handleReturn(issue._id)}
                      disabled={!canReturn || returningId === issue._id}
                      className="btn-primary py-2.5 px-5 shadow-lg text-sm w-auto shrink-0 font-extrabold"
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
