import { useState, type MouseEvent } from 'react';
import type { CardsType } from '../../types';
import { RotateCcw, Star } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../common/ErrorFallbackComponent';

export const FlashCard = ({
    flashcard,
    onToggleStar,
}: {
    flashcard: CardsType;
    onToggleStar: (cardId: string) => void;
}) => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const handleFlipped = () => {
        setIsFlipped(!isFlipped);
    };
    return (
        <div className="relative w-full h-72" style={{ perspective: '1000px' }}>
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <div
                    className="relative w-full h-full transition-transform duration-500 transform-cpu cursor-pointer"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped
                            ? 'rotateY(180deg'
                            : 'rotateY(0deg)',
                    }}
                    onClick={handleFlipped}
                >
                    {/* Front card */}
                    <div
                        className=" absolute inset-0 w-full h-full bg-white/80 backdrop-blur-xl border-2 border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-8 flex-col justify-between"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="bg-slate-100 text-[10px] text-slate-600 rounded px-4 py-1 uppercase">
                                {flashcard.difficulty}
                            </div>
                            <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    onToggleStar(flashcard._id);
                                }}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    flashcard.isStarred
                                        ? 'bg-linear-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500 '
                                }`}
                            >
                                <Star
                                    className="w-4 h-4"
                                    strokeWidth={2}
                                    fill={
                                        flashcard.isStarred
                                            ? 'currentColor'
                                            : 'none'
                                    }
                                />
                            </button>
                        </div>

                        {/* Question content */}
                        <div className="flex-1 flex items-center justify-center px-4 py-6">
                            <p className="text-lg font-semibold text-slate-900 text-center leading-relaxed">
                                {flashcard.question}
                            </p>
                        </div>

                        {/* Indicator */}
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                            <RotateCcw
                                className="w-3.5 h-3.5"
                                strokeWidth={2}
                            />
                            <span>Click to reveal answer</span>
                        </div>
                    </div>

                    {/* Back card  */}
                    <div
                        className=" absolute inset-0 w-full h-full bg-linear-to-br from-emerald-500 to-teal-500 border-2 border-emerald-400/60 rounded-2xl shadow-xl shadow-emerald-500/30 p-8 flex flex-col justify-between"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg',
                        }}
                    >
                        {/* Star Button  */}
                        <div className="flex justify-end">
                            <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    onToggleStar(flashcard._id);
                                }}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 
            ${
                flashcard.isStarred
                    ? 'bg-white/30 backdrop-blur-sm text-white border border-white/50'
                    : 'bg-white/20 backdrop-blur-sm text-white/70 border border-white/50 hover:text-white'
            }
            `}
                            >
                                <Star
                                    className="w-4 h-4"
                                    strokeWidth={2}
                                    fill={
                                        flashcard.isStarred
                                            ? 'currentColor'
                                            : 'none'
                                    }
                                />
                            </button>
                        </div>

                        {/* Answer Content  */}
                        <div className="flex-1 flex items-center justify-center px-4 py-6">
                            <p className="text-lg font-semibold text-white text-center leading-relaxed">
                                {flashcard.answer}
                            </p>
                        </div>

                        {/* Indicator */}
                        <div className="flex items-center justify-center gap-2 text-xs text-white/70 font-medium">
                            <RotateCcw
                                className="w-3.5 h-3.5"
                                strokeWidth={2}
                            />
                            <span>Click to see question</span>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    );
};
