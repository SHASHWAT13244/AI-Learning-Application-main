import type { ButttonProps } from '../../types';

export const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    variant = 'primary',
    size = 'md',
}: ButttonProps) => {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap';
    const variantStyles: Record<string, string> = {
        primary:
            'bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 text-white shadow-lg shadow-emerald-500/25 dark:shadow-teal-500/25 hover:shadow-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-teal-500/30',
        secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
        outline:
            'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600',
        danger: 'bg-red-500! hover:bg-red-600 active:bg-red-700 text-white font-semibold focus:ring-red-500',
    };
    const sizeStyles: Record<NonNullable<ButttonProps['size']>, string> = {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-5 text-xs',
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles},
        ${variantStyles[variant]},
        ${sizeStyles[size]},
        ${className},
      `}
        >
            {children}
        </button>
    );
};
