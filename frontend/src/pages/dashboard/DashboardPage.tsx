import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressServices from '../../services/ProgressServices';
import type { DashBoardPayloadTypes } from '../../types';
import {
    BookOpen,
    BrainCircuit,
    Clock,
    FileText,
    TrendingUp,
} from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [dashBoardData, setDashboardData] =
        useState<DashBoardPayloadTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserDashBoardData = async () => {
            setLoading(true);
            try {
                const response = await ProgressServices.getDashBoardData();
                setDashboardData(response);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDashBoardData();
    }, []);

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    if (loading) {
        return <Spinner />;
    }
    
    if (!dashBoardData || !dashBoardData.data.overview) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                        <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        No Dashboard data available
                    </p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Documents',
            value: dashBoardData.data.overview.totalDocuments,
            icon: FileText,
            gradient: 'from-blue-400 to-cyan-500 dark:from-blue-600 dark:to-cyan-700',
            shadowColor: 'shadow-blue-500/25 dark:shadow-blue-600/25',
            onClick: () => handleNavigate('/documents'),
        },
        {
            label: 'Total FlashCard Sets',
            value: dashBoardData.data.overview.totalFlashCardSets,
            icon: BookOpen,
            gradient: 'from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-700',
            shadowColor: 'shadow-purple-500/25 dark:shadow-purple-600/25',
            onClick: () => handleNavigate('/flashcards'),
        },
        {
            label: 'Total FlashCards',
            value: dashBoardData.data.overview.totalFlashCards,
            icon: BrainCircuit,
            gradient: 'from-emerald-400 to-teal-500 dark:from-teal-500 dark:to-blue-600',
            shadowColor: 'shadow-emerald-500/25 dark:shadow-teal-500/25',
            onClick: () => handleNavigate('/flashcards'),
        },
    ];

    return (
        <div className="min-h-screen">
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] dark:bg-[radial-gradient(#456882_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100 tracking-tight mb-2">
                            Dashboard
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Track your learning progress and activity
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
                        {stats.map((stat, index) => (
                            <div
                                className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-6 hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-black/50 transition-all duration-300 hover:translate-y-[-3px] cursor-pointer"
                                key={index}
                                onClick={stat.onClick}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                                        {stat.label}
                                    </span>
                                    <div
                                        className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <stat.icon
                                            className="w-5 h-5 text-white"
                                            strokeWidth={2}
                                        />
                                    </div>
                                </div>
                                <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight mt-2">
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/30 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 tracking-tight">
                                Recent Activities
                            </h3>
                        </div>

                        {dashBoardData.data.recentActivity &&
                        (dashBoardData.data.recentActivity.documents.length > 0 ||
                            dashBoardData.data.recentActivity.quizzes.length > 0) ? (
                            <div className="space-y-3">
                                {[
                                    ...(dashBoardData.data.recentActivity.documents || []).map(doc => ({
                                        id: doc._id,
                                        description: doc.title,
                                        timestamp: doc.lastAccessed,
                                        path: `/documents/${doc._id}`,
                                        type: 'document',
                                        icon: FileText,
                                        iconColor: 'from-blue-400 to-cyan-500 dark:from-blue-600 dark:to-cyan-700',
                                    })),
                                    ...(dashBoardData.data.recentActivity.quizzes || []).map(quiz => ({
                                        id: quiz._id,
                                        description: quiz.title,
                                        timestamp: quiz.completedAt,
                                        path: `/quizzes/${quiz._id}/results`,
                                        type: 'quiz',
                                        icon: BrainCircuit,
                                        iconColor: 'from-emerald-400 to-teal-500 dark:from-teal-500 dark:to-blue-600',
                                    })),
                                ]
                                    .sort((a, b) => {
                                        const timeA = a.timestamp
                                            ? new Date(a.timestamp).getTime()
                                            : 0;
                                        const timeB = b.timestamp
                                            ? new Date(b.timestamp).getTime()
                                            : 0;
                                        return timeB - timeA;
                                    })
                                    .map((activity, index) => {
                                        const Icon = activity.icon;
                                        return (
                                            <div
                                                className="group flex items-center justify-between p-4 rounded-xl bg-slate-50/5 dark:bg-slate-900/30 border border-slate-200/60 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700/50 hover:border-slate-300/60 dark:hover:border-white/20 hover:shadow-md transition-all duration-300 cursor-pointer"
                                                key={activity.id || index}
                                                onClick={() => handleNavigate(activity.path)}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${activity.iconColor} flex items-center justify-center shadow-md shrink-0`}>
                                                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${
                                                                    activity.type === 'document'
                                                                        ? 'bg-blue-500 dark:bg-blue-400'
                                                                        : 'bg-emerald-500 dark:bg-teal-400'
                                                                }`}
                                                            />
                                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                                                {activity.type === 'document'
                                                                    ? 'Accessed Document: '
                                                                    : 'Completed Quiz: '}
                                                                <span className="text-slate-700 dark:text-slate-300">
                                                                    {activity.description}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {activity.timestamp
                                                                ? new Date(activity.timestamp).toLocaleString()
                                                                : 'Date unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="ml-4 px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-teal-400 hover:text-emerald-700 dark:hover:text-teal-300 hover:bg-emerald-100 dark:hover:bg-teal-900/30 rounded-lg transition-all duration-200 whitespace-nowrap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNavigate(activity.path);
                                                    }}
                                                >
                                                    View →
                                                </button>
                                            </div>
                                        );
                                    })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                                    <Clock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    No recent activity yet
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                    Start learning to see your progress here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default DashboardPage;
