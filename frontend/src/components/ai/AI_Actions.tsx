import { useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import AiServices from '../../services/AiServices';
import toast from 'react-hot-toast';
import { BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { MarkDownRendererCompo } from '../common/MarkDownRendererCompo';
import { Modal } from '../common/Modal';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../common/ErrorFallbackComponent';

export const AI_Actions = () => {
    const { id: documentId } = useParams();
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [isModalOpen, setIsModelOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');
    const [concept, setConcept] = useState<string>('');

    const handleGenerateSummary = async () => {
        if (!documentId) return;
        setLoadingAction('summary');
        try {
            const {
                data: { summary },
            } = await AiServices.generateSummary(documentId);
            setModalTitle('Generated Summary');
            setModalContent(summary);
            setIsModelOpen(true);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to Generate summary');
            }
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!documentId || !concept.trim()) {
            if (!concept.trim()) {
                toast.error('Please enter a concept to explain');
            }
            return;
        }

        setLoadingAction('explain');
        try {
            const {
                data: { context },
            } = await AiServices.explainConcept(documentId, concept);
            setModalContent(context);
            setModalTitle(`Explanation of "${concept}"`);
            setIsModelOpen(true);
            setConcept('');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to explain concept');
            }
        } finally {
            setLoadingAction(null);
        }
    };
    return (
        <>
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-xl border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
                <ErrorBoundary
                    fallbackRender={props => (
                        <ErrorFallbackComponent {...props} />
                    )}
                >
                    <div className="px-6 py-5 border-b border-slate-200/50 dark:border-white/10 bg-linear-to-br from-slate-50/50 to-white/50 dark:from-slate-900/30 dark:to-slate-800/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 dark:from-teal-600 dark:to-blue-700 shadow-lg shadow-purple-500/25 dark:shadow-teal-500/25 flex items-center justify-center">
                                <Sparkles
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    AI Assistant
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Powered by advanced AI
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white dark:from-slate-900/30 dark:to-slate-800/30 rounded-xl border border-slate-200/80 dark:border-white/10 hover:border-slate-300/60 dark:hover:border-white/20 hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                                            <BookOpen
                                                className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                            Generate Summary
                                        </h4>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Wrap up the whole document in a few sentences
                                    </p>
                                </div>
                                <button
                                    onClick={handleGenerateSummary}
                                    disabled={loadingAction === 'summary'}
                                    className="shrink-0 h-10 px-5 bg-linear-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-blue-700 hover:from-teal-600 hover:to-teal-700 dark:hover:from-teal-700 dark:hover:to-blue-800 text-white text-sm font-semibold transition-all rounded-xl duration-200 shadow-lg shadow-blue-500/25 dark:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {loadingAction === 'summary' ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Loading...
                                        </span>
                                    ) : (
                                        'Summarize'
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white dark:from-slate-900/30 dark:to-slate-800/30 rounded-xl border border-slate-200/60 dark:border-white/10 hover:border-slate-300/60 dark:hover:border-white/20 hover:shadow-md transition-all duration-200">
                            <form onSubmit={handleExplainConcept}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                        <Lightbulb
                                            className="w-4 h-4 text-amber-600 dark:text-amber-400"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                        Explain a concept
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                    Enter a topic or concept from the document to get a detailed explanation
                                </p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={concept}
                                        onChange={e => setConcept(e.target.value)}
                                        placeholder="e.g., Explain JavaScript"
                                        disabled={loadingAction === 'explain'}
                                        className="flex-1 h-11 px-4 border-2 border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-purple-500/50 dark:focus:shadow-teal-500/25"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loadingAction === 'explain' || !concept.trim()}
                                        className="shrink-0 h-11 px-5 bg-linear-to-r from-emerald-600 to-emerald-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-emerald-600 dark:hover:from-teal-700 dark:hover:to-blue-800 text-white text-sm font-semibold rounded-xl duration-200 shadow-lg shadow-blue-500/25 dark:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        {loadingAction === 'explain' ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                Loading...
                                            </span>
                                        ) : (
                                            'Explain'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ErrorBoundary>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModelOpen(false)}
                title={modalTitle}
            >
                <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate dark:prose-invert">
                    <MarkDownRendererCompo content={modalContent} />
                </div>
            </Modal>
        </>
    );
};
