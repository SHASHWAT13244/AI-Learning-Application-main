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

    const hanldeGenerateSummary = async () => {
        if (!documentId) return;
        setLoadingAction('summary');
        try {
            const {
                data: { summary },
            } = await AiServices.generateSummary(documentId);
            setLoadingAction('Generated Summary');
            setModalTitle(`Generated Summary`);
            setModalContent(summary);
            setIsModelOpen(true);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Failed to Generate sumamry');
            }
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!documentId || !concept.trim()) {
            if (!concept.trim()) {
                toast.error('Please enter a concenpt to explain');
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
            <div className="bg-white/80 rounded-2xl backdrop-blur-xl border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
                <ErrorBoundary
                    fallbackRender={props => (
                        <ErrorFallbackComponent {...props} />
                    )}
                >
                    {/* Header  */}
                    <div className="px-6 py-5 border-b border-slate-200/50 bg-linear-to-br from-slate-50/50 to-white/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-purple-500/25 flex items-center justify-center">
                                <Sparkles
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    AI Assistant
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Powered by advance AI
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Generate summary  */}
                        <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/80 hover:border-slate-300/60 hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                            <BookOpen
                                                className="w-4 h-4 text-blue-600"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <h4 className="font-semibold text-slate-900">
                                            Generate Sumamry
                                        </h4>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Wrap up the whole document in a few
                                        sentences
                                    </p>
                                </div>
                                <button
                                    onClick={hanldeGenerateSummary}
                                    disabled={loadingAction === 'summary'}
                                    className="shrink-0 h-10 px-5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-semibold transition-all rounded-xl duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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

                        {/* Explain concept  */}
                        <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-md transition-all duration-200">
                            <form onSubmit={handleExplainConcept}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                        <Lightbulb
                                            className="w-4 h-4 text-amber-600"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <h4 className="font-semibold text-slate-900">
                                        Explain a concept
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Enter a topic or concept from the document
                                    to get a detailed explanation
                                </p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={concept}
                                        onChange={e =>
                                            setConcept(e.target.value)
                                        }
                                        placeholder="e.g., Explain JavaScript"
                                        disabled={loadingAction === 'explain'}
                                        className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-purple-500/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={
                                            loadingAction === 'explain' ||
                                            !concept.trim()
                                        }
                                        className="shrink-0 h-11 px-5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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

            {/* Modal  */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModelOpen(false)}
                title={modalTitle}
            >
                <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate">
                    <MarkDownRendererCompo content={modalContent} />
                </div>
            </Modal>
        </>
    );
};
