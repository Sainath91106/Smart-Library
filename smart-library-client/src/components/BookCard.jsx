import { useState } from 'react';
import api from '../services/api';

function BookCard({ 
  bookId,
  title, 
  author, 
  category,
  description,
  coverImage,
  availableCopies,
  aiSummary: initialAiSummary, 
  onIssue, 
  issuing, 
  showIssueButton = true 
}) {
  const inStock = availableCopies > 0;
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [aiSummary, setAiSummary] = useState(initialAiSummary || '');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const handleGenerateSummary = async () => {
    if (aiSummary) return; // Don't regenerate if summary already exists
    
    setGeneratingSummary(true);
    setSummaryError('');
    
    try {
      const response = await api.post('/ai/summary', { bookId });
      setAiSummary(response.data.summary);
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = errorData?.message || 'Failed to generate summary';
      
      // Add detailed information for rate limit errors
      if (error.response?.status === 429) {
        errorMessage = `${errorMessage} ${errorData?.details || 'Please wait 60 seconds and try again.'}`;
      } else if (errorData?.details) {
        errorMessage = `${errorMessage} ${errorData.details}`;
      }
      
      setSummaryError(errorMessage);
      console.error('AI Summary Error:', error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <article className="bg-white animate-fade-in-up card-hover relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 group hover:shadow-2xl shadow-xl border-2 border-slate-200">
      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
        {coverImage && !imageError ? (
          <img
            src={coverImage}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-7xl">
            📚
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/20 to-transparent" />
        
        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 text-xs font-extrabold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg border-2 border-white/30">
              {category}
            </span>
          </div>
        )}
        
        {/* Stock indicator */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 text-xs font-extrabold rounded-full shadow-lg border-2 ${inStock
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-white/30'
              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-white/30'
            }`}
          >
            {inStock ? `${availableCopies} left` : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-extrabold leading-tight text-slate-900 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 flex items-center gap-1.5 font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {author}
        </p>

        {/* Description */}
        {description && (
          <div className="mt-3 flex-1">
            <p className={`text-sm text-slate-600 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
              {description}
            </p>
            {description.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1.5 text-xs text-indigo-600 hover:text-indigo-700 transition-colors font-bold"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* AI Summary Section */}
        <div className="mt-4">
          {!aiSummary ? (
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              {generatingSummary ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating AI Summary...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ✨ Generate AI Summary
                </span>
              )}
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-md">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">✨</span>
                <h4 className="text-sm font-bold text-purple-700">AI Summary</h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{aiSummary}</p>
            </div>
          )}
          
          {summaryError && (
            <div className="mt-2 p-4 rounded-xl bg-red-50 border-2 border-red-200 shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-700 mb-1">Error</p>
                  <p className="text-xs text-red-600 leading-relaxed">{summaryError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        {showIssueButton && (
          <button
            onClick={onIssue}
            disabled={!inStock || issuing}
            className="mt-4 w-full btn-primary py-3 shadow-lg hover:shadow-xl transition-all font-bold text-base"
          >
            {issuing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Issuing…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Issue Book
              </span>
            )}
          </button>
        )}
      </div>
    </article>
  );
}

export default BookCard;

