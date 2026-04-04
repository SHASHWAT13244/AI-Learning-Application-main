import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 border border-slate-200 dark:border-emerald-500/20"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <>
                    <Moon size={16} strokeWidth={2} />
                    <span>Dark</span>
                </>
            ) : (
                <>
                    <Sun size={16} strokeWidth={2} />
                    <span>Light</span>
                </>
            )}
        </button>
    );
};
