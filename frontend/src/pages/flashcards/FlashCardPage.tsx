import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { CardsType, FlashCardSetsResponseTypes } from '../../types';
import FlashCardServices from '../../services/FlashCardServices';
import AiServices from '../../services/AiServices';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { EmptyCard } from '../../components/common/EmptyCard';
import { FlashCard } from '../../components/flashcards/FlashCard';
import { Button } from '../../components/common/Button';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
} from 'lucide-react';
import { Pageheader } from '../../components/common/Pageheader';
import { Modal } from '../../components/common/Modal';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const FlashCardPage = () => {
    const navigate = useNavigate();
    const { id: documentId } = useParams();
    const [flashCardSets, setFlashCardSets] = useState<
        FlashCardSetsResponseTypes['data'] | null
    >(null);
    const [cardData, setCardData] = useState<CardsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [generating, setGenerating] = useState<boolean>(false);
    const [currCardInd, setCurrentCardInd] = useState<number>(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const fetchFlashcards = async () => {
        if (!documentId) return;
        setLoading(true);
        try {
            const { data } =
                await FlashCardServices.flashCardDocsById(documentId);
            setFlashCardSets(data);
            setCardData(data[0]?.cards);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                console.error(error?.message);
            } else {
                console.error('Failed to fetch flashcard');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashcards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentId]);

    const handleGenerateFlashCards = async () => {
        if (!documentId) return;
        setGenerating(true);
        try {
            await AiServices.generateFlashcards(documentId);
            toast.success('Flashcard generated successfully');
            fetchFlashcards();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                console.error(error?.message);
            } else {
                console.error('Failed to generate flashcard');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleNextCard = () => {
        handleReview(currCardInd);
        setCurrentCardInd(prev => (prev + 1) % cardData?.length);
    };

    const handlePrevCard = () => {
        handleReview(currCardInd);
        setCurrentCardInd(
            prev => (prev - 1 + cardData.length) % cardData.length
        );
    };
    const handleReview = async (index: number) => {
        const currentCard = cardData[currCardInd];
        if (!currentCard) return;

        try {
            await FlashCardServices.reviewFlashcard(currentCard._id, index);
            toast.success('Flashcard Reviewed');
        } catch (error) {
            console.error(error);
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
            setCardData(prev =>
                prev.map(c =>
                    c._id === cardId ? { ...c, isStarred: !c.isStarred } : c
                )
            );
            toast.success('Flashcard starred status updated!');
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to update star status on flashcard');
            }
        }
    };

    const handleDeleteFlashcardSet = async () => {
        if (!flashCardSets) return;
        setIsDeleting(true);
        try {
            await FlashCardServices.deleteFlashCardSet(flashCardSets[0]?._id);
            toast.success('Flashcard set deleted successfully');
            setIsDeleteModalOpen(false);
            navigate(`/flashcards`);
            fetchFlashcards();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to delete flashcard');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const renderFlashCardContent = () => {
        if (loading) {
            return <Spinner />;
        }

        if (flashCardSets?.length === 0) {
            return (
                <EmptyCard
                    title="No Flashcard yet"
                    description="Generate flashcrds from your document to start learning"
                />
            );
        }
        const currentCard = cardData[currCardInd];
        return (
            <div className="flex flex-col items-center space-y-6">
                <ErrorBoundary
                    fallbackRender={props => (
                        <ErrorFallbackComponent {...props} />
                    )}
                >
                    <div className="w-full max-w-md">
                        <FlashCard
                            flashcard={currentCard}
                            onToggleStar={handleToggleStar}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handlePrevCard}
                            variant="secondary"
                            disabled={cardData.length <= 1}
                        >
                            <ChevronLeft size={16} /> Previous
                        </Button>
                        <span className="text-sm text-neutral-400">
                            {currCardInd + 1}/{cardData.length}
                        </span>
                        <Button
                            onClick={handleNextCard}
                            variant="secondary"
                            disabled={cardData.length <= 1}
                        >
                            Next <ChevronRight size={16} />
                        </Button>
                    </div>
                </ErrorBoundary>
            </div>
        );
    };
    return (
        <div>
            <div className="mb-4">
                <Link
                    to={`/documents/${documentId}`}
                    className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to documents
                </Link>
            </div>
            <Pageheader
                title={`Detailed Flashcard - ${flashCardSets && flashCardSets[0]?.documentId.title}`}
            >
                <div className="flex gap-2">
                    {!loading &&
                        (cardData.length > 0 ? (
                            <>
                                <Button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    disabled={isDeleting}
                                >
                                    <Trash2 size={16} /> Delete Set
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleGenerateFlashCards}
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Plus size={16} /> Generate
                                            Flashcard
                                        </>
                                    )}
                                </Button>
                            </>
                        ))}
                </div>
            </Pageheader>

            {renderFlashCardContent()}

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete FlashCardset"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        Are you sure you want to delete all flashcards for this
                        document?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteFlashcardSet}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FlashCardPage;
