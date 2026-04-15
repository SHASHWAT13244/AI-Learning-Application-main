import { useEffect, useState } from 'react';
import AdminServices from '../../services/AdminServices';
import type { AdminStatsTypes, AdminUserTypes, AdminDocumentTypes } from '../../types';
import { Pageheader } from '../../components/common/Pageheader';
import Spinner from '../../components/common/Spinner';
import { Users, FileText, BookOpen, HelpCircle, TrendingUp, UserPlus, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';
import { Modal } from '../../components/common/Modal';

type TabType = 'stats' | 'users' | 'documents';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('stats');
    const [stats, setStats] = useState<AdminStatsTypes | null>(null);
    const [users, setUsers] = useState<AdminUserTypes[]>([]);
    const [documents, setDocuments] = useState<AdminDocumentTypes[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<AdminUserTypes | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<AdminDocumentTypes | null>(null);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [isDeleteDocumentModalOpen, setIsDeleteDocumentModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [activeTab]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'stats') {
                const statsRes = await AdminServices.getSystemStats();
                setStats(statsRes.data);
            } else if (activeTab === 'users') {
                const usersRes = await AdminServices.getAllUsers();
                setUsers(usersRes.data);
            } else if (activeTab === 'documents') {
                const docsRes = await AdminServices.getAllDocuments();
                setDocuments(docsRes.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch admin dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            await AdminServices.deleteUser(selectedUser._id);
            toast.success(`User ${selectedUser.username} deleted`);
            setIsDeleteUserModalOpen(false);
            setSelectedUser(null);
            fetchDashboardData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteDocument = async () => {
        if (!selectedDocument) return;
        setActionLoading(true);
        try {
            await AdminServices.deleteDocument(selectedDocument._id);
            toast.success(`Document deleted`);
            setIsDeleteDocumentModalOpen(false);
            setSelectedDocument(null);
            fetchDashboardData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete document');
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteUserModal = (user: AdminUserTypes) => {
        setSelectedUser(user);
        setIsDeleteUserModalOpen(true);
    };

    const openDeleteDocumentModal = (doc: AdminDocumentTypes) => {
        setSelectedDocument(doc);
        setIsDeleteDocumentModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
        { label: 'Total Documents', value: stats?.totalDocuments || 0, icon: FileText, color: 'from-emerald-500 to-teal-500' },
        { label: 'Total Flashcards', value: stats?.totalFlashcards || 0, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
        { label: 'Total Quizzes', value: stats?.totalQuizzes || 0, icon: HelpCircle, color: 'from-orange-500 to-red-500' },
        { label: 'Completed Quizzes', value: stats?.completedQuizzes || 0, icon: TrendingUp, color: 'from-indigo-500 to-blue-500' },
        { label: 'Recent Signups (7d)', value: stats?.recentSignups || 0, icon: UserPlus, color: 'from-rose-500 to-pink-500' },
    ];

    return (
        <div className="min-h-screen">
            <ErrorBoundary fallbackRender={props => <ErrorFallbackComponent {...props} />}>
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] dark:bg-[radial-gradient(#456882_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto">
                    <Pageheader 
                        title="Admin Dashboard" 
                        subtitle="Manage users, documents, and view system statistics"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
                            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Admin Access</span>
                        </div>
                    </Pageheader>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-white/10">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-t-xl ${
                                activeTab === 'stats'
                                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-teal-400 border-b-2 border-emerald-500'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            Statistics
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-t-xl ${
                                activeTab === 'users'
                                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-teal-400 border-b-2 border-emerald-500'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-t-xl ${
                                activeTab === 'documents'
                                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-teal-400 border-b-2 border-emerald-500'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            All Documents
                        </button>
                    </div>

                    {/* Stats View */}
                    {activeTab === 'stats' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                                {statCards.map((stat, idx) => (
                                    <div key={idx} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                                                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stat.value}</p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                                <stat.icon className="w-6 h-6 text-white" strokeWidth={2} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {stats?.topUsers && stats.topUsers.length > 0 && (
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Top Users by Documents</h3>
                                    <div className="space-y-3">
                                        {stats.topUsers.map((user, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 dark:from-teal-900/50 dark:to-blue-900/50 flex items-center justify-center font-bold text-emerald-700 dark:text-teal-300">
                                                        #{idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{user.user.username}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{user.documentCount} documents</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Users View */}
                    {activeTab === 'users' && (
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Users</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage user accounts</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/10">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">User</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Stats</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Joined</th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-semibold text-sm">
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-slate-900 dark:text-slate-100">{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-300">{user.documentCount || 0} docs</span>
                                                        <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-700 dark:text-purple-300">{user.flashcardCount || 0} cards</span>
                                                        <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-700 dark:text-emerald-300">{user.quizCount || 0} quizzes</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openDeleteUserModal(user)}
                                                        disabled={user.email === 'admin@example.com'}
                                                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Documents View */}
                    {activeTab === 'documents' && (
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Documents</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all user documents</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/10">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Title</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Owner</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Size</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Uploaded</th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                        {documents.map((doc) => (
                                            <tr key={doc._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                                                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs">{doc.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{doc.userId?.username || 'Unknown'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${
                                                        doc.status === 'ready' 
                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                                            : doc.status === 'processing'
                                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                    }`}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openDeleteDocumentModal(doc)}
                                                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                                        title="Delete Document"
                                                    >
                                                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </ErrorBoundary>

            {/* Delete User Modal */}
            <Modal isOpen={isDeleteUserModalOpen} onClose={() => setIsDeleteUserModalOpen(false)} title="Delete User">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedUser?.username}</span>? This will also delete all their documents, flashcards, and quizzes. This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsDeleteUserModalOpen(false)}
                            disabled={actionLoading}
                            className="px-5 h-11 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            disabled={actionLoading}
                            className="px-5 h-11 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 active:scale-95 disabled:opacity-50"
                        >
                            {actionLoading ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Document Modal */}
            <Modal isOpen={isDeleteDocumentModalOpen} onClose={() => setIsDeleteDocumentModalOpen(false)} title="Delete Document">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedDocument?.title}</span>? This will also delete all associated flashcards and quizzes. This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsDeleteDocumentModalOpen(false)}
                            disabled={actionLoading}
                            className="px-5 h-11 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteDocument}
                            disabled={actionLoading}
                            className="px-5 h-11 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 active:scale-95 disabled:opacity-50"
                        >
                            {actionLoading ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboardPage;
       
