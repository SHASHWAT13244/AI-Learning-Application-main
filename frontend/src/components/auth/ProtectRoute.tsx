import { Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const ProtectRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
                <Spinner />
            </div>
        );
    }

    return isAuthenticated ? (
        <AppLayout>
            <Outlet />
        </AppLayout>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectRoute;
