import { Menu, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';

export const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <>
            <header className="sticky top-0 z-40 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-red-500/10">
                <div className="flex items-center justify-between h-full px-6">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl transition-all duration-200"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:block"></div>
                    
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        
                        <div
                            className="flex items-center gap-3 pl-3 border-l border-slate-200/60 dark:border-red-500/20 cursor-pointer"
                            onClick={() => {
                                navigate('/profile');
                            }}
                        >
                            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer group">
                                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-red-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-200">
                                    <User size={18} strokeWidth={2.5} />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {user?.username || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {user?.email || 'someone@gmail.com'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};
