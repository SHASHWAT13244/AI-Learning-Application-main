import { useEffect, useState, type ChangeEvent } from 'react';
import {
    type DocumentPayloadTypes,
    type GetDocumentsResponseTypes,
} from '../../types';
import DocuemntServices from '../../services/DocumentServices';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { FileText, Plus, Trash, Upload, X } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import { Documentcard } from '../../components/documents/Documentcard';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const DocumentListPage = () => {
    const [documents, setDocuments] = useState<
        GetDocumentsResponseTypes['data'] | null
    >([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [isUploadModelOpen, setIsUploadModelOpen] = useState<boolean>(false);
    const [uploadFile, setUploadFile] = useState<null | File>(null);
    const [uploadTitle, setUploadTitle] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentPayloadTypes | null>(
        null
    );

    const fetchDocs = async () => {
        try {
            const { data } = await DocuemntServices.getDocuments();
            setDocuments(data);
        } catch (error) {
            toast.error('Failed to fetch documents');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files;
        if (file && file?.length > 0) {
            setUploadFile(file[0]);
            setUploadTitle(file[0].name.replace(/\.[^/.]+$/, ''));
        } else {
            setUploadFile(null);
            setUploadTitle('');
        }
    };

    const handleUpload = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!uploadFile || !uploadTitle) {
            toast.error('Please provide a title and select a file');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('title', uploadTitle);

        try {
            await DocuemntServices.uploadDocuments(formData);
            toast.success('Document uploaded successfully');
            setIsUploadModelOpen(false);
            setUploadFile(null);
            setUploadTitle('');
            setLoading(true);
            fetchDocs();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('upload failed');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteRequest = (doc: DocumentPayloadTypes) => {
        setSelectedDoc(doc);
        setIsDeleteModalOpen(true);
    };

    const handleDeletePopup = async () => {
        if (!selectedDoc) return;
        setIsDelete(true);
        try {
            await DocuemntServices.deleteDocument(selectedDoc._id);
            toast.success(`${selectedDoc.title} Deleted`);
            setIsDeleteModalOpen(false);
            setSelectedDoc(null);
            setDocuments(
                documents && documents?.filter(d => d._id !== selectedDoc._id)
            );
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message);
            } else {
                toast.error('Deletion failed');
            }
        } finally {
            setIsDelete(false);
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
        if (documents && documents?.length === 0) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shadow-lg shadow-slate-200 dark:shadow-black/30">
                            <FileText
                                className="w-10 h-10 text-slate-400 dark:text-slate-500"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 tracking-tight mb-2">
                            No Documents Found
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Get Started by uploading your first PDF document to
                            begin learning
                        </p>
                        <button
                            onClick={() => setIsUploadModelOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 dark:shadow-teal-500/25 hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-teal-500/30 active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Upload Document
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {documents?.map(doc => (
                    <Documentcard
                        key={doc._id}
                        document={doc}
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>
        );
    };
    
    return (
        <div className="min-h-screen">
            <ErrorBoundary
                fallbackRender={props => <ErrorFallbackComponent {...props} />}
            >
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] dark:bg-[radial-gradient(#456882_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100 tracking-tight mb-2">
                                My Documents
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Manage and organize your learning materials
                            </p>
                        </div>

                        {documents && documents?.length > 0 && (
                            <Button onClick={() => setIsUploadModelOpen(true)}>
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                Upload Document
                            </Button>
                        )}
                    </div>
                    {renderContent()}
                </div>
            </ErrorBoundary>
            
            {isUploadModelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-xl">
                    <ErrorBoundary
                        fallbackRender={props => (
                            <ErrorFallbackComponent {...props} />
                        )}
                    >
                        <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-2xl shadow-slate-900/20 dark:shadow-black/40 p-8">
                            <button
                                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
                                onClick={() => setIsUploadModelOpen(false)}
                            >
                                <X className="w-5 h-5" strokeWidth={2.5} />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100 tracking-tight">
                                    Upload New Document
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Add a PDF document to your library
                                </p>
                            </div>

                            <form className="space-y-5" onSubmit={handleUpload}>
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                        Document Title
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadTitle}
                                        onChange={e => setUploadTitle(e.target.value)}
                                        className="w-full h-12 px-4 border-2 border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg focus:shadow-emerald-300/50 dark:focus:shadow-teal-500/25"
                                        required
                                        placeholder="e.g. Javascript beginner docs"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                        PDF file
                                    </label>
                                    <div className="relative border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-400 dark:hover:border-teal-500 hover:bg-emerald-50/30 dark:hover:bg-teal-900/20 transition-all duration-200">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            onChange={handleFileChange}
                                            accept=".pdf"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center py-10 px-6">
                                            <div className="w-14 h-14 rounded-xl bg-linear-to-r from-emerald-100 to-teal-100 dark:from-teal-900/50 dark:to-blue-900/50 flex items-center justify-center mb-2">
                                                <Upload
                                                    className="w-7 h-7 text-emerald-600 dark:text-teal-400"
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                {uploadFile ? (
                                                    <span className="text-emerald-600 dark:text-teal-400">
                                                        {uploadFile.name}
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="text-emerald-600 dark:text-teal-400">
                                                            click to upload
                                                        </span>
                                                        or drag and drop
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                PDF upto 10MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModelOpen(false)}
                                        disabled={uploading}
                                        className="flex-1 h-11 px-4 border-2 border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 h-11 px-4 rounded-xl text-white font-semibold bg-linear-to-r from-emerald-500 to-teal-500 dark:from-teal-600 dark:to-blue-700 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-teal-700 dark:hover:to-blue-800 transition-all duration-200 shadow-lg shadow-emerald-500/50 dark:shadow-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        {uploading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-xl animate-spin" />
                                                Uploading...!
                                            </span>
                                        ) : (
                                            <span>Upload</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </ErrorBoundary>
                </div>
            )}
            
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-slate-900/40 dark:shadow-black/40 p-6">
                        <button
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            <X className="w-5 h-5" strokeWidth={2.5} />
                        </button>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center mb-4">
                                <Trash
                                    className="w-6 h-6 text-red-600 dark:text-red-400"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 tracking-tight">
                                Confirm Deletion
                            </h2>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            Are you sure you want to delete the document:
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {selectedDoc?.title}
                            </span>
                            ?
                        </p>

                        <div className="flex gap-5">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDelete}
                                className="flex-1 h-11 px-4 border-2 border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePopup}
                                disabled={isDelete}
                                className="flex-1 h-11 px-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {isDelete ? (
                                    <>
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-xl animate-spin" />
                                            Deleting...
                                        </span>
                                    </>
                                ) : (
                                    <span>Delete</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentListPage;
