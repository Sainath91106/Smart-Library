import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('student');
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

      if (loginType === 'admin' && userRole !== 'admin') {
        logout();
        setError('❌ Access Denied: This account is not an admin. Please use Student Login tab.');
        setLoading(false);
        return;
      }

      if (loginType === 'student' && userRole === 'admin') {
        logout();
        setError('❌ Access Denied: This is an admin account. Please use Admin Login tab.');
        setLoading(false);
        return;
      }

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
    <main className="bg-page animate-fade-in min-h-screen flex items-center justify-center p-4">
      <div className="surface animate-fade-in-up relative w-full max-w-md rounded-3xl p-10 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex w-16 h-16 items-center justify-center rounded-2xl bg-[#2563EB] text-3xl text-white shadow-sm">
            📖
          </div>
          <h1 className="text-3xl font-bold text-[#111827]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Sign in to access <span className="font-semibold text-[#2563EB]">Smart Library</span>
          </p>
        </div>

        <div className="mb-6 flex gap-2 p-1.5 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => {
              setLoginType('student');
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
              loginType === 'student'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
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
                ? 'bg-[#2563EB] text-white'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
            }`}
          >
            👨‍💼 Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="label-text">Email</label>
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
            <label className="label-text">Password</label>
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

          <button type="submit" disabled={loading} className="btn-primary">
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

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
