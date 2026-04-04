import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { QuizPayloadTypes } from '../../types';
import QuizServices from '../../services/QuizServices';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { Pageheader } from '../../components/common/Pageheader';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const QuizTakePage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizPayloadTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currQnsindex, setCurrQnsIndex] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<
        Record<string, { index: number; text: string }>
    >({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!quizId) return;
        const fetchQuizById = async () => {
            try {
                const { data } = await QuizServices.getQuizzesById(quizId);
                setQuiz(data);
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    toast.error(error?.message);
                } else {
                    toast.error('Failed to fetch quiz');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchQuizById();
    }, [quizId]);

    const handleOptionsChange = (questionId: string, optionIndex: number, optionText: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: { index: optionIndex, text: optionText },
        }));
    };

    const handleNextQuestion = () => {
        if (quiz?.questions && currQnsindex < quiz?.questions?.length - 1) {
            setCurrQnsIndex(prev => prev + 1);
        }
    };

    const handlePreviosQuestions = () => {
        if (currQnsindex > 0) {
            setCurrQnsIndex(prev => prev - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (!quizId) return;

        setSubmitting(true);
        try {
            // Format answers correctly with the actual selected answer text
            const formattedAnswers = Object.keys(selectedAnswers).map(questionId => {
                const questionIndex = quiz?.questions.findIndex(q => q._id === questionId);
                const selectedOptionText = selectedAnswers[questionId]?.text;
                
                return { 
                    questionIndex, 
                    selectedAnswer: selectedOptionText || ''
                };
            });

            // Filter out any undefined answers
            const validAnswers = formattedAnswers.filter(a => a.questionIndex !== undefined && a.selectedAnswer);
            
            await QuizServices.SubmitQuiz(quizId, validAnswers);
            toast.success('Quiz submitted successfully');
            navigate(`/quizzes/${quizId}/results`);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to submit quiz');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        );
    }

    if (!quiz || quiz?.questions?.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-slate-600 text-lg">
                        Quiz not found or No Question available
                    </p>
                </div>
            </div>
        );
    }
    
    const quizCurrentQns = quiz.questions && quiz.questions[currQnsindex];
    const isAnswered = selectedAnswers && selectedAnswers[quizCurrentQns._id] !== undefined;
    const answeredCount = Object.keys(selectedAnswers)?.length;

    return (
        <div className="max-w-4xl mx-auto">
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <Pageheader title={quiz.title || 'Quiz'} />

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">
                            Question {currQnsindex + 1} of{' '}
                            {quiz?.questions?.length}
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                            {answeredCount} answered
                        </span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${((currQnsindex + 1) / quiz?.questions?.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl mb-6">
                        <div className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full" />
                        <span className="text-sm font-semibold text-emerald-700">
                            Question {currQnsindex + 1}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
                        {quizCurrentQns?.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                        {quizCurrentQns.options.map((option, index) => {
                            const isSelected = selectedAnswers && selectedAnswers[quizCurrentQns._id]?.index === index;
                            return (
                                <label
                                    key={index}
                                    className={`group relative flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300
                                    ${
                                        isSelected
                                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-md'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${quizCurrentQns._id}`}
                                        value={index}
                                        checked={isSelected ?? false}
                                        onChange={() => handleOptionsChange(quizCurrentQns._id, index, option)}
                                        className="sr-only"
                                    />
                                    {/* Custom Radio btn */}
                                    <div
                                        className={`shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200
                                        ${
                                            isSelected
                                                ? 'border-emerald-500 bg-emerald-500'
                                                : 'border-slate-300 bg-white group-hover:border-emerald-400'
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Option text */}
                                    <span
                                        className={`ml-4 text-sm font-medium transition-colors duration-200 ${
                                            isSelected
                                                ? 'text-emerald-900'
                                                : 'text-slate-700 group-hover:text-slate-900'
                                        }`}
                                    >
                                        {option}
                                    </span>

                                    {/* Selected Checkmark */}
                                    {isSelected && (
                                        <CheckCircle2
                                            className="ml-auto w-5 h-5 text-emerald-500"
                                            strokeWidth={2.5}
                                        />
                                    )}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation button */}
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="secondary"
                        disabled={currQnsindex === 0 || submitting}
                        onClick={handlePreviosQuestions}
                    >
                        <ChevronLeft
                            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                            strokeWidth={2.5}
                        />
                        Previous
                    </Button>

                    {currQnsindex === quiz.questions.length - 1 ? (
                        <button
                            className="group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden"
                            onClick={handleSubmitQuiz}
                            disabled={submitting || !isAnswered}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2
                                            className="w-4 h-4"
                                            strokeWidth={2.5}
                                        />
                                        Submit Quiz
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </button>
                    ) : (
                        <Button
                            onClick={handleNextQuestion}
                            disabled={submitting}
                        >
                            Next
                            <ChevronRight
                                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                                strokeWidth={2.5}
                            />
                        </Button>
                    )}
                </div>

                {/* Question Navigation Dots */}
                <div className="mt-8 flex items-center justify-center flex-wrap gap-2">
                    {quiz.questions.map((_, index) => {
                        const isAnsweredQuestions = selectedAnswers && selectedAnswers[quiz.questions[index]._id] !== undefined;
                        const isCurrent = index === currQnsindex;

                        return (
                            <button
                                key={index}
                                onClick={() => setCurrQnsIndex(index)}
                                disabled={submitting}
                                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all duration-200 ${
                                    isCurrent
                                        ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 scale-110'
                                        : isAnsweredQuestions
                                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default QuizTakePage;
