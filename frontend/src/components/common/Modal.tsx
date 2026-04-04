import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from './ErrorFallbackComponent';

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <ErrorBoundary
                    fallbackRender={props => (
                        <ErrorFallbackComponent {...props} />
                    )}
                >
                    <div
                        className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={onClose}
                    ></div>

                    <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-slate-900/20 dark:shadow-black/40 p-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                        >
                            <X className="w-5 h-5" strokeWidth={2} />
                        </button>
                        <div className="mb-6 pr-8">
                            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 tracking-tight">
                                {title}
                            </h3>
                        </div>
                        <div>{children}</div>
                    </div>
                </ErrorBoundary>
            </div>
        </div>
    );
};
