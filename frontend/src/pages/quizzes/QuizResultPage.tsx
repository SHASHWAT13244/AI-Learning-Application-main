import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QuizServices from '../../services/QuizServices';
import toast from 'react-hot-toast';
import type { GetQuizResultsPayloadTypes } from '../../types';
import Spinner from '../../components/common/Spinner';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Target,
    Trophy,
    XCircle,
} from 'lucide-react';
import { Pageheader } from '../../components/common/Pageheader';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const QuizResultPage = () => {
    const { quizId } = useParams();
    const [resultsData, setResultsData] = useState<GetQuizResultsPayloadTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!quizId) return;
        setLoading(true);
        const fetchResults = async () => {
            try {
                const { data } = await QuizServices.getQuizResutls(quizId);
                setResultsData(data);
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    toast.error(error?.message);
                } else {
                    toast.error('Failed to fetch quiz results');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [quizId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        );
    }

    if (!resultsData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-slate-600 text-lg">Quiz Results not found.</p>
                </div>
            </div>
        );
    }
    
    const { quiz, results } = resultsData;
    const score = quiz.score;
    const totalQns = results.length;
    const correctAnswers = results.filter(d => d.isCorrect).length;
    const incorrectAnswers = totalQns - correctAnswers;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-teal-500';
        if (score >= 60) return 'from-amber-500 to-orange-500';
        return 'from-rose-500 to-red-500';
    };

    const getScoreMessage = (score: number) => {
        if (score >= 90) return 'Outstanding!';
        if (score >= 80) return 'Great Job!';
        if (score >= 70) return 'Good Work!';
        if (score >= 60) return 'Not bad!';
        return 'Keep practicing';
    };
    
    return (
        <div className="max-w-5xl mx-auto">
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        to={`/documents/${quiz.document._id}`}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-300"
                    >
                        <ArrowLeft
                            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
                            strokeWidth={2}
                        />
                        Back to documents
                    </Link>
                </div>
                <Pageheader title={`${quiz.title || 'Quiz'} Results`} />

                {/* Score Card */}
                <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 mb-8">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-15 h-15 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/20">
                            <Trophy
                                className="w-7 h-7 text-emerald-600"
                                strokeWidth={2}
                            />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                You Score
                            </p>
                            <div
                                className={`inline-block text-5xl font-bold bg-linear-to-r ${getScoreColor(
                                    score
                                )} bg-clip-text text-transparent mb-2`}
                            >
                                {score}%
                            </div>
                            <p className="text-lg font-medium text-slate-700">
                                {getScoreMessage(score)}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                                <Target
                                    className="w-4 h-4 text-slate-600"
                                    strokeWidth={2}
                                />
                                <span className="text-sm font-semibold text-slate-700">
                                    {totalQns} Total
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                                <CheckCircle2
                                    className="w-4 h-4 text-emerald-600"
                                    strokeWidth={2}
                                />
                                <span className="text-sm font-semibold text-emerald-700">
                                    {correctAnswers} Correct
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl">
                                <XCircle
                                    className="w-4 h-4 text-rose-600"
                                    strokeWidth={2}
                                />
                                <span className="text-sm font-semibold text-rose-700">
                                    {incorrectAnswers} Incorrect
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen
                            className="w-5 h-5 text-slate-600"
                            strokeWidth={2}
                        />
                        <h3 className="text-lg font-semibold text-slate-900">
                            Detailed Review
                        </h3>
                    </div>

                    {results.map((res, ind) => {
                        const is_Correct = res.isCorrect;
                        
                        return (
                            <div
                                key={ind}
                                className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/50"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex-1">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg mb-3">
                                            <span className="text-xs font-semibold text-slate-600">
                                                Question {ind + 1}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-900 leading-relaxed">
                                            {res.question}
                                        </h4>
                                    </div>
                                    <div
                                        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                            is_Correct
                                                ? 'bg-emerald-50 border-2 border-emerald-300'
                                                : 'bg-rose-50 border-2 border-rose-200'
                                        }`}
                                    >
                                        {is_Correct ? (
                                            <CheckCircle2
                                                className="w-5 h-5 text-emerald-600"
                                                strokeWidth={2}
                                            />
                                        ) : (
                                            <XCircle
                                                className="w-5 h-5 text-rose-600"
                                                strokeWidth={2}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {res.options.map((opt, idx) => {
                                        const isCorrectOption = opt === res.correctAnswer;
                                        const isUserSelected = opt === res.selectedAnswer;
                                        const isWrongAns = isUserSelected && !is_Correct;

                                        return (
                                            <div
                                                key={idx}
                                                className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                                                    isCorrectOption
                                                        ? 'bg-emerald-50 border-emerald-300 shadow-lg shadow-emerald-500/30'
                                                        : isWrongAns
                                                        ? 'bg-rose-50 border-rose-300'
                                                        : 'bg-slate-50 border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            isCorrectOption
                                                                ? 'text-emerald-900'
                                                                : isWrongAns
                                                                ? 'text-rose-900'
                                                                : 'text-slate-700'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {isUserSelected && (
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                                                                    isCorrectOption
                                                                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-700'
                                                                        : 'bg-rose-100 border border-rose-300 text-rose-700'
                                                                }`}
                                                            >
                                                                {isCorrectOption ? '✓ Your Answer' : '✗ Your Answer'}
                                                            </span>
                                                        )}
                                                        {isCorrectOption && !isUserSelected && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-700">
                                                                ✓ Correct Answer
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {res.explanation && (
                                    <div className="p-4 bg-linear-to-br from-slate-50 to-teal-100/50 border border-slate-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center mt-0.5">
                                                <BookOpen
                                                    className="w-4 h-4 text-slate-600"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                                    Explanation
                                                </p>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    {res.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action Button */}
                <div className="mt-8 flex justify-center">
                    <Link to={`/documents/${quiz.document._id}`}>
                        <button className="group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                <ArrowLeft
                                    className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
                                    strokeWidth={2.5}
                                />
                                Return to Document
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                        </button>
                    </Link>
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default QuizResultPage;
