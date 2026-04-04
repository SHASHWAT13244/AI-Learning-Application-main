import { useEffect, useState, type MouseEvent } from 'react';
import FlashCardServices from '../../services/FlashCardServices';
import toast from 'react-hot-toast';
import type {
    FlashCardPayloadTypes,
    FlashCardSetsResponseTypes,
} from '../../types';
import AiServices from '../../services/AiServices';
import Spinner from '../common/Spinner';
import {
    ArrowLeft,
    Brain,
    ChevronLeft,
    ChevronRight,
    Plus,
    Sparkles,
    Trash2,
} from 'lucide-react';
import moment from 'moment';
import { Modal } from '../common/Modal';
import { FlashCard } from './FlashCard';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../common/ErrorFallbackComponent';

export const FlashCardManager = ({ documentId }: { documentId: string }) => {
    const [flashCardSets, setFlashCardsets] = useState<
        FlashCardSetsResponseTypes['data']
    >([]);
    const [selectedSet, setSelectedSet] =
        useState<FlashCardPayloadTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [generating, setGenerating] = useState<boolean>(false);
    const [currInd, setCurrInd] = useState<number>(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [setToDelete, setSetToDelete] =
        useState<FlashCardPayloadTypes | null>(null);

    const fetchFlashCardSets = async () => {
        setLoading(true);
        try {
            const { data } =
                await FlashCardServices.flashCardDocsById(documentId);
            setFlashCardsets(data);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to fetch flashcard sets');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashCardSets();
    }, [documentId]);

    const handleGenerateFlashCards = async () => {
        setGenerating(true);
        try {
            await AiServices.generateFlashcards(documentId);
            toast.success('Flashcards generated successfully!');
            fetchFlashCardSets();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to generate flashcards');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleNext = () => {
        if (selectedSet) {
            handleReview(currInd);
            setCurrInd(prev => (prev + 1) % selectedSet.cards.length);
        }
    };

    const handlePrev = () => {
        if (selectedSet) {
            handleReview(currInd);
            setCurrInd(
                prev =>
                    (prev - 1 + selectedSet.cards.length) %
                    selectedSet.cards.length
            );
        }
    };

    const handleReview = async (index: number) => {
        const currentCard = selectedSet?.cards[currInd];
        if (!currentCard) return;

        try {
            await FlashCardServices.reviewFlashcard(currentCard._id, index);
            toast.success('Flash Card Reviewed');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to review flashcard');
            }
        }
    };

    const handleToggleStar = async (cardId: string) => {
        try {
            await FlashCardServices.toggleStar(cardId);
            let updatedSelectedSet: FlashCardPayloadTypes | null = null;
            const updatedSets = flashCardSets.map(set => {
                if (set._id === selectedSet?._id) {
                    const updateCards = set.cards.map(card =>
                        card._id === cardId
                            ? { ...card, isStarred: !card.isStarred }
                            : card
                    );
                    const newSet = { ...set, cards: updateCards };
                    updatedSelectedSet = newSet;
                    return newSet;
                }
                return set;
            });
            setFlashCardsets(updatedSets);
            setSelectedSet(updatedSelectedSet);
            toast.success('Flashcard starred status successfully');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to update star status');
            }
        }
    };

    const handleDelete = (
        e: MouseEvent<HTMLButtonElement>,
        set: FlashCardPayloadTypes
    ) => {
        e.stopPropagation();
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmPopup = async () => {
        if (!setToDelete) return;
        setIsDeleting(true);
        try {
            await FlashCardServices.deleteFlashCardSet(setToDelete._id);
            toast.success('Flashcard set deleted successfully');
            setIsDeleteModalOpen(false);
            setSetToDelete(null);
            fetchFlashCardSets();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to delete flashcards');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSelectSet = (set: FlashCardPayloadTypes) => {
        setSelectedSet(set);
        setCurrInd(0);
    };

    const renderFlashCardViewer = () => {
        const currCard = selectedSet?.cards[currInd];
        if (!currCard) return;
        return (
            <div className="space-y-8">
                <button
                    onClick={() => setSelectedSet(null)}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-teal-400 transition-colors duration-200"
                >
                    <ArrowLeft
                        className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
                        strokeWidth={2}
                    />
                    Back to Flashcard sets
                </button>

                <div className="flex flex-col items-center space-y-8">
                    <div className="w-full max-w-2xl">
                        <FlashCard
                            flashcard={currCard}
                            onToggleStar={handleToggleStar}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={handlePrev}
                            disabled={selectedSet.cards.length <= 1}
                            className="group flex items-center gap-2 px-5 h-11 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft
                                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-100"
                                strokeWidth={2.5}
                            />
                            Previous
                        </button>

                        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-white/10">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {currInd + 1}{' '}
                                <span className="text-slate-400 dark:text-slate-500 font-normal">
                                    /
                                </span>{' '}
                                {selectedSet.cards.length}
                            </span>
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={selectedSet.cards.length <= 1}
                            className="group flex items-center gap-2 px-5 h-11 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight
                                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                                strokeWidth={2.5}
                            />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSetList = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            );
        }
        if (flashCardSets?.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-teal-900/50 dark:to-blue-900/50 mb-6">
                        <Brain
                            className="w-8 h-8 text-emerald-600 dark:text-teal-400"
                            strokeWidth={2}
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        No flashcard yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-sm">
                        Generate flashcards from your document to start learning
                        and reinforce your knowledge.
                    </p>
                    <button
                        onClick={handleGenerateFlashCards}
                        disabled={generating}
                        className="group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-br from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 dark:shadow-teal-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        {generating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" strokeWidth={2} />
                                Generate Flashcards
                            </>
                        )}
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <ErrorBoundary
                    fallbackRender={props => (
                        <ErrorFallbackComponent {...props} />
                    )}
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Your Flashcard Sets
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {flashCardSets.length}
                                {flashCardSets.length === 1 ? ' set' : ' sets'}{' '}
                                available
                            </p>
                        </div>
                        <button
                            onClick={handleGenerateFlashCards}
                            disabled={generating}
                            className="group inline-flex items-center gap-2 px-5 h-11 bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 dark:shadow-teal-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {generating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Generate New Set
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {flashCardSets.map(set => (
                            <div
                                key={set._id}
                                onClick={() => handleSelectSet(set)}
                                className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-teal-500 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500 dark:hover:shadow-teal-500"
                            >
                                <button
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => handleDelete(e, set)}
                                    className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-red-400 dark:hover:text-red-400 hover:bg-rose-100 dark:hover:bg-red-900/20 transition-all rounded-lg duration-200 opacity-0 group-hover:opacity-100 p-2"
                                >
                                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                                </button>

                                <div className="space-y-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-teal-900/50 dark:to-blue-900/50">
                                        <Brain
                                            className="w-6 h-6 text-emerald-600 dark:text-teal-400"
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <div>
                                        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                            FlashCard Set
                                        </h4>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            Created{' '}
                                            {moment(set.createdAt).format('MMM D, YYYY')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                                        <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                                {set.cards.length}{' '}
                                                {set.cards.length === 1 ? 'card' : 'cards'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ErrorBoundary>
            </div>
        );
    };

    return (
        <>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-8">
                {selectedSet ? renderFlashCardViewer() : renderSetList()}
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Flashcard set?"
            >
                <div className="space-y-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Are you sure you want to delete this flashcard set? This
                        action cannot be undone and all cards will be permanently removed.
                    </p>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                            className="px-5 h-12 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleDeleteConfirmPopup}
                            disabled={isDeleting}
                            className="px-5 h-12 bg-linear-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {isDeleting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                'Delete Set'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
