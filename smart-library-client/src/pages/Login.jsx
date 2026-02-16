import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('student'); // 'student' or 'admin'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      const userRole = response?.user?.role;
      
      // Verify role matches login type - CRITICAL SECURITY CHECK
      if (loginType === 'admin' && userRole !== 'admin') {
        // Immediately logout the user since they used wrong login page
        logout();
        setError('❌ Access Denied: This account is not an admin. Please use Student Login tab.');
        setLoading(false);
        return;
      }
      if (loginType === 'student' && userRole === 'admin') {
        // Immediately logout the admin since they used wrong login page
        logout();
        setError('❌ Access Denied: This is an admin account. Please use Admin Login tab.');
        setLoading(false);
        return;
      }
      
      // Redirect based on actual role from server
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-mesh animate-fade-in min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300/40 blur-[80px] animate-float" />
        <div className="absolute -right-32 bottom-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300 to-rose-300/40 blur-[80px] animate-float-delayed" />
      </div>

      <div className="glass animate-fade-in-up relative w-full max-w-md rounded-3xl p-10 shadow-2xl">
        {/* Logo header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-brand text-3xl shadow-lg shadow-indigo-400/40">
            📖
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access{' '}
            <span className="font-semibold text-gradient">
              Smart Library
            </span>
          </p>
        </div>
        
        {/* Login Type Tabs */}
        <div className="mb-6 flex gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setLoginType('student');
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
              loginType === 'student'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-400/40'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white'
            }`}
          >
            🎓 Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('admin');
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-400/40'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white'
            }`}
          >
            👨‍💼 Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="label-text">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="input-field focus-ring"
            />
          </div>

          <div>
            <label className="label-text">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="input-field focus-ring"
            />
          </div>

          {error && (
            <div className="animate-fade-in rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin-fast" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Link to signup */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;

