import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border border-slate-200 dark:border-emerald-500/20 overflow-hidden"
            aria-label="Toggle theme"
        >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500"></span>
            
            <span className="relative z-10 flex items-center gap-2">
                {theme === 'light' ? (
                    <>
                        <Moon size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-12" />
                        <span>Dark</span>
                    </>
                ) : (
                    <>
                        <Sun size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-90" />
                        <span>Light</span>
                    </>
                )}
            </span>
        </button>
    );
};
