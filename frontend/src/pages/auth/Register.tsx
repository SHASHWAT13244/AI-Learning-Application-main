import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../services/AuthServices';
import toast from 'react-hot-toast';
import { ArrowRight, BrainCircuit, Lock, Mail, User } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [focussedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            await AuthServices.register({
                username: userName,
                email,
                password,
            });

            toast.success('Registration successfully! Please Login');
            navigate('/login');
        } catch (err) {
            setError(
                (err as Error).message || 'Failed to register. Please try again.'
            );
            toast.error(
                (err as Error).message || 'Failed to register. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] dark:bg-[radial-gradient(#456882_1px, transparent_1px)] bg-size-[16px_16px] opacity-30" />

            <div className="relative w-full max-w-md px-6">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 dark:from-teal-600 dark:to-blue-700 shadow-lg shadow-emerald-50/20 dark:shadow-teal-500/20 mb-6">
                            <BrainCircuit
                                className="w-7 h-7 text-white"
                                strokeWidth={2}
                            />
                        </div>
                        <h1 className="text-2xl font-medium text-slate-500 dark:text-slate-400 tracking-tight mb-2">
                            Create an Account
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Start your AI-powered learning journey today!
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Username
                            </label>
                            <div className="relative group">
                                <div
                                    className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
                                    ${focussedField === 'username' ? 'text-emerald-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}
                                >
                                    <User className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Username"
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-500/10 dark:focus:shadow-teal-500/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Email
                            </label>
                            <div className="relative group">
                                <div
                                    className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
                                    ${focussedField === 'email' ? 'text-emerald-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}
                                >
                                    <Mail className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-500/10 dark:focus:shadow-teal-500/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative group">
                                <div
                                    className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
                                    ${focussedField === 'password' ? 'text-emerald-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}
                                >
                                    <Lock className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="******"
                                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-500/10 dark:focus:shadow-teal-500/10"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="group relative w-full h-12 bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-emerald-500/25 dark:shadow-teal-500/25 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight
                                            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                                            strokeWidth={2.5}
                                        />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10">
                        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-emerald-600 dark:text-teal-400 hover:text-emerald-700 dark:hover:text-teal-300 transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Register;
