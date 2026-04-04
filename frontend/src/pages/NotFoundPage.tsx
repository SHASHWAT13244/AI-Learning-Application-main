import { Link } from 'react-router-dom';
import { BrainCircuit, Home } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] dark:bg-[radial-gradient(#456882_1px, transparent_1px)] bg-size-[16px_16px] opacity-30" />
            
            <div className="relative text-center max-w-md px-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-emerald-400 to-teal-500 dark:from-teal-600 dark:to-blue-700 shadow-lg shadow-emerald-500/20 dark:shadow-teal-500/20 mb-8">
                    <BrainCircuit className="w-12 h-12 text-white" strokeWidth={2} />
                </div>
                
                <h1 className="text-8xl font-bold text-slate-800 dark:text-slate-100 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Page Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 dark:shadow-teal-500/25 active:scale-95"
                >
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
