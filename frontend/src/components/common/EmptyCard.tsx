import { FileText, Plus } from 'lucide-react';

export const EmptyCard = ({
    title,
    description,
    buttonText,
    onClickAction,
}: {
    title: string;
    description: string;
    buttonText?: string;
    onClickAction?: () => void;
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-linear-to-br from-slate-50/30 to-white dark:from-slate-800/30 dark:to-slate-900/30 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200/50 dark:from-slate-700 dark:to-slate-800/50 mb-6">
                <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {title}
            </h3>
            <p className="font-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm leading-relaxed">
                {description}
            </p>
            {buttonText && onClickAction && (
                <button
                    onClick={onClickAction}
                    className="group relative inline-flex items-center gap-2 px-6 h-11 bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 dark:shadow-teal-500/25 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        {buttonText}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
            )}
        </div>
    );
};
