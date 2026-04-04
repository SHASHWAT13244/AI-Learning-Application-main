import { useNavigate } from 'react-router-dom';
import type { GetAllFlashCardpayloadTypes } from '../../types';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import moment from 'moment';
import type { MouseEvent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../common/ErrorFallbackComponent';

export const FlashlistCard = ({
    card,
}: {
    card: GetAllFlashCardpayloadTypes;
}) => {
    const navigate = useNavigate();

    if (!card || !card.documentId) {
        return null;
    }

    const handleStudyNow = () => {
        if (!card.documentId?._id) return;
        navigate(`/documents/${card.documentId._id}/flashcards`);
    };

    const reviewCount = card.cards?.filter(c => c.lastReviewed).length || 0;
    const totalCards = card.cards?.length || 0;
    const progressPercentage =
        totalCards > 0 ? Math.round((reviewCount / totalCards) * 100) : 0;
    
    return (
        <div
            className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-teal-500 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-teal-500/10 flex flex-col justify-between"
            onClick={handleStudyNow}
        >
            <ErrorBoundary
                fallbackRender={props => (
                    <ErrorFallbackComponent {...props} />
                )}
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-teal-900/50 dark:to-blue-900/50 flex items-center justify-center">
                            <BookOpen
                                className="w-6 h-6 text-emerald-600 dark:text-teal-400"
                                strokeWidth={2}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3
                                className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1"
                                title={card.documentId?.title || 'Untitled'}
                            >
                                {card.documentId?.title || 'Untitled'}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Created {moment(card.createdAt).fromNow()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {totalCards}
                                {totalCards === 1 ? 'Card' : 'Cards'}
                            </span>
                        </div>
                        {reviewCount > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                <TrendingUp
                                    className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                                    strokeWidth={2.5}
                                />
                                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                    {progressPercentage}%
                                </span>
                            </div>
                        )}
                    </div>

                    {totalCards > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Progress
                                </span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {reviewCount}/{totalCards} reviewed
                                </span>
                            </div>
                            <div className="relative h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-500 dark:to-blue-600 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                    <button
                        className="group/btn relative w-full h-11 bg-linear-to-r from-emerald-50 to-teal-100 dark:from-teal-900/30 dark:to-blue-900/30 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-600 dark:hover:to-blue-700 text-emerald-700 dark:text-teal-400 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 overflow-hidden"
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleStudyNow();
                        }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                            Study Now
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    </button>
                </div>
            </ErrorBoundary>
        </div>
    );
};
