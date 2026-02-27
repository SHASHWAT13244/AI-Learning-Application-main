import { lazy, Suspense } from 'react';
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from 'react-router-dom';
import ProtectRoute from './components/auth/ProtectRoute';
import { useAuth } from './context/AuthContext';

const App = () => {
    const { isAuthenticated } = useAuth();
    // const loading = false;
    const LoginPage = lazy(() => import('./pages/auth/Login'));
    const RegisterPage = lazy(() => import('./pages/auth/Register'));
    const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

    //protected routes
    const DashBoardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
    const DocumentListPage = lazy(
        () => import('./pages/documents/DocumentListPage')
    );
    const DocumentDetailPage = lazy(
        () => import('./pages/documents/DocumentDetailsPage')
    );
    const FlashCardListPage = lazy(
        () => import('./pages/flashcards/FlashCardListPage')
    );
    const FlashCardDetailsPage = lazy(
        () => import('./pages/flashcards/FlashCardPage')
    );
    const QuizTakePage = lazy(() => import('./pages/quizzes/QuizTakePage'));
    const QuizResultPage = lazy(() => import('./pages/quizzes/QuizResultPage'));
    const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
    // // if (loading) {
    // //     return (
    //         <div className='flex items-center justify-center h-screen'>
    //             <p className=''>Loading...</p>
    //         </div>
    // //     );
    // // }

    return (
        <Router>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-screen">
                        <p className="">Loading...</p>
                    </div>
                }
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to={'/dashboard'} replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectRoute />}>
                        <Route path="/dashboard" element={<DashBoardPage />} />
                        <Route
                            path="/documents"
                            element={<DocumentListPage />}
                        />
                        <Route
                            path="/documents/:id"
                            element={<DocumentDetailPage />}
                        />
                        <Route
                            path="/flashcards"
                            element={<FlashCardListPage />}
                        />
                        <Route
                            path="/documents/:id/flashcards"
                            element={<FlashCardDetailsPage />}
                        />
                        <Route
                            path="/quizzes/:quizId"
                            element={<QuizTakePage />}
                        />
                        <Route
                            path="/quizzes/:quizId/results"
                            element={<QuizResultPage />}
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
