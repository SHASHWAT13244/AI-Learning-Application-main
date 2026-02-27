import { Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../../context/AuthContext';

const ProtectRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div> Loading ...!</div>;
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
