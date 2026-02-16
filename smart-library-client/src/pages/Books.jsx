import { useEffect, useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Books() {
  const { user, isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [issuingBookId, setIssuingBookId] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // recent, title, author

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category !== 'all') params.category = category;

        const response = await api.get('/books', { params });
        setBooks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchBooks, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  const categories = useMemo(() => {
    const unique = new Set(books.map((book) => book.category).filter(Boolean));
    return ['all', ...Array.from(unique)];
  }, [books]);

  const visibleBooks = useMemo(() => {
    let filtered = books;
    
    if (onlyAvailable) {
      filtered = filtered.filter((book) => book.availableCopies > 0);
    }
    
    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'author') {
        return a.author.localeCompare(b.author);
      } else if (sortBy === 'available') {
        return b.availableCopies - a.availableCopies;
      }
      return 0; // recent (already sorted by backend)
    });
    
    return sorted;
  }, [books, onlyAvailable, sortBy]);
  
  // Get recommended books (popular books with high availability)
  const recommendedBooks = useMemo(() => {
    return books
      .filter(book => book.availableCopies > 0)
      .sort((a, b) => b.availableCopies - a.availableCopies)
      .slice(0, 4);
  }, [books]);

  const handleIssue = async (bookId) => {
    if (!isAuthenticated) {
      setError('Please login first to issue a book');
      return;
    }
    setIssuingBookId(bookId);
    setError('');
    try {
      await api.post('/issues', { bookId });
      
      // Update the book in the local state
      setBooks((prev) =>
        prev.map((book) =>
          book._id === bookId
            ? { ...book, availableCopies: Math.max(0, (book.availableCopies || 0) - 1) }
            : book
        )
      );
      
      // Show success message
      const bookTitle = books.find(b => b._id === bookId)?.title;
      alert(`Successfully issued: ${bookTitle || 'Book'}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setIssuingBookId(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          📚 Library{' '}
          <span className="text-gradient">
            Catalog
          </span>
        </h1>
        <p className="mt-2 text-slate-400">
          Browse and issue books from the library collection.
        </p>
        
        {/* Stats */}
        {!loading && books.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-sm text-slate-400">Total Books: </span>
              <span className="text-sm font-semibold text-indigo-400">{books.length}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-sm text-slate-400">Available: </span>
              <span className="text-sm font-semibold text-emerald-400">
                {books.filter(b => b.availableCopies > 0).length}
              </span>
            </div>
            {search && (
              <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-sm text-slate-400">Search Results: </span>
                <span className="text-sm font-semibold text-purple-400">{visibleBooks.length}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters bar */}
      <div className="glass-light animate-fade-in-up mt-6 flex flex-wrap items-center gap-3 rounded-2xl p-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, author, category…"
            className="input-field pl-10 pr-10 focus-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field cursor-pointer min-w-[140px] focus-ring"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-slate-800 text-white">
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
        
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field cursor-pointer min-w-[140px] focus-ring"
        >
          <option value="recent" className="bg-slate-800 text-white">Recent First</option>
          <option value="title" className="bg-slate-800 text-white">Title A-Z</option>
          <option value="author" className="bg-slate-800 text-white">Author A-Z</option>
          <option value="available" className="bg-slate-800 text-white">Most Available</option>
        </select>

        {/* Available toggle */}
        <label className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 cursor-pointer hover:bg-white/10 transition-colors select-none">
          <div className="relative w-9 h-5">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-white/10 peer-checked:bg-indigo-500 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" />
          </div>
          Available only
        </label>
      </div>
      
      {/* Active filters indicator */}
      {(search || category !== 'all' || onlyAvailable) && (
        <div className="animate-fade-in mt-3 flex items-center gap-2 text-sm">
          <span className="text-slate-400">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                Search: "{search}"
                <button onClick={() => setSearch('')} className="hover:text-white">×</button>
              </span>
            )}
            {category !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                Category: {category}
                <button onClick={() => setCategory('all')} className="hover:text-white">×</button>
              </span>
            )}
            {onlyAvailable && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                Available only
                <button onClick={() => setOnlyAvailable(false)} className="hover:text-white">×</button>
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setOnlyAvailable(false);
            }}
            className="ml-auto text-slate-400 hover:text-white transition-colors underline text-xs"
          >
            Clear all
          </button>
        </div>
      )}

      {error && (
        <div className="animate-fade-in mt-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}
      
      {/* Recommended Books Section */}
      {!loading && !search && category === 'all' && recommendedBooks.length > 0 && user?.role === 'student' && (
        <div className="animate-fade-in-up mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold text-white">
              Recommended for You
            </h2>
          </div>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedBooks.map((book) => (
              <BookCard
                key={book._id}
                title={book.title}
                author={book.author}
                category={book.category}
                description={book.description}
                coverImage={book.coverImage}
                availableCopies={book.availableCopies}
                issuing={issuingBookId === book._id}
                showIssueButton={user?.role === 'student'}
                onIssue={user?.role === 'student' ? () => handleIssue(book._id) : undefined}
              />
            ))}
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* Book grid */}
      {loading ? (
        <div className="stagger mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="glass-light animate-fade-in-up rounded-2xl overflow-hidden">
              <div className="skeleton h-56" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-10 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {visibleBooks.length > 0 && (
            <div className="mt-8 mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">
                {search || category !== 'all' || onlyAvailable ? 'Search Results' : 'All Books'}
              </h2>
              <span className="text-sm text-slate-400">({visibleBooks.length})</span>
            </div>
          )}
          <div className="stagger grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleBooks.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              category={book.category}
              description={book.description}
              coverImage={book.coverImage}
              availableCopies={book.availableCopies}
              issuing={issuingBookId === book._id}
              showIssueButton={user?.role === 'student'}
              onIssue={user?.role === 'student' ? () => handleIssue(book._id) : undefined}
            />
          ))}
        </div>
        </>
      )}

      {!loading && visibleBooks.length === 0 && (
        <div className="animate-fade-in mt-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <span className="text-4xl">📭</span>
          </div>
          <p className="text-xl font-semibold text-white">No books found</p>
          <p className="mt-2 text-sm text-slate-400 max-w-md">
            {search || category !== 'all' || onlyAvailable
              ? "Try adjusting your search or filter criteria to find what you're looking for."
              : "The library catalog is currently empty. Check back later!"}
          </p>
          {(search || category !== 'all' || onlyAvailable) && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('all');
                setOnlyAvailable(false);
              }}
              className="mt-6 btn-primary py-2 px-6"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default Books;

