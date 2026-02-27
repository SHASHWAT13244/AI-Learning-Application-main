import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import type { userTypes } from '../types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<null | userTypes>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        checkAuthStatuts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const checkAuthStatuts = async () => {
        try {
            const token = localStorage.getItem('token');
            const userString = localStorage.getItem('user');
            if (token && userString) {
                const user = JSON.parse(userString);
                setUser(user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (userData: userTypes, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    const updateUser = (updatedUserData: userTypes) => {
        const newUserData = { ...user, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    };
    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatuts,
    };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
