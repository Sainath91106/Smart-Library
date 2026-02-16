import { useState } from 'react';

function BookCard({ 
  title, 
  author, 
  category,
  description,
  coverImage,
  availableCopies, 
  onIssue, 
  issuing, 
  showIssueButton = true 
}) {
  const inStock = availableCopies > 0;
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="glass-light animate-fade-in-up card-hover relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 group hover:shadow-2xl border border-white/10">
      {/* Cover Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
        {coverImage && !imageError ? (
          <img
            src={coverImage}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            📚
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/30 to-transparent" />
        
        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/90 text-white shadow-md backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
        
        {/* Stock indicator */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-md ring-1 ring-inset backdrop-blur-sm ${inStock
              ? 'bg-emerald-500/90 text-white ring-emerald-400/50'
              : 'bg-red-500/90 text-white ring-red-400/50'
            }`}
          >
            {inStock ? `${availableCopies} left` : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold leading-tight text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-400 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {author}
        </p>

        {/* Description */}
        {description && (
          <div className="mt-3 flex-1">
            <p className={`text-sm text-slate-400 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
              {description}
            </p>
            {description.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Action button */}
        {showIssueButton && (
          <button
            onClick={onIssue}
            disabled={!inStock || issuing}
            className="mt-4 w-full btn-primary py-2.5 shadow-md hover:shadow-lg transition-all"
          >
            {issuing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Issuing…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

