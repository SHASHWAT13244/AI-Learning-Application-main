import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { DocumentPayloadTypes } from '../../types';
import DocuemntServices from '../../services/DocumentServices';
import Spinner from '../../components/common/Spinner';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Pageheader } from '../../components/common/Pageheader';
import { Tabs } from '../../components/common/Tabs';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { AI_Actions } from '../../components/ai/AI_Actions';
import { FlashCardManager } from '../../components/flashcards/FlashCardManager';
import { QuizManager } from '../../components/quizzes/QuizManager';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const DocumentDetailsPage = () => {
    const { id } = useParams();
    const [getDocdetails, setDocDetails] = useState<DocumentPayloadTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, SetActiveTab] = useState<string>('Content');

    useEffect(() => {
        const fetchDocs = async () => {
            if (!id) return;
            try {
                const { data } = await DocuemntServices.getDocumentById(id);
                setDocDetails(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error?.message);
                } else {
                    console.error('Failed to fetch document details');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, [id]);

    const getFileURL = () => {
        if (!getDocdetails?.filePath) return null;

        const filePath = getDocdetails.filePath;

        if (filePath.startsWith('https://')) {
            return filePath;
        }

        const baseUrl = import.meta.env.VITE_API_ROOTURL;
        return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    };

    const renderContent = () => {
        if (loading) {
            return <Spinner />;
        }
        if (!getDocdetails || !getDocdetails.filePath) {
            return <div className="text-center p-8 text-slate-600 dark:text-slate-400">PDF not available</div>;
        }

        const getURL = getFileURL();
        if (getURL) {
            return (
                <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-white/10 rounded-lg overflow-hidden shadow-md">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-300 dark:border-white/10">
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            Document Viewer
                        </span>
                        <a
                            href={getURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-teal-400 hover:text-emerald-700 dark:hover:text-teal-300 font-medium transition-colors"
                        >
                            <ExternalLink size={16} />
                            Open in new tab
                        </a>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-900/30 p-1">
                        <iframe
                            title="PDF Viewer"
                            src={getURL}
                            className="w-full h-[70vh] bg-white dark:bg-slate-800 rounded border border-gray-300 dark:border-white/10"
                        ></iframe>
                    </div>
                </div>
            );
        }
    };

    const renderChat = () => {
        return <ChatInterface />;
    };

    const renderAIActions = () => {
        return <AI_Actions />;
    };

    const renderFlashCardSets = () => {
        if (!id) return null;
        return <FlashCardManager documentId={id} />;
    };
    
    const renderQuizzes = () => {
        if (!id) return null;
        return <QuizManager documentId={id} />;
    };

    const tabs = [
        { name: 'Content', label: 'Content', content: renderContent() },
        { name: 'Chat', label: 'Chat', content: renderChat() },
        { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
        { name: 'FlashCards', label: 'FlashCards', content: renderFlashCardSets() },
        { name: 'Quizzes', label: 'Quizzes', content: renderQuizzes() },
    ];
    
    if (loading) {
        return <Spinner />;
    }

    if (!getDocdetails) {
        return <div className="text-center p-8 text-slate-600 dark:text-slate-400">Document Not found.</div>;
    }
    
    return (
        <div>
            <div className="mb-4">
                <Link
                    to="/documents"
                    className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>
            </div>
            <Pageheader title={getDocdetails.title} />
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <Tabs
                    tab={tabs}
                    activeTab={activeTab}
                    setActiveTab={SetActiveTab}
                />
            </ErrorBoundary>
        </div>
    );
};

export default DocumentDetailsPage;
