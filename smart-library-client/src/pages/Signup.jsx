import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
    const { register, logout } = useAuth();
    const navigate = useNavigate();

    const [registrationType, setRegistrationType] = useState('student'); // 'student' or 'admin'
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
            const response = await register(formData.name, formData.email, formData.password, registrationType);
            const userRole = response?.user?.role;
            
            // Verify role matches registration type (security check)
            if (registrationType === 'admin' && userRole !== 'admin') {
                logout();
                setError('❌ Failed to create admin account. Please try again.');
                setLoading(false);
                return;
            }
            if (registrationType === 'student' && userRole === 'admin') {
                logout();
                setError('❌ Registration error. Please try again.');
                setLoading(false);
                return;
            }
            
            // Redirect based on role
            if (userRole === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gradient-mesh animate-fade-in min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-32 top-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-[60px] animate-float" />
                <div className="absolute -right-32 bottom-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-[60px] animate-float-delayed" />
            </div>

            <div className="glass animate-fade-in-up relative w-full max-w-md rounded-3xl p-10 shadow-2xl shadow-indigo-500/10">
                {/* Logo header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-brand text-2xl shadow-lg shadow-indigo-500/30">
                        ✨
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create Account</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Join{' '}
                        <span className="font-medium text-gradient">
                            Smart Library
                        </span>
                    </p>
                </div>
                
                {/* Registration Type Tabs */}
                <div className="mb-6 flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                    <button
                        type="button"
                        onClick={() => {
                            setRegistrationType('student');
                            setError('');
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                            registrationType === 'student'
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        🎓 Student
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setRegistrationType('admin');
                            setError('');
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                            registrationType === 'admin'
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        👨‍💼 Admin
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="label-text">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="input-field focus-ring"
                        />
                    </div>

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
                        className="btn-success"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin-fast" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating account…
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Link to login */}
                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-indigo-400 hover:text-purple-400 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default Signup;

