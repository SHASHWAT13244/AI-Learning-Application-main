import { useNavigate } from 'react-router-dom';
import type { DocumentPayloadTypes } from '../../types';
import type { MouseEvent } from 'react';
import { BookOpen, BrainCircuit, Clock, FileText, Trash } from 'lucide-react';
import { handleFormatSize } from '../../utils/helper';
import moment from 'moment';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../common/ErrorFallbackComponent';

export const Documentcard = ({
    document,
    onDelete,
}: {
    document: DocumentPayloadTypes;
    onDelete: (item: DocumentPayloadTypes) => void;
}) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onDelete(document);
    };
    return (
        <div
            className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl p-5 hover:border-slate-300/50 dark:hover:border-white/20 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:translate-y-[-3px]"
            onClick={handleNavigate}
        >
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="shrink-0 w-12 h-12 bg-linear-to-br from-emerald-500 to-cyan-400 dark:from-teal-600 dark:to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 dark:shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                            <FileText
                                className="w-6 h-6 text-white"
                                strokeWidth={2}
                            />
                        </div>
                        <button
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            onClick={handleDelete}
                        >
                            <Trash className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </div>

                    <h2
                        className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate mb-2"
                        title={document.title}
                    >
                        {document.title}
                    </h2>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        {document.fileSize !== undefined && (
                            <>
                                <span className="font-medium">
                                    {handleFormatSize(document.fileSize)}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {document.flashcardCount !== undefined && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <BookOpen
                                    className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400"
                                    strokeWidth={2}
                                />
                                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                    {document.flashcardCount} Flashcards
                                </span>
                            </div>
                        )}
                        {document.quizCount !== undefined && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <BrainCircuit
                                    className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                                    strokeWidth={2}
                                />
                                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                    {document.quizCount} Quizzes
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                            Uploaded {moment(document.createdAt).fromNow()}
                        </span>
                    </div>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 to-teal-500/0 dark:from-teal-500/0 dark:to-blue-500/0 hover:from-emerald-500/5 hover:to-teal-500/5 dark:hover:from-teal-500/5 dark:hover:to-blue-500/5 transition-all duration-300 pointer-events-none" />
            </ErrorBoundary>
        </div>
    );
};
