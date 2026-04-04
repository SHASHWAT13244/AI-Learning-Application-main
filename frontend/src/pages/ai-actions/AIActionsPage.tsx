import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pageheader } from '../../components/common/Pageheader';
import { Button } from '../../components/common/Button';
import { EmptyCard } from '../../components/common/EmptyCard';
import { 
    Sparkles, 
    FileText, 
    Brain, 
    MessageSquare,
    ChevronRight,
    Zap
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';
import DocuemntServices from '../../services/DocumentServices';
import type { DocumentPayloadTypes } from '../../types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const AIActionsPage = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<DocumentPayloadTypes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await DocuemntServices.getDocuments();
            setDocuments(response.data || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    const aiActions = [
        {
            id: 'generate-flashcards',
            title: 'Generate Flashcards',
            description: 'Create smart flashcards from your documents to reinforce learning',
            icon: Brain,
            color: 'from-purple-500 to-pink-500',
            shadowColor: 'shadow-purple-500/25',
            action: () => navigate('/documents')
        },
        {
            id: 'generate-quiz',
            title: 'Generate Quiz',
            description: 'Test your knowledge with AI-generated quizzes from document content',
            icon: Sparkles,
            color: 'from-emerald-500 to-teal-500',
            shadowColor: 'shadow-emerald-500/25',
            action: () => navigate('/documents')
        },
        {
            id: 'chat-with-docs',
            title: 'Chat with Documents',
            description: 'Ask questions and get answers from your document content',
            icon: MessageSquare,
            color: 'from-blue-500 to-cyan-500',
            shadowColor: 'shadow-blue-500/25',
            action: () => navigate('/documents')
        },
        {
            id: 'generate-summary',
            title: 'Generate Summary',
            description: 'Get concise summaries of your documents for quick review',
            icon: FileText,
            color: 'from-orange-500 to-red-500',
            shadowColor: 'shadow-orange-500/25',
            action: () => navigate('/documents')
        },
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Spinner />
                </div>
            );
        }

        if (documents.length === 0) {
            return (
                <EmptyCard
                    title="No Documents Found"
                    description="Upload a document to start using AI actions"
                    buttonText="Upload Document"
                    onClickAction={() => navigate('/documents')}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <div
                            key={action.id}
                            onClick={action.action}
                            className="group relative bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] overflow-hidden"
                        >
                            {/* Gradient background on hover */}
                            <div className="absolute inset-0 bg-linear-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/50 group-hover:to-slate-100/50 transition-all duration-300" />
                            
                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${action.color} shadow-lg ${action.shadowColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                                </div>
                                
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                    {action.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 group-hover:gap-3 transition-all duration-200">
                                    Get Started
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto">
                    <Pageheader 
                        title="AI Actions" 
                        subtitle="Leverage AI to enhance your learning experience"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                            <Zap className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                            <span className="text-sm font-semibold text-emerald-700">
                                Powered by Gemini AI
                            </span>
                        </div>
                    </Pageheader>

                    {/* Quick Stats */}
                    <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Documents</p>
                            <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Available Actions</p>
                            <p className="text-2xl font-bold text-slate-900">{aiActions.length}</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">AI Model</p>
                            <p className="text-lg font-bold text-slate-900">Gemini 2.0</p>
                        </div>
                    </div>

                    {renderContent()}
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default AIActionsPage;
