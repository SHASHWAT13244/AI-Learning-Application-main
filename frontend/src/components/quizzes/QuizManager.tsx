import { useEffect, useState, type ChangeEvent } from 'react';
import QuizServices from '../../services/QuizServices';
import toast from 'react-hot-toast';
import type { QuizPayloadTypes } from '../../types';
import AiServices from '../../services/AiServices';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';
import Spinner from '../common/Spinner';
import { EmptyCard } from '../common/EmptyCard';
import { QuizCard } from './QuizCard';
import { Modal } from '../common/Modal';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../common/ErrorFallbackComponent';

export const QuizManager = ({ documentId }: { documentId: string }) => {
    const [quizzes, setQuizzes] = useState<QuizPayloadTypes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [generating, setgenerating] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [numQuestions, setNumQuestions] = useState<number>(5);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizPayloadTypes | null>(
        null
    );

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const { data } = await QuizServices.getQuizzessForDocs(documentId);
            setQuizzes(data);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to fetch quizzes');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentId]);

    //generate quiz
    const handleGenerateQuiz = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setgenerating(true);
        try {
            await AiServices.generateQuiz(documentId, { numQuestions });
            toast.success('Quiz Generated successfully');
            setIsModalOpen(false);
            fetchQuizzes();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to generate quizzes');
            }
        } finally {
            setgenerating(false);
        }
    };

    //handle delete request
    const handleDeleteRequest = (q: QuizPayloadTypes) => {
        setSelectedQuiz(q);
        setIsDeleteModalOpen(true);
    };

    //delete confirm popup
    const handleDeleteCfrmPopup = async () => {
        if (!selectedQuiz) return;
        setIsDeleting(true);

        try {
            await QuizServices.deleteQuiz(selectedQuiz._id);
            toast.success(`${selectedQuiz.title} || Quiz delted successfully`);
            setIsDeleteModalOpen(false);
            setSelectedQuiz(null);
            fetchQuizzes();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to delete quiz');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    //render quiz content
    const renderQuizContent = () => {
        if (loading) {
            return <Spinner />;
        }

        if (quizzes.length === 0) {
            return (
                <EmptyCard
                    title="No Quizzes Yet"
                    description="Generate a quiz from you document to test your knowledge"
                />
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ErrorBoundary
                    fallbackRender={props => (
                        <ErrorFallbackComponent {...props} />
                    )}
                >
                    {quizzes.map(q => (
                        <QuizCard
                            key={q._id}
                            quiz={q}
                            onDelete={handleDeleteRequest}
                        />
                    ))}
                </ErrorBoundary>
            </div>
        );
    };
    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex justify-end gap-2 mb-4">
                <Button
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={16} />
                    Generate Quiz
                </Button>
            </div>

            {renderQuizContent()}

            {/* Generate Quiz  */}
            <Modal
                title="Generate New Quiz"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form onSubmit={handleGenerateQuiz} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                            No. Of Questions
                        </label>
                        <input
                            type="number"
                            value={numQuestions}
                            onChange={e =>
                                setNumQuestions(
                                    Math.max(1, parseInt(e.target.value) || 1)
                                )
                            }
                            min="1"
                            required
                            className="w-full h-9 px-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            disabled={generating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={generating}>
                            {generating ? 'Generating...' : 'Generate'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete Quiz"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        Are you sure you want to delete the quiz:{' '}
                        <span className="font-semibold text-neutral-900">
                            {selectedQuiz?.title || 'Quiz'}
                        </span>
                        ?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isDeleting}
                            onClick={handleDeleteCfrmPopup}
                            variant="danger"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
