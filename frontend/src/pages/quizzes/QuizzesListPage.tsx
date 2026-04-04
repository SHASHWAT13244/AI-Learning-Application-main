import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pageheader } from '../../components/common/Pageheader';
import Spinner from '../../components/common/Spinner';
import { EmptyCard } from '../../components/common/EmptyCard';
import { QuizCard } from '../../components/quizzes/QuizCard';
import QuizServices from '../../services/QuizServices';
import type { QuizPayloadTypes } from '../../types';
import toast from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const QuizzesListPage = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<QuizPayloadTypes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchAllQuizzes();
    }, []);

    const fetchAllQuizzes = async () => {
        setLoading(true);
        try {
            // You'll need to add this endpoint to your backend
            // For now, we'll show a message
            toast.error('Quizzes list endpoint coming soon');
            setQuizzes([]);
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

    const handleDeleteQuiz = async (quiz: QuizPayloadTypes) => {
        try {
            await QuizServices.deleteQuiz(quiz._id);
            toast.success('Quiz deleted successfully');
            fetchAllQuizzes();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to delete quiz');
            }
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Spinner />
                </div>
            );
        }

        if (quizzes.length === 0) {
            return (
                <EmptyCard
                    title="No Quizzes Found"
                    description="Complete a quiz from any document to see it here"
                    buttonText="Go to Documents"
                    onClickAction={() => navigate('/documents')}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <ErrorBoundary
                    fallbackRender={props => <ErrorFallbackComponent {...props} />}
                >
                    {quizzes.map(quiz => (
                        <QuizCard
                            key={quiz._id}
                            quiz={quiz}
                            onDelete={handleDeleteQuiz}
                        />
                    ))}
                </ErrorBoundary>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <div className="relative max-w-7xl mx-auto">
                    <Pageheader 
                        title="All Quizzes" 
                        subtitle="View and review all your completed and pending quizzes"
                    />
                    {renderContent()}
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default QuizzesListPage;
