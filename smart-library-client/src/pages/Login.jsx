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
        <div className="absolute -left-32 top-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-[60px] animate-float" />
        <div className="absolute -right-32 bottom-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-[60px] animate-float-delayed" />
      </div>

      <div className="glass animate-fade-in-up relative w-full max-w-md rounded-3xl p-10 shadow-2xl shadow-indigo-500/10">
        {/* Logo header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-brand text-2xl shadow-lg shadow-indigo-500/30">
            📖
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access{' '}
            <span className="font-medium text-gradient">
              Smart Library
            </span>
          </p>
        </div>
        
        {/* Login Type Tabs */}
        <div className="mb-6 flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setLoginType('student');
              setError('');
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              loginType === 'student'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
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
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              loginType === 'admin'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
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
            <div className="animate-fade-in rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
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
        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-400 hover:text-purple-400 transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;

